import path from "node:path";
import fs from "fs-extra";
import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

export async function importSql(config: ViterexConfig): Promise<void> {
  const { projectDir, dbHost, dbPort, dbUser, dbPassword, dbName, verbose } = config;

  const sqlFile = path.join(projectDir, "var", "data", "seed.sql");
  if (!(await fs.pathExists(sqlFile))) return;

  const sqlContent = await fs.readFile(sqlFile, "utf-8");
  const authArgs = [
    "-h", dbHost,
    "--port", String(dbPort),
    "-u", dbUser,
    ...(dbPassword ? [`--password=${dbPassword}`] : []),
    `--database=${dbName}`,
  ];

  await exec("mysql", [...authArgs], {
    cwd: projectDir,
    input: sqlContent,
    verbose,
  });

  await fs.remove(sqlFile);
}
