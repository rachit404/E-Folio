/**
 * Decides which panels of a two-column comic page span the full
 * width.
 *
 * - The first panel is the "splash" and spans both columns.
 * - After it, panels pair up two per row; if one is left over, the
 *   last panel spans the row so the page never ends with a hole.
 *
 * Returns one boolean per panel (true = full width).
 */
export function panelSpans(count: number): boolean[] {
  if (count <= 0) {
    return [];
  }

  const spans = Array.from({ length: count }, () => false);

  spans[0] = true;

  const remaining = count - 1;

  if (remaining % 2 === 1) {
    spans[count - 1] = true;
  }

  return spans;
}
