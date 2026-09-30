// Renames the brand "Gamingqu" to "ArcaneBoost" in the site's database content
// and switches the logo and favicon to the new ArcaneBoost files.
//
// Preview what would change:   node --env-file=.env scripts/rename-to-arcaneboost.mjs
// Save the changes:            node --env-file=.env scripts/rename-to-arcaneboost.mjs --apply
//
// Only site content is touched (settings, footer, pages, banners, blog, games,
// services). Web addresses, emails, usernames and customer data (orders,
// reviews, messages) are left as they are.
import mariadb from "mariadb";

const NEW_NAME = "ArcaneBoost";
const NEW_LOGO = "/brand/arcaneboost-logo.svg";
const NEW_FAVICON = "/brand/arcaneboost-icon-512.png";

// "Gamingqu", "GamingQu", "Gaming Qu" as a word, but not inside a URL, email,
// domain or handle such as gamingqu.com, t.me/gamingqu or @GamingQu.
const BRAND = /(?<![\w@/.-])gaming ?qu(?![\w.@/-])/gi;

const CONTENT_TABLES = ["WebsiteSetting", "FooterSetting", "Page", "Banner", "Post", "Game", "Category", "Service", "ServiceDetail"];
// siteName, logoUrl and faviconUrl are set explicitly further down.
const SKIP_COLUMN = /(url|link|email|slug|id|sitename)$/i;

const apply = process.argv.includes("--apply");

function connectionFromEnv() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    console.error("DATABASE_URL is missing. Run this from the project folder with --env-file=.env");
    process.exit(1);
  }
  const u = new URL(raw);
  return {
    host: u.hostname,
    port: u.port ? Number(u.port) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\/+/, ""),
  };
}

function preview(text, index) {
  const start = Math.max(0, index - 30);
  return text.slice(start, index + 40).replace(/\s+/g, " ");
}

const cfg = connectionFromEnv();
const conn = await mariadb.createConnection(cfg);
let changes = 0;

try {
  const existing = new Set(
    (await conn.query("SELECT table_name AS t FROM information_schema.tables WHERE table_schema = ?", [cfg.database])).map((r) => r.t)
  );

  for (const table of CONTENT_TABLES) {
    if (!existing.has(table)) continue;
    const cols = (
      await conn.query(
        "SELECT column_name AS c FROM information_schema.columns WHERE table_schema = ? AND table_name = ? AND data_type IN ('varchar','char','text','mediumtext','longtext')",
        [cfg.database, table]
      )
    )
      .map((r) => r.c)
      .filter((c) => !SKIP_COLUMN.test(c));
    if (cols.length === 0) continue;

    const where = cols.map((c) => `LOWER(\`${c}\`) LIKE '%gaming%qu%'`).join(" OR ");
    const rows = await conn.query(`SELECT \`id\`, ${cols.map((c) => `\`${c}\``).join(", ")} FROM \`${table}\` WHERE ${where}`);

    for (const row of rows) {
      const updates = {};
      for (const c of cols) {
        const value = row[c];
        if (typeof value !== "string") continue;
        const matches = [...value.matchAll(BRAND)];
        if (matches.length === 0) continue;
        updates[c] = value.replace(BRAND, NEW_NAME);
        changes += matches.length;
        console.log(`${table}.${c} (id ${row.id}): ${matches.length} change(s), e.g. "...${preview(value, matches[0].index)}..."`);
      }
      if (apply && Object.keys(updates).length > 0) {
        const set = Object.keys(updates).map((c) => `\`${c}\` = ?`).join(", ");
        await conn.query(`UPDATE \`${table}\` SET ${set} WHERE \`id\` = ?`, [...Object.values(updates), row.id]);
      }
    }
  }

  // Site name, logo and favicon.
  if (existing.has("WebsiteSetting")) {
    const settings = await conn.query("SELECT `id`, `siteName`, `logoUrl`, `faviconUrl` FROM `WebsiteSetting`");
    for (const s of settings) {
      const plan = { siteName: NEW_NAME, logoUrl: NEW_LOGO, faviconUrl: NEW_FAVICON };
      for (const [k, v] of Object.entries(plan)) {
        if (s[k] !== v) {
          console.log(`WebsiteSetting.${k}: "${s[k] ?? ""}" -> "${v}"`);
          changes += 1;
        }
      }
      if (apply) {
        await conn.query("UPDATE `WebsiteSetting` SET `siteName` = ?, `logoUrl` = ?, `faviconUrl` = ? WHERE `id` = ?", [
          plan.siteName,
          plan.logoUrl,
          plan.faviconUrl,
          s.id,
        ]);
      }
    }
  }

  if (changes === 0) {
    console.log("Nothing to change: the database already uses ArcaneBoost.");
  } else if (apply) {
    console.log(`\nDone: saved ${changes} change(s). Restart the site so it stops showing the cached old name.`);
  } else {
    console.log(`\nPreview only: ${changes} change(s) found. Run again with --apply to save them.`);
  }
} finally {
  await conn.end();
}
