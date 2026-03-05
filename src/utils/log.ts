import chalk from "chalk";

export function printBanner(): void {
  console.log(
    chalk.red(`
- - - - - - - - - - - -
  ViteRex Setup
- - - - - - - - - - - -
`)
  );
}

export function printSuccess(projectName: string): void {
  console.log(
    chalk.green(`\n✓ Project "${projectName}" created successfully!\n`)
  );
}

export function printError(err: Error): void {
  console.error(chalk.red(`\n✗ ${err.message}\n`));
}
