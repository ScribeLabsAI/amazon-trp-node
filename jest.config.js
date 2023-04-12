export default {
  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageProvider: 'v8',
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testRegex: 'tests/.*\\.test\\.ts',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
