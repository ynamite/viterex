import { execa, type Options, type ResultPromise } from "execa";

type ExecOptions = Omit<Options, "verbose"> & { verbose?: boolean };

/**
 * Thin wrapper around execa that sets stdio based on verbose mode.
 * When verbose, stdout/stderr are inherited (piped to terminal).
 * When not verbose, output is suppressed (piped and captured).
 * When input is provided, stdin is always piped regardless of verbose mode.
 *
 * If the caller passes `stdio` explicitly (e.g. `"inherit"` for an
 * interactive subprocess like `yarn upgrade-interactive`), we respect it
 * and skip the per-stream defaults — execa rejects mixing the two.
 */
export function exec(
  file: string,
  args: string[],
  options: ExecOptions = {}
): ResultPromise {
  const { verbose, ...execaOptions } = options;

  if ("stdio" in execaOptions) {
    return execa(file, args, execaOptions as Options);
  }

  const hasInput = "input" in execaOptions;
  return execa(file, args, {
    stdin: hasInput ? "pipe" : (verbose ? "inherit" : "pipe"),
    stdout: verbose ? "inherit" : "pipe",
    stderr: verbose ? "inherit" : "pipe",
    ...execaOptions,
  } as Options);
}

/**
 * Returns true when the given command resolves on $PATH.
 */
export async function commandExists(cmd: string): Promise<boolean> {
  try {
    const which = process.platform === "win32" ? "where" : "which";
    await execa(which, [cmd]);
    return true;
  } catch {
    return false;
  }
}
