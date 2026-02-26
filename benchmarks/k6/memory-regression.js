import http from "k6/http";
import { SharedArray } from "k6/data";
import { check, sleep } from "k6";

const baseUrl = __ENV.BASE_URL || "http://localhost:3000";
const targetVus = Number(__ENV.TARGET_VUS || "80");
const thinkTimeMs = Number(__ENV.THINK_TIME_MS || "0");
const csvFile = __ENV.CSV_FILE || "/data/enterprise-ids.csv";

const trimQuotes = (value) => value.replace(/^"+|"+$/g, "").trim();

const extractFirstColumn = (line) => {
  const separator = line.includes(";") ? ";" : ",";
  const firstColumn = line.split(separator).at(0) || "";
  return trimQuotes(firstColumn);
};

const enterpriseIds = new SharedArray("enterprise-ids", () => {
  const csv = open(csvFile).replace(/^\uFEFF/, "");
  const rows = csv
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return rows.map(extractFirstColumn).filter((id) => id.length > 0);
});

if (enterpriseIds.length === 0) {
  throw new Error(`No enterprise IDs found in CSV file: ${csvFile}`);
}

export const options = {
  scenarios: {
    memory_regression: {
      executor: "ramping-vus",
      stages: [
        { duration: __ENV.WARMUP_DURATION || "2m", target: Math.max(1, Math.floor(targetVus / 2)) },
        { duration: __ENV.STEADY_DURATION || "15m", target: targetVus },
        { duration: __ENV.COOLDOWN_DURATION || "8m", target: 0 },
      ],
      gracefulRampDown: "30s",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.05"],
  },
};

const randomEnterprisePath = () => {
  const index = Math.floor(Math.random() * enterpriseIds.length);
  const id = enterpriseIds.at(index) || "";
  return `/entreprise/${id}`;
};

export default () => {
  const path = randomEnterprisePath();
  const response = http.get(`${baseUrl}${path}`, {
    tags: { path },
  });

  check(response, {
    "status is below 500": (res) => res.status < 500,
  });

  if (thinkTimeMs > 0) {
    sleep(thinkTimeMs / 1000);
  }
};
