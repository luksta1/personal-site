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
    favicon: "./public/favicon.ico",
    appIcon: {
      icons: [
        { src: "./public/apple-touch-icon.png", size: 180 },
        { src: "./public/android-chrome-192x192.png", size: 192 },
        { src: "./public/android-chrome-512x512.png", size: 512 },
      ],
    },
    meta: {
      description:
        "Portfolio of Luke Pura — lead software engineer specializing in user-focused products and scalable frontend systems.",
      viewport: "width=device-width, initial-scale=1",
    },
  },
});
