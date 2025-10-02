import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "./src"),
      "#application": path.resolve(__dirname, "./src/application"),
    },
  },
});
