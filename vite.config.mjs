import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repositoryName = "new-backend-prototype-demo";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? `/${repositoryName}/` : "/",
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react()],
});
