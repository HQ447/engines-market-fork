import os
import re
from pathlib import Path

ROOT = Path("public")
ROBOTS_TAG = '<meta name="robots" content="index, follow" />'
robots_re = re.compile(r'<meta\s+[^>]*name=["\']robots["\']', re.I)

missing = []
updated = []

for path in ROOT.rglob("*.html"):
    text = path.read_text(encoding="utf-8", errors="ignore")
    if robots_re.search(text):
        continue
    missing.append(path)

    # Insert after charset/viewport/description/canonical block — prefer after first <meta name="description"...> or after <title>
    insert = ROBOTS_TAG + "\n"
    new_text = None

    desc = re.search(r'(<meta\s+name=["\']description["\'][^>]*>\s*)', text, re.I)
    if desc:
        new_text = text[: desc.end()] + "\n    " + ROBOTS_TAG + text[desc.end() :]
    else:
        title = re.search(r"(</title>\s*)", text, re.I)
        if title:
            new_text = text[: title.end()] + "\n    " + ROBOTS_TAG + text[title.end() :]
        else:
            head = re.search(r"(<head[^>]*>\s*)", text, re.I)
            if head:
                new_text = text[: head.end()] + "\n    " + ROBOTS_TAG + text[head.end() :]

    if new_text and new_text != text:
        path.write_text(new_text, encoding="utf-8", newline="\n")
        updated.append(str(path).replace("\\", "/"))

print(f"missing_before={len(missing)}")
print(f"updated={len(updated)}")
legal = [p for p in updated if "/legal/" in p or "\\legal\\" in p.replace("/", "\\")]
print("legal_updated:")
for p in updated:
    if "legal" in p:
        print(p)
