import { transform } from '@babel/core';
import plugin from './dist/index.esm.js';

const input = `
import React from 'react';
const fontSize = useResponsiveValue(24);
`;

console.log('Input:', input);

const result = transform(input, {
  filename: 'test.tsx',
  plugins: [[plugin, { precompute: true, development: true }]],
  presets: [
    ['@babel/preset-env', { 
      targets: { node: 'current' },
      modules: false // Generate ES6 modules instead of CommonJS
    }],
    '@babel/preset-typescript'
  ]
});

console.log('Output:', result?.code);
