module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: [
    // '@nuxtjs/eslint-config-typescript',
    'plugin:prettier/recommended',
    'plugin:tailwindcss/recommended',
  ],
  plugins: [],
  rules: {
    'vue/multi-word-component-names': 0,
    semi: [2, 'never'],
    'prettier/prettier': [
      'error',
      { semi: false, singleQuote: true, endOfLine: 'auto' },
    ],
    quotes: [2, 'single', { avoidEscape: true }],
  },
}
