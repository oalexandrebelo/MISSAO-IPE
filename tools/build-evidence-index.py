#!/usr/bin/env python3
"""Index local evidence and cited URLs. This does not revalidate a remote source."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / 'evidence'
EVIDENCE.mkdir(exist_ok=True)
references = {}
documents = [ROOT/'README.md', ROOT/'NOTICE.md']
documents += sorted((ROOT/'docs').glob('*.md'))
documents += sorted((ROOT/'research').glob('*.md'))
for path in documents:
    for number, line in enumerate(path.read_text().splitlines(), 1):
        for url in re.findall(r'https?://[^\s<>\]\)]+', line):
            url = url.rstrip('.,;`')
            references.setdefault(url, []).append({'document':str(path.relative_to(ROOT)), 'line':number})
index = {'generatedAt':datetime.now(timezone.utc).isoformat(),
    'method':'Index of references present in the reports; retrieval success, publisher and limits remain in the corresponding report. Inclusion is not a new verification of availability or truth.',
    'count':len(references), 'sources':[{'url':url,'occurrences':occurrences} for url,occurrences in sorted(references.items())]}
(EVIDENCE/'source-index.json').write_text(json.dumps(index,ensure_ascii=False,indent=2)+'\n')

links = [
 ('SCI-01','PRD-06','QA and complete unique records','src/core/science.ts',['tests/engine.test.mts','tests/adversarial.test.mts'],['public/data/mod13q1-research-pack.json','research/01-regras-ciencia.md'],'NODE_VERIFIED'),
 ('SCI-02','PRD-06','Equivalent NDVI objective for both representations','src/core/science.ts',['tests/engine.test.mts','tests/adversarial.test.mts'],['scripts/verify-science-data.mjs'],'NODE_VERIFIED'),
 ('ENG-01','PRD-05','Energy and bit conservation','src/core/engine.ts',['tests/engine.test.mts','tests/adversarial.test.mts'],['specs/IMPLEMENTATION-CONTRACT.md'],'NODE_VERIFIED'),
 ('ENG-02','PRD-05','Instantaneous discharge limit differs from energy capacity','src/core/power.ts',['tests/engine.test.mts','tests/adversarial.test.mts'],['specs/IMPLEMENTATION-CONTRACT.md'],'NODE_VERIFIED'),
 ('SRCH-01','PRD-08','Complete enumeration and bounded minimum','src/core/search.ts',['tests/engine.test.mts','tests/adversarial.test.mts'],['evidence/catalog-enumeration.json'],'NODE_VERIFIED'),
 ('EXP-01','PRD-07','Presentation uses computed events and values','src/ui/MissionControl.tsx',['tests-ui/flows.test.mjs'],['research/05-interface.md'],'IMPLEMENTED_DOM_PARTIAL_BROWSER_PENDING'),
 ('DATA-01','PRD-14','Archive dates distinct from simulated time','src/data/science-data.ts',['tests/engine.test.mts'],['scripts/verify-science-data.mjs','public/data/mod13q1-A-raw.json'],'DATA_VERIFIED_PRESENTATION_BROWSER_PENDING'),
 ('PST-01','PRD-10','Commit acknowledgement and revision CAS','src/persistence/store.ts',['tests/persistence.test.mts'],['research/06-persistencia.md'],'FAKE_INDEXEDDB_VERIFIED_BROWSER_PENDING'),
 ('PST-02','PRD-11','Strict import and recomputation','src/persistence/replay.ts',['tests/replay.test.mts','tests/adversarial.test.mts'],['research/06-persistencia.md'],'NODE_VERIFIED'),
 ('UX-01','PRD-04/09','Prediction before own attempt and restricted help','src/App.tsx',['tests-ui/flows.test.mjs'],['docs/02-PRD.md'],'DOM_VERIFIED_HUMAN_LEARNING_PENDING'),
 ('OFF-01','PRD-12','No mandatory external runtime service','scripts/build-portable.mjs',['scripts/test-ui.mjs'],['evidence/portable-build.json'],'STATIC_AND_DOM_VERIFIED_COLD_BROWSER_PENDING'),
 ('ASYNC-01','PRD-15','Cancel stale work and validate replies','src/workers/client.ts',['tests/adversarial.test.mts','tests-ui/flows.test.mjs'],['research/07-revisao-independente.md'],'NODE_AND_DOM_VERIFIED_BROWSER_PENDING'),
]
trace = {'generatedAt':datetime.now(timezone.utc).isoformat(),'engineVersion':'0.1.1-rd','catalogVersion':'ipe-64-v1',
    'limit':'Mappings identify tests and receipts; a mapping is not an additional test run or proof of educational efficacy.',
    'requirements':[dict(zip(['requirementId','productRequirement','claim','implementation','tests','references','status'],row)) for row in links]}
for item in trace['requirements']:
    paths=[item['implementation'],*item['tests'],*item['references']]
    item['artifacts']=[{'path':p,'exists':(ROOT/p).is_file(),
       'sha256':hashlib.sha256((ROOT/p).read_bytes()).hexdigest() if (ROOT/p).is_file() else None} for p in paths]
(ROOT/'specs/traceability.json').write_text(json.dumps(trace,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'sources':len(references),'requirements':len(links),'missingArtifacts':sum(not a['exists'] for r in trace['requirements'] for a in r['artifacts'])}))
