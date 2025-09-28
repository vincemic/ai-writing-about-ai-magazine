import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Allow unused variables (warnings only)
      "@typescript-eslint/no-unused-vars": "warn",
      // Allow unescaped entities in JSX (common in text content)
      "react/no-unescaped-entities": "off",
      // Allow img elements (warnings only) 
      "@next/next/no-img-element": "warn",
    },
  },
];

export default eslintConfig;
