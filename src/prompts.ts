import * as p from "@clack/prompts";
import path from "node:path";
import { ADDON_CATALOG, type ViterexConfig, type MassifSettings } from "./types.js";

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
  let adminEmail: string | symbol = "";
  const redaxo = await p.group(
    {
      version: () =>
        p.text({
          message: "Redaxo version",
          initialValue: "5.20.2",
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
      adminEmail: async () =>
        adminEmail = await p.text({
          message: "Admin email",
          validate: (v) => {
            if (!v.includes("@")) return "Enter a valid email";
          },
        }),
      errorEmail: () =>
        p.text({
          message: "Error notification email",
          initialValue: adminEmail === "" ? "admin" : (adminEmail as string),
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

  // ─── Massif Settings (business contact info) ─────────────────────
  const massif = await p.group(
    {
      firma: () =>
        p.text({ message: "Company name", placeholder: "My Company" }),
      strasse: () =>
        p.text({ message: "Street address", placeholder: "Strasse 1" }),
      plz: () =>
        p.text({ message: "Postal code (PLZ)", placeholder: "5400" }),
      ort: () =>
        p.text({ message: "City", placeholder: "Baden" }),
      kantonCode: () =>
        p.text({ message: "Canton/State code", placeholder: "AG" }),
      land: () =>
        p.text({ message: "Country", initialValue: "Schweiz" }),
      landCode: () =>
        p.text({ message: "Country code", initialValue: "CH" }),
      phone: () =>
        p.text({ message: "Phone number", placeholder: "+41 00 000 00 00" }),
      email: () =>
        p.text({
          message: "Contact email",
          validate: (v) => {
            if (!v.includes("@")) return "Enter a valid email";
          },
        }),
      googleMapsLink: () =>
        p.text({ message: "Google Maps link (optional)", defaultValue: "" }),
      geoLat: () =>
        p.text({ message: "Latitude (optional)", defaultValue: "" }),
      geoLong: () =>
        p.text({ message: "Longitude (optional)", defaultValue: "" }),
    },
    { onCancel: () => process.exit(0) }
  );

  const massifSettings: MassifSettings = {
    firma: (massif.firma as string) ?? "",
    strasse: (massif.strasse as string) ?? "",
    plz: (massif.plz as string) ?? "",
    ort: (massif.ort as string) ?? "",
    kantonCode: (massif.kantonCode as string) ?? "",
    land: (massif.land as string) ?? "",
    landCode: (massif.landCode as string) ?? "",
    phone: (massif.phone as string) ?? "",
    email: (massif.email as string) ?? "",
    googleMapsLink: (massif.googleMapsLink as string) ?? "",
    geoLat: (massif.geoLat as string) ?? "",
    geoLong: (massif.geoLong as string) ?? "",
  };

  // ─── Frontend options ─────────────────────────────────────────────
  const frontend = await p.group(
    {
      setupDeploy: () =>
        p.confirm({ message: "Set up ydeploy?", initialValue: false }),
    },
    { onCancel: () => process.exit(0) }
  );

  // ─── Git remote ─────────────────────────────────────────────────
  let gitProvider = "";
  let gitNamespace = "";
  let gitRepoName = "";

  if (!options.skipGit) {
    const setupRemote = await p.confirm({
      message: "Create a remote git repository?",
      initialValue: false,
    });

    if (p.isCancel(setupRemote)) process.exit(0);

    if (setupRemote) {
      const gitRemote = await p.group(
        {
          provider: () =>
            p.select({
              message: "Git provider",
              initialValue: "github.com",
              options: [
                { value: "github.com", label: "GitHub" },
                { value: "gitlab.com", label: "GitLab" },
              ],
            }),
          namespace: () =>
            p.text({ message: "Organization / username" }),
          repoName: ({ results }) =>
            p.text({
              message: "Repository name",
              initialValue: project.projectName as string,
            }),
        },
        { onCancel: () => process.exit(0) }
      );
      gitProvider = gitRemote.provider as string;
      gitNamespace = gitRemote.namespace as string;
      gitRepoName = gitRemote.repoName as string;
    }
  }

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
    massifSettings,
    setupDeploy: frontend.setupDeploy as boolean,
    skipGit: !!options.skipGit,
    gitProvider,
    gitNamespace,
    gitRepoName,
    verbose: false,
  };
}
