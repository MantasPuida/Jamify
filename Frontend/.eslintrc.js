module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  extends: ["airbnb", "airbnb-typescript", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 13,
    sourceType: "module",
    files: ["*.ts", "*.tsx"],
    project: ["./tsconfig.json"]
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "import/prefer-default-export": "off",
    "react/jsx-boolean-value": [1, "always"],
    "comma-dangle": ["error", "never"],
    semi: [1, "always"],
    quotes: [2, "double"],
    "react/jsx-props-no-spreading": [0],
    "react/state-in-constructor": [0],
    "class-methods-use-this": [0]
  }
};
