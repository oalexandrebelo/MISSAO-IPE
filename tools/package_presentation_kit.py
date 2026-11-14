"""Freeze a complete local presentation kit, preserving the R4 game artifacts."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'output/packages'
ARCHIVE = OUTPUT / 'AB_Missao_Ipe_R5_Apresentacao_Completa.zip'
MANIFEST = OUTPUT / 'MANIFESTO_SHA256.json'
RECEIPT = OUTPUT / 'r5-package-integrity.json'
ENTRY_FILES = ['COMECE_AQUI.html','LEIA_PRIMEIRO.md','INICIAR_MAC_LINUX.command','INICIAR_WINDOWS.cmd','VERIFICAR_PACOTE.py','AI-USAGE.md']
EXCLUSIONS = {'node_modules','.git','__pycache__','.cache','.DS_Store'}

def include(path):
    parts = path.relative_to(ROOT).parts
    return (path.is_file() and not path.is_symlink()
            and not any(part in EXCLUSIONS or part.startswith('.env') for part in parts)
            and parts[:2] != ('output','packages')
            and parts[:3] != ('research','evidence','repository-sources'))

def digest(data): return hashlib.sha256(data).hexdigest()

OUTPUT.mkdir(parents=True, exist_ok=True)
required = ['presentation/Missao_Ipe_Apresentacao.html','presentation/README_APRESENTADOR.md','presentation/ROTEIRO_PT_EN.md','presentation/PITCH_EN_7_SLIDES.md','evidence/presentation-qa.json','evidence/presentation-kit-http-qa.json','evidence/presentation-release-r5.json']
for name in required:
    if not (ROOT/name).is_file(): raise RuntimeError('Missing release prerequisite: '+name)

baseline = json.loads((ROOT/'evidence/game-baseline-r5.json').read_text())
for row in baseline['files']:
    data=(ROOT/row['path']).read_bytes()
    if len(data)!=row['bytes'] or digest(data)!=row['sha256']:
        raise RuntimeError('Previously frozen game changed: '+row['path'])
qa=json.loads((ROOT/'evidence/presentation-kit-http-qa.json').read_text())
if qa['failed'] != 0: raise RuntimeError('HTTP checks have failures')
for row in qa['verifiedFiles']:
    data=(ROOT/row['path']).read_bytes()
    if len(data)!=row['bytes'] or digest(data)!=row['sha256']:
        raise RuntimeError('HTTP-checked file changed: '+row['path'])
dom_qa=json.loads((ROOT/'evidence/presentation-qa.json').read_text())
if dom_qa['checksFailed'] != 0: raise RuntimeError('Presentation DOM checks have failures')
artifact=dom_qa['observations']['artifact']
data=(ROOT/artifact['path']).read_bytes()
if len(data)!=artifact['bytes'] or digest(data)!=artifact['sha256']:
    raise RuntimeError('Presentation changed after DOM QA')
harness=dom_qa['harness']
data=(ROOT/harness['path']).read_bytes()
if len(data)!=harness['bytes'] or digest(data)!=harness['sha256']:
    raise RuntimeError('Presentation test harness changed after QA')

paths={name:ROOT/'kit'/name for name in ENTRY_FILES}
paths.update({'ab-mission-ipe/'+p.relative_to(ROOT).as_posix():p for p in sorted(ROOT.rglob('*')) if include(p)})
rows=[{'path':name,'bytes':p.stat().st_size,'sha256':digest(p.read_bytes())} for name,p in sorted(paths.items())]
manifest={'generatedAt':datetime.now(timezone.utc).isoformat(),'release':'R5 presentation kit','gameVersion':'0.1.1','engineVersion':'0.1.1-rd','status':'P&D pré-evento; elegibilidade competitiva não estabelecida','manifestSelfExcluded':True,'gameUnchangedFiles':len(baseline['files']),'files':rows,'exclusions':['node_modules','.git','__pycache__','.cache','symlinks','environment secrets','output/packages','research/evidence/repository-sources'],'limitations':['Hashes identify bytes; they do not authenticate authorship, eligibility or scientific validity.','No actual browser, AB hardware, pedagogical study or global-submission acceptance is certified.']}
MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
with zipfile.ZipFile(ARCHIVE,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
    for name,p in sorted(paths.items()): archive.write(p,name)
    archive.write(MANIFEST,'MANIFESTO_SHA256.json')
with zipfile.ZipFile(ARCHIVE) as archive:
    bad=archive.testzip()
    if bad: raise RuntimeError('CRC failure: '+bad)
    if len(archive.namelist())!=len(set(archive.namelist())): raise RuntimeError('Duplicate ZIP entries')
    if set(archive.namelist()) != set(paths)|{'MANIFESTO_SHA256.json'}: raise RuntimeError('Unexpected archive entries')
    for row in rows:
        data=archive.read(row['path'])
        if len(data)!=row['bytes'] or digest(data)!=row['sha256']: raise RuntimeError('Hash mismatch: '+row['path'])
    if archive.read('MANIFESTO_SHA256.json') != MANIFEST.read_bytes(): raise RuntimeError('Manifest mismatch')
receipt={'checkedAt':datetime.now(timezone.utc).isoformat(),'archive':ARCHIVE.name,'bytes':ARCHIVE.stat().st_size,'sha256':digest(ARCHIVE.read_bytes()),'entries':len(rows)+1,'manifestedFiles':len(rows),'sourceBytesExcludingManifest':sum(r['bytes'] for r in rows),'crcVerified':True,'everyEntryHashVerified':True,'gameUnchangedFiles':len(baseline['files']),'manifestSha256':digest(MANIFEST.read_bytes())}
RECEIPT.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(receipt,ensure_ascii=False))
