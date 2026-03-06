export interface ViterexConfig {
  projectName: string;
  projectDir: string;

  // Redaxo
  redaxoVersion: string;
  redaxoAdminUser: string;
  redaxoAdminPassword: string;
  redaxoAdminEmail: string;
  redaxoErrorEmail: string;
  redaxoServerName: string;

  // Database
  skipDb: boolean;
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;

  // Addons & Plugins
  skipAddons: boolean;
  addons: AddonSelection[];

  // Vite / Frontend
  packageManager: "yarn" | "npm" | "pnpm";

  // Massif Settings (business contact info inserted into rex_config)
  massifSettings: MassifSettings;

  // Deployment
  setupDeploy: boolean;

  // Git
  skipGit: boolean;
  gitProvider: string;    // e.g. "github.com" or "gitlab.com"
  gitNamespace: string;   // org or user name
  gitRepoName: string;    // repository name

  // Runtime flags (not persisted to config files)
  verbose: boolean;
}

export interface AddonSelection {
  key: string;       // e.g. "yrewrite"
  install: boolean;
  activate: boolean;
  plugins?: string[]; // optional plugin keys to activate
}

// Full addon catalog ported from setup/setup.cfg ADDON_PACKAGES.
// All entries from the original list are recommended:true (installed by default).
export const ADDON_CATALOG: AddonEntry[] = [
  { key: "yform", label: "YForm (form builder)", recommended: true },
  { key: "yrewrite", label: "YRewrite (URL rewriting)", recommended: true },
  { key: "be_tools", label: "BE Tools (backend enhancements)", recommended: true },
  { key: "sprog", label: "Sprog (i18n / variables)", recommended: true },
  { key: "url", label: "URL (custom URL profiles)", recommended: true },
  { key: "adminer", label: "Adminer (DB management)", recommended: true },
  { key: "bloecks", label: "Bloecks (block editor)", recommended: true },
  { key: "developer", label: "Developer (file-based templates/modules)", recommended: true },
  { key: "focuspoint", label: "Focuspoint (image focal point)", recommended: true },
  { key: "mblock", label: "MBlock (repeatable fields)", recommended: true },
  { key: "mform", label: "MForm (module form builder)", recommended: true },
  { key: "quick_navigation", label: "Quick Navigation", recommended: true },
  { key: "cropper", label: "Cropper (image cropping)", recommended: true },
  { key: "hyphenator", label: "Hyphenator (auto-hyphenation)", recommended: true },
  { key: "emailobfuscator", label: "Email Obfuscator", recommended: true },
  { key: "structure_tweaks", label: "Structure Tweaks", recommended: true },
  { key: "cke5", label: "CKEditor 5 (WYSIWYG editor)", recommended: true },
  { key: "ui_tools", label: "UI Tools", recommended: true, plugins: ["jquery-minicolors", "selectize"] },
  { key: "uploader", label: "Uploader (media upload)", recommended: true },
  { key: "useragent", label: "Useragent (device detection)", recommended: true },
  { key: "yform_adminer", label: "YForm Adminer", recommended: true },
  { key: "yform_spam_protection", label: "YForm Spam Protection", recommended: true },
  { key: "yform_usability", label: "YForm Usability", recommended: true },
  { key: "media_negotiator", label: "Media Negotiator (WebP/AVIF)", recommended: true },
  { key: "statistics", label: "Statistics", recommended: true },
  { key: "ydeploy", label: "YDeploy (deployment)", recommended: true },
  { key: "structure", label: "Structure (history plugin)", recommended: true, plugins: ["history"] },
  { key: "phpmailer", label: "PHPMailer", recommended: true },
  { key: "be_password", label: "BE Password (password policy)", recommended: true },
  { key: "block_peek", label: "Block Peek (slice preview)", recommended: true },
];

export interface MassifSettings {
  firma: string;
  strasse: string;
  plz: string;
  ort: string;
  kantonCode: string;
  land: string;
  landCode: string;
  phone: string;
  email: string;
  googleMapsLink: string;
  geoLat: string;
  geoLong: string;
}

export interface AddonEntry {
  key: string;
  label: string;
  recommended: boolean;
  plugins?: string[];
}
