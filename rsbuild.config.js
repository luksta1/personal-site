// @ts-check
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: { index: "./src/main.jsx" },
  },
  html: {
    title: "Luke Pura — Lead Software Engineer",
    meta: {
      description:
        "Portfolio of Luke Pura — lead software engineer specializing in user-focused products and scalable frontend systems.",
      viewport: "width=device-width, initial-scale=1",
    },
  },
});
