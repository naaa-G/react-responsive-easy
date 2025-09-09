import globals from 'globals';
import pluginJs from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
  pluginJs.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      // Critical TypeScript rules (relaxed for enterprise codebase)
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      'no-unused-vars': 'off', // Turn off base rule
      '@typescript-eslint/no-explicit-any': 'off', // Allow any for Babel AST nodes
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/await-thenable': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/return-await': 'warn',

      // General enterprise rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-spacing': 'error',
      'no-duplicate-imports': 'error',
      'no-useless-rename': 'error',
      'object-shorthand': 'warn', // Relaxed to warn
      'prefer-template': 'error',
      'template-curly-spacing': 'error',
      'yield-star-spacing': 'error',
      'no-await-in-loop': 'warn', // Relaxed for test loops
      'no-return-await': 'error',
      'prefer-promise-reject-errors': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unreachable-loop': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-negation': 'error',
      'valid-typeof': 'error',
      'no-array-constructor': 'error',
      'no-new-object': 'error',
      'no-new-wrappers': 'error',
      'no-octal-escape': 'error',
      'no-param-reassign': 'error',
      'no-proto': 'error',
      'no-iterator': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.name="eval"]',
          message: 'eval() is not allowed for security reasons'
        },
        {
          selector: 'CallExpression[callee.name="Function"]',
          message: 'Function constructor is not allowed for security reasons'
        }
      ],

      // Code quality rules (relaxed for Babel plugin complexity)
      'complexity': ['warn', 35], // Increased for Babel plugins
      'max-depth': ['warn', 8],
      'max-lines': ['warn', 1500],
      'max-lines-per-function': ['warn', 250], // Increased for Babel visitors
      'max-params': ['warn', 8],
      'max-statements': ['warn', 60], // Increased for Babel visitors
      'no-magic-numbers': 'off', // Allow magic numbers in Babel plugins

      // Security rules
      'no-caller': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-implied-eval': 'error',
      'no-iterator': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',
      'no-multi-str': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-octal-escape': 'error',
      'no-proto': 'error',
      'no-return-assign': 'error',
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unused-expressions': 'error',
      'no-useless-call': 'error',
      'no-void': 'error',
      'no-with': 'error',
      'radix': 'error',
      'wrap-iife': 'error',
      'yoda': 'error',
      'no-async-promise-executor': 'warn' // Relaxed for test code
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        NodeJS: 'readonly',
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      'no-unused-vars': 'off',
      'no-console': 'off',
      'no-magic-numbers': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'complexity': 'off',
      'no-undef': 'off',
      'no-await-in-loop': 'off',
      'no-async-promise-executor': 'off',
      'object-shorthand': 'off'
    },
  },
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      '*.js',
      '*.d.ts',
    ],
  },
];