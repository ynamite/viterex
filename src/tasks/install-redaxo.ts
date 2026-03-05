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

  // --server expects a full URL, --servername is a human-readable display name
  const serverUrl = `http://${redaxoServerName}/`;

  await exec(
    "php",
    [
      "bin/console",
      "setup:run",
      "--lang", "de_de",
      "--agree-license",
      "--server", serverUrl,
      "--servername", config.projectName,
      "--error-email", redaxoErrorEmail,
      "--timezone", "Europe/Berlin",
      "--db-host", dbHost,
      "--db-login", dbUser,
      "--db-password", dbPassword,
      "--db-name", dbName,
      "--db-setup", "normal",
      "--db-createdb", "yes",
      "--db-charset", "utf8mb4",
      "--admin-username", redaxoAdminUser,
      "--admin-password", redaxoAdminPassword,
      "--quiet",
    ],
    { cwd: projectDir, verbose }
  );
}
