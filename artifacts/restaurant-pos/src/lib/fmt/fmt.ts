// ── fmt — global number formatting utilities ──────────────────────────────
// Single source of truth for all number/price display formatting.
// Import pkFmt wherever a number needs display — never format inline.

/**
 * Format a whole number using the Pakistani lakh/crore comma system.
 * Strips any non-numeric prefix (e.g. the currency symbol + space), removes decimals (floor),
 * then applies grouping: last 3 digits, then pairs from the right.
 *
 *   pkFmt(1000)         → "1,000"
 *   pkFmt(100000)       → "1,00,000"
 *   pkFmt(1234567)      → "12,34,567"
 *   pkFmt("Rs. 12.99")  → "12"
 *   pkFmt("000")        → "0"
 */
export function pkFmt(value: string | number): string {
  const n = Math.floor(Math.abs(Number(String(value).replace(/[^\d.]/g, '')) || 0));
  const s = String(n);
  if (s.length <= 3) return s;

  // Last 3 digits form the first comma group (rightmost)
  const last3 = s.slice(-3);
  const rest   = s.slice(0, -3);

  // Split the remainder into groups of 2 from the right
  const groups: string[] = [];
  let i = rest.length;
  while (i > 0) {
    groups.unshift(rest.slice(Math.max(0, i - 2), i));
    i -= 2;
  }

  return [...groups, last3].join(',');
}
