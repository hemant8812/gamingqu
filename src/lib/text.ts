export function toSlug(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function stripHtml(input?: string | null): string {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}
