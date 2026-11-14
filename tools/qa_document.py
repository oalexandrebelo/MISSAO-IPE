"""Render documentary QA evidence. Visual approval is a separate observation."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import subprocess

import pdfplumber
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "output/pdf/AB_Missao_Ipe_Dossie_Implementacao.pdf"
TMP = ROOT.parent / "tmp/ipe-r4-render"
PAGES = TMP / "pages-final"
PAGES.mkdir(parents=True, exist_ok=True)
checks = []
with pdfplumber.open(PDF) as document:
    for number, page in enumerate(document.pages, 1):
        outside = [
            char for char in page.chars
            if char["x0"] < -.5 or char["x1"] > page.width + .5
            or char["top"] < -.5 or char["bottom"] > page.height + .5
        ]
        checks.append({"page": number, "characters": len(page.chars),
                       "outOfPageCharacters": len(outside), "images": len(page.images)})
receipt = {
    "checkedAt": datetime.now(timezone.utc).isoformat(),
    "pdfSha256": hashlib.sha256(PDF.read_bytes()).hexdigest(),
    "pages": len(checks),
    "outOfPageCharacters": sum(row["outOfPageCharacters"] for row in checks),
    "blankPages": [row["page"] for row in checks if not row["characters"] and not row["images"]],
    "pageChecks": checks,
    "scope": "Automatic geometry only; rendered contacts and samples require separate visual inspection.",
}
(ROOT / "evidence/pdf-geometry-check.json").write_text(
    json.dumps(receipt, ensure_ascii=False, indent=2) + "\n"
)
subprocess.run(["pdftoppm", "-r", "45", "-png", str(PDF), str(PAGES / "page")],
               check=True, capture_output=True)
paths = sorted(PAGES.glob("page-*.png"))
if len(paths) != len(checks):
    raise RuntimeError("Page count mismatch: remove obsolete temporary renders before rerunning.")
for offset in range(0, len(paths), 24):
    sheet = Image.new("RGB", (1000, 1776), "#d8ded9")
    draw = ImageDraw.Draw(sheet)
    for local, path in enumerate(paths[offset:offset+24]):
        image = Image.open(path).convert("RGB")
        image.thumbnail((224, 267))
        x, y = (local % 4) * 250, (local // 4) * 296
        draw.text((x+12, y+5), path.stem, fill="#17352f")
        sheet.paste(image, (x+(250-image.width)//2, y+23))
    sheet.save(TMP / f"contact-final-{offset//24+1}.png")
for number in (1, 5, 16, 17, 21, 47, 48, 52, 61, 74, 75, 96, len(checks)):
    subprocess.run(["pdftoppm", "-f", str(number), "-l", str(number), "-r", "110", "-png",
                    "-singlefile", str(PDF), str(TMP / f"sample-final-{number}")],
                   check=True, capture_output=True)
print(json.dumps({key: value for key, value in receipt.items() if key != "pageChecks"}, ensure_ascii=False))
