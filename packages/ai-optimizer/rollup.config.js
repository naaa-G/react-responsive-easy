import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

export default [
  // Main build with TypeScript declarations
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
        exclude: ['**/*.test.ts', '**/*.test.tsx'],
        declaration: true,
        declarationDir: 'dist',
        declarationMap: true
      })
    ],
    external: [
      'react',
      'react-dom',
      '@tensorflow/tfjs',
      '@tensorflow/tfjs-node',
      '@react-responsive-easy/core',
      'events',
      'fs',
      'path',
      'util'
    ]
  },
  // Standalone type definitions bundle (enterprise-grade approach)
  {
    input: 'src/index.ts',
    output: [{ 
      file: 'dist/index.d.ts', 
      format: 'esm' 
    }],
    plugins: [
      dts({
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.ts', '**/*.test.tsx']
      })
    ],
    external: [
      'react',
      'react-dom',
      '@tensorflow/tfjs',
      '@tensorflow/tfjs-node',
      '@react-responsive-easy/core',
      'events',
      'fs',
      'path',
      'util'
    ]
  }
];
