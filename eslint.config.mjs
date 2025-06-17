// eslint.config.mjs

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        document: 'readonly',
        window: 'readonly',
        localStorage: 'readonly',
        FormData: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        navigator: 'readonly',
        URLSearchParams: 'readonly',
        IntersectionObserver: 'readonly'
      }
    },
    rules: {
      // Formatting basics
      indent: ['error', 2],
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'eol-last': ['error', 'always'],

      // Clean code habits
      'prefer-const': 'error',
      'prefer-template': 'error',
      'no-unused-vars': 'warn',
      'no-undef': 'error',

      // Optional: leave on warn instead of error
      'no-console': 'warn'
    }
  }
];
