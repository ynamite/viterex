import { Command } from "commander";
import { collectConfig } from "./prompts.js";
import { runPipeline } from "./pipeline.js";
import { loadState, clearState } from "./state.js";
import { printBanner, printSuccess, printError } from "./utils/log.js";

const program = new Command();

program
  .name("create-viterex")
  .description("Scaffold a ViteRex (Redaxo + Vite) project")
  .version("1.0.0")
  .argument("[project-name]", "Name of the project directory")
  .option("--skip-db", "Skip database creation")
  .option("--skip-addons", "Skip addon installation")
  .option("--skip-git", "Don't initialize a git repo")
  .option("--pm <manager>", "Package manager: yarn | npm | pnpm", "yarn")
  .option("--config <path>", "Path to a viterex config file (skip prompts)")
  .option("--resume", "Resume a previously failed run, skipping completed tasks")
  .option("--dry-run", "Log each task without executing")
  .option("--verbose", "Pipe task stdout/stderr to the terminal")
  .action(async (projectName, options) => {
    printBanner();

    try {
      let config;
      let completedTasks: string[] = [];

      if (options.resume) {
        // Resume: load config and completed tasks from state file
        const state = await loadState(projectName, options);
        config = state.config;
        completedTasks = state.completedTasks;
      } else {
        // Fresh run: collect config, delete any stale state file
        config = options.config
          ? await loadConfigFile(options.config)
          : await collectConfig(projectName, options);

        await clearState(config.projectDir);
      }

      config.verbose = !!options.verbose;

      await runPipeline(config, { completedTasks, dryRun: !!options.dryRun });

      // Clean up state file on successful completion
      await clearState(config.projectDir);

      printSuccess(config.projectName);
    } catch (err) {
      printError(err as Error);
      process.exit(1);
    }
  });

program.parse();

async function loadConfigFile(configPath: string) {
  const fsExtra = await import("fs-extra");
  return fsExtra.default.readJSON(configPath);
}
