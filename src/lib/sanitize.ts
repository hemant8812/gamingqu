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
