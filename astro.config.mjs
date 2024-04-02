import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import { Client } from "basic-ftp";


// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: "static",
});