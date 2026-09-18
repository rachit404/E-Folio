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

export function cleanLatex(text: string): string {
  let value = text;

  // Non-breaking spaces.
  value = value.replace(/~/g, " ");

  /*
   * \href{url}{visible text}
   * -> visible text
   */
  value = value.replace(/\\href\s*\{[^{}]*\}\s*\{([^{}]*)\}/g, "$1");

  /*
   * Layout commands must disappear completely.
   *
   * \vspace{-1pt}Education
   * -> Education
   */
  const layoutCommands = ["vspace", "hspace", "raisebox"];

  for (const command of layoutCommands) {
    value = value.replace(
      new RegExp(String.raw`\\${command}\s*(?:\[[^\]]*\])?\s*\{[^{}]*\}`, "g"),
      "",
    );
  }

  /*
   * Formatting commands preserve their contents.
   */
  const formattingCommands = [
    "textbf",
    "textit",
    "emph",
    "underline",
    "textrm",
    "textsf",
    "texttt",
    "small",
    "footnotesize",
    "large",
    "Large",
    "LARGE",
    "Huge",
  ];

  for (const command of formattingCommands) {
    value = value.replace(
      new RegExp(String.raw`\\${command}\s*\{([^{}]*)\}`, "g"),
      "$1",
    );
  }

  // Font Awesome commands.
  value = value.replace(/\\fa[A-Za-z]+/g, "");

  /*
   * Common LaTeX escapes.
   */
  const replacements: Record<string, string> = {
    "\\&": "&",
    "\\%": "%",
    "\\$": "$",
    "\\#": "#",
    "\\_": "_",
    "\\{": "{",
    "\\}": "}",
    "---": "—",
    "--": "–",
    "``": '"',
    "''": '"',
  };

  for (const [source, target] of Object.entries(replacements)) {
    value = value.split(source).join(target);
  }

  /*
   * Remove remaining simple commands.
   */
  value = value.replace(/\\[a-zA-Z]+\*?(?:\[[^\]]*\])?/g, "");

  value = value.replace(/[{}]/g, "");

  value = value.replace(/\s+/g, " ").trim();

  return value;
}
