import https from "node:https";

const FALLBACK_VERSION = "5.20.2";
const RELEASES_URL = "https://api.github.com/repos/redaxo/redaxo/releases/latest";
const TIMEOUT_MS = 3000;
const MAX_REDIRECTS = 3;

/**
 * Resolve the latest Redaxo release tag from GitHub. Falls back to a known
 * version if the request fails or times out — used as a prompt default.
 *
 * Follows up to MAX_REDIRECTS HTTP redirects (the redaxo/redaxo path returns
 * a 301 to a /repositories/<id>/ canonical URL).
 */
export async function getLatestRedaxoVersion(): Promise<string> {
  return fetchTag(RELEASES_URL, MAX_REDIRECTS);
}

function fetchTag(url: string, redirectsLeft: number): Promise<string> {
  return new Promise((resolve) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent": "create-viterex",
          Accept: "application/vnd.github+json",
        },
        timeout: TIMEOUT_MS,
      },
      (res) => {
        const status = res.statusCode ?? 0;

        if (status >= 300 && status < 400 && res.headers.location && redirectsLeft > 0) {
          res.resume();
          const next = new URL(res.headers.location, url).toString();
          return resolve(fetchTag(next, redirectsLeft - 1));
        }

        if (status !== 200) {
          res.resume();
          return resolve(FALLBACK_VERSION);
        }

        let body = "";
        res.setEncoding("utf-8");
        res.on("data", (chunk: string) => (body += chunk));
        res.on("end", () => {
          try {
            const data = JSON.parse(body) as { tag_name?: string };
            const tag = (data.tag_name ?? "").trim();
            resolve(tag || FALLBACK_VERSION);
          } catch {
            resolve(FALLBACK_VERSION);
          }
        });
      },
    );
    req.on("error", () => resolve(FALLBACK_VERSION));
    req.on("timeout", () => {
      req.destroy();
      resolve(FALLBACK_VERSION);
    });
  });
}
