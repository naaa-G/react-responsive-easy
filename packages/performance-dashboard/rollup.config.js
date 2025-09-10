import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
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
      postcss({
        extract: true,
        minimize: true,
        sourceMap: true,
        config: {
          path: './postcss.config.cjs'
        }
      }),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.ts', '**/*.test.tsx', 'dashboard/**/*'],
        declaration: true,
        declarationMap: true,
        outputToFilesystem: true
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
  }
];
