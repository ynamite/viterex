import chalk from "chalk";

export function printBanner(): void {
  const top = "┌────────────────────┐";
  const bottom = "└────────────────────┘";
  const label = chalk.magentaBright.bold("ViteRex Setup");
  const side = chalk.magenta("│");
  console.log("");
  console.log(chalk.magenta(top));
  console.log(`${side}   ${label}    ${side}`);
  console.log(chalk.magenta(bottom));
  console.log("");
}

export function printSuccess(projectName: string): void {
  console.log(
    chalk.green(`\n✓ Project "${projectName}" created successfully!\n`)
  );
}

export function printError(err: Error): void {
  console.error(chalk.red(`\n✗ ${err.message}\n`));
}
