// index.ts
import { Command } from "commander";

// prompts.ts
import * as p from "@clack/prompts";
import path from "path";

// types.ts
var ADDON_CATALOG = [
  { key: "yform", label: "YForm (form builder)", recommended: true },
  { key: "yrewrite", label: "YRewrite (URL rewriting)", recommended: true },
  { key: "be_tools", label: "BE Tools (backend enhancements)", recommended: true },
  { key: "sprog", label: "Sprog (i18n / variables)", recommended: true },
  { key: "url", label: "URL (custom URL profiles)", recommended: true },
  { key: "adminer", label: "Adminer (DB management)", recommended: true },
  { key: "bloecks", label: "Bloecks (block editor)", recommended: true },
  { key: "developer", label: "Developer (file-based templates/modules)", recommended: true },
  { key: "focuspoint", label: "Focuspoint (image focal point)", recommended: true },
  { key: "mblock", label: "MBlock (repeatable fields)", recommended: true },
  { key: "mform", label: "MForm (module form builder)", recommended: true },
  { key: "quick_navigation", label: "Quick Navigation", recommended: true },
  { key: "cropper", label: "Cropper (image cropping)", recommended: true },
  { key: "hyphenator", label: "Hyphenator (auto-hyphenation)", recommended: true },
  { key: "emailobfuscator", label: "Email Obfuscator", recommended: true },
  { key: "plyr", label: "Plyr (media player)", recommended: true },
  { key: "structure_tweaks", label: "Structure Tweaks", recommended: true },
  { key: "markitup", label: "MarkItUp (markdown editor)", recommended: true },
  { key: "redactor", label: "Redactor (WYSIWYG editor)", recommended: true },
  { key: "ui_tools", label: "UI Tools", recommended: true, plugins: ["jquery-minicolors", "selectize"] },
  { key: "uploader", label: "Uploader (media upload)", recommended: true },
  { key: "useragent", label: "Useragent (device detection)", recommended: true },
  { key: "yform_adminer", label: "YForm Adminer", recommended: true },
  { key: "yform_quick_edit", label: "YForm Quick Edit", recommended: true },
  { key: "yform_spam_protection", label: "YForm Spam Protection", recommended: true },
  { key: "yform_usability", label: "YForm Usability", recommended: true },
  { key: "media_negotiator", label: "Media Negotiator (WebP/AVIF)", recommended: true },
  { key: "statistics", label: "Statistics", recommended: true },
  { key: "ydeploy", label: "YDeploy (deployment)", recommended: true },
  { key: "structure", label: "Structure (history plugin)", recommended: true, plugins: ["history"] },
  { key: "phpmailer", label: "PHPMailer", recommended: true },
  { key: "be_password", label: "BE Password (password policy)", recommended: true },
  { key: "block_peek", label: "Block Peek (slice preview)", recommended: true }
];

