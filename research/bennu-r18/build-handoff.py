"""Build six educational records from the seven independently extracted table rows."""
import csv
import hashlib
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent
SOURCE = "https://ntrs.nasa.gov/citations/20205007912"
DATASET = "https://static-content.springer.com/esm/art%3A10.1038%2Fs41550-020-1195-z/MediaObjects/41550_2020_1195_MOESM1_ESM.pdf"
SOURCES = [
    {"file": "originals/DG_Nature_merged_1595501739.pdf", "bytes": 5587870,
     "sha256": "b711f7810c69c9e891c0a33f6b956afaa51280afdd19ffbe73e298f4ab039717",
     "url": "https://ntrs.nasa.gov/api/citations/20205007912/downloads/DG_Nature_merged_1595501739.pdf?attachment=true",
     "role": "NASA NTRS accepted manuscript; Methods pp. 8–9 describe imaging and terrain registration."},
    {"file": "originals/41550_2020_1195_MOESM1_ESM.pdf", "bytes": 11723148,
     "sha256": "4c0f880a9bde432938611cfbfe153f52c4e7c91c832e1c9c72a40323fc823cf7",
     "url": DATASET,
     "role": "Publisher's original supplement linked by NASA NTRS; Table 1, physical PDF page 12, printed page 11."},
]
for source in SOURCES:
    content = (BASE / source["file"]).read_bytes()
    assert len(content) == source["bytes"], source["file"]
    assert hashlib.sha256(content).hexdigest() == source["sha256"], source["file"]

rows = json.loads((BASE / "table1-extracted.json").read_text())
assert [r["site"] for r in rows] == ["1", "2", "3", "4a", "4b", "5", "6"]
assert rows[4]["latitudeDeg"] == rows[4]["longitudeDeg"] == ""
with (BASE / "bennu-table1.csv").open("w", newline="") as file:
    writer = csv.DictWriter(file, fieldnames=list(rows[0]))
    writer.writeheader()
    writer.writerows(rows)

limitations = (
    "Dimensão publicada, não rugosidade, telemetria ao vivo ou descoberta produzida pelo jogo. "
    "Medida em imagens PolyCam registradas sobre terreno OLA. Escala de pixel limita a precisão dos eixos; "
    "não equivale a erro estatístico de 1σ. Coordenadas norte (+Z) positivo e longitude 0–360°; "
    "a tabela não explicita direção leste/oeste. Marcadores num GLB sem registro cartográfico devem ser esquemáticos."
)
records = []
for row in rows:
    if row["site"] == "4b":
        continue
    site = row["site"]
    record = {
        "id": f"bennu-site-{site}",
        "label": f"Sítio {site} · {'clasto' if site == '4a' else 'rocha'}",
        "goal": "Entregar seis registros de dimensões de rochas/clastos observados em Bennu e comparar suas escalas.",
        "value": float(row["longAxisM"]),
        "unit": "m",
        "evidence": {
            "kind": "boulder",
            "sourceTitle": "DellaGiustina et al. · dimensões PolyCam + OLA · Tabela Suplementar 1",
            "sourceUrl": SOURCE,
            "datasetUrl": DATASET,
            "observedAt": "2019 · Orbital A / Detailed Survey; a tabela não fornece um instante por dimensão",
            "sourceRow": f"Supplementary Table 1 · Site {site} · Long axis (m) · PDF p.12 / página impressa 11",
            "quantity": "Eixo maior da rocha/clasto",
            "uncertainty": "Limitada pela escala PolyCam de 5,25 cm/pixel; não declarada como ±1σ",
            "latitudeDeg": float(row["latitudeDeg"]),
            "longitudeDeg": float(row["longitudeDeg"]),
            "limitations": limitations + (
                " O sítio 4 contém os clastos 4a e 4b; este registro representa somente 4a. "
                "O eixo maior de 4b é 0,927 m e sua linha permanece no CSV completo."
                if site == "4a" else ""
            ),
        },
        "dimensions": {"longAxisM": float(row["longAxisM"]), "shortAxisM": float(row["shortAxisM"]), "heightM": float(row["heightM"])},
    }
    records.append(record)
assert len(records) == 6 and len({r["id"] for r in records}) == 6
assert [r["value"] for r in records] == [1.53, 3.93, 2.62, 1.6, 3.221, 1.453]
(BASE / "bennu-handoff.json").write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n")

