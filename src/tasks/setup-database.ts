import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

export async function setupDatabase(config: ViterexConfig): Promise<void> {
  const { dbHost, dbUser, dbPassword, dbName, verbose } = config;

  const authArgs = [
    "-h", dbHost,
    "-u", dbUser,
    ...(dbPassword ? [`--password=${dbPassword}`] : []),
  ];

  // Drop if exists, then create
  await exec("mysql", [
    ...authArgs,
    "-e",
    `DROP DATABASE IF EXISTS \`${dbName}\`; CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
  ], { verbose });
}
