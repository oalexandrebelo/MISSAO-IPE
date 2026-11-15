#!/usr/bin/env python3
"""Rebuild the six-bin teaching subset from unmodified NASA/author source files.

Only Python's standard library is needed. Run from any working directory.
"""
import csv
import hashlib
import json
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'WASP_39_b_3.11466_4988_2.tbl'
AUTHOR = ROOT / 'FIREFLY_REDUCTION.txt'
EXPECTED_HASHES = {
    SOURCE.name: '49a41e9eacaec33457b5c5d249bb9803da1ab0a07ea99fa2b4b5a8d0e24de687',
    AUTHOR.name: '83e5e45d5867f1abe6a8776469d4284daf2630f66b7f67736453d912a6bfdd27',
}
for name, expected in EXPECTED_HASHES.items():
    assert hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == expected, name

# IPAC metadata starts with backslash; four header rows start with pipe.
# The first five columns are numeric and precede all text columns.
rows = []
for line_number, line in enumerate(SOURCE.read_text().splitlines(), 1):
    if not line or line.startswith(('\\', '|')):
        continue
    wavelength, bandwidth, depth, plus, minus = map(Decimal, line.split()[:5])
    assert plus > 0 and minus == -plus
    rows.append((line_number, wavelength, bandwidth, depth, plus))

with AUTHOR.open() as stream:
    author_rows = list(csv.DictReader(stream, delimiter=' '))
assert len(rows) == len(author_rows) == 95
assert all(rows[i][1] < rows[i+1][1] for i in range(len(rows)-1))

# Verify every archive row against the original author's fraction-valued file.
# The NASA table prints numerical fields to five decimals; uncertainty is a
# percentage-point difference, not a percentage of the transit depth itself.
# Allow one last displayed digit: archive ingestion/formatting is not always
# identical to rounding the full-precision author's file in a single step.
last_decimal = Decimal('0.00001')
for archive, author in zip(rows, author_rows):
    for nasa_value, original in (
        (archive[1], Decimal(author['wv_center'])),
        (archive[2], Decimal(author['wv_wdth'])),
        (archive[3], Decimal(author['transit_depth']) * 100),
        (archive[4], Decimal(author['tran_unc']) * 100),
    ):
        assert abs(nasa_value - original) <= last_decimal

# Explicit teaching anchors sample either side and within the published CO2
# feature. Nearest-bin selection does not average, interpolate or fit a model.
anchors = tuple(map(Decimal, ('3.6', '3.9', '4.2', '4.3', '4.5', '4.9')))
indices = [min(range(len(rows)), key=lambda i: abs(rows[i][1] - a)) for a in anchors]
assert [i+1 for i in indices] == [25, 39, 54, 58, 65, 80]

dataset_url = 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/atmospheres/nph-firefly?atmospheres=&planet=WASP-39%20b'
goal = 'Entregar seis bins reais do espectro de WASP-39 b e comparar a profundidade do trânsito com suas incertezas.'
limitations = ('Recorte de seis dos 95 bins da redução FIREFLy de um único trânsito; '
               'não são seis exposições. Incertezas publicadas de 1σ; o recorte não fornece '
               'covariância entre bins. Não permite refazer a detecção de CO₂, estimar '
               'abundâncias ou concluir presença de vida. Operação e telemetria do jogo são didáticas.')
records = []
for index in indices:
    line, wavelength, bandwidth, depth, error = rows[index]
    records.append({
        'id': f'webb-firefly-row-{index+1}',
        'label': f'WASP-39 b · {wavelength} µm',
        'goal': goal,
        'value': float(depth),
        'unit': '% de luz bloqueada',
        'evidence': {
            'kind': 'spectrum',
            'sourceTitle': 'NASA Exoplanet Archive · JWST/NIRSpec PRISM · FIREFLy',
            'sourceUrl': dataset_url,
            'datasetUrl': 'https://doi.org/10.5281/zenodo.6959427',
            'observedAt': '2022-07-10',
            'sourceRow': index+1,
            'quantity': 'Profundidade do trânsito (Rp/R★)² × 100',
            'uncertainty': float(error),
            'wavelengthMicrometers': float(wavelength),
            'limitations': limitations,
        },
        'archiveFileLine': line,
        'authorFileLine': index+2,
        'binWidthMicrometers': float(bandwidth),
        'uncertaintyUnit': 'pontos percentuais (1σ)',
        'authorOriginal': author_rows[index],
    })

output = {
    'version': 'webb-nirspec-prism-firefly-r18-v1',
    'sourceFile': SOURCE.name,
    'sourceSha256': EXPECTED_HASHES[SOURCE.name],
    'totalSourceRows': len(rows),
    'selection': {'method': 'nearest existing wavelength bin', 'anchorsMicrometers': list(map(float, anchors)), 'oneBasedDataRows': [i+1 for i in indices]},
    'records': records,
}
(ROOT / 'webb-spectrum-subset.json').write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
print(f'PASS: hashes, 95 cross-checked NASA/author rows, 6 unique bins; wrote {ROOT / "webb-spectrum-subset.json"}')
