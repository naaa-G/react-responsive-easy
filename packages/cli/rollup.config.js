import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { dts } from 'rollup-plugin-dts';
import json from '@rollup/plugin-json';
import { builtinModules } from 'module';

// Enterprise-grade external dependencies
const EXTERNAL_DEPENDENCIES = [
  // Node.js built-ins
  ...builtinModules,
  
  // Core CLI dependencies
  'commander',
  'chalk',
  'ora',
  'inquirer',
  'fs-extra',
  'glob',
  'path-browserify',
  
  // Enterprise dependencies
  'winston',
  'conf',
  'semver',
  'uuid',
  'crypto',
  'events',
  'util',
  'fs',
  'path',
  'os',
  'child_process',
  'stream',
  'buffer',
  'string_decoder',
  'http',
  'https',
  'url',
  'querystring',
  'zlib',
  'readline',
  'tty',
  'cluster',
  'worker_threads',
  
  // React ecosystem (external to avoid bundling)
      'react',
    'react-dom',
    '@types/react',
    '@types/react-dom',
    'react/jsx-runtime',
  
  // Project dependencies
  '@react-responsive-easy/core',
  '@yaseratiar/react-responsive-easy-ai-optimizer',
  '@yaseratiar/react-responsive-easy-performance-dashboard'
];

// Enterprise-grade rollup plugins configuration
const createPlugins = (isDTS = false) => {
  const plugins = [
    json({
      compact: true,
      preferConst: true
    })
  ];

  if (!isDTS) {
    plugins.push(
      nodeResolve({
        preferBuiltins: true,
        exportConditions: ['node'],
        browser: false,
        dedupe: ['commander', 'chalk', 'ora']
      }),
      commonjs({
        ignoreDynamicRequires: true,
        transformMixedEsModules: true,
        requireReturnsDefault: 'auto'
      }),
      typescript({
        tsconfig: './tsconfig.json',
        sourceMap: true,
        declaration: false,
        declarationMap: false,
        inlineSources: false,
        exclude: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**']
      })
    );
  } else {
    plugins.push(
      dts({
        respectExternal: true,
        compilerOptions: {
          skipLibCheck: true,
          declaration: true,
          emitDeclarationOnly: true,
          preserveSymlinks: false
        },
        exclude: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**']
      })
    );
  }

  return plugins;
};

// Enterprise-grade rollup configuration
export default defineConfig([
  // Main CLI bundle
  {
    input: 'src/cli.ts',
    output: {
      file: 'dist/cli.js',
      format: 'cjs',
      banner: '#!/usr/bin/env node',
      sourcemap: true,
      exports: 'auto',
      strict: true
    },
    external: EXTERNAL_DEPENDENCIES,
    plugins: createPlugins(),
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false
    },
    onwarn(warning, warn) {
      // Suppress specific warnings for enterprise-grade builds
      if (warning.code === 'CIRCULAR_DEPENDENCY') return;
      if (warning.code === 'EVAL') return;
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      if (warning.message.includes('preferring built-in module')) return;
      warn(warning);
    }
  },
  
  // Library bundle (CommonJS)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'auto',
      strict: true
    },
    external: EXTERNAL_DEPENDENCIES,
    plugins: createPlugins(),
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false
    },
    onwarn(warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') return;
      if (warning.code === 'EVAL') return;
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      if (warning.message.includes('preferring built-in module')) return;
      warn(warning);
    }
  },
  
  // Library bundle (ESM)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      exports: 'auto',
      strict: true
    },
    external: EXTERNAL_DEPENDENCIES,
    plugins: createPlugins(),
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false
    },
    onwarn(warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') return;
      if (warning.code === 'EVAL') return;
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      if (warning.message.includes('preferring built-in module')) return;
      warn(warning);
    }
  },
  
  // Type definitions
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'esm'
    },
    external: EXTERNAL_DEPENDENCIES,
    plugins: createPlugins(true),
    onwarn(warning, warn) {
      // Suppress React type warnings for enterprise builds
      if (warning.message.includes('JSX is not exported')) return;
      if (warning.message.includes('ElementType is not exported')) return;
      if (warning.message.includes('Key is not exported')) return;
      if (warning.message.includes('ReactElement is not exported')) return;
      warn(warning);
    }
  }
]);