/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

// eslint-disable-next-line import/no-extraneous-dependencies
const baseStyleRules = require('eslint-config-airbnb-base/rules/style').rules;

const dangleRules = baseStyleRules['no-underscore-dangle'];

module.exports = {
  env: {
    browser: true,
    // es2021: true, // Environment key "es2021" is unknown
    node: true,
  },

  extends: [
    'eslint-config-airbnb-base',
  ],

  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },

  plugins: [
    '@typescript-eslint',
    'header',
  ],

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.component'],
      },
    },
  },

  // rules for all files (*.ts are overritten below)
  //
  rules: {
    'linebreak-style': 0,
    // our own rules
    'no-empty-function': ['error', { allow: ['constructors'] }],
    '@typescript-eslint/naming-convention': 'warn',

    'header/header': [
      2,
      'block',
      [
        '*',
        {
          pattern: ' \\* Copyright \\(c\\) (\\d{4}, )+Oracle and/or its affiliates\\.',
        },
        ' * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/',
        ' ',
      ],
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],

    'class-methods-use-this': 'off',
    'no-underscore-dangle': [
      dangleRules[0],
      {
        ...dangleRules[1],
      },
    ],
    'import/default': 'error',
    'import/namespace': 'error',
    'import/imports-first': 'error',
  },

  overrides: [
    {
      files: ['*.ts'],

      parser: '@typescript-eslint/parser',

      plugins: ['@typescript-eslint'],

      rules: {
        'linebreak-style': 0,
        'no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: true }],
        'no-useless-constructor': 'off',

        // IMPORT
        'import/prefer-default-export': 'off',

        // TYPESCRIPT
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        // '@typescript-eslint/class-name-casing': 'error', // no longer valid
        '@typescript-eslint/member-delimiter-style': 'error',
        '@typescript-eslint/member-ordering': [
          'error',
          {
            default: [
              'public-field',
              'private-field',
              'constructor',
              'public-method',
              'private-method',
            ],
          },
        ],
        '@typescript-eslint/no-array-constructor': 'error',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-for-in-array': 'error',
        '@typescript-eslint/no-inferrable-types': 'error',
        '@typescript-eslint/no-require-imports': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { vars: 'all', args: 'none', ignoreRestSiblings: true },
        ],
        '@typescript-eslint/no-use-before-define': 'error',
        '@typescript-eslint/no-useless-constructor': 'error',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/type-annotation-spacing': 'error',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: [],
          },
        ],

      },
    },
  ],

};
