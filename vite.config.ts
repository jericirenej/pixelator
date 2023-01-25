/* eslint-disable import/no-extraneous-dependencies */
import autoprefixer from "autoprefixer";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  base: "/pixelator/",
  plugins: [solidPlugin(), splitVendorChunkPlugin()],
  css: {
    modules: { localsConvention: "dashes" },
    postcss: {
      plugins: [autoprefixer],
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
