import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['client/**', 'server/**', 'e2e/**', 'node_modules/**', 'dist/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.node },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
];
