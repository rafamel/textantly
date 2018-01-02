'use strict';
module.exports = {
    root: true,
    parser: 'babel-eslint',
    extends: [
        'react-app',
        'standard',
        'plugin:import/errors',
        'plugin:jsx-a11y/recommended',
        'plugin:react/recommended',
    ],
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        jest: true,
        node: true,
    },
    plugins: [
      'react',
      'jsx-a11y',
      'import',
      'class-property'
    ],
    parserOptions: {
        ecmaVersion: 6
    },
    globals: {
        Caman: true
    },
    rules: {
        'jsx-a11y/img-has-alt': 0, // breaking change of jsx-x11y with 'react-app' defaults
        'import/no-unresolved': 0, // Can't detect non-relative to ./src
        'import/no-webpack-loader-syntax': 0,
        'class-property/class-property-semicolon': 2,
        // Console.log
        'no-console': 1,
        // Switch
        'default-case': 0,
        // Indentation
        'indent': [ 2, 4 ],
        // Semicolons
        'semi': [2, 'always'],
        // Space before function parenthesis
        'space-before-function-paren': [2, {
            'anonymous': 'always',
            'named': 'never',
            'asyncArrow': 'always'
        }],
        // Template strings inner spacing
        'template-curly-spacing': 0,
        'operator-linebreak': [2, 'before'],
        // Line length
        'max-len': [2, {
            'code': 90,
            'ignoreUrls': true,
            'ignoreComments': true,
            'ignoreStrings': true,
            'ignoreTemplateLiterals': true,
            'ignoreRegExpLiterals': true
        }]
    }
};
