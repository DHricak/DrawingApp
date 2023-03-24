import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import {resolve} from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src/"),
      "@comps": resolve(__dirname, "./src/components/"),
      "@svg": resolve(__dirname, "./src/components/svg/"),
      "@store": resolve(__dirname, "./src/store.ts")
    }
  }
})
