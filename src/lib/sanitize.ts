export function sanitizePlain(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

export function normalizeEmail(email: string): string {
  return sanitizePlain(email).toLowerCase();
}
