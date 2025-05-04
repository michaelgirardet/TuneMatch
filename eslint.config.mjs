// eslint.config.js
import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {
    settings: {
      next: {
        rootDir: '.',
      },
    },
  },
});

export default [
  ...fixupConfigRules(compat.extends('next/core-web-vitals')),
  {
    ignores: ['.next/', 'node_modules/', '*.config.js', '*.config.ts', 'dist/', 'build/'],
  },
];
