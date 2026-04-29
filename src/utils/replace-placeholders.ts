/**
 * Replace `{{TOKEN}}` placeholders in a string with values from `replacements`.
 *
 * Tokens whose key is not present in `replacements` are left intact (the literal
 * `{{TOKEN}}` survives). This is the contract scaffold-frontend has always
 * relied on — never silently swallow unknown tokens.
 */
export function replacePlaceholders(
  content: string,
  replacements: Record<string, string>,
): string {
  return content.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    key in replacements ? replacements[key] : match,
  );
}
