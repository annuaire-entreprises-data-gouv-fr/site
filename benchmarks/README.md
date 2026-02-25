# Local Memory Regression Benchmark

This benchmark is designed to compare memory behavior between two branches (for example `next15` vs `next16`) under the same Docker runtime constraints and load profile.

## 1. Prepare once

```bash
cp .env.dev .env
chmod +x ./scripts/perf/run-docker-memory-benchmark.sh
```

The script injects this file at image build-time with Docker BuildKit secrets, so `next build` can read env vars without copying `.env` into the final image.

## 2. Run on branch A (baseline)

```bash
git checkout <branch-with-next15>
bash ./scripts/perf/run-docker-memory-benchmark.sh --label next15
```

## 3. Run on branch B (candidate)

```bash
git checkout <branch-with-next16>
bash ./scripts/perf/run-docker-memory-benchmark.sh --label next16
```

## 4. Compare results

Each run writes artifacts in `perf-results/<label>-<timestamp>/`:

- `docker-stats.csv`: container-level memory and CPU over time
- `process-memory.csv`: process-level memory from `/proc/1/status`
- `container.log`: full Docker container logs (`docker logs --follow --timestamps`)
- `k6-summary.json`: aggregated latency/error metrics
- `k6-output.log`: raw `k6` output

Request generation:

- The k6 scenario reads `annuaire-des-entreprises-etablissements-25_02_2026.csv`
- It skips the first row, parses first-column IDs, and hits `/entreprise/<id>`
- Final URL pattern is `http://localhost:3000/entreprise/<id>` (runner default target is `http://host.docker.internal:3000` because k6 itself runs in Docker)

Look for:

- Rising memory during steady load that never stabilizes
- Memory that remains high after cooldown
- A clearly higher peak and/or end-of-test memory on `next16`

## Tunables

Use environment variables when needed:

```bash
TARGET_VUS=120 \
STEADY_DURATION=20m \
MEMORY_LIMIT=3g \
CPU_LIMIT=3 \
CSV_FILE=annuaire-des-entreprises-etablissements-25_02_2026.csv \
BASE_URL=http://host.docker.internal:3000 \
PATHS="/,/recherche?terme=insee,/administration,/api/healthcheck" \
bash ./scripts/perf/run-docker-memory-benchmark.sh --label next16-heavy
```
