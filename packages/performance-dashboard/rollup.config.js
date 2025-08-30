import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

export default [
  // Main build
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'auto'
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.ts', '**/*.test.tsx', 'dashboard/**/*']
      })
    ],
    external: [
      'react',
      'react-dom',
      'chart.js',
      'recharts',
      'socket.io-client',
      '@react-responsive-easy/core'
    ]
  },
  // Type definitions
  {
    input: 'dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  }
];
