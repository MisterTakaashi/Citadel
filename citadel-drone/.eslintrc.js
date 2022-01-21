module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'prettier',
  ],
  rules: {},
};
