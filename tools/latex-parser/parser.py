from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any


# ============================================================
# Utilities
# ============================================================

def strip_comments(text: str) -> str:
    """
    Remove LaTeX comments while preserving escaped percent signs.
    """
    lines = []

    for line in text.splitlines():
        result = []
        escaped = False

        for char in line:
            if char == "%" and not escaped:
                break

            result.append(char)

            if char == "\\":
                escaped = not escaped
            else:
                escaped = False

        lines.append("".join(result))

    return "\n".join(lines)


def clean_latex(text: str) -> str:
    """
    Convert common LaTeX formatting into readable plain text.
    """

    text = text.replace("~", " ")

    # Remove href while preserving visible text.
    text = re.sub(
        r"\\href\s*\{[^{}]*\}\s*\{([^{}]*)\}",
        r"\1",
        text,
    )

    # Remove common formatting commands.
    commands = [
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
        "vspace",
        "hspace",
        "raisebox",
        "footnotesize",
    ]

    for command in commands:
        text = re.sub(
            rf"\\{command}\s*\{{([^{{}}]*)\}}",
            r"\1",
            text,
        )

    # Remove font-awesome commands.
    text = re.sub(r"\\fa[A-Za-z]+", "", text)

    # Remove escaped LaTeX symbols.
    replacements = {
        r"\&": "&",
        r"\%": "%",
        r"\$": "$",
        r"\#": "#",
        r"\_": "_",
        r"\{": "{",
        r"\}": "}",
        r"---": "—",
        r"--": "–",
        r"``": '"',
        r"''": '"',
    }

    for source, target in replacements.items():
        text = text.replace(source, target)

    # Remove remaining simple commands.
    text = re.sub(
        r"\\[a-zA-Z]+\*?(?:\[[^\]]*\])?",
        "",
        text,
    )

    # Remove braces.
    text = text.replace("{", "").replace("}", "")

    # Normalize whitespace.
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def extract_braced(text: str, start: int) -> tuple[str, int]:
    """
    Given the index of '{', extract the balanced brace content.
    Returns (content, index_after_closing_brace).
    """

    if start >= len(text) or text[start] != "{":
        raise ValueError("Expected '{'.")

    depth = 0
    content_start = start + 1

    for index in range(start, len(text)):
        char = text[index]

        if char == "{":
            depth += 1

        elif char == "}":
            depth -= 1

            if depth == 0:
                return text[content_start:index], index + 1

    raise ValueError("Unclosed LaTeX brace.")


def parse_command_arguments(
    text: str,
    command: str,
    expected: int,
) -> list[list[str]]:
    """
    Parse repeated LaTeX commands such as:

        \\resumeSubheading{A}{B}{C}{D}

    Returns:
        [
            ["A", "B", "C", "D"],
            ...
        ]
    """

    pattern = re.compile(
        rf"\\{re.escape(command)}\b"
    )

    results = []

    for match in pattern.finditer(text):
        position = match.end()
        args = []

        try:
            for _ in range(expected):
                while position < len(text) and text[position].isspace():
                    position += 1

                if position >= len(text) or text[position] != "{":
                    break

                value, position = extract_braced(text, position)
                args.append(value)

            if len(args) == expected:
                results.append(args)

        except ValueError:
            continue

    return results


def extract_items_from_list(text: str) -> list[str]:
    """
    Extract \\item contents from a resumeItemList.
    """

    items = []

    pattern = re.compile(
        r"\\item\s*(.*?)(?=\\item|\\resumeItemListEnd|$)",
        re.DOTALL,
    )

    for match in pattern.finditer(text):
        value = clean_latex(match.group(1))

        if value:
            items.append(value)

    return items


# ============================================================
# Contact / Metadata
# ============================================================

def parse_metadata(text: str) -> dict[str, Any]:
    metadata: dict[str, Any] = {}

    definitions = {
        "name": r"\\newcommand\{\\name\}\{([^}]*)\}",
        "course": r"\\newcommand\{\\course\}\{([^}]*)\}",
        "phone": r"\\newcommand\{\\phone\}\{([^}]*)\}",
        "email": r"\\newcommand\{\\emaila\}\{([^}]*)\}",
    }

    for key, pattern in definitions.items():
        match = re.search(pattern, text)

        if match:
            metadata[key] = clean_latex(match.group(1))

    links = {}

    github = re.search(
        r"\\href\{(https?://github\.com/[^}]+)\}",
        text,
    )

    linkedin = re.search(
        r"\\href\{(https?://www\.linkedin\.com/[^}]+)\}",
        text,
    )

    if github:
        links["github"] = github.group(1)

    if linkedin:
        links["linkedin"] = linkedin.group(1)

    metadata["links"] = links

    return metadata


# ============================================================
# Section Detection
# ============================================================

def extract_sections(text: str) -> list[dict[str, Any]]:
    """
    Detect every \\section{...} without relying on its name.

    The section heading is preserved exactly as content.
    """

    sections = []

    pattern = re.compile(
        r"\\section\s*\{",
        re.MULTILINE,
    )

    matches = list(pattern.finditer(text))

    for index, match in enumerate(matches):

        try:
            heading, heading_end = extract_braced(
                text,
                match.end() - 1,
            )
        except ValueError:
            continue

        body_start = heading_end

        if index + 1 < len(matches):
            body_end = matches[index + 1].start()
        else:
            document_end = text.find(r"\end{document}", body_start)
            body_end = document_end if document_end != -1 else len(text)

        body = text[body_start:body_end].strip()

        sections.append(
            {
                "heading": clean_latex(heading),
                "body": body,
            }
        )

    return sections


