"""Safely replace Engines Market's old legal company details.

The script deliberately does not touch contact phone numbers. It updates only
the old legal company name, registered address, and company registration
number in the source/static output layers. Run without ``--apply`` first to
review the dry-run report.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

OLD_NAME = "Engine Finders UK Ltd"
NEW_NAME = "PRESTIGE AUTO ENGINEERING LTD"
OLD_COMPANY_NUMBER = "13157944"
NEW_COMPANY_NUMBER = "17406830"

NEW_FULL_ADDRESS = (
    "Unit A5 Windsor Road Commercial Estate, Ramsden Heath, Billericay, "
    "United Kingdom, CM11 1QE"
)
NEW_STREET_ADDRESS = "Unit A5 Windsor Road Commercial Estate, Ramsden Heath"
NEW_ADDRESS_LOCALITY = "Billericay"
NEW_POSTCODE = "CM11 1QE"

OLD_PHONE_PATTERNS = (
    re.compile(r"020\s+3488\s+4649"),
    re.compile(r"\+44[- ]?20[- ]?3488[- ]?4649"),
    re.compile(r"442034884649"),
    re.compile(r"0333\s+000\s+0044"),
    re.compile(r"03330000044"),
)

TEXT_SUFFIXES = {
    ".css",
    ".html",
    ".js",
    ".json",
    ".md",
    ".mjs",
    ".py",
    ".ts",
    ".tsx",
    ".txt",
    ".xml",
}

SOURCE_ROOTS = (
    ROOT / "app",
    ROOT / "artifacts",
    ROOT / "components",
    ROOT / "content",
    ROOT / "data" / "static-pages",
    ROOT / "docs",
    ROOT / "lib",
    ROOT / "public",
    ROOT / "reports",
    ROOT / "scripts",
)

GENERATED_ROOT = ROOT / "data" / "static-pages-dynamic"


def iter_files(include_generated: bool = False):
    roots = (*SOURCE_ROOTS, GENERATED_ROOT) if include_generated else SOURCE_ROOTS
    seen: set[Path] = set()
    updater_path = Path(__file__).resolve()

    for root in roots:
        if not root.exists():
            continue
        for path in root.rglob("*"):
            if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES:
                continue
            resolved = path.resolve()
            if resolved == updater_path:
                continue
            if resolved in seen:
                continue
            seen.add(resolved)
            yield path


def read_text(path: Path) -> str:
    with path.open("r", encoding="utf-8", newline="") as handle:
        return handle.read()


def write_text(path: Path, text: str) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        handle.write(text)


def replace_address(text: str) -> str:
    # Preserve HTML line-break formatting used by the Data Handling Policy.
    text = re.sub(
        r"113\s+Park\s+Road\s*<br\s*/?>\s*Ilford,\s*IG1\s*[13]SQ\s*<br\s*/?>",
        "Unit A5 Windsor Road Commercial Estate<br /> Ramsden Heath, Billericay, CM11 1QE<br />",
        text,
        flags=re.IGNORECASE,
    )

    # Replace complete plain-text address variants, including the mockup's
    # historical IG1 3SQ typo.
    text = re.sub(
        r"113\s+Park\s+Road\s*,?\s+Ilford\s*,?\s+IG1\s*[13]SQ(?:\s*,?\s+United Kingdom)?",
        NEW_FULL_ADDRESS,
        text,
        flags=re.IGNORECASE,
    )

    # Update structured PostalAddress fields only in files that contain the
    # old address marker. This avoids changing unrelated example addresses.
    if re.search(r"113\s+Park\s+Road|IG1\s*[13]SQ", text, flags=re.IGNORECASE):
        text = text.replace(
            '"streetAddress": "113 Park Road"',
            f'"streetAddress": "{NEW_STREET_ADDRESS}"',
        )
        text = text.replace(
            '"addressLocality": "Ilford"',
            f'"addressLocality": "{NEW_ADDRESS_LOCALITY}"',
        )
        text = text.replace(
            '"postalCode": "IG1 1SQ"',
            f'"postalCode": "{NEW_POSTCODE}"',
        )
        text = text.replace(
            '"postalCode": "IG1 3SQ"',
            f'"postalCode": "{NEW_POSTCODE}"',
        )

    return text


def rewrite(text: str) -> str:
    text = replace_address(text)
    text = text.replace(OLD_NAME, NEW_NAME)
    text = text.replace(OLD_COMPANY_NUMBER, NEW_COMPANY_NUMBER)
    return text


def contains_old_legal_value(text: str) -> bool:
    return any(
        value in text
        for value in (
            OLD_NAME,
            OLD_COMPANY_NUMBER,
            "113 Park Road",
            "IG1 1SQ",
            "IG1 3SQ",
        )
    )


def count_phone_matches(text: str) -> int:
    return sum(len(pattern.findall(text)) for pattern in OLD_PHONE_PATTERNS)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--apply",
        action="store_true",
        help="write the approved legal-detail replacements; default is dry-run",
    )
    parser.add_argument(
        "--verify",
        action="store_true",
        help="scan generated data too; use after rebuilding static-pages-dynamic",
    )
    args = parser.parse_args()

    changed: list[tuple[Path, int]] = []
    legal_matches_before = 0
    phone_matches_before = 0

    for path in iter_files(include_generated=args.verify):
        try:
            before = read_text(path)
        except UnicodeDecodeError:
            continue

        if not contains_old_legal_value(before):
            phone_matches_before += count_phone_matches(before)
            continue

        legal_matches_before += sum(
            before.count(value)
            for value in (OLD_NAME, OLD_COMPANY_NUMBER, "113 Park Road", "IG1 1SQ", "IG1 3SQ")
        )
        phone_matches_before += count_phone_matches(before)
        after = rewrite(before)
        if after == before:
            continue

        changed.append((path, before.count(OLD_NAME) + before.count(OLD_COMPANY_NUMBER)))
        if args.apply and not args.verify:
            write_text(path, after)

    mode = "APPLY" if args.apply and not args.verify else "DRY-RUN"
    print(f"mode={mode}")
    print(f"legal_matches_before={legal_matches_before}")
    print(f"files_to_update={len(changed)}")
    print(f"phone_matches_seen={phone_matches_before}")
    for path, count in changed:
        print(f"  {path.relative_to(ROOT)} legal_name_or_number_matches={count}")

    if args.verify:
        remaining: list[Path] = []
        for path in iter_files(include_generated=True):
            try:
                text = read_text(path)
            except UnicodeDecodeError:
                continue
            if contains_old_legal_value(text):
                remaining.append(path)
        print(f"remaining_old_legal_files={len(remaining)}")
        for path in remaining:
            print(f"  {path.relative_to(ROOT)}")
        return 1 if remaining else 0

    if args.apply:
        print("Contact phone numbers were not modified.")
    else:
        print("No files changed. Re-run with --apply to write these replacements.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
