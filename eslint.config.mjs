import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // Disable hook-deps warnings if you’re intentionally omitting deps:
      "react-hooks/exhaustive-deps": "off",
      // Allow normal <img> usage:
      "@next/next/no-img-element": "off",
      // Allow unescaped quotes:
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
