export function stripComments(text: string): string {
  return text
    .split(/\r?\n/)
    .map((line) => {
      let escaped = false;

      for (let index = 0; index < line.length; index++) {
        const char = line[index];

        if (char === "%" && !escaped) {
          return line.slice(0, index);
        }

        if (char === "\\") {
          escaped = !escaped;
        } else {
          escaped = false;
        }
      }

      return line;
    })
    .join("\n");
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

function unwrapSimpleCommands(value: string): string {
  const commands = [
    "textbf",
    "textit",
    "emph",
    "underline",
    "textrm",
    "textsf",
    "texttt",
    "textnormal",
    "small",
    "footnotesize",
    "scriptsize",
    "tiny",
    "large",
    "Large",
    "LARGE",
    "huge",
    "Huge",
    "HUGE",
    "mbox",
    "makebox",
    "fbox",
  ];

  let result = value;

  /*
   * Repeat because formatting commands can be nested:
   *
   * \textbf{\emph{Something}}
   *
   * The first pass removes one layer and the second
   * removes the next.
   */
  for (let pass = 0; pass < 10; pass++) {
    let changed = false;

    for (const command of commands) {
      const pattern = new RegExp(String.raw`\\${command}\s*\{([^{}]*)\}`, "g");

      const next = result.replace(pattern, "$1");

      if (next !== result) {
        changed = true;
        result = next;
      }
    }

    if (!changed) {
      break;
    }
  }

  return result;
}

function removeLayoutCommands(value: string): string {
  let result = value;

  const commands = [
    "vspace",
    "hspace",
    "vspace*",
    "hspace*",
    "raisebox",
    "kern",
    "hskip",
    "vskip",
    "smallskip",
    "medskip",
    "bigskip",
    "noindent",
    "indent",
    "newline",
    "linebreak",
    "pagebreak",
    "newpage",
    "clearpage",
  ];

  /*
   * Commands with a braced argument.
   */
  for (const command of commands) {
    const escapedCommand = command.replace("*", "\\*");

    result = result.replace(
      new RegExp(
        String.raw`\\${escapedCommand}\s*(?:\[[^\]]*\])?\s*(?:\{[^{}]*\})?`,
        "g",
      ),
      " ",
    );
  }

  /*
   * Explicit LaTeX line breaks.
   */
  result = result.replace(/\\\\(?:\[[^\]]*\])?/g, " ");

  return result;
}

function removeRemainingCommands(value: string): string {
  let result = value;

  /*
   * Remove commands which have one braced argument while
   * preserving the argument itself.
   */
  for (let pass = 0; pass < 10; pass++) {
    const next = result.replace(/\\[a-zA-Z]+\*?\s*\{([^{}]*)\}/g, "$1");

    if (next === result) {
      break;
    }

    result = next;
  }

  /*
   * Remove commands without arguments.
   */
  result = result.replace(/\\[a-zA-Z]+\*?(?:\[[^\]]*\])?/g, " ");

  return result;
}

function decodeLatexEscapes(value: string): string {
  let result = value;

  const replacements: Record<string, string> = {
    "\\&": "&",
    "\\%": "%",
    "\\$": "$",
    "\\#": "#",
    "\\_": "_",
    "\\{": "{",
    "\\}": "}",
    "\\textbackslash": "\\",
    "---": "—",
    "--": "–",
    "``": '"',
    "''": '"',
    "~": " ",
  };

  /*
   * Protect escaped braces from the generic brace removal
   * by converting them before that stage.
   */
  for (const [source, target] of Object.entries(replacements)) {
    result = result.split(source).join(target);
  }

  return result;
}

function removeStrayBraces(value: string): string {
  return value.replace(/[{}]/g, "");
}

export function cleanLatex(text: string): string {
  let value = text;

  /*
   * Normalize line endings first.
   */
  value = value.replace(/\r\n/g, "\n");

  /*
   * \href{url}{label}
   *
   * For visible text we keep the label.
   *
   * Example:
   * \href{https://github.com/foo}{LearnPath AI}
   * -> LearnPath AI
   */
  for (let pass = 0; pass < 10; pass++) {
    const next = value.replace(/\\href\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, "$2");

    if (next === value) {
      break;
    }

    value = next;
  }

  /*
   * Remove layout-only commands.
   */
  value = removeLayoutCommands(value);

  /*
   * Remove Font Awesome/icon commands.
   */
  value = value.replace(/\\fa[A-Za-z]+(?:\[[^\]]*\])?/g, " ");

  /*
   * Remove common formatting wrappers.
   */
  value = unwrapSimpleCommands(value);

  /*
   * Remove remaining LaTeX commands.
   */
  value = removeRemainingCommands(value);

  /*
   * Decode escaped characters.
   */
  value = decodeLatexEscapes(value);

  /*
   * Remove any remaining structural braces.
   */
  value = removeStrayBraces(value);

  /*
   * Normalize whitespace.
   */
  value = value.replace(/\s+/g, " ").trim();

  return value;
}
