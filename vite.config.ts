import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { handleDatabase } from "./server/database";

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const privateEnv = loadEnv(mode, process.cwd(), ["TURSO_", "SQLITE_PATH", "PIRATE_ADMIN_PASSWORD"]);
  for (const [key, value] of Object.entries(privateEnv)) process.env[key] ??= value;
  const plugins = [react(), tailwindcss(), {
    name: "persistent-workspace-database",
    configureServer(server: import("vite").ViteDevServer) { server.middlewares.use("/api/database", handleDatabase); },
    configurePreviewServer(server: import("vite").PreviewServer) { server.middlewares.use("/api/database", handleDatabase); },
  }];
  try {
    // @ts-expect-error The editor's optional instrumentation is a JavaScript module.
    const m = await import("./.vite-source-tags.js");
    plugins.push(m.sourceTags());
  } catch {
    /* Source tagging is optional outside the preview editor. */
  }

  const env = loadEnv(mode, process.cwd(), ["VITE_", "NEXT_PUBLIC_"]);
  const processEnvDefines: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    processEnvDefines[`process.env.${key}`] = JSON.stringify(value);
  }

  return {
    plugins,
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "math-renderer": ["katex"],
            "react-core": ["react", "react-dom", "react-router-dom"],
          },
        },
      },
    },
    envPrefix: ["VITE_", "NEXT_PUBLIC_"],
    define: processEnvDefines,
  };
});
