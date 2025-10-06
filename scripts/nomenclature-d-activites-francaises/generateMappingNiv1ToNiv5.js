const fs = require("fs");
const path = require("path");

// Read and parse NAF 5 niveaux CSV
const nafCsvPath = path.join(__dirname, "naf2008_5_niveaux.csv");
const nafContent = fs.readFileSync(nafCsvPath, "utf-8");
const nafLines = nafContent.split("\n").slice(1); // Skip header

// Create mapping from NIV1 to all NIV5 codes
const niv1ToNiv5Mapping = {};

nafLines
  .filter((line) => line.trim())
  .forEach((line) => {
    const [niv5, niv4, niv3, niv2, niv1] = line
      .split(";")
      .map((field) => field.trim());

    if (niv1 && niv5) {
      if (!niv1ToNiv5Mapping[niv1]) {
        niv1ToNiv5Mapping[niv1] = [];
      }
      niv1ToNiv5Mapping[niv1].push(niv5);
    }
  });

// Generate TypeScript content
const tsContent = `// This file is auto-generated. Do not edit manually.
export interface Niv1ToNiv5Mapping {
  [niv1: string]: string[];
}

export const niv1ToNiv5Mapping: Niv1ToNiv5Mapping = ${JSON.stringify(
  niv1ToNiv5Mapping,
  null,
  2
)};
`;

// Write the output to a TypeScript file
const outputPath = path.join(__dirname, "niv1ToNiv5Mapping.ts");
fs.writeFileSync(outputPath, tsContent);

// Log summary
const niv1Count = Object.keys(niv1ToNiv5Mapping).length;
const totalNiv5Count = Object.values(niv1ToNiv5Mapping).reduce(
  (sum, codes) => sum + codes.length,
  0
);

console.log(
  `Generated mapping for ${niv1Count} NIV1 codes with ${totalNiv5Count} total NIV5 codes in ${outputPath}`
);
