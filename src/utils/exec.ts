import { execa, type Options, type ResultPromise } from "execa";

type ExecOptions = Omit<Options, "verbose"> & { verbose?: boolean };

/**
 * Thin wrapper around execa that sets stdio based on verbose mode.
 * When verbose, stdout/stderr are inherited (piped to terminal).
 * When not verbose, output is suppressed (piped and captured).
 * When input is provided, stdin is always piped regardless of verbose mode.
 */
export function exec(
  file: string,
  args: string[],
  options: ExecOptions = {}
): ResultPromise {
  const { verbose, ...execaOptions } = options;
  const hasInput = "input" in execaOptions;
  return execa(file, args, {
    stdin: hasInput ? "pipe" : (verbose ? "inherit" : "pipe"),
    stdout: verbose ? "inherit" : "pipe",
    stderr: verbose ? "inherit" : "pipe",
    ...execaOptions,
  } as Options);
}
