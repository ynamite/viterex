import path from "node:path";
import { exec } from "../utils/exec.js";
import type { ViterexConfig } from "../types.js";

export async function installRedaxo(config: ViterexConfig): Promise<void> {
  const {
    projectDir,
    redaxoServerName,
    redaxoAdminUser,
    redaxoAdminPassword,
    redaxoErrorEmail,
    dbHost,
    dbUser,
    dbPassword,
    dbName,
    verbose,
  } = config;

  // On resume the DB may already exist with partial tables from a previous
  // failed run, which causes setup:run to abort. Back it up and drop it.
  const authArgs = [
    "-h", dbHost,
    "-u", dbUser,
    ...(dbPassword ? [`--password=${dbPassword}`] : []),
  ];

  // Check if the database already exists
  const { stdout: dbExists } = await exec("mysql", [
    ...authArgs,
    "--skip-column-names",
    "-e", `SHOW DATABASES LIKE '${dbName}';`,
  ], { verbose });

  if (dbExists.trim() === dbName) {
    const backupFile = path.join(projectDir, `backup_${dbName}_${Date.now()}.sql`);
    await exec("mysqldump", [
      ...authArgs,
      "--databases", dbName,
      `--result-file=${backupFile}`,
    ], { verbose });

    await exec("mysql", [
      ...authArgs,
      "-e", `DROP DATABASE \`${dbName}\`;`,
    ], { verbose });
  }

  // --server expects a full URL, --servername is a human-readable display name
  const serverUrl = `http://${redaxoServerName}/`;

  await exec(
    "php",
    [
      "bin/console",
      "setup:run",
      "--lang=de_de",
      "--agree-license",
      "--server=" + serverUrl,
      "--servername=" + config.projectName,
      "--error-email=" + redaxoErrorEmail,
      "--timezone=Europe/Berlin",
      "--db-host=" + dbHost,
      "--db-login=" + dbUser,
      "--db-password=" + dbPassword,
      "--db-name=" + dbName,
      "--db-setup=normal",
      "--db-createdb=yes",
      "--db-charset=utf8mb4",
      "--admin-username=" + redaxoAdminUser,
      "--admin-password=" + redaxoAdminPassword,
      "--no-interaction",
      "--quiet",
    ],
    { cwd: projectDir, verbose }
  );
}
