#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Run a local Docker memory benchmark for the current branch.

Usage:
  bash ./scripts/perf/run-docker-memory-benchmark.sh --label <label>

Environment variables:
  ENV_FILE=.env
  HOST_PORT=3000
  MEMORY_LIMIT=2g
  CPU_LIMIT=2
  TARGET_VUS=80
  WARMUP_DURATION=2m
  STEADY_DURATION=15m
  COOLDOWN_DURATION=8m
  THINK_TIME_MS=0
  SAMPLE_INTERVAL_SECONDS=1
  CSV_FILE=annuaire-des-entreprises-etablissements-25_02_2026.csv
  BASE_URL=http://host.docker.internal:3000
  PATHS="/,/recherche?terme=mairie,/administration"
  DOCKER_IMAGE="annuaire-entreprises-benchmark:<label>"
  K6_IMAGE="grafana/k6:0.49.0"
  RESULTS_DIR="<repo>/perf-results/<label>-<timestamp>"
EOF
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

label=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --label)
      if [[ $# -lt 2 ]]; then
        echo "--label requires a value" >&2
        exit 1
      fi
      label="$2"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$label" ]]; then
  echo "Please provide --label <label>" >&2
  usage
  exit 1
fi

require_command docker
require_command curl
require_command tee

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="${ENV_FILE:-.env}"
HOST_PORT="${HOST_PORT:-3000}"
MEMORY_LIMIT="${MEMORY_LIMIT:-2g}"
CPU_LIMIT="${CPU_LIMIT:-2}"
TARGET_VUS="${TARGET_VUS:-80}"
WARMUP_DURATION="${WARMUP_DURATION:-2m}"
STEADY_DURATION="${STEADY_DURATION:-15m}"
COOLDOWN_DURATION="${COOLDOWN_DURATION:-8m}"
THINK_TIME_MS="${THINK_TIME_MS:-0}"
SAMPLE_INTERVAL_SECONDS="${SAMPLE_INTERVAL_SECONDS:-1}"
CSV_FILE="${CSV_FILE:-annuaire-des-entreprises-etablissements-25_02_2026.csv}"
BASE_URL="${BASE_URL:-http://host.docker.internal:${HOST_PORT}}"
PATHS="${PATHS:-/,/recherche?terme=mairie,/administration}"
K6_IMAGE="${K6_IMAGE:-grafana/k6:0.49.0}"
DOCKER_IMAGE="${DOCKER_IMAGE:-annuaire-entreprises-benchmark:${label}}"

if [[ "${ENV_FILE:0:1}" != "/" ]]; then
  ENV_FILE="$ROOT_DIR/$ENV_FILE"
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE" >&2
  echo "Copy .env.dev to .env (or point ENV_FILE to an existing file)." >&2
  exit 1
fi

if [[ "${CSV_FILE:0:1}" != "/" ]]; then
  CSV_FILE="$ROOT_DIR/$CSV_FILE"
fi

if [[ ! -f "$CSV_FILE" ]]; then
  echo "Missing CSV file: $CSV_FILE" >&2
  echo "Provide CSV_FILE with a valid file path." >&2
  exit 1
fi

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
safe_label="$(printf '%s' "$label" | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9_.-' '-')"
lowercase_timestamp="$(printf '%s' "$timestamp" | tr '[:upper:]' '[:lower:]')"
container_name="$(printf 'ae-bench-%s-%s' "$safe_label" "$lowercase_timestamp" | cut -c1-63)"
RESULTS_DIR="${RESULTS_DIR:-$ROOT_DIR/perf-results/${safe_label}-${timestamp}}"
mkdir -p "$RESULTS_DIR"

stats_pid=""
process_pid=""
logs_pid=""

cleanup() {
  set +e

  if [[ -n "$stats_pid" ]] && kill -0 "$stats_pid" >/dev/null 2>&1; then
    kill "$stats_pid" >/dev/null 2>&1 || true
    wait "$stats_pid" >/dev/null 2>&1 || true
  fi

  if [[ -n "$process_pid" ]] && kill -0 "$process_pid" >/dev/null 2>&1; then
    kill "$process_pid" >/dev/null 2>&1 || true
    wait "$process_pid" >/dev/null 2>&1 || true
  fi

  if [[ -n "$logs_pid" ]] && kill -0 "$logs_pid" >/dev/null 2>&1; then
    kill "$logs_pid" >/dev/null 2>&1 || true
    wait "$logs_pid" >/dev/null 2>&1 || true
  fi

  docker rm -f "$container_name" >/dev/null 2>&1 || true
}

collect_docker_stats() {
  local output_file="$1"
  printf 'timestamp_utc,mem_usage,mem_percent,cpu_percent,pids,net_io,block_io\n' >"$output_file"

  while docker container inspect "$container_name" >/dev/null 2>&1; do
    local snapshot
    snapshot="$(docker stats --no-stream --format '{{.MemUsage}},{{.MemPerc}},{{.CPUPerc}},{{.PIDs}},{{.NetIO}},{{.BlockIO}}' "$container_name" 2>/dev/null || true)"
    if [[ -n "$snapshot" ]]; then
      printf '%s,%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$snapshot" >>"$output_file"
    fi
    sleep "$SAMPLE_INTERVAL_SECONDS"
  done
}

collect_process_memory() {
  local output_file="$1"
  printf 'timestamp_utc,vm_rss_kb,vm_size_kb,vm_swap_kb,threads\n' >"$output_file"

  while docker container inspect "$container_name" >/dev/null 2>&1; do
    local snapshot
    snapshot="$(
      docker exec "$container_name" sh -c \
        "awk '/VmRSS:/{rss=\$2}/VmSize:/{size=\$2}/VmSwap:/{swap=\$2}/Threads:/{threads=\$2} END {printf \"%s,%s,%s,%s\", rss, size, swap, threads}' /proc/1/status" \
        2>/dev/null || true
    )"
    if [[ -n "$snapshot" ]]; then
      printf '%s,%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$snapshot" >>"$output_file"
    fi
    sleep "$SAMPLE_INTERVAL_SECONDS"
  done
}

collect_container_logs() {
  local output_file="$1"
  : >"$output_file"
  docker logs --timestamps --follow "$container_name" >>"$output_file" 2>&1 || true
}

trap cleanup EXIT INT TERM

echo "Building Docker image: $DOCKER_IMAGE"
DOCKER_BUILDKIT=1 docker build \
  --file Dockerfile \
  --secret "id=build_env,src=$ENV_FILE" \
  --tag "$DOCKER_IMAGE" \
  .

echo "Starting benchmark container: $container_name"
docker run --detach --rm \
  --name "$container_name" \
  --memory "$MEMORY_LIMIT" \
  --cpus "$CPU_LIMIT" \
  --env-file "$ENV_FILE" \
  -e PORT=3000 \
  -p "${HOST_PORT}:3000" \
  "$DOCKER_IMAGE" >/dev/null

echo "Waiting for startup on http://127.0.0.1:${HOST_PORT}/"
is_ready=false
for _ in $(seq 1 120); do
  http_code="$(curl --silent --output /dev/null --write-out '%{http_code}' "http://127.0.0.1:${HOST_PORT}/" || true)"
  if [[ "$http_code" == "200" || "$http_code" == "301" || "$http_code" == "302" || "$http_code" == "307" || "$http_code" == "308" ]]; then
    is_ready=true
    break
  fi
  sleep 1
done

if [[ "$is_ready" != true ]]; then
  echo "Container did not become ready in time." >&2
  docker logs "$container_name" || true
  exit 1
fi

collect_docker_stats "$RESULTS_DIR/docker-stats.csv" &
stats_pid="$!"
collect_process_memory "$RESULTS_DIR/process-memory.csv" &
process_pid="$!"
collect_container_logs "$RESULTS_DIR/container.log" &
logs_pid="$!"

echo "Running k6 load test against ${BASE_URL}"
echo "Using enterprise IDs from: $CSV_FILE"
echo "Results folder: $RESULTS_DIR"

set +e
docker run --rm \
  --add-host=host.docker.internal:host-gateway \
  -e BASE_URL="$BASE_URL" \
  -e TARGET_VUS="$TARGET_VUS" \
  -e WARMUP_DURATION="$WARMUP_DURATION" \
  -e STEADY_DURATION="$STEADY_DURATION" \
  -e COOLDOWN_DURATION="$COOLDOWN_DURATION" \
  -e THINK_TIME_MS="$THINK_TIME_MS" \
  -e CSV_FILE="/data/enterprise-ids.csv" \
  -e PATHS="$PATHS" \
  -v "$CSV_FILE:/data/enterprise-ids.csv:ro" \
  -v "$ROOT_DIR/benchmarks/k6:/benchmarks:ro" \
  -v "$RESULTS_DIR:/results" \
  "$K6_IMAGE" run \
  --summary-export "/results/k6-summary.json" \
  "/benchmarks/memory-regression.js" | tee "$RESULTS_DIR/k6-output.log"
k6_exit_code="$?"
set -e

if [[ "$k6_exit_code" -ne 0 ]]; then
  echo "k6 exited with code $k6_exit_code" >&2
fi

if [[ -n "$stats_pid" ]] && kill -0 "$stats_pid" >/dev/null 2>&1; then
  kill "$stats_pid" >/dev/null 2>&1 || true
  wait "$stats_pid" >/dev/null 2>&1 || true
fi

if [[ -n "$process_pid" ]] && kill -0 "$process_pid" >/dev/null 2>&1; then
  kill "$process_pid" >/dev/null 2>&1 || true
  wait "$process_pid" >/dev/null 2>&1 || true
fi

if [[ -n "$logs_pid" ]] && kill -0 "$logs_pid" >/dev/null 2>&1; then
  kill "$logs_pid" >/dev/null 2>&1 || true
  wait "$logs_pid" >/dev/null 2>&1 || true
fi

echo
echo "Benchmark finished."
echo "- docker stats: $RESULTS_DIR/docker-stats.csv"
echo "- process memory: $RESULTS_DIR/process-memory.csv"
echo "- container logs: $RESULTS_DIR/container.log"
echo "- k6 summary: $RESULTS_DIR/k6-summary.json"
echo "- k6 console log: $RESULTS_DIR/k6-output.log"

docker rm -f "$container_name" >/dev/null 2>&1 || true

exit "$k6_exit_code"
