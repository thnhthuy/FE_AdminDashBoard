import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@styles": path.resolve(__dirname, "src/assets/styles"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@icons": path.resolve(__dirname, "src/assets/icons"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
      "@layout": path.resolve(__dirname, "src/components/layout"),
      "@ui": path.resolve(__dirname, "src/components/ui"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@routers": path.resolve(__dirname, "src/routers"),
    },
  },
});
