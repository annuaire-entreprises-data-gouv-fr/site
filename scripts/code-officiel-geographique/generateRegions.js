const fs = require('fs');
const path = require('path');

// Read and parse departments
const departmentsCsvPath = path.join(__dirname, 'v_departement_2025.csv');
const departmentsContent = fs.readFileSync(departmentsCsvPath, 'utf-8');
const departmentsLines = departmentsContent.split('\n').slice(1);

const departments = departmentsLines
  .filter((line) => line.trim())
  .map((line) => {
    const [dep, reg, , , , , libelle] = line
      .split(',')
      .map((field) => field.replace(/"/g, ''));
    return {
      code: dep,
      name: libelle,
      region: reg,
    };
  });

// Read and parse regions
const regionsCsvPath = path.join(__dirname, 'v_region_2025.csv');
const regionsContent = fs.readFileSync(regionsCsvPath, 'utf-8');
const regionsLines = regionsContent.split('\n').slice(1);

const regions = regionsLines
  .filter((line) => line.trim())
  .map((line) => {
    const [reg, , , , , libelle] = line
      .split(',')
      .map((field) => field.replace(/"/g, ''));
    return {
      code: reg,
      name: libelle,
      departments: departments
        .filter((dept) => dept.region === reg)
        .map(({ code, name }) => ({ code, name })),
    };
  });

// Generate TypeScript content
const tsContent = `// This file is auto-generated. Do not edit manually.
export interface Department {
  code: string;
  name: string;
}

export interface Region {
  code: string;
  name: string;
  departments: Department[];
}

export const regions: Region[] = ${JSON.stringify(regions, null, 2)};
`;

// Write the output to a TypeScript file
const outputPath = path.join(__dirname, 'regions.ts');
fs.writeFileSync(outputPath, tsContent);

console.log(`Generated ${regions.length} regions in ${outputPath}`);
