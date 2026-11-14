"""Package source, evidence and local builds; check ZIP CRC and every entry hash."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output/packages"
OUTPUT.mkdir(parents=True, exist_ok=True)
ARCHIVE = OUTPUT / "AB_Missao_Ipe_R4_Projeto_Completo_0.1.1.zip"
MANIFEST = ROOT / "evidence/package-manifest.json"
RECEIPT = OUTPUT / "package-integrity.json"

def included(path):
    parts = path.relative_to(ROOT).parts
    return (path.is_file() and not path.is_symlink()
            and not any(part in {"node_modules", ".git", "__pycache__", ".cache"} for part in parts)
            and not parts[:2] == ("output", "packages")
            and not parts[:3] == ("research", "evidence", "repository-sources")
            and path != MANIFEST)

files = sorted(path for path in ROOT.rglob("*") if included(path))
rows = [{"path": str(path.relative_to(ROOT)), "bytes": path.stat().st_size,
         "sha256": hashlib.sha256(path.read_bytes()).hexdigest()} for path in files]
manifest = {
    "generatedAt": datetime.now(timezone.utc).isoformat(),
    "project": "Missão Ipê — Ciência que chega", "version": "0.1.1",
    "status": "P&D pré-evento; elegibilidade competitiva não estabelecida",
    "manifestSelfExcluded": True, "files": rows,
    "exclusions": ["node_modules", ".git", "__pycache__", ".cache", "symlinks",
                   "output/packages", "research/evidence/repository-sources"],
    "limitations": ["Hashes identify bytes; they do not authenticate authorship or eligibility.",
                    "No real-browser, AB hardware, or participant validation has been completed."],
}
MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
with zipfile.ZipFile(ARCHIVE, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for path in files + [MANIFEST]:
        archive.write(path, "ab-mission-ipe/" + str(path.relative_to(ROOT)))
with zipfile.ZipFile(ARCHIVE) as archive:
    bad = archive.testzip()
    if bad is not None:
        raise RuntimeError(f"CRC failure: {bad}")
    expected = {"ab-mission-ipe/"+row["path"]: row for row in rows}
    if set(archive.namelist()) != set(expected) | {"ab-mission-ipe/evidence/package-manifest.json"}:
        raise RuntimeError("Unexpected archive entry set")
    for name, row in expected.items():
        data = archive.read(name)
        if len(data) != row["bytes"] or hashlib.sha256(data).hexdigest() != row["sha256"]:
            raise RuntimeError(f"Byte/hash mismatch: {name}")
    if archive.read("ab-mission-ipe/evidence/package-manifest.json") != MANIFEST.read_bytes():
        raise RuntimeError("Manifest mismatch")
receipt = {"checkedAt": datetime.now(timezone.utc).isoformat(), "archive": ARCHIVE.name,
           "bytes": ARCHIVE.stat().st_size, "sha256": hashlib.sha256(ARCHIVE.read_bytes()).hexdigest(),
           "entries": len(rows)+1, "sourceBytesExcludingManifest": sum(row["bytes"] for row in rows),
           "crcVerified": True, "everyEntryHashVerified": True,
           "manifestSha256": hashlib.sha256(MANIFEST.read_bytes()).hexdigest()}
RECEIPT.write_text(json.dumps(receipt, ensure_ascii=False, indent=2)+"\n")
print(json.dumps(receipt, ensure_ascii=False))
