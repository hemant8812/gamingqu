export function getParamStr(sp: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const v = sp?.[key];
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v[0] ?? undefined;
  return undefined;
}

export function normalizeQuery(sp: Record<string, string | string[] | undefined>, key: string, maxLen = 64): string {
  const raw = getParamStr(sp, key) ?? "";
  return raw.trim().slice(0, maxLen);
}

export function parseToast(sp: Record<string, string | string[] | undefined>): { value?: string; type: "success" | "error" } {
  const v = getParamStr(sp, "toast");
  return { value: v, type: v === "error" ? "error" : "success" };
}
