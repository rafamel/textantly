// npm i --save-dev eslint babel-eslint eslint-config-standard eslint-plugin-import eslint-plugin-jest eslint-plugin-node eslint-plugin-promise eslint-plugin-standard prettier eslint-config-prettier eslint-plugin-prettier

module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: [
    'react-app',
    'standard',
    'plugin:import/errors',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'prettier'
  ],
  env: {
    browser: true,
    jest: true
  },
  parserOptions: {
    impliedStrict: true
  },
  plugins: [
    'prettier',
    'jest',
    'react',
    'jsx-a11y',
    'import',
    'class-property'
  ],
  globals: {},
  rules: {
    'prettier/prettier': [2, require('./.prettierrc')],
    'no-console': 1,
    // Breaking change of jsx-x11y with 'react-app' defaults
    'jsx-a11y/img-has-alt': 0,
    // Can't detect non-relative to ./src
    'import/no-unresolved': 0
  }
};
