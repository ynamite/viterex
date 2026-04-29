import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

export async function createGitRemote(config: ViterexConfig): Promise<void> {
  const { projectDir, gitProvider, gitNamespace, gitRepoName, forcePush, verbose } = config;

  const sshUrl = `git@${gitProvider}:${gitNamespace}/${gitRepoName}.git`;

  if (gitProvider === "github.com") {
    try {
      await exec(
        "gh",
        ["repo", "create", `${gitNamespace}/${gitRepoName}`, "--private", "--description", ""],
        { cwd: projectDir, verbose },
      );
    } catch {
      // Repo may already exist — continue
    }
  } else if (gitProvider === "gitlab.com") {
    try {
      await exec("glab", ["repo", "create", `${gitNamespace}/${gitRepoName}`, "--private"], {
        cwd: projectDir,
        verbose,
      });
    } catch {
      // Repo may already exist — continue
    }
  }

  try {
    await exec("git", ["remote", "add", "origin", sshUrl], { cwd: projectDir, verbose });
  } catch {
    // Remote "origin" may already exist (e.g. on resume) — continue
  }

  // Push the current branch (don't hard-code "main")
  const { stdout: branchOut } = await exec("git", ["symbolic-ref", "--short", "HEAD"], {
    cwd: projectDir,
  });
  const branch = (branchOut as string).trim() || "main";

  try {
    await exec("git", ["push", "--set-upstream", sshUrl, branch], { cwd: projectDir, verbose });
  } catch (err) {
    if (forcePush) {
      await exec("git", ["push", "--force", "--set-upstream", sshUrl, branch], {
        cwd: projectDir,
        verbose,
      });
    } else {
      throw new Error(
        `Push to ${sshUrl} failed; the remote has commits we don't have locally.\n` +
          `Re-run with --force-push to overwrite, or rebase/pull manually first.`,
      );
    }
  }
}
