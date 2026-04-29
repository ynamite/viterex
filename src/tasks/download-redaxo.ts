import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import { exec } from "../utils/exec.js";
import { consolePathFor } from "../utils/detect.js";
import type { ViterexConfig } from "../types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.resolve(__dirname, "../templates");

export async function downloadRedaxo(config: ViterexConfig): Promise<void> {
  const { projectDir, redaxoVersion, layout, verbose } = config;

  // Belt-and-braces idempotency guard: if the layout-specific console binary
  // already exists, Redaxo is already on disk — skip.
  if (await fs.pathExists(path.join(projectDir, consolePathFor(layout)))) {
    return;
  }

  const tmpDir = path.join(projectDir, "tmp");
  const zipFile = path.join(tmpDir, `redaxo_${redaxoVersion}.zip`);
  const url = `https://github.com/redaxo/redaxo/releases/download/${redaxoVersion}/redaxo_${redaxoVersion}.zip`;

  await fs.ensureDir(tmpDir);

  if (layout === "modern") {
    await downloadAndReorganizeModern(projectDir, tmpDir, zipFile, url, verbose);
  } else {
    await downloadClassic(projectDir, layout, tmpDir, zipFile, url, verbose);
  }

  await fs.remove(tmpDir);
}

async function downloadAndReorganizeModern(
  projectDir: string,
  tmpDir: string,
  zipFile: string,
  url: string,
  verbose: boolean,
): Promise<void> {
  const publicDir = path.join(projectDir, "public");

  await exec("curl", ["-Ls", "-o", zipFile, url], { verbose });
  await exec("unzip", ["-oq", zipFile, "-d", publicDir], { verbose });

  const binDir = path.join(projectDir, "bin");
  const srcDir = path.join(projectDir, "src");
  const varDir = path.join(projectDir, "var");

  await fs.ensureDir(binDir);
  await fs.ensureDir(srcDir);
  await fs.ensureDir(varDir);

  await fs.move(path.join(publicDir, "redaxo/bin"), binDir, { overwrite: true });
  await fs.move(path.join(publicDir, "redaxo/cache"), path.join(varDir, "cache"), { overwrite: true });
  await fs.move(path.join(publicDir, "redaxo/data"), path.join(varDir, "data"), { overwrite: true });
  await fs.move(path.join(publicDir, "redaxo/src/addons"), path.join(srcDir, "addons"), {
    overwrite: true,
  });
  await fs.move(path.join(publicDir, "redaxo/src/core"), path.join(srcDir, "core"), {
    overwrite: true,
  });

  const license = path.join(publicDir, "LICENSE.md");
  if (await fs.pathExists(license)) {
    await fs.move(license, path.join(projectDir, "LICENSE.md"), { overwrite: true });
  }
  await fs.remove(path.join(publicDir, "README.md"));
  await fs.remove(path.join(publicDir, ".htaccess"));

  await fs.remove(path.join(publicDir, "redaxo/bin"));
  await fs.remove(path.join(publicDir, "redaxo/src"));
  await fs.remove(path.join(publicDir, ".gitignore.example"));

  // Copy custom Redaxo PHP files required for the modern (path_provider) layout.
  const redaxoTemplates = path.join(templatesDir, "redaxo");

  await fs.copy(path.join(redaxoTemplates, "console"), path.join(binDir, "console"), {
    overwrite: true,
  });
  await fs.chmod(path.join(binDir, "console"), 0o755);
  await fs.copy(path.join(redaxoTemplates, "path_provider.php"), path.join(srcDir, "path_provider.php"), {
    overwrite: true,
  });
  await fs.copy(path.join(redaxoTemplates, "index.frontend.php"), path.join(publicDir, "index.php"), {
    overwrite: true,
  });
  await fs.ensureDir(path.join(publicDir, "redaxo"));
  await fs.copy(
    path.join(redaxoTemplates, "index.backend.php"),
    path.join(publicDir, "redaxo", "index.php"),
    { overwrite: true },
  );
  await fs.copy(path.join(redaxoTemplates, "htaccess"), path.join(publicDir, ".htaccess"), {
    overwrite: true,
  });
}

async function downloadClassic(
  projectDir: string,
  layout: ViterexConfig["layout"],
  tmpDir: string,
  zipFile: string,
  url: string,
  verbose: boolean,
): Promise<void> {
  await exec("curl", ["-Ls", "-o", zipFile, url], { verbose });
  // Classic: unzip directly into the project root. The Redaxo zip already
  // contains the `redaxo/` subdirectory and a top-level index.php / .htaccess
  // — that's exactly the classic layout.
  await exec("unzip", ["-oq", zipFile, "-d", projectDir], { verbose });

  const license = path.join(projectDir, "LICENSE.md");
  if (await fs.pathExists(license)) {
    // already at root; leave as is
  }
  await fs.remove(path.join(projectDir, "README.md"));
  await fs.remove(path.join(projectDir, ".gitignore.example"));

  if (layout === "classic+theme") {
    await fs.ensureDir(path.join(projectDir, "theme", "public"));
    await fs.ensureDir(path.join(projectDir, "theme", "private"));
  }
}
