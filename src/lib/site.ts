export function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (raw) {
    try {
      const trimmed = raw.trim().replace(/^`+|`+$/g, "");
      const url = trimmed.includes("://") ? new URL(trimmed) : new URL(`https://${trimmed}`);
      return `${url.protocol}//${url.hostname}`;
    } catch {
      const s = raw.trim().replace(/^`+|`+$/g, "");
      return s.replace(/\/+$/, "").replace(/:\d+$/, "");
    }
  }
  return "http://localhost:3000";
}
