// ── currency — single source of truth for price symbol ───────────────────────
// Import PRICE_SYMBOL wherever the currency symbol is displayed or stripped.
// Change it here once to update the entire app.

/** Currency symbol shown before every price (e.g. "Rs."). */
export const PRICE_SYMBOL = 'Rs.';

/**
 * Strip the currency symbol prefix from a stored price string.
 *   stripCurrency("Rs. 12.99") → "12.99"
 *   stripCurrency("12.99")     → "12.99"
 */
export function stripCurrency(price: string): string {
  const escaped = PRICE_SYMBOL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return price.replace(new RegExp(`^${escaped}\\s*`, 'i'), '');
}