// prompts.ts
async function collectConfig(projectNameArg, options) {
  p.intro("Let's set up your ViteRex project");
  const project = await p.group(
    {
      projectName: () => p.text({
        message: "Project name",
        initialValue: projectNameArg ?? "my-viterex-project",
        validate: (v) => {
          if (!/^[a-z0-9_-]+$/i.test(v)) return "Only alphanumeric, hyphens, underscores";
        }
      }),
      serverName: () => p.text({
        message: "Local server name (vhost URL)",
        placeholder: "my-project.test"
      }),
      packageManager: () => p.select({
        message: "Package manager",
        initialValue: options.pm ?? "yarn",
        options: [
          { value: "yarn", label: "Yarn" },
          { value: "npm", label: "npm" },
          { value: "pnpm", label: "pnpm" }
        ]
      })
    },
    { onCancel: () => process.exit(0) }
  );
  const redaxo = await p.group(
    {
      version: () => p.text({
        message: "Redaxo version",
        initialValue: "5.17.1"
      }),
      adminUser: () => p.text({
        message: "Admin username",
        initialValue: "admin"
      }),
      adminPassword: () => p.password({
        message: "Admin password"
      }),
      adminEmail: () => p.text({
        message: "Admin email",
        validate: (v) => {
          if (!v.includes("@")) return "Enter a valid email";
        }
      }),
      errorEmail: () => p.text({
        message: "Error notification email",
        validate: (v) => {
          if (!v.includes("@")) return "Enter a valid email";
        }
      })
    },
    { onCancel: () => process.exit(0) }
  );
  let db = {
    skipDb: false,
    host: "127.0.0.1",
    port: 3306,
    name: "",
    user: "root",
    password: ""
  };
  if (!options.skipDb) {
    const dbAnswers = await p.group(
      {
        host: () => p.text({ message: "DB host", initialValue: "127.0.0.1" }),
        port: () => p.text({ message: "DB port", initialValue: "3306" }),
        name: () => p.text({
          message: "DB name",
          initialValue: project.projectName.replace(/-/g, "_")
        }),
        user: () => p.text({ message: "DB user", initialValue: "root" }),
        password: () => p.password({ message: "DB password" })
      },
      { onCancel: () => process.exit(0) }
    );
    db = { ...db, ...dbAnswers, port: parseInt(dbAnswers.port) };
  } else {
    db.skipDb = true;
  }
  let addons = [];
  if (!options.skipAddons) {
    const selected = await p.multiselect({
      message: "Select addons to install",
      options: ADDON_CATALOG.map((a) => ({
        value: a.key,
        label: a.label,
        hint: a.recommended ? "recommended" : void 0
      })),
      initialValues: ADDON_CATALOG.filter((a) => a.recommended).map((a) => a.key)
    });
    if (p.isCancel(selected)) process.exit(0);
    addons = selected.map((key) => {
      const catalogEntry = ADDON_CATALOG.find((a) => a.key === key);
      return {
        key,
        install: true,
        activate: true,
        plugins: catalogEntry?.plugins
      };
    });
  }
  const frontend = await p.group(
    {
      useTailwind: () => p.confirm({ message: "Include Tailwind CSS?", initialValue: true }),
      useFluidTw: ({ results }) => results.useTailwind ? p.confirm({ message: "Include Fluid TW?", initialValue: true }) : Promise.resolve(false),
      setupDeploy: () => p.confirm({ message: "Set up ydeploy?", initialValue: false })
    },
    { onCancel: () => process.exit(0) }
  );
  p.outro("Config collected \u2014 starting installation...");
  return {
    projectName: project.projectName,
    projectDir: path.resolve(process.cwd(), project.projectName),
    redaxoVersion: redaxo.version,
    redaxoAdminUser: redaxo.adminUser,
    redaxoAdminPassword: redaxo.adminPassword,
    redaxoAdminEmail: redaxo.adminEmail,
    redaxoErrorEmail: redaxo.errorEmail,
    redaxoServerName: project.serverName,
    skipDb: db.skipDb,
    dbHost: db.host,
    dbPort: db.port,
    dbName: db.name,
    dbUser: db.user,
    dbPassword: db.password,
    skipAddons: !!options.skipAddons,
    addons,
    packageManager: project.packageManager,
    useTailwind: frontend.useTailwind,
    useFluidTw: frontend.useFluidTw,
    setupDeploy: frontend.setupDeploy,
    skipGit: !!options.skipGit,
    verbose: false
  };
}

// pipeline.ts
import * as p3 from "@clack/prompts";

// state.ts
import path2 from "path";
import fs from "fs-extra";
import * as p2 from "@clack/prompts";
var STATE_FILE = ".viterex-state.json";
function resolveStatePath(projectDir) {
  return path2.join(projectDir, STATE_FILE);
}
async function loadState(projectNameArg, options) {
  const projectName = projectNameArg;
  if (!projectName) {
    throw new Error(
      "--resume requires a project name argument so we can find .viterex-state.json"
    );
  }
  const projectDir = path2.resolve(process.cwd(), projectName);
  const statePath = resolveStatePath(projectDir);
  if (!await fs.pathExists(statePath)) {
    throw new Error(
      `No state file found at ${statePath}. Cannot resume \u2014 run without --resume to start fresh.`
    );
  }
  const data = await fs.readJSON(statePath);
  if (options.skipDb) data.config.skipDb = true;
  if (options.skipAddons) data.config.skipAddons = true;
  if (options.skipGit) data.config.skipGit = true;
  p2.log.info(
    `Resuming from state file \u2014 ${data.completedTasks.length} task(s) already completed`
  );
  return data;
}
async function saveState(config, completedTasks) {
  const statePath = resolveStatePath(config.projectDir);
  await fs.ensureDir(path2.dirname(statePath));
  const data = { config, completedTasks };
  await fs.writeJSON(statePath, data, { spaces: 2 });
}
async function clearState(projectDir) {
  const statePath = resolveStatePath(projectDir);
  await fs.remove(statePath);
}

