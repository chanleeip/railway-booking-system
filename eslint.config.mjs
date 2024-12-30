import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a compat instance for extending rules
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Define your ESLint configuration
const eslintConfig = {
  extends: [
    "next/core-web-vitals",
    "next/typescript",
    // You can add more configurations here as needed
  ],
  rules: {
    // Add or customize rules here
    "@typescript-eslint/no-explicit-any": "off", // Example of disabling a rule
    "@typescript-eslint/no-unused-vars": "warn", // Example of customizing a rule
  },
};

export default eslintConfig;