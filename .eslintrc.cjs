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
    'sonarjs/cognitive-complexity': ['error', 30],
    'no-secrets/no-secrets': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-unreadable-array-destructuring': 'off',
    'unicorn/no-keyword-prefix': 'off',
    'unicorn/catch-error-name': ['error', { name: 'err' }],
    'unicorn/prefer-ternary': ['error', 'only-single-line'],
    'unicorn/switch-case-braces': ['error', 'avoid'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true, argsIgnorePattern: '^_' },
    ],
    'no-empty': ['error', { allowEmptyCatch: true }],
    'unicorn/no-new-array': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/import-index': ['error', { ignoreImports: true }],
    'unicorn/filename-case': ['off'],
  },
  parserOptions: {
    project: ['./tsconfig.json', './tests/tsconfig.json'],
  },
};