// tasks/download-redaxo.ts
import path3 from "path";
import fs2 from "fs-extra";

// utils/exec.ts
import { execa } from "execa";
function exec(file, args, options = {}) {
  const { verbose, ...execaOptions } = options;
  return execa(file, args, {
    ...execaOptions,
    stdio: verbose ? "inherit" : "pipe"
  });
}

// tasks/download-redaxo.ts
async function downloadRedaxo(config) {
  const { projectDir, redaxoVersion, verbose } = config;
  const tmpDir = path3.join(projectDir, "tmp");
  const zipFile = path3.join(tmpDir, `redaxo_${redaxoVersion}.zip`);
  const publicDir = path3.join(projectDir, "public");
  const url = `https://github.com/redaxo/redaxo/releases/download/${redaxoVersion}/redaxo_${redaxoVersion}.zip`;
  await fs2.ensureDir(tmpDir);
  await exec("curl", ["-Ls", "-o", zipFile, url], { verbose });
  await exec("unzip", ["-oq", zipFile, "-d", publicDir], { verbose });
  const binDir = path3.join(projectDir, "bin");
  const srcDir = path3.join(projectDir, "src");
  const varDir = path3.join(projectDir, "var");
  await fs2.ensureDir(binDir);
  await fs2.ensureDir(srcDir);
  await fs2.ensureDir(varDir);
  await fs2.move(path3.join(publicDir, "redaxo/bin"), binDir, { overwrite: true });
  await fs2.move(path3.join(publicDir, "redaxo/cache"), path3.join(varDir, "cache"), { overwrite: true });
  await fs2.move(path3.join(publicDir, "redaxo/data"), path3.join(varDir, "data"), { overwrite: true });
  await fs2.move(path3.join(publicDir, "redaxo/src/addons"), path3.join(srcDir, "addons"), { overwrite: true });
  await fs2.move(path3.join(publicDir, "redaxo/src/core"), path3.join(srcDir, "core"), { overwrite: true });
  const license = path3.join(publicDir, "LICENSE.md");
  if (await fs2.pathExists(license)) {
    await fs2.move(license, path3.join(projectDir, "LICENSE.md"), { overwrite: true });
  }
  await fs2.remove(path3.join(publicDir, "README.md"));
  await fs2.remove(path3.join(publicDir, ".htaccess"));
  await fs2.remove(path3.join(publicDir, "redaxo/bin"));
  await fs2.remove(path3.join(publicDir, "redaxo/src"));
  await fs2.remove(path3.join(publicDir, ".gitignore.example"));
  await fs2.remove(tmpDir);
}

