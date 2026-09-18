export function extractBraced(text: string, start: number): [string, number] {
  if (start >= text.length || text[start] !== "{") {
    throw new Error("Expected '{'.");
  }

  let depth = 0;
  const contentStart = start + 1;

  for (let index = start; index < text.length; index++) {
    const char = text[index];

    if (char === "{") {
      depth++;
    } else if (char === "}") {
      depth--;

      if (depth === 0) {
        return [text.slice(contentStart, index), index + 1];
      }
    }
  }

  throw new Error("Unclosed LaTeX brace.");
}

export function parseCommandArguments(
  text: string,
  command: string,
  expected: number,
): string[][] {
  const pattern = new RegExp(String.raw`\\${escapeRegExp(command)}\b`, "g");

  const results: string[][] = [];

  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    let position = (match.index ?? 0) + match[0].length;
    const args: string[] = [];

    try {
      for (let i = 0; i < expected; i++) {
        while (position < text.length && /\s/.test(text[position])) {
          position++;
        }

        if (position >= text.length || text[position] !== "{") {
          break;
        }

        const [value, nextPosition] = extractBraced(text, position);

        args.push(value);
        position = nextPosition;
      }

      if (args.length === expected) {
        results.push(args);
      }
    } catch {
      continue;
    }
  }

  return results;
}

export function extractItemsFromList(
  text: string,
  clean: (value: string) => string,
): string[] {
  const items: string[] = [];

  const pattern = /\\item\s*([\s\S]*?)(?=\\item|\\resumeItemListEnd|$)/g;

  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const value = clean(match[1]);

    if (value) {
      items.push(value);
    }
  }

  return items;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
