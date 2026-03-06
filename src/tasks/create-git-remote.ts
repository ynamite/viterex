import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

export async function createGitRemote(config: ViterexConfig): Promise<void> {
  const { projectDir, gitProvider, gitNamespace, gitRepoName, verbose } = config;

  const sshUrl = `git@${gitProvider}:${gitNamespace}/${gitRepoName}.git`;

  if (gitProvider === "github.com") {
    // Create private repo — ignore error if it already exists
    try {
      await exec(
        "gh",
        ["repo", "create", `${gitNamespace}/${gitRepoName}`, "--private", "--description", ""],
        { cwd: projectDir, verbose }
      );
    } catch {
      // Repo likely already exists — continue
    }
  } else if (gitProvider === "gitlab.com") {
    try {
      await exec(
        "glab",
        ["repo", "create", `${gitNamespace}/${gitRepoName}`, "--private"],
        { cwd: projectDir, verbose }
      );
    } catch {
      // Repo likely already exists — continue
    }
  }

  // Add remote if not already set
  try {
    await exec("git", ["remote", "add", "origin", sshUrl], { cwd: projectDir, verbose });
  } catch {
    // Remote "origin" may already exist (e.g. on resume)
  }

  try {
    await exec("git", ["push", "--set-upstream", sshUrl, "main"], { cwd: projectDir, verbose });
  } catch {
    // Remote has existing commits — pull with rebase then push
    await exec("git", ["pull", "--rebase", sshUrl, "main"], { cwd: projectDir, verbose });
    await exec("git", ["push", "--set-upstream", sshUrl, "main"], { cwd: projectDir, verbose });
  }
}
