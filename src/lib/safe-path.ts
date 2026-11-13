// Redirect targets coming from the URL or a form: same-site paths only.
// Refuses "//evil.com" and "/\evil.com" (browsers read both as another website).
export function safePath(value: unknown, fallback = "/account"): string {
  return typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.startsWith("/\\")
    ? value
    : fallback;
}
