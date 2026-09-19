export function extractBraced(text: string, start: number): [string, number] {
  if (start < 0 || start >= text.length || text[start] !== "{") {
    throw new Error(`Expected '{' at position ${start}.`);
  }

  let depth = 0;

  const contentStart = start + 1;

  for (let index = start; index < text.length; index++) {
    const char = text[index];

    /*
     * Escaped braces are literal characters:
     *
     * \{  -> {
     * \}  -> }
     *
     * They must not affect nesting depth.
     */
    if ((char === "{" || char === "}") && isEscaped(text, index)) {
      continue;
    }

    if (char === "{") {
      depth++;
      continue;
    }

    if (char === "}") {
      depth--;

      if (depth === 0) {
        return [text.slice(contentStart, index), index + 1];
      }
    }
  }

  throw new Error(`Unclosed LaTeX brace beginning at position ${start}.`);
}

export function extractOptionalArgument(
  text: string,
  start: number,
): [string | undefined, number] {
  let position = start;

  while (position < text.length && /\s/.test(text[position])) {
    position++;
  }

  if (text[position] !== "[") {
    return [undefined, position];
  }

  const contentStart = position + 1;

  for (let index = position + 1; index < text.length; index++) {
    if (text[index] === "]" && !isEscaped(text, index)) {
      return [text.slice(contentStart, index), index + 1];
    }
  }

  throw new Error(
    `Unclosed optional LaTeX argument beginning at position ${position}.`,
  );
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
      for (let argumentIndex = 0; argumentIndex < expected; argumentIndex++) {
        while (position < text.length && /\s/.test(text[position])) {
          position++;
        }

        /*
         * Some LaTeX commands may contain optional arguments.
         * Consume them before the required braced argument.
         */
        if (text[position] === "[") {
          const [, nextPosition] = extractOptionalArgument(text, position);

          position = nextPosition;

          while (position < text.length && /\s/.test(text[position])) {
            position++;
          }
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
      /*
       * Ignore malformed command occurrences and
       * continue searching for the next valid command.
       */
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

  /*
   * An item ends at the next \item or the end of the
   * current resumeItemList.
   */
  const pattern = /\\item\b\s*([\s\S]*?)(?=\\item\b|\\resumeItemListEnd\b|$)/g;

  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const value = clean(match[1]);

    if (value) {
      items.push(value);
    }
  }

  return items;
}

export function extractCommandBlocks(
  text: string,
  startCommand: string,
  endCommand: string,
): string[] {
  const blocks: string[] = [];

  const startPattern = new RegExp(
    String.raw`\\${escapeRegExp(startCommand)}\b`,
    "g",
  );

  const endPattern = new RegExp(
    String.raw`\\${escapeRegExp(endCommand)}\b`,
    "g",
  );

  let startMatch: RegExpExecArray | null;

  while ((startMatch = startPattern.exec(text)) !== null) {
    const start = (startMatch.index ?? 0) + startMatch[0].length;

    endPattern.lastIndex = start;

    const endMatch = endPattern.exec(text);

    const end = endMatch?.index ?? text.length;

    blocks.push(text.slice(start, end));

    if (!endMatch) {
      break;
    }

    startPattern.lastIndex = endMatch.index + endMatch[0].length;
  }

  return blocks;
}

function isEscaped(text: string, index: number): boolean {
  let slashCount = 0;

  for (let cursor = index - 1; cursor >= 0; cursor--) {
    if (text[cursor] !== "\\") {
      break;
    }

    slashCount++;
  }

  return slashCount % 2 === 1;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
