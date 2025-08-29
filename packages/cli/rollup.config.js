import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { dts } from 'rollup-plugin-dts';
import json from '@rollup/plugin-json';

export default defineConfig([
  // Main bundle
  {
    input: 'src/cli.ts',
    output: [
      {
        file: 'dist/cli.js',
        format: 'cjs',
        banner: '#!/usr/bin/env node',
        sourcemap: true
      }
    ],
    external: [
      'commander',
      'chalk',
      'ora',
      'inquirer',
      'fs-extra',
      'glob',
      'path-browserify',
      '@react-responsive-easy/core'
    ],
    plugins: [
      json(),
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        sourceMap: true
      })
    ]
  },
  
  // Library bundle
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    external: [
      'commander',
      'chalk',
      'ora',
      'inquirer',
      'fs-extra',
      'glob',
      'path-browserify',
      '@react-responsive-easy/core'
    ],
    plugins: [
      json(),
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        sourceMap: true
      })
    ]
  },
  
  // Type definitions
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'esm'
    },
    plugins: [dts()]
  }
]);
