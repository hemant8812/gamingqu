export function sanitizePlain(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

export function normalizeEmail(email: string): string {
  return sanitizePlain(email).toLowerCase();
}

export function sanitizeHtml(input: string): string {
  if (!input) return "";
  let s = input;
  s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  s = s.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
  s = s.replace(/\son\w+=(["']).*?\1/gi, "");
  return s.trim();
}

export function sanitizeSlug(input: string): string {
  const s = String(input || "").toLowerCase().trim();
  const m = s.match(/^[a-z0-9-]{1,100}$/);
  return m ? s : "";
}

export function limitLen(input: string, max: number): string {
  const s = String(input || "");
  return s.length > max ? s.slice(0, max) : s;
}
