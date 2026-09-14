import { defineConfig } from 'vite'

// GitHub Pages serves this as a project site at /nexaa-portfolio/, so assets
// need that base path in CI builds. Local dev/build stays at the root.
export default defineConfig({
  root: 'src',
  publicDir: '../public',
  base: process.env.GITHUB_PAGES ? '/nexaa-portfolio/' : '/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
