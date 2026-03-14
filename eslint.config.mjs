export default [
  {
    ignores: ['**/dist/**', '**/.next/**', '**/node_modules/**']
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    rules: {
      'no-unused-vars': 'error'
    }
  }
];
