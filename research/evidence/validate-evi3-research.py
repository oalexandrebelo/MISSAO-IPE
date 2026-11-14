#!/usr/bin/env python3
"""Independent arithmetic on existing archived MOD13Q1 JSON; no game implementation."""
from datetime import datetime, timezone
from fractions import Fraction
from hashlib import sha256
import json
from pathlib import Path
import argparse

ROOT = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser(description='Recheck six archived EVI3 values without changing the original research receipt.')
parser.add_argument('--out', type=Path, help='Optional path for a NEW receipt; existing files are never overwritten.')
args = parser.parse_args()
SOURCE = ROOT / 'public' / 'data'
DEST = args.out.resolve() if args.out else None
rows, inputs = [], []
for point in 'ABC':
    path = SOURCE / f'mod13q1-{point}-raw.json'
    raw = path.read_bytes()
    inputs.append({'path': str(path.relative_to(ROOT)), 'bytes': len(raw), 'sha256': sha256(raw).hexdigest()})
    data = json.loads(raw)
    for composite in ('A2024241', 'A2024257'):
        bands = {entry['band'].removeprefix('250m_16_days_'): entry['data'][0]
                 for entry in data['subset'] if entry['modis_date'] == composite}
        values = [bands[name] for name in ('red_reflectance', 'NIR_reflectance', 'blue_reflectance')]
        assert all(type(value) is int and 0 <= value <= 10000 for value in values)
        red, nir, blue = (Fraction(value, 10000) for value in values)
        denominator = nir + 6 * red - Fraction(15, 2) * blue + 1
        assert denominator > 0
        evi3 = Fraction(5, 2) * (nir-red) / denominator
        published = Fraction(bands['EVI'], 10000)
        evi2 = Fraction(5, 2) * (nir-red) / (nir + Fraction(12, 5)*red + 1)
        delta = abs(evi3-published)
        assert bands['VI_Quality'] == 2116 and bands['pixel_reliability'] == 0
        assert blue < Fraction(1, 10)
        assert delta < Fraction(1, 10000)
        rows.append({
            'id': f'{point}-{composite}', 'redInteger': values[0], 'nirInteger': values[1],
            'blueInteger': values[2], 'reflectanceScale': 0.0001,
            'eviPublished': float(published), 'evi3Recalculated': float(evi3),
            'evi3ExactFraction': str(evi3), 'absoluteDifference': float(delta),
            'denominator': float(denominator), 'evi2RecalculatedForDistinctionOnly': float(evi2),
            'viQuality': bands['VI_Quality'], 'pixelReliability': bands['pixel_reliability'],
            'modisDate': composite, 'pixelDayOfYear': bands['composite_day_of_the_year'],
        })
result = {
    'status': 'RESEARCH_ONLY_P1_NOT_GAME_CONTRACT',
    'calculatedAt': datetime.now(timezone.utc).isoformat(),
    'sourceDocument': 'https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf',
    'sourceEquation': 'Equation 2, printed p.3 / PDF p.6, G=2.5 C1=6 C2=7.5 L=1',
    'product': 'MOD13Q1.061', 'productDoi': '10.5067/MODIS/MOD13Q1.061',
    'formula': '2.5 * (NIR - RED) / (NIR + 6*RED - 7.5*BLUE + 1)',
    'method': 'Exact rational arithmetic on previously retrieved integer bands scaled by 1/10000',
    'inputs': inputs, 'records': rows, 'count': len(rows),
    'maximumAbsoluteDifference': max(row['absoluteDifference'] for row in rows),
    'sampleComparisonThreshold': 0.0001,
    'limits': [
        'This checks six archived records, not the entire MODIS production algorithm.',
        'Comparison threshold is for this sample, not a universal product accuracy claim.',
        'A physical-band representation must explicitly include BLUE before it supports EVI3.',
        'NDVI-only telemetry does not contain enough information to reconstruct EVI3.',
        'This is neither a game result nor evidence of learning or resource-list eligibility.',
        'The primary NDVI objective and fixed-objective redesign contract remain unchanged.',
        'No game code, public submission, publication, or outside communication was performed by this research script.',
    ],
}
encoded = json.dumps(result, indent=2, ensure_ascii=False)+'\n'
if DEST is not None:
    DEST.parent.mkdir(parents=True, exist_ok=True)
    with DEST.open('x', encoding='utf-8') as output:
        output.write(encoded)
    print(json.dumps({'path': str(DEST), 'records': len(rows),
                     'maximumAbsoluteDifference': result['maximumAbsoluteDifference'],
                     'calculatedAt': result['calculatedAt']}, ensure_ascii=False))
else:
    print(encoded, end='')