# ============================================================
# Structural Classification
# ============================================================

def classify_section(body: str) -> str:
    """
    Determine section kind from its LaTeX structure,
    NOT from its heading.

    This is what keeps the system heading-independent.
    """

    if r"\resumeProject" in body:
        return "projects"

    if r"\resumeHeadingSkillStart" in body:
        return "skills"

    if r"\resumePOR" in body:
        return "positions"

    if r"\resumeSubheading" in body:
        return "timeline"

    return "content"


# ============================================================
# Structured Section Parsers
# ============================================================

def parse_timeline_section(body: str) -> list[dict[str, Any]]:
    items = []

    for args in parse_command_arguments(
        body,
        "resumeSubheading",
        4,
    ):
        organization, secondary, role, dates = args

        items.append(
            {
                "organization": clean_latex(organization),
                "secondary": clean_latex(secondary),
                "role": clean_latex(role),
                "dates": clean_latex(dates),
                "details": [],
            }
        )

    # Attach resume item lists in order.
    lists = re.findall(
        r"\\resumeItemListStart(.*?)\\resumeItemListEnd",
        body,
        re.DOTALL,
    )

    for index, item_list in enumerate(lists):
        if index < len(items):
            items[index]["details"] = extract_items_from_list(item_list)

    return items


def parse_project_section(body: str) -> list[dict[str, Any]]:
    items = []

    for args in parse_command_arguments(
        body,
        "resumeProject",
        4,
    ):
        name, description, metadata_a, metadata_b = args

        project = {
            "name": clean_latex(name),
            "description": clean_latex(description),
            "metadata": {
                "primary": clean_latex(metadata_a),
                "secondary": clean_latex(metadata_b),
            },
            "details": [],
            "links": [],
        }

        # Extract GitHub URLs from project name.
        urls = re.findall(
            r"https?://[^\s}]+",
            name,
        )

        for url in urls:
            project["links"].append(
                {
                    "label": "repository",
                    "url": url,
                }
            )

        items.append(project)

    lists = re.findall(
        r"\\resumeItemListStart(.*?)\\resumeItemListEnd",
        body,
        re.DOTALL,
    )

    for index, item_list in enumerate(lists):
        if index < len(items):
            items[index]["details"] = extract_items_from_list(item_list)

    return items


def parse_skill_section(body: str) -> list[dict[str, Any]]:
    """
    Generic skill extraction.

    We don't assume what the user calls a skill category.
    """

    skills = []

    # Look for resumeItem / resumeSubItem commands.
    for command in ["resumeItem", "resumeSubItem"]:
        for args in parse_command_arguments(
            body,
            command,
            2,
        ):
            name, description = args

            skills.append(
                {
                    "name": clean_latex(name),
                    "description": clean_latex(description),
                }
            )

    return skills


def parse_positions_section(body: str) -> list[dict[str, Any]]:
    items = []

    for args in parse_command_arguments(
        body,
        "resumePOR",
        3,
    ):
        title, organization, dates = args

        items.append(
            {
                "title": clean_latex(title),
                "organization": clean_latex(organization),
                "dates": clean_latex(dates),
            }
        )

    return items


def parse_generic_section(body: str) -> list[dict[str, Any]]:
    """
    Fallback parser.

    Keeps useful textual content even if the LaTeX section
    uses a structure we haven't explicitly modeled.
    """

    result = []

    for value in extract_items_from_list(body):
        result.append(
            {
                "text": value,
            }
        )

    if not result:
        cleaned = clean_latex(body)

        if cleaned:
            result.append(
                {
                    "text": cleaned,
                }
            )

    return result


# ============================================================
# Main document parser
# ============================================================

def parse_document(source: str, source_name: str) -> dict[str, Any]:

    source_without_comments = strip_comments(source)

    metadata = parse_metadata(
        source_without_comments
    )

    raw_sections = extract_sections(
        source_without_comments
    )

    sections = []

    for section in raw_sections:

        body = section["body"]
        kind = classify_section(body)

        if kind == "projects":
            items = parse_project_section(body)

        elif kind == "skills":
            items = parse_skill_section(body)

        elif kind == "timeline":
            items = parse_timeline_section(body)

        elif kind == "positions":
            items = parse_positions_section(body)

        else:
            items = parse_generic_section(body)

        sections.append(
            {
                "heading": section["heading"],
                "kind": kind,
                "items": items,
            }
        )

    return {
        "schemaVersion": 1,
        "source": {
            "file": source_name,
        },
        "metadata": metadata,
        "sections": sections,
    }


# ============================================================
# CLI
# ============================================================

def main() -> None:

    parser = argparse.ArgumentParser(
        description="Parse a LaTeX resume into portfolio JSON."
    )

    parser.add_argument(
        "input",
        type=Path,
        help="Input .tex file",
    )

    parser.add_argument(
        "output",
        type=Path,
        help="Output .json file",
    )

    args = parser.parse_args()

    if not args.input.exists():
        raise SystemExit(
            f"Input file does not exist: {args.input}"
        )

    source = args.input.read_text(
        encoding="utf-8"
    )

    result = parse_document(
        source,
        args.input.name,
    )

    args.output.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    args.output.write_text(
        json.dumps(
            result,
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )

    print(
        f"Parsed: {args.input}"
    )

    print(
        f"Generated: {args.output}"
    )

    print(
        f"Sections: {len(result['sections'])}"
    )


if __name__ == "__main__":
    main()