const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions: baseTsConfig } = require('./tsconfig.json');

// Take the paths from tsconfig automatically from base tsconfig.json
// @link https://kulshekhar.github.io/ts-jest/docs/paths-mapping
const getTsConfigBasePaths = () => {
  return baseTsConfig.paths
    ? pathsToModuleNameMapper(baseTsConfig.paths, {
        prefix: '<rootDir>/',
      })
    : {};
};

const config = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  moduleNameMapper: {
    ...getTsConfigBasePaths(),
  },
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testTimeout: 10000,
};

module.exports = config;
