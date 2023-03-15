module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'unicorn', 'sonarjs', 'jest', 'promise'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:unicorn/all',
    'plugin:sonarjs/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:promise/recommended',
  ],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-new-array': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-keyword-prefix': 'off',
    'unicorn/catch-error-name': ['error', { name: 'err' }],
    'unicorn/import-index': ['error', { ignoreImports: true }],
    'unicorn/filename-case': ['off'],
    'sonarjs/cognitive-complexity': ['error', 30],
  },
  parserOptions: {
    project: ['./tsconfig.json', './tests/tsconfig.json'],
  },
};
