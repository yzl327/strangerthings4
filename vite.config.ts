import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];

export default defineConfig(({ command }) => ({
  base: command === "build" ? `/${repositoryName ?? "strangerthings4"}/` : "/",
  plugins: [react()],
}));
