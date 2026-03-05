import path from "node:path";
import fs from "fs-extra";
import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

export async function downloadRedaxo(config: ViterexConfig): Promise<void> {
  const { projectDir, redaxoVersion, verbose } = config;
  const tmpDir = path.join(projectDir, "tmp");
  const zipFile = path.join(tmpDir, `redaxo_${redaxoVersion}.zip`);
  const publicDir = path.join(projectDir, "public");
  const url = `https://github.com/redaxo/redaxo/releases/download/${redaxoVersion}/redaxo_${redaxoVersion}.zip`;

  await fs.ensureDir(tmpDir);

  await exec("curl", ["-Ls", "-o", zipFile, url], { verbose });
  await exec("unzip", ["-oq", zipFile, "-d", publicDir], { verbose });

  // Reorganize into Yakamara-massif file structure
  const binDir = path.join(projectDir, "bin");
  const srcDir = path.join(projectDir, "src");
  const varDir = path.join(projectDir, "var");

  await fs.ensureDir(binDir);
  await fs.ensureDir(srcDir);
  await fs.ensureDir(varDir);

  await fs.move(path.join(publicDir, "redaxo/bin"), binDir, { overwrite: true });
  await fs.move(path.join(publicDir, "redaxo/cache"), path.join(varDir, "cache"), { overwrite: true });
  await fs.move(path.join(publicDir, "redaxo/data"), path.join(varDir, "data"), { overwrite: true });
  await fs.move(path.join(publicDir, "redaxo/src/addons"), path.join(srcDir, "addons"), { overwrite: true });
  await fs.move(path.join(publicDir, "redaxo/src/core"), path.join(srcDir, "core"), { overwrite: true });

  // Move license, remove readme
  const license = path.join(publicDir, "LICENSE.md");
  if (await fs.pathExists(license)) {
    await fs.move(license, path.join(projectDir, "LICENSE.md"), { overwrite: true });
  }
  await fs.remove(path.join(publicDir, "README.md"));
  await fs.remove(path.join(publicDir, ".htaccess"));

  // Clean up leftover redaxo dirs
  await fs.remove(path.join(publicDir, "redaxo/bin"));
  await fs.remove(path.join(publicDir, "redaxo/src"));
  await fs.remove(path.join(publicDir, ".gitignore.example"));

  // Clean up tmp
  await fs.remove(tmpDir);
}
