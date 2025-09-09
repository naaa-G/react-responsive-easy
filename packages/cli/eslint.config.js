import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        NodeJS: 'readonly',
        Buffer: 'readonly',
        process: 'readonly',
        require: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      // Critical TypeScript rules (highly relaxed for enterprise CLI)
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      'no-unused-vars': 'off', // Turn off base rule
      '@typescript-eslint/no-explicit-any': 'off', // Allow any for CLI flexibility
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/await-thenable': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      '@typescript-eslint/require-await': 'off', // Many CLI methods are async stubs
      '@typescript-eslint/return-await': 'warn',
      
      // General enterprise rules (relaxed for CLI complexity)
      'no-console': 'off', // CLI needs console output
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-var': 'error',
      'prefer-const': 'warn', // Relaxed to warn
      'prefer-arrow-callback': 'error',
      'arrow-spacing': 'error',
      'no-duplicate-imports': 'error',
      'no-useless-rename': 'error',
      'object-shorthand': 'warn', // Relaxed to warn
      'prefer-template': 'error',
      'template-curly-spacing': 'error',
      'yield-star-spacing': 'error',
      'no-await-in-loop': 'warn', // Relaxed for CLI operations
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
      'no-param-reassign': 'warn', // Relaxed for CLI operations
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
      
      // Code quality rules (highly relaxed for enterprise CLI)
      'complexity': ['warn', 40], // Increased for CLI complexity
      'max-depth': ['warn', 8],
      'max-lines': 'off', // Allow large service files
      'max-lines-per-function': 'off', // Allow large CLI methods
      'max-params': ['warn', 10],
      'max-statements': 'off', // Allow complex CLI methods
      'no-magic-numbers': 'off', // Allow magic numbers in CLI
      
      // Security rules (relaxed where appropriate)
      'no-caller': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',
      'no-multi-str': 'error',
      'no-new': 'error',
      'no-return-assign': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-unused-expressions': 'error',
      'no-useless-call': 'error',
      'no-void': 'error',
      'no-with': 'error',
      'radix': 'error',
      'wrap-iife': 'error',
      'yoda': 'error',
      'no-unreachable': 'warn', // Relaxed to warn
      'no-constant-condition': 'warn', // Relaxed to warn
      'no-redeclare': 'warn', // Relaxed to warn
      'no-undef': 'warn', // Relaxed to warn with globals
      'no-useless-escape': 'warn' // Relaxed to warn
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
        test: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-magic-numbers': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
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
