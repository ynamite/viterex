import * as p from "@clack/prompts";
import type { ViterexConfig } from "./types.js";
import { saveState } from "./state.js";
import { downloadRedaxo } from "./tasks/download-redaxo.js";
import { installRedaxo } from "./tasks/install-redaxo.js";
import { installAddons } from "./tasks/install-addons.js";
import { scaffoldFrontend } from "./tasks/scaffold-frontend.js";
import { importSql } from "./tasks/import-sql.js";
import { installDependencies } from "./tasks/install-deps.js";
import { initGitRepo, gitInitialCommit } from "./tasks/init-git.js";
import { installSubmoduleAddons } from "./tasks/install-submodule-addons.js";
import { createGitRemote } from "./tasks/create-git-remote.js";
import { openBrowser } from "./tasks/open-browser.js";
import { startDevServer } from "./tasks/start-dev-server.js";

export interface Task {
  name: string;
  skip?: (config: ViterexConfig) => boolean;
  /** When true, the spinner is stopped before running so the task gets full TTY control. */
  interactive?: boolean;
  run: (config: ViterexConfig) => Promise<void>;
}

/**
 * All installation tasks in order.
 * Each task is idempotent — if it fails, fix the issue and re-run.
 * The `skip` predicate lets tasks be conditionally bypassed.
 */
const tasks: Task[] = [
  {
    name: "Download Redaxo",
    run: downloadRedaxo,
  },
{
    name: "Install Redaxo",
    run: installRedaxo,
  },
  {
    name: "Install addons",
    skip: (c) => c.skipAddons || c.addons.length === 0,
    run: installAddons,
  },
  {
    name: "Scaffold frontend (Vite, configs)",
    run: scaffoldFrontend,
  },
  {
    name: "Seed database",
    skip: (c) => c.skipDb || !c.seedFile,
    run: importSql,
  },
  {
    name: "Install dependencies (composer + packages)",
    interactive: true,
    run: installDependencies,
  },
  {
    name: "Initialize git repo",
    skip: (c) => c.skipGit,
    run: initGitRepo,
  },
  {
    name: "Install addons as submodules",
    skip: (c) => c.skipGit || !c.submoduleAddons?.length,
    run: installSubmoduleAddons,
  },
  {
    name: "Git initial commit",
    skip: (c) => c.skipGit,
    run: gitInitialCommit,
  },
  {
    name: "Create remote git repository",
    skip: (c) => c.skipGit || !c.gitProvider,
    run: createGitRemote,
  },
  {
    name: "Open frontend and backend in browser",
    run: openBrowser,
  },
  {
    name: "Start Vite dev server",
    run: startDevServer,
  },
];

export interface PipelineOptions {
  completedTasks?: string[];
  dryRun?: boolean;
}

export async function runPipeline(
  config: ViterexConfig,
  options: PipelineOptions = {}
): Promise<void> {
  const { completedTasks = [], dryRun = false } = options;
  const total = tasks.length;
  const done = new Set(completedTasks);

  if (dryRun) {
    p.log.info("Dry run — no tasks will be executed\n");
  }

  for (let i = 0; i < total; i++) {
    const task = tasks[i];
    const label = `[${i + 1}/${total}] ${task.name}`;

    if (done.has(task.name)) {
      p.log.info(`Already done: ${task.name}`);
      continue;
    }

    if (task.skip?.(config)) {
      p.log.info(`${dryRun ? "Would skip" : "Skipping"}: ${task.name}`);
      continue;
    }

    if (dryRun) {
      p.log.step(`Would run: ${task.name}`);
      continue;
    }

    if (task.interactive) {
      p.log.step(label);
      try {
        await task.run(config);
        p.log.step(`${label} ✓`);
        done.add(task.name);
        await saveState(config, [...done]);
      } catch (err) {
        const e = err as Record<string, unknown>;
        const stderr = e.stderr ? `\n${e.stderr}` : "";
        const stdout = e.stdout ? `\n${e.stdout}` : "";
        throw new Error(`Task "${task.name}" failed: ${(err as Error).message}${stderr}${stdout}`);
      }
    } else {
      const s = p.spinner();
      s.start(label);
      try {
        await task.run(config);
        s.stop(`${label} ✓`);
        done.add(task.name);
        await saveState(config, [...done]);
      } catch (err) {
        s.stop(`${label} ✗`);
        const e = err as Record<string, unknown>;
        const stderr = e.stderr ? `\n${e.stderr}` : "";
        const stdout = e.stdout ? `\n${e.stdout}` : "";
        throw new Error(`Task "${task.name}" failed: ${(err as Error).message}${stderr}${stdout}`);
      }
    }
  }
}
