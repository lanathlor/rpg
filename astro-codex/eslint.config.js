import i18next from "eslint-plugin-i18next";
import tseslint from "typescript-eslint";

export default tseslint.config({
  files: ["src/**/*.{tsx,jsx}"],
  extends: [tseslint.configs.base],
  plugins: {
    i18next,
  },
  rules: {
    "i18next/no-literal-string": [
      "error",
      {
        markupOnly: true,
        ignoreAttribute: [
          "className",
          "class",
          "style",
          "type",
          "key",
          "id",
          "htmlFor",
          "data-testid",
          "role",
          "href",
          "src",
          "alt",
          "target",
          "rel",
          "name",
          "value",
        ],
        ignoreCallee: [
          "console.*",
          "*.addEventListener",
          "*.removeEventListener",
          "*.querySelector",
          "*.querySelectorAll",
          "*.getElementById",
          "*.classList.*",
          "*.setAttribute",
          "*.getAttribute",
          "JSON.parse",
          "JSON.stringify",
          "localStorage.*",
          "crypto.*",
        ],
        ignoreComponent: ["Trans"],
      },
    ],
  },
});