// tasks/setup-database.ts
async function setupDatabase(config) {
  const { dbHost, dbUser, dbPassword, dbName, verbose } = config;
  const authArgs = [
    "-h",
    dbHost,
    "-u",
    dbUser,
    ...dbPassword ? [`--password=${dbPassword}`] : []
  ];
  await exec("mysql", [
    ...authArgs,
    "-e",
    `DROP DATABASE IF EXISTS \`${dbName}\`; CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  ], { verbose });
}

// tasks/install-redaxo.ts
async function installRedaxo(config) {
  const {
    projectDir,
    redaxoServerName,
    redaxoAdminUser,
    redaxoAdminPassword,
    redaxoErrorEmail,
    dbHost,
    dbUser,
    dbPassword,
    dbName,
    verbose
  } = config;
  const serverUrl = `http://${redaxoServerName}/`;
  await exec(
    "php",
    [
      "bin/console",
      "setup:run",
      "--lang",
      "de_de",
      "--agree-license",
      "--server",
      serverUrl,
      "--servername",
      config.projectName,
      "--error-email",
      redaxoErrorEmail,
      "--timezone",
      "Europe/Berlin",
      "--db-host",
      dbHost,
      "--db-login",
      dbUser,
      "--db-password",
      dbPassword,
      "--db-name",
      dbName,
      "--db-setup",
      "normal",
      "--db-createdb",
      "yes",
      "--db-charset",
      "utf8mb4",
      "--admin-username",
      redaxoAdminUser,
      "--admin-password",
      redaxoAdminPassword,
      "--quiet"
    ],
    { cwd: projectDir, verbose }
  );
}

// tasks/install-addons.ts
import path4 from "path";
import fs3 from "fs-extra";
async function installAddons(config) {
  const { projectDir, addons, dbHost, dbUser, dbPassword, dbName, verbose } = config;
  for (const addon of addons) {
    const isPlugin = addon.key.includes("/");
    if (!isPlugin && addon.install) {
      const addonDir = path4.join(projectDir, "src", "addons", addon.key);
      if (!await fs3.pathExists(addonDir)) {
        await exec(
          "php",
          ["bin/console", "install:download", addon.key, "--no-interaction", "--quiet"],
          { cwd: projectDir, verbose }
        );
      }
    }
    if (addon.install) {
      await exec(
        "php",
        ["bin/console", "package:install", addon.key, "--no-interaction", "--quiet"],
        { cwd: projectDir, verbose }
      );
    }
    if (addon.activate) {
      await exec(
        "php",
        ["bin/console", "package:activate", addon.key, "--no-interaction", "--quiet"],
        { cwd: projectDir, verbose }
      );
    }
    if (addon.plugins) {
      for (const plugin of addon.plugins) {
        const pluginKey = `${addon.key}/${plugin}`;
        await exec(
          "php",
          ["bin/console", "package:install", pluginKey, "--no-interaction", "--quiet"],
          { cwd: projectDir, verbose }
        );
        await exec(
          "php",
          ["bin/console", "package:activate", pluginKey, "--no-interaction", "--quiet"],
          { cwd: projectDir, verbose }
        );
      }
    }
  }
  await exec("php", ["bin/console", "cache:clear", "--quiet"], { cwd: projectDir, verbose });
  await fs3.remove(path4.join(projectDir, "public", "assets", "addon", "markitup", "cache"));
  await exec("php", ["bin/console", "be_style:compile", "--quiet"], { cwd: projectDir, verbose });
  const sqlFile = path4.join(projectDir, "var", "data", "redaxo_massif_install.sql");
  if (await fs3.pathExists(sqlFile)) {
    const authArgs = [
      "-h",
      dbHost,
      "-u",
      dbUser,
      ...dbPassword ? [`--password=${dbPassword}`] : [],
      `--database=${dbName}`
    ];
    await exec("mysql", [...authArgs], {
      cwd: projectDir,
      inputFile: sqlFile,
      verbose
    });
  }
}

// tasks/scaffold-frontend.ts
import path5 from "path";
import { fileURLToPath } from "url";
import fs4 from "fs-extra";
var __dirname = path5.dirname(fileURLToPath(import.meta.url));
var templatesDir = path5.resolve(__dirname, "../../templates");
function replacePlaceholders(content, replacements) {
  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return key in replacements ? replacements[key] : match;
  });
}
async function processTemplate(tplPath, destPath, replacements) {
  if (!await fs4.pathExists(tplPath)) return;
  const content = await fs4.readFile(tplPath, "utf-8");
  await fs4.writeFile(destPath, replacePlaceholders(content, replacements));
}
async function copyTemplate(srcPath, destPath) {
  if (!await fs4.pathExists(srcPath)) return;
  await fs4.copy(srcPath, destPath, { overwrite: false });
}
async function scaffoldFrontend(config) {
  const {
    projectDir,
    projectName,
    redaxoServerName,
    redaxoAdminUser,
    redaxoAdminEmail,
    redaxoErrorEmail,
    useTailwind,
    useFluidTw,
    setupDeploy
  } = config;
  const replacements = {
    PROJECT_NAME: projectName,
    SERVER_NAME: redaxoServerName,
    ADMIN_USER: redaxoAdminUser,
    ADMIN_EMAIL: redaxoAdminEmail,
    ERROR_EMAIL: redaxoErrorEmail,
    HOST_PROTOCOL: "http"
  };
  const baseDir = path5.join(templatesDir, "base");
  if (await fs4.pathExists(baseDir)) {
    await fs4.copy(baseDir, projectDir, { overwrite: false });
  }
  await processTemplate(
    path5.join(templatesDir, "env.tpl"),
    path5.join(projectDir, ".env"),
    replacements
  );
  await processTemplate(
    path5.join(templatesDir, "env.tpl"),
    path5.join(projectDir, ".env.local"),
    replacements
  );
  await processTemplate(
    path5.join(templatesDir, "package.json.tpl"),
    path5.join(projectDir, "package.json"),
    replacements
  );
  if (useTailwind) {
    const pkgPath = path5.join(projectDir, "package.json");
    const pkg = await fs4.readJSON(pkgPath);
    pkg.devDependencies["tailwindcss"] = "3.4.17";
    pkg.devDependencies["prettier-plugin-tailwindcss"] = "^0.6.11";
    if (useFluidTw) {
      pkg.devDependencies["fluid-tailwind"] = "^1.0.4";
    }
    await fs4.writeJSON(pkgPath, pkg, { spaces: 2 });
  }
  await processTemplate(
    path5.join(templatesDir, "vite.config.js.tpl"),
    path5.join(projectDir, "vite.config.js"),
    replacements
  );
  await processTemplate(
    path5.join(templatesDir, "composer.json.tpl"),
    path5.join(projectDir, "composer.json"),
    replacements
  );
  if (useTailwind) {
    await processTemplate(
      path5.join(templatesDir, "tailwind.config.js.tpl"),
      path5.join(projectDir, "tailwind.config.js"),
      replacements
    );
    await copyTemplate(
      path5.join(templatesDir, "base", "postcss.config.js"),
      path5.join(projectDir, "postcss.config.js")
    );
  } else {
    await copyTemplate(
      path5.join(templatesDir, "postcss.config.no-tailwind.js"),
      path5.join(projectDir, "postcss.config.js")
    );
  }
  const redaxoDir = path5.join(templatesDir, "redaxo");
  await copyTemplate(
    path5.join(redaxoDir, "console"),
    path5.join(projectDir, "bin", "console")
  );
  await copyTemplate(
    path5.join(redaxoDir, "index.frontend.php"),
    path5.join(projectDir, "public", "index.php")
  );
  await fs4.ensureDir(path5.join(projectDir, "public", "redaxo"));
  await copyTemplate(
    path5.join(redaxoDir, "index.backend.php"),
    path5.join(projectDir, "public", "redaxo", "index.php")
  );
  await copyTemplate(
    path5.join(redaxoDir, "path_provider.php"),
    path5.join(projectDir, "src", "path_provider.php")
  );
  await copyTemplate(
    path5.join(redaxoDir, "htaccess"),
    path5.join(projectDir, "public", ".htaccess")
  );
  await fs4.ensureDir(path5.join(projectDir, "var", "data", "addons", "install"));
  await copyTemplate(
    path5.join(redaxoDir, "redaxo_install_config.json"),
    path5.join(projectDir, "var", "data", "addons", "install", "config.json")
  );
  await fs4.ensureDir(path5.join(projectDir, "var", "data", "addons", "ydeploy"));
  await processTemplate(
    path5.join(redaxoDir, "redaxo_massif_install.sql.tpl"),
    path5.join(projectDir, "var", "data", "redaxo_massif_install.sql"),
    replacements
  );
  await fs4.ensureDir(path5.join(projectDir, "src", "addons", "project", "fragments"));
  if (setupDeploy) {
    const deployDir = path5.join(templatesDir, "deploy");
    await processTemplate(
      path5.join(deployDir, "deploy.php.tpl"),
      path5.join(projectDir, "deploy.php"),
      replacements
    );
    await copyTemplate(
      path5.join(deployDir, "deployer.task.setup.php"),
      path5.join(projectDir, "deployer.task.setup.php")
    );
    await copyTemplate(
      path5.join(deployDir, "deployer.task.release.metanet.php"),
      path5.join(projectDir, "deployer.task.release.metanet.php")
    );
  }
  const scriptsDir = path5.join(templatesDir, "scripts");
  const scripts = ["quickstart", "sync-config", "sync-db", "sync-media"];
  for (const script of scripts) {
    const dest = path5.join(projectDir, script);
    await copyTemplate(path5.join(scriptsDir, script), dest);
    if (await fs4.pathExists(dest)) {
      await fs4.chmod(dest, 493);
    }
  }
}

