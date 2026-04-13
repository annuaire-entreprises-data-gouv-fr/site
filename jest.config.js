const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions: baseTsConfig } = require("./tsconfig.json");

// Take the paths from tsconfig automatically from base tsconfig.json
// @link https://kulshekhar.github.io/ts-jest/docs/paths-mapping
const getTsConfigBasePaths = () =>
  baseTsConfig.paths
    ? pathsToModuleNameMapper(baseTsConfig.paths, {
        prefix: "<rootDir>/",
      })
    : {};

const config = {
  transform: {
    "^.+\\.(m|t|j)sx?$": [
      "@swc/jest",
      {
        module: {
          type: "commonjs",
        },
      },
    ],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(msw|@mswjs|until-async|rettime)/)",
  ],
  moduleNameMapper: {
    ...getTsConfigBasePaths(),
    "^rettime$": "<rootDir>/node_modules/rettime/src/index.ts",
  },
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  testTimeout: 10_000,
};

module.exports = config;
