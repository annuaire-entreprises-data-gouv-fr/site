import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const outputDir = path.join(rootDir, ".output");
const publicDir = path.join(outputDir, "public");
const serverDir = path.join(outputDir, "server");
const serverEntry = path.join(serverDir, "index.mjs");

const encodings = new Map([
  [".br", "br"],
  [".gz", "gzip"],
  [".zst", "zstd"],
]);

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".csv", "text/csv; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json"],
  [".map", "application/json"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".pdf", "application/pdf"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".xml", "application/xml"],
]);

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(dir, entry.name);
      return entry.isDirectory() ? listFiles(entryPath) : entryPath;
    })
  );
  return files.flat();
}

function getAssetType(relativeFile) {
  const encodingExtension = path.extname(relativeFile);
  const assetFile = encodings.has(encodingExtension)
    ? relativeFile.slice(0, -encodingExtension.length)
    : relativeFile;
  return mimeTypes.get(path.extname(assetFile)) || "text/plain; charset=utf-8";
}

function getEncoding(relativeFile) {
  return encodings.get(path.extname(relativeFile));
}

function getAssetId(relativeFile) {
  return `/${relativeFile.split(path.sep).join("/")}`;
}

async function createAssetManifest() {
  const files = await listFiles(publicDir);
  const manifest = {};

  for (const file of files.sort()) {
    const relativeFile = path.relative(publicDir, file);
    const fileBuffer = await readFile(file);
    const fileStat = await stat(file);

    manifest[getAssetId(relativeFile)] = {
      type: getAssetType(relativeFile),
      encoding: getEncoding(relativeFile),
      etag: `"${createHash("sha1").update(fileBuffer).digest("base64url")}"`,
      mtime: fileStat.mtime.toJSON(),
      size: fileStat.size,
      path: path.relative(serverDir, file).split(path.sep).join("/"),
    };
  }

  return manifest;
}

function findManifestObjectEnd(source, objectStart) {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = objectStart; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
    } else if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return index + 1;
      }
    }
  }

  throw new Error("Could not find Nitro public assets manifest end");
}

const source = await readFile(serverEntry, "utf-8");
const marker = "var public_assets_data_default = ";
const markerStart = source.indexOf(marker);

if (markerStart === -1) {
  throw new Error("Could not find Nitro public assets manifest");
}

const objectStart = markerStart + marker.length;
const objectEnd = findManifestObjectEnd(source, objectStart);
const manifest = await createAssetManifest();
const nextSource = `${source.slice(0, objectStart)}${JSON.stringify(
  manifest,
  null,
  2
)}${source.slice(objectEnd)}`;

await writeFile(serverEntry, nextSource);

console.log(
  `sync-nitro-public-assets: synced ${Object.keys(manifest).length} asset(s)`
);