// tasks/install-deps.ts
async function installDependencies(config) {
  const { projectDir, packageManager, verbose } = config;
  await exec("composer", ["install", "--no-interaction", "--quiet"], {
    cwd: projectDir,
    verbose
  });
  await exec(packageManager, ["install"], {
    cwd: projectDir,
    verbose
  });
}

// tasks/init-git.ts
async function initGit(config) {
  const { projectDir, verbose } = config;
  await exec("git", ["init"], { cwd: projectDir, verbose });
  await exec("git", ["add", "."], { cwd: projectDir, verbose });
  await exec("git", ["commit", "-m", "initial commit"], { cwd: projectDir, verbose });
}

// pipeline.ts
var tasks = [
  {
    name: "Download Redaxo",
    run: downloadRedaxo
  },
  {
    name: "Create database",
    skip: (c) => c.skipDb,
    run: setupDatabase
  },
  {
    name: "Install Redaxo",
    run: installRedaxo
  },
  {
    name: "Install addons",
    skip: (c) => c.skipAddons || c.addons.length === 0,
    run: installAddons
  },
  {
    name: "Scaffold frontend (Vite, Tailwind, configs)",
    run: scaffoldFrontend
  },
  {
    name: "Install dependencies (composer + packages)",
    run: installDependencies
  },
  {
    name: "Initialize git",
    skip: (c) => c.skipGit,
    run: initGit
  }
];
async function runPipeline(config, options = {}) {
  const { completedTasks = [], dryRun = false } = options;
  const total = tasks.length;
  const done = new Set(completedTasks);
  if (dryRun) {
    p3.log.info("Dry run \u2014 no tasks will be executed\n");
  }
  for (let i = 0; i < total; i++) {
    const task = tasks[i];
    const label = `[${i + 1}/${total}] ${task.name}`;
    if (done.has(task.name)) {
      p3.log.info(`Already done: ${task.name}`);
      continue;
    }
    if (task.skip?.(config)) {
      p3.log.info(`${dryRun ? "Would skip" : "Skipping"}: ${task.name}`);
      continue;
    }
    if (dryRun) {
      p3.log.step(`Would run: ${task.name}`);
      continue;
    }
    const s = p3.spinner();
    s.start(label);
    try {
      await task.run(config);
      s.stop(`${label} \u2713`);
      done.add(task.name);
      await saveState(config, [...done]);
    } catch (err) {
      s.stop(`${label} \u2717`);
      throw new Error(`Task "${task.name}" failed: ${err.message}`);
    }
  }
}

