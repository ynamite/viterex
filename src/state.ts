import path from "node:path";
import fs from "fs-extra";
import * as p from "@clack/prompts";
import type { ViterexConfig } from "./types.js";
import { loadPreset, resolveSeedFile } from "./preset.js";

const STATE_FILE = ".viterex-state.json";

/**
 * Fields on `ViterexConfig` that are resolved at runtime from inside the
 * installer package (or an external preset path) and therefore must NOT
 * be persisted — when published as `npx create-viterex`, the package's
 * on-disk location varies between invocations (npx cache hash), and an
 * absolute path baked into the state file would point to a stale or
 * garbage-collected location on resume.
 *
 * These fields are stripped on save and re-derived on load by re-running
 * `loadPreset(config.preset)`.
 */
const PACKAGE_RESOLVED_FIELDS = [
  "presetDir",
  "presetFilesDir",
  "seedFile",
  "installerConfig",
  "deployerExtras",
] as const;

interface StateData {
  config: ViterexConfig;
  completedTasks: string[];
}

function resolveStatePath(projectDir: string): string {
  return path.join(projectDir, STATE_FILE);
}

/**
 * Load state for --resume. Resolves the project directory from either the
 * positional project-name argument or `--config <path>` (the config file's
 * own `projectDir` field).
 */
export async function loadState(
  projectNameArg: string | undefined,
  options: Record<string, unknown>
): Promise<StateData> {
  if (projectNameArg) {
    return loadStateFromDir(path.resolve(process.cwd(), projectNameArg), options);
  }

  if (options.config) {
    const cfg = (await fs.readJSON(options.config as string)) as { projectDir?: string };
    if (!cfg.projectDir) {
      throw new Error(
        `--resume --config requires the config file to have a "projectDir" field.`,
      );
    }
    return loadStateFromDir(cfg.projectDir, options);
  }

  throw new Error(
    "--resume requires either a project name argument or --config <path> with a projectDir field.",
  );
}

async function loadStateFromDir(
  projectDir: string,
  options: Record<string, unknown>,
): Promise<StateData> {
  const statePath = resolveStatePath(projectDir);

  if (!(await fs.pathExists(statePath))) {
    throw new Error(
      `No state file found at ${statePath}. Cannot resume — run without --resume to start fresh.`,
    );
  }

  const raw: Record<string, unknown> = await fs.readJSON(statePath);
  const rawConfig = raw.config as Record<string, unknown>;

  // Migrate old massifSettings → templateReplacements
  if (rawConfig.massifSettings && !rawConfig.templateReplacements) {
    const ms = rawConfig.massifSettings as Record<string, string>;
    rawConfig.templateReplacements = Object.fromEntries(
      Object.entries(ms).map(([k, v]) => {
        const snake = k.replace(/([A-Z])/g, "_$1").toUpperCase();
        return [`MASSIF_${snake}`, v];
      }),
    );
    delete rawConfig.massifSettings;
  }

  // Backfill defaults for fields added in newer installer versions
  if (!rawConfig.templateReplacements) rawConfig.templateReplacements = {};
  if (!rawConfig.preset) rawConfig.preset = "custom";
  if (!rawConfig.layout) rawConfig.layout = "modern";
  if (!rawConfig.installMode) rawConfig.installMode = "fresh";
  if (!rawConfig.redaxoLang) rawConfig.redaxoLang = "de_de";
  if (!rawConfig.redaxoTimezone) rawConfig.redaxoTimezone = "Europe/Berlin";

  const data = raw as unknown as StateData;

  // Re-derive package-resolved paths against the *current* installer location.
  // The persisted state intentionally omits these (see PACKAGE_RESOLVED_FIELDS)
  // because the npx cache hash, and therefore the on-disk path of the installed
  // package, can differ between the run that wrote the state and the resume run.
  await rederivePackageResolvedPaths(data.config);

  if (options.skipDb) data.config.skipDb = true;
  if (options.skipAddons) data.config.skipAddons = true;
  if (options.skipGit) data.config.skipGit = true;

  p.log.info(
    `Resuming from state file — ${data.completedTasks.length} task(s) already completed`,
  );

  return data;
}

async function rederivePackageResolvedPaths(config: ViterexConfig): Promise<void> {
  if (!config.preset || config.preset === "custom") return;

  let loaded: Awaited<ReturnType<typeof loadPreset>>;
  try {
    loaded = await loadPreset(config.preset);
  } catch (err) {
    p.log.warn(
      `Could not re-resolve preset "${config.preset}" on resume: ${(err as Error).message}. ` +
        `Tasks that depend on preset files (apply-preset-files, seed-database, deployer extras) will be skipped.`,
    );
    return;
  }
  if (!loaded) return;

  config.presetDir = loaded.dir;

  if (loaded.config.seedFile) {
    config.seedFile = resolveSeedFile(loaded.config.seedFile, loaded.dir);
  }
  if (loaded.config.installerConfig) {
    config.installerConfig = path.resolve(loaded.dir, loaded.config.installerConfig);
  }
  if (loaded.config.deployerExtras?.length) {
    config.deployerExtras = loaded.config.deployerExtras.map((f) =>
      path.resolve(loaded.dir, f),
    );
  }

  const filesDirName = loaded.config.filesDir ?? "files";
  const filesDirPath = path.resolve(loaded.dir, filesDirName);
  if (await fs.pathExists(filesDirPath)) {
    config.presetFilesDir = filesDirPath;
  }
}

/**
 * Save state after a task completes.
 *
 * Package-resolved paths (see `PACKAGE_RESOLVED_FIELDS`) are stripped before
 * writing. They get re-derived on resume from the persisted `preset` field.
 */
export async function saveState(
  config: ViterexConfig,
  completedTasks: string[]
): Promise<void> {
  const statePath = resolveStatePath(config.projectDir);
  await fs.ensureDir(path.dirname(statePath));

  const persisted: Record<string, unknown> = { ...config };
  for (const key of PACKAGE_RESOLVED_FIELDS) {
    delete persisted[key];
  }

  const data = { config: persisted, completedTasks };
  await fs.writeJSON(statePath, data, { spaces: 2 });
}

/**
 * Delete the state file. Called on fresh runs (clear stale state) and after
 * successful completion.
 */
export async function clearState(projectDir: string): Promise<void> {
  const statePath = resolveStatePath(projectDir);
  await fs.remove(statePath);
}
