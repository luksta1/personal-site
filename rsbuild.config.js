// @ts-check
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

const SITE_URL = "https://lukepura.com";

const schemaOrgPerson = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Luke Pura",
  url: SITE_URL,
  jobTitle: "Lead Software Engineer",
  description: "Lead software engineer specializing in user-focused products and scalable frontend systems.",
  sameAs: [
    "https://github.com/luksta1",
    "https://www.linkedin.com/in/lukepura/",
  ],
  knowsAbout: [
    "React",
    "TypeScript",
    "Frontend Architecture",
    "Module Federation",
    "Micro-frontends",
    "Nx",
    "Rspack",
    "Design Systems",
  ],
};

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
      description: "Portfolio of Luke Pura — lead software engineer specializing in user-focused products and scalable frontend systems.",
      viewport: "width=device-width, initial-scale=1",
      author: "Luke Pura",
      canonical: SITE_URL,
      "og:type": "profile",
      "og:title": "Luke Pura — Lead Software Engineer",
      "og:description": "Portfolio of Luke Pura — lead software engineer specializing in user-focused products and scalable frontend systems.",
      "og:url": SITE_URL,
      "og:image": `${SITE_URL}/og-image.png`,
      "profile:first_name": "Luke",
      "profile:last_name": "Pura",
    },
    tags: [
      {
        tag: "link",
        attrs: {
          rel: "canonical",
          href: SITE_URL,
        },
      },
      {
        tag: "script",
        attrs: {
          type: "application/ld+json",
        },
        children: JSON.stringify(schemaOrgPerson),
      },
    ],
  },
});