// utils/log.ts
import chalk from "chalk";
function printBanner() {
  console.log(
    chalk.red(`
- - - - - - - - - - - -
  ViteRex Setup
- - - - - - - - - - - -
`)
  );
}
function printSuccess(projectName) {
  console.log(
    chalk.green(`
\u2713 Project "${projectName}" created successfully!
`)
  );
}
function printError(err) {
  console.error(chalk.red(`
\u2717 ${err.message}
`));
}

// index.ts
var program = new Command();
program.name("create-viterex").description("Scaffold a ViteRex (Redaxo + Vite) project").version("1.0.0").argument("[project-name]", "Name of the project directory").option("--skip-db", "Skip database creation").option("--skip-addons", "Skip addon installation").option("--skip-git", "Don't initialize a git repo").option("--pm <manager>", "Package manager: yarn | npm | pnpm", "yarn").option("--config <path>", "Path to a viterex config file (skip prompts)").option("--resume", "Resume a previously failed run, skipping completed tasks").option("--dry-run", "Log each task without executing").option("--verbose", "Pipe task stdout/stderr to the terminal").action(async (projectName, options) => {
  printBanner();
  try {
    let config;
    let completedTasks = [];
    if (options.resume) {
      const state = await loadState(projectName, options);
      config = state.config;
      completedTasks = state.completedTasks;
    } else {
      config = options.config ? await loadConfigFile(options.config) : await collectConfig(projectName, options);
      await clearState(config.projectDir);
    }
    config.verbose = !!options.verbose;
    await runPipeline(config, { completedTasks, dryRun: !!options.dryRun });
    await clearState(config.projectDir);
    printSuccess(config.projectName);
  } catch (err) {
    printError(err);
    process.exit(1);
  }
});
program.parse();
async function loadConfigFile(configPath) {
  const fsExtra = await import("fs-extra");
  return fsExtra.default.readJSON(configPath);
}
