import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {
  copyFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));
const sourceDataDir = join(projectRoot, "data");
const buildDataDir = join(projectRoot, "dist", "data");

function copyDirectory(sourceDir, targetDir) {
  if (!existsSync(sourceDir)) {
    return;
  }

  readdirSync(sourceDir, { withFileTypes: true }).forEach((entry) => {
    const sourcePath = join(sourceDir, entry.name);
    const targetPath = join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
      return;
    }

    mkdirSync(dirname(targetPath), { recursive: true });
    copyFileSync(sourcePath, targetPath);
  });
}

function getContentType(filePath) {
  if (filePath.endsWith(".csv")) {
    return "text/csv; charset=utf-8";
  }

  if (filePath.endsWith(".json") || filePath.endsWith(".geojson")) {
    return "application/json; charset=utf-8";
  }

  return "application/octet-stream";
}

function dataFolderPlugin() {
  return {
    name: "serve-project-data-folder",
    configureServer(server) {
      server.middlewares.use("/data", (request, response, next) => {
        const rawUrl = request.url?.split("?")[0] || "/";
        const requestedFile = join(sourceDataDir, decodeURIComponent(rawUrl));
        const relativePath = relative(sourceDataDir, requestedFile);

        if (
          relativePath.startsWith("..") ||
          !existsSync(requestedFile) ||
          !statSync(requestedFile).isFile()
        ) {
          next();
          return;
        }

        response.setHeader("Content-Type", getContentType(requestedFile));
        createReadStream(requestedFile).pipe(response);
      });
    },
    closeBundle() {
      copyDirectory(sourceDataDir, buildDataDir);
    },
  };
}

export default defineConfig({
  plugins: [react(), dataFolderPlugin()],
  server: {
    allowedHosts: ["782d-125-235-237-167.ngrok-free.app"],
  },
});
