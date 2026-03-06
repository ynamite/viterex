import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.resolve(__dirname, "../../templates");

/**
 * Replace all {{PLACEHOLDER}} tokens in a string with values from the replacements map.
 */
function replacePlaceholders(
  content: string,
  replacements: Record<string, string>
): string {
  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return key in replacements ? replacements[key] : match;
  });
}

/**
 * Read a .tpl file, replace placeholders, and write to destination.
 */
async function processTemplate(
  tplPath: string,
  destPath: string,
  replacements: Record<string, string>
): Promise<void> {
  if (!(await fs.pathExists(tplPath))) return;
  const content = await fs.readFile(tplPath, "utf-8");
  await fs.writeFile(destPath, replacePlaceholders(content, replacements));
}

/**
 * Copy a static file from templates to the project directory.
 */
async function copyTemplate(
  srcPath: string,
  destPath: string
): Promise<void> {
  if (!(await fs.pathExists(srcPath))) return;
  await fs.copy(srcPath, destPath, { overwrite: false });
}

export async function scaffoldFrontend(config: ViterexConfig): Promise<void> {
  const {
    projectDir,
    projectName,
    redaxoServerName,
    redaxoAdminUser,
    redaxoAdminEmail,
    redaxoErrorEmail,
    massifSettings,
    verbose,
    useTailwind,
    useFluidTw,
    setupDeploy,
  } = config;

  // Common placeholder replacements used across all templates
  const replacements: Record<string, string> = {
    PROJECT_NAME: projectName,
    SERVER_NAME: redaxoServerName,
    ADMIN_USER: redaxoAdminUser,
    ADMIN_EMAIL: redaxoAdminEmail,
    ERROR_EMAIL: redaxoErrorEmail,
    HOST_PROTOCOL: "http",
    MASSIF_FIRMA: massifSettings.firma,
    MASSIF_STRASSE: massifSettings.strasse,
    MASSIF_PLZ: massifSettings.plz,
    MASSIF_ORT: massifSettings.ort,
    MASSIF_KANTON_CODE: massifSettings.kantonCode,
    MASSIF_LAND: massifSettings.land,
    MASSIF_LAND_CODE: massifSettings.landCode,
    MASSIF_PHONE: massifSettings.phone,
    MASSIF_EMAIL: massifSettings.email,
    MASSIF_GOOGLE_MAPS_LINK: massifSettings.googleMapsLink,
    MASSIF_GEO_LAT: massifSettings.geoLat,
    MASSIF_GEO_LONG: massifSettings.geoLong,
  };

  // ─── 1. Base static files ──────────────────────────────────────────
  // .browserslistrc, .eslintrc.cjs, .prettierrc, stylelint.config.js,
  // jsconfig.json, index.js, LocalValetDriver.php, .gitignore
  const baseDir = path.join(templatesDir, "base");
  if (await fs.pathExists(baseDir)) {
    await fs.copy(baseDir, projectDir, { overwrite: false });
  }

  // ─── 2. Templated root configs ─────────────────────────────────────
  // .env and .env.local (both from same template)
  await processTemplate(
    path.join(templatesDir, "env.tpl"),
    path.join(projectDir, ".env"),
    replacements
  );
  await processTemplate(
    path.join(templatesDir, "env.tpl"),
    path.join(projectDir, ".env.local"),
    replacements
  );

  // package.json
  await processTemplate(
    path.join(templatesDir, "package.json.tpl"),
    path.join(projectDir, "package.json"),
    replacements
  );

  // If tailwind selected, add tailwind + fluid-tailwind deps to package.json
  if (useTailwind) {
    const pkgPath = path.join(projectDir, "package.json");
    const pkg = await fs.readJSON(pkgPath);
    pkg.devDependencies["tailwindcss"] = "3.4.17";
    pkg.devDependencies["prettier-plugin-tailwindcss"] = "^0.6.11";
    if (useFluidTw) {
      pkg.devDependencies["fluid-tailwind"] = "^1.0.4";
    }
    await fs.writeJSON(pkgPath, pkg, { spaces: 2 });
  }

  // vite.config.js (no dynamic placeholders, but kept as .tpl for consistency)
  await processTemplate(
    path.join(templatesDir, "vite.config.js.tpl"),
    path.join(projectDir, "vite.config.js"),
    replacements
  );

  // composer.json
  await processTemplate(
    path.join(templatesDir, "composer.json.tpl"),
    path.join(projectDir, "composer.json"),
    replacements
  );

  // ─── 3. Tailwind / PostCSS ────────────────────────────────────────
  if (useTailwind) {
    await processTemplate(
      path.join(templatesDir, "tailwind.config.js.tpl"),
      path.join(projectDir, "tailwind.config.js"),
      replacements
    );
    // PostCSS config with tailwind plugins
    await copyTemplate(
      path.join(templatesDir, "base", "postcss.config.js"),
      path.join(projectDir, "postcss.config.js")
    );
  } else {
    // PostCSS config without tailwind
    await copyTemplate(
      path.join(templatesDir, "postcss.config.no-tailwind.js"),
      path.join(projectDir, "postcss.config.js")
    );
  }

  // ─── 4. Redaxo PHP files ──────────────────────────────────────────
  // NOTE: bin/console, path_provider.php, index.frontend.php,
  // index.backend.php, and .htaccess are copied in download-redaxo.ts
  // because they must be in place before `setup:run` executes.

  const redaxoDir = path.join(templatesDir, "redaxo");

  // var/data/addons/install/config.json
  await fs.ensureDir(path.join(projectDir, "var", "data", "addons", "install"));
  await copyTemplate(
    path.join(redaxoDir, "redaxo_install_config.json"),
    path.join(projectDir, "var", "data", "addons", "install", "config.json")
  );

  // var/data/addons/ydeploy (empty dir needed)
  await fs.ensureDir(path.join(projectDir, "var", "data", "addons", "ydeploy"));

  // Massif install SQL (templated with placeholders)
  await processTemplate(
    path.join(redaxoDir, "redaxo_massif_install.sql.tpl"),
    path.join(projectDir, "var", "data", "redaxo_massif_install.sql"),
    replacements
  );

  // src/addons/project/fragments (empty dir for project fragments)
  await fs.ensureDir(path.join(projectDir, "src", "addons", "project", "fragments"));

  // ─── 5. Deploy files (conditional) ────────────────────────────────
  if (setupDeploy) {
    const deployDir = path.join(templatesDir, "deploy");

    await processTemplate(
      path.join(deployDir, "deploy.php.tpl"),
      path.join(projectDir, "deploy.php"),
      replacements
    );

    await copyTemplate(
      path.join(deployDir, "deployer.task.setup.php"),
      path.join(projectDir, "deployer.task.setup.php")
    );

    await copyTemplate(
      path.join(deployDir, "deployer.task.release.metanet.php"),
      path.join(projectDir, "deployer.task.release.metanet.php")
    );
  }

  // ─── 6. Utility scripts ───────────────────────────────────────────
  const scriptsDir = path.join(templatesDir, "scripts");

  const scripts = ["quickstart", "sync-config", "sync-db", "sync-media"];
  for (const script of scripts) {
    const dest = path.join(projectDir, script);
    await copyTemplate(path.join(scriptsDir, script), dest);
    // Make scripts executable
    if (await fs.pathExists(dest)) {
      await fs.chmod(dest, 0o755);
    }
  }

  // ─── 7. Download redaxo-frontend-assets from GitHub ────────────────
  // Clone the repo into a temp dir, then rsync (merge without overwriting)
  const tmpAssets = path.join(projectDir, "tmp-assets");
  try {
    await exec(
      "gh",
      ["repo", "clone", "massif-web/redaxo-frontend-assets", tmpAssets],
      { verbose }
    );
    // Remove git metadata from the cloned repo
    await fs.remove(path.join(tmpAssets, ".git"));
    await fs.remove(path.join(tmpAssets, ".github"));
    await fs.remove(path.join(tmpAssets, ".gitignore"));
    // Merge into project root without overwriting existing files
    await exec("rsync", ["-a", "--ignore-existing", `${tmpAssets}/`, `${projectDir}/`], { verbose });
  } finally {
    await fs.remove(tmpAssets);
  }
}
