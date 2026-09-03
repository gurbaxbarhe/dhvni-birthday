import { defineConfig } from "vite";

// GitHub Pages serves project sites from https://<user>.github.io/<repo>/
// so assets need to be prefixed with the repo name in production builds.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/dhvni-birthday/" : "/",
}));
