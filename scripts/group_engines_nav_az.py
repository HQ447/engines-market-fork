import json
import re
from pathlib import Path

src = json.loads(Path("data/nav/engines.json").read_text(encoding="utf-8"))
links = []
for group in src.get("groups", []):
    links.extend(group.get("links", []))

# Deduplicate by href
seen = set()
unique = []
for link in links:
    href = link.get("href", "")
    if href in seen:
        continue
    seen.add(href)
    unique.append(link)

unique.sort(key=lambda item: (item.get("label", "").lower(), item.get("href", "")))

by_letter: dict[str, list] = {}
for link in unique:
    label = (link.get("label") or "").strip()
    first = label[:1].upper() if label else "#"
    if not re.match(r"[A-Z]", first):
        first = "#"
    by_letter.setdefault(first, []).append(link)

letters = sorted(by_letter.keys(), key=lambda letter: (letter == "#", letter))
groups = [{"title": letter, "links": by_letter[letter]} for letter in letters]

Path("data/nav/engines.json").write_text(
    json.dumps({"groups": groups}, indent=2, ensure_ascii=False) + "\n",
    encoding="utf-8",
)
print("letters", letters)
print("total", len(unique))
print("per", {letter: len(by_letter[letter]) for letter in letters})
