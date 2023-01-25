module.exports = {
  extends: [
    "eslint:recommended",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "plugin:solid/typescript",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  settings: {
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        directory: "./tsconfig.json",
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  parserOptions: { project: "tsconfig.json" },
  plugins: ["@typescript-eslint", "import", "solid", "prettier"],
  root: true,
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/quotes": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-shadow": "off"
  },
};
