import { execa, type Options, type ResultPromise } from "execa";

type ExecOptions = Omit<Options, "verbose"> & { verbose?: boolean };

/**
 * Thin wrapper around execa that sets stdio based on verbose mode.
 * When verbose, stdout/stderr are inherited (piped to terminal).
 * When not verbose, output is suppressed (piped and captured).
 */
export function exec(
  file: string,
  args: string[],
  options: ExecOptions = {}
): ResultPromise {
  const { verbose, ...execaOptions } = options;
  return execa(file, args, {
    stdio: verbose ? "inherit" : "pipe",
    ...execaOptions,
  } as Options);
}
