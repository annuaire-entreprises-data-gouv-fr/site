/**
 * Converts every `*.yml` under `src/data` to a sibling `*.json` file
 * so app code can import JSON (client-safe) instead of using node:fs at runtime.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const dataRoot = join(root, "src", "data");

let count = 0;

const compileFile = (ymlPath) => {
  const raw = readFileSync(ymlPath, "utf8");
  const doc = load(raw);
  const jsonPath = ymlPath.replace(/\.yml$/i, ".json");
  writeFileSync(jsonPath, `${JSON.stringify(doc, null, 2)}\n`, "utf8");
  count += 1;
};

const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(p);
    } else if (entry.name.endsWith(".yml")) {
      compileFile(p);
    }
  }
};

walk(dataRoot);
process.stdout.write(`compile-data-yaml: wrote ${count} JSON file(s) under src/data\n`);
