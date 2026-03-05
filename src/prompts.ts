import * as p from "@clack/prompts";
import path from "node:path";
import { ADDON_CATALOG, type ViterexConfig } from "./types.js";

export async function collectConfig(
  projectNameArg: string | undefined,
  options: Record<string, unknown>
): Promise<ViterexConfig> {
  p.intro("Let's set up your ViteRex project");

  // ─── Project basics ───────────────────────────────────────────────
  const project = await p.group(
    {
      projectName: () =>
        p.text({
          message: "Project name",
          initialValue: projectNameArg ?? "my-viterex-project",
          validate: (v) => {
            if (!/^[a-z0-9_-]+$/i.test(v)) return "Only alphanumeric, hyphens, underscores";
          },
        }),
      serverName: () =>
        p.text({
          message: "Local server name (vhost URL)",
          placeholder: "my-project.test",
        }),
      packageManager: () =>
        p.select({
          message: "Package manager",
          initialValue: (options.pm as string) ?? "yarn",
          options: [
            { value: "yarn", label: "Yarn" },
            { value: "npm", label: "npm" },
            { value: "pnpm", label: "pnpm" },
          ],
        }),
    },
    { onCancel: () => process.exit(0) }
  );

  // ─── Redaxo config ────────────────────────────────────────────────
  const redaxo = await p.group(
    {
      version: () =>
        p.text({
          message: "Redaxo version",
          initialValue: "5.17.1",
        }),
      adminUser: () =>
        p.text({
          message: "Admin username",
          initialValue: "admin",
        }),
      adminPassword: () =>
        p.password({
          message: "Admin password",
        }),
      adminEmail: () =>
        p.text({
          message: "Admin email",
          validate: (v) => {
            if (!v.includes("@")) return "Enter a valid email";
          },
        }),
      errorEmail: () =>
        p.text({
          message: "Error notification email",
          validate: (v) => {
            if (!v.includes("@")) return "Enter a valid email";
          },
        }),
    },
    { onCancel: () => process.exit(0) }
  );

  // ─── Database ─────────────────────────────────────────────────────
  let db = {
    skipDb: false,
    host: "127.0.0.1",
    port: 3306,
    name: "",
    user: "root",
    password: "",
  };

  if (!options.skipDb) {
    const dbAnswers = await p.group(
      {
        host: () =>
          p.text({ message: "DB host", initialValue: "127.0.0.1" }),
        port: () =>
          p.text({ message: "DB port", initialValue: "3306" }),
        name: () =>
          p.text({
            message: "DB name",
            initialValue: project.projectName.replace(/-/g, "_"),
          }),
        user: () =>
          p.text({ message: "DB user", initialValue: "root" }),
        password: () =>
          p.password({ message: "DB password" }),
      },
      { onCancel: () => process.exit(0) }
    );
    db = { ...db, ...dbAnswers, port: parseInt(dbAnswers.port as string) };
  } else {
    db.skipDb = true;
  }

  // ─── Addon selection ──────────────────────────────────────────────
  let addons: ViterexConfig["addons"] = [];

  if (!options.skipAddons) {
    const selected = await p.multiselect({
      message: "Select addons to install",
      options: ADDON_CATALOG.map((a) => ({
        value: a.key,
        label: a.label,
        hint: a.recommended ? "recommended" : undefined,
      })),
      initialValues: ADDON_CATALOG.filter((a) => a.recommended).map((a) => a.key),
    });

    if (p.isCancel(selected)) process.exit(0);

    addons = (selected as string[]).map((key) => {
      const catalogEntry = ADDON_CATALOG.find((a) => a.key === key);
      return {
        key,
        install: true,
        activate: true,
        plugins: catalogEntry?.plugins,
      };
    });
  }

  // ─── Frontend options ─────────────────────────────────────────────
  const frontend = await p.group(
    {
      useTailwind: () =>
        p.confirm({ message: "Include Tailwind CSS?", initialValue: true }),
      useFluidTw: ({ results }) =>
        results.useTailwind
          ? p.confirm({ message: "Include Fluid TW?", initialValue: true })
          : Promise.resolve(false),
      setupDeploy: () =>
        p.confirm({ message: "Set up ydeploy?", initialValue: false }),
    },
    { onCancel: () => process.exit(0) }
  );

  p.outro("Config collected — starting installation...");

  return {
    projectName: project.projectName as string,
    projectDir: path.resolve(process.cwd(), project.projectName as string),
    redaxoVersion: redaxo.version as string,
    redaxoAdminUser: redaxo.adminUser as string,
    redaxoAdminPassword: redaxo.adminPassword as string,
    redaxoAdminEmail: redaxo.adminEmail as string,
    redaxoErrorEmail: redaxo.errorEmail as string,
    redaxoServerName: project.serverName as string,
    skipDb: db.skipDb,
    dbHost: db.host as string,
    dbPort: db.port,
    dbName: db.name as string,
    dbUser: db.user as string,
    dbPassword: db.password as string,
    skipAddons: !!options.skipAddons,
    addons,
    packageManager: project.packageManager as ViterexConfig["packageManager"],
    useTailwind: frontend.useTailwind as boolean,
    useFluidTw: frontend.useFluidTw as boolean,
    setupDeploy: frontend.setupDeploy as boolean,
    skipGit: !!options.skipGit,
    verbose: false,
  };
}
