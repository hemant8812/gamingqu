export function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (raw) {
    try {
      const url = raw.includes("://") ? new URL(raw) : new URL(`https://${raw}`);
      return `${url.protocol}//${url.hostname}`;
    } catch {
      return raw.replace(/\/+$/, "").replace(/:\d+$/, "");
    }
  }
  return "http://localhost:3000";
}