provenance = {
    "datasetId": "ipe-bennu-dellagiustina-2020-table1-v1",
    "retrievedAtUtc": "2026-11-15",
    "recordUrl": SOURCE,
    "doi": "10.1038/s41550-020-1195-z",
    "citation": "DellaGiustina, D. N., Kaplan, H. H., Simon, A. A., et al. Exogenic basalt on asteroid (101955) Bennu. Nature Astronomy 5, 31–38 (2021); published 21 September 2020.",
    "version": "Original supplementary information linked from NASA NTRS record 20205007912; frozen by SHA256.",
    "sourceChain": "NASA NTRS record → External Source(s) → publisher's original supplement → Supplementary Table 1.",
    "sources": SOURCES,
    "extraction": "Native macOS PDFKit text selection by fixed table-cell rectangles, extract-table.swift; visually cross-checked against rendered page. No graph digitization, pixel measurement or statistical fitting.",
    "selection": "Six unique objects, one at each numbered site: 1, 2, 3, 4a, 5, 6. Complete table has seven rows because site 4 has clasts 4a and 4b. The omitted game record 4b remains in table1-extracted.json and bennu-table1.csv. No averaging or duplicated measurements.",
    "time": "Morphology images listed in manuscript Methods span 27 February–28 March 2019; no per-dimension acquisition timestamp is assigned by the table. OLA terrain is also involved. Publication time is not observation time.",
    "quantity": "Long axis, short axis and height in metres; latitude and longitude in degrees. Volume columns copied for audit only, not promoted to independent measured telemetry.",
    "uncertainty": {"axisPixelScaleM": 0.0525, "heightEstimatedPrecisionM": 0.01, "interpretation": "Table caption says axis uncertainty is limited by pixel scale and height uncertainty estimated from OLA vertical precision. Do not label either as a provided confidence interval or standard deviation."},
    "quality": "Published measurements using PolyCam images registered to OLA terrain. The paper identifies saturation/icicle calibration concerns for reflectance; this handoff does not extract reflectance or assign independent raw-data QA flags. No numeric PDS quality flags are present in Table 1.",
    "scientificInterpretation": "Observed bright pyroxene-bearing material has spectra similar to HED meteorites. A Vesta-family origin is the authors' supported interpretation; the delivery path through Bennu's parent is a hypothesis. Size alone or this six-value exercise cannot establish mineral composition or provenance.",
    "threeDimensionalUse": "Render six labelled dimension proxies / scale bars and optionally a schematic coordinate globe. Do not claim measured rock shape, mapped alignment to the bundled Bennu GLB, or safe landing areas. No GLB body frame registration was verified.",
    "rights": "Numerical facts and original handoff prose may be published with citation. Downloaded full papers/text/raster reading aids are gitignored: NTRS explicitly cautions that portions may be copyrighted. Sources remain available through their original NASA/publisher links.",
    "contextImage": {
        "file": "bennu-vesta-nasa-context.png",
        "url": "https://www.nasa.gov/wp-content/uploads/2020/07/orex_vesta_press_release_graphic.png?resize=768,383",
        "articleUrl": "https://www.nasa.gov/solar-system/nasas-osiris-rex-to-asteroid-bennu-youve-got-a-little-vesta-on-you/",
        "credit": "NASA/Goddard/University of Arizona",
        "bytes": 258664,
        "sha256": "899041d3abef7a88d8a779823451a93a6b4914d0655df28a4e44fca4bd4b18cb",
        "dimensionsPx": [768, 383],
        "transformation": "None locally; official 768×383 rendition supplied in NASA article srcset.",
        "use": "Two contextual views of bright rocks/clasts, not six individual record images; not a georeferenced map or a source for measuring values. Preserve NASA attribution and link.",
    },
    "pdsAttempt": "OCAMS calibrated collection urn:nasa:pds:orex.ocams:data_calibrated::13.0 / DOI 10.26033/asca-b202 verified; direct XML/FITS retrieval returned a Cloudflare challenge (403). No challenge bypass was attempted; none of these game records is claimed to be a locally reprocessed raw PDS image.",
}
context_image = (BASE / provenance["contextImage"]["file"]).read_bytes()
assert len(context_image) == provenance["contextImage"]["bytes"]
assert hashlib.sha256(context_image).hexdigest() == provenance["contextImage"]["sha256"]
for filename in ["bennu-table1.csv", "table1-extracted.json", "bennu-handoff.json"]:
    content = (BASE / filename).read_bytes()
    provenance.setdefault("derivedFiles", []).append({"file": filename, "bytes": len(content), "sha256": hashlib.sha256(content).hexdigest()})
(BASE / "provenance.json").write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + "\n")
print("Verified both original SHA256; extracted 7 table rows; generated 6 unique game records.")
