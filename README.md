# create-viterex

CLI tool to scaffold a **ViteRex** project — [Redaxo CMS](https://redaxo.org/) + [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/).

## Quick start

```bash
npx create-viterex my-project
```

The interactive prompts will walk you through project name, Redaxo version, database credentials, addon selection and package manager choice.

## Usage

```
create-viterex [project-name] [options]
```

### Options

| Flag              | Description                                              | Default |
| ----------------- | -------------------------------------------------------- | ------- |
| `--skip-db`       | Skip database creation                                   | `false` |
| `--skip-addons`   | Skip addon installation                                  | `false` |
| `--skip-git`      | Don't initialize a git repo                              | `false` |
| `--pm <manager>`  | Package manager: `yarn`, `npm`, or `pnpm`                | `yarn`  |
| `--config <path>` | Load config from a JSON file (skip all prompts)          | —       |
| `--resume`        | Resume a previously failed run, skipping completed tasks | `false` |
| `--dry-run`       | Log each task without executing anything                 | `false` |
| `--verbose`       | Pipe task stdout/stderr to the terminal                  | `false` |
| `-V, --version`   | Print version                                            | —       |
| `-h, --help`      | Show help                                                | —       |

## Examples

### Interactive mode

```bash
npx create-viterex
```

You'll be prompted for everything. Pass a project name to skip the first question:

```bash
npx create-viterex my-site
```

### Skip specific steps

```bash
npx create-viterex my-site --skip-db --skip-git --pm pnpm
```

### Non-interactive mode with a config file

```bash
npx create-viterex --config viterex.json
```

### Preview what would happen

```bash
npx create-viterex --config viterex.json --dry-run
```

### Resume after a failure

If a task fails mid-run, fix the issue and resume where you left off:

```bash
npx create-viterex my-site --resume
```

Progress is tracked in `.viterex-state.json` inside the project directory. The state file is automatically deleted on successful completion.

### Debug with verbose output

```bash
npx create-viterex my-site --verbose
```

All subprocess output (composer, php, mysql, git, etc.) is piped to the terminal instead of being suppressed.

## Config JSON schema

When using `--config`, provide a JSON file matching this shape:

```jsonc
{
  // Project
  "projectName": "my-site", // Directory name (alphanumeric, hyphens, underscores)
  "projectDir": "/absolute/path/to/my-site",

  // Redaxo
  "redaxoVersion": "5.17.1",
  "redaxoAdminUser": "admin",
  "redaxoAdminPassword": "secret",
  "redaxoAdminEmail": "admin@example.com",
  "redaxoErrorEmail": "errors@example.com",
  "redaxoServerName": "my-site.test", // Local vhost hostname

  // Database
  "skipDb": false, // true to skip DB creation entirely
  "dbHost": "127.0.0.1",
  "dbPort": 3306,
  "dbName": "my_site",
  "dbUser": "root",
  "dbPassword": "",

  // Addons
  "skipAddons": false, // true to skip addon installation
  "addons": [
    { "key": "yrewrite", "install": true, "activate": true },
    { "key": "developer", "install": true, "activate": true },
    {
      "key": "ui_tools",
      "install": true,
      "activate": true,
      "plugins": ["jquery-minicolors", "selectize"],
    },
  ],

  // Frontend
  "packageManager": "yarn", // "yarn" | "npm" | "pnpm"

  // Massif Settings (business contact info inserted into rex_config)
  "massifSettings": {
    "firma": "My Company",
    "strasse": "Strasse 1",
    "plz": "5400",
    "ort": "Baden",
    "kantonCode": "AG",
    "land": "Schweiz",
    "landCode": "CH",
    "phone": "+41 00 000 00 00",
    "email": "info@example.com",
    "googleMapsLink": "", // optional
    "geoLat": "", // optional
    "geoLong": "", // optional
  },

  // Deployment
  "setupDeploy": false, // true to scaffold ydeploy config

  // Git
  "skipGit": false, // true to skip git init + initial commit
  "gitProvider": "github.com", // "github.com" | "gitlab.com" (empty string to skip remote)
  "gitNamespace": "my-org", // GitHub org or GitLab group/user
  "gitRepoName": "my-site", // remote repository name

  // Runtime (optional in config file — overridden by CLI flags)
  "verbose": false,
}
```

### Addon selection format

Each entry in the `addons` array:

| Field      | Type       | Description                                                               |
| ---------- | ---------- | ------------------------------------------------------------------------- |
| `key`      | `string`   | Redaxo addon key (e.g. `"yrewrite"`)                                      |
| `install`  | `boolean`  | Whether to download and install the addon                                 |
| `activate` | `boolean`  | Whether to activate the addon after install                               |
| `plugins`  | `string[]` | Optional list of plugin keys to install and activate (e.g. `["history"]`) |

Plugins use slash notation internally: addon `structure` with plugin `history` becomes `structure/history`.

### Massif Settings format

Business contact information inserted into the Redaxo `rex_config` table:

| Field            | Type     | Description                     |
| ---------------- | -------- | ------------------------------- |
| `firma`          | `string` | Company name                    |
| `strasse`        | `string` | Street address                  |
| `plz`            | `string` | Postal code                     |
| `ort`            | `string` | City                            |
| `kantonCode`     | `string` | Canton/State code (e.g. `"AG"`) |
| `land`           | `string` | Country name (e.g. `"Schweiz"`) |
| `landCode`       | `string` | Country code (e.g. `"CH"`)      |
| `phone`          | `string` | Phone number                    |
| `email`          | `string` | Contact email                   |
| `googleMapsLink` | `string` | Google Maps link (optional)     |
| `geoLat`         | `string` | Latitude (optional)             |
| `geoLong`        | `string` | Longitude (optional)            |

### Git remote format

| Field          | Type     | Description                                             |
| -------------- | -------- | ------------------------------------------------------- |
| `gitProvider`  | `string` | `"github.com"` or `"gitlab.com"` (empty string to skip) |
| `gitNamespace` | `string` | Organization or username                                |
| `gitRepoName`  | `string` | Repository name                                         |

## Pipeline

The CLI runs these tasks sequentially:

| #   | Task                                                                           | Skipped when                          |
| --- | ------------------------------------------------------------------------------ | ------------------------------------- |
| 1   | Download Redaxo                                                                | —                                     |
| 2   | Create database                                                                | `--skip-db`                           |
| 3   | Install Redaxo                                                                 | —                                     |
| 4   | Install addons                                                                 | `--skip-addons` or no addons selected |
| 5   | Scaffold frontend (Vite, configs)                                              | —                                     |
| 6   | Install dependencies (composer + packages)                                     | —                                     |
| 7   | Initialize git                                                                 | `--skip-git`                          |
| 8   | Install submodule addons (viterex, massif, massif_settings, massif_dnd_sorter) | `--skip-git`                          |
| 9   | Git initial commit                                                             | `--skip-git`                          |
| 10  | Create remote git repository                                                   | `--skip-git` or no git provider       |
| 11  | Open frontend and backend in browser                                           | —                                     |
| 12  | Start Vite dev server                                                          | —                                     |

Each task is idempotent. If one fails, fix the issue and re-run with `--resume`.

## Available addons

All addons below are selected by default in interactive mode:

| Addon                   | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `yform`                 | Form builder                                     |
| `yrewrite`              | URL rewriting                                    |
| `be_tools`              | Backend enhancements                             |
| `sprog`                 | i18n / variables                                 |
| `url`                   | Custom URL profiles                              |
| `adminer`               | DB management                                    |
| `bloecks`               | Block editor                                     |
| `developer`             | File-based templates/modules                     |
| `focuspoint`            | Image focal point                                |
| `mblock`                | Repeatable fields                                |
| `mform`                 | Module form builder                              |
| `quick_navigation`      | Quick navigation                                 |
| `cropper`               | Image cropping                                   |
| `hyphenator`            | Auto-hyphenation                                 |
| `emailobfuscator`       | Email obfuscation                                |
| `plyr`                  | Media player                                     |
| `structure_tweaks`      | Structure tweaks                                 |
| `cke5`                  | CKEditor 5                                       |
| `ui_tools`              | UI tools (plugins: jquery-minicolors, selectize) |
| `uploader`              | Media upload                                     |
| `useragent`             | Device detection                                 |
| `yform_adminer`         | YForm adminer                                    |
| `yform_quick_edit`      | YForm quick edit                                 |
| `yform_spam_protection` | YForm spam protection                            |
| `yform_usability`       | YForm usability                                  |
| `media_negotiator`      | WebP/AVIF negotiation                            |
| `statistics`            | Statistics                                       |
| `ydeploy`               | Deployment                                       |
| `structure`             | Structure (plugin: history)                      |
| `phpmailer`             | PHPMailer                                        |
| `be_password`           | Password policy                                  |
| `block_peek`            | Slice preview                                    |

## Prerequisites

- Node.js >= 18
- PHP (for Redaxo CLI commands)
- MySQL / MariaDB (unless `--skip-db`)
- Composer
- Git (unless `--skip-git`)

## Development

```bash
pnpm install
pnpm run build          # tsup -> dist/
node bin/cli.js         # run locally
```

## License

MIT
