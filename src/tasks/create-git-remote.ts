import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

export async function createGitRemote(config: ViterexConfig): Promise<void> {
  const { projectDir, gitProvider, gitNamespace, gitRepoName, verbose } = config;

  const sshUrl = `git@${gitProvider}:${gitNamespace}/${gitRepoName}.git`;

  if (gitProvider === "github.com") {
    // Create private repo via GitHub CLI
    await exec(
      "gh",
      ["repo", "create", `${gitNamespace}/${gitRepoName}`, "--private", "--description", ""],
      { cwd: projectDir, verbose }
    );
  } else if (gitProvider === "gitlab.com") {
    // Create private repo via GitLab CLI
    await exec(
      "glab",
      ["repo", "create", `${gitNamespace}/${gitRepoName}`, "--private"],
      { cwd: projectDir, verbose }
    );
  }

  await exec("git", ["remote", "add", "origin", sshUrl], { cwd: projectDir, verbose });
  await exec("git", ["push", "--set-upstream", sshUrl, "main"], { cwd: projectDir, verbose });
}
