from pathlib import Path

fixed = 0
for path in Path("public").rglob("*.html"):
    text = path.read_text(encoding="utf-8", errors="ignore")
    new = text.replace(
        'content="index, follow" /><link',
        'content="index, follow" />\n    <link',
    )
    if new != text:
        path.write_text(new, encoding="utf-8")
        fixed += 1

print(f"fixed={fixed}")
