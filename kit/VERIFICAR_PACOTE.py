#!/usr/bin/env python3
"""Check packaged bytes against the bundled manifest; no network or dependencies."""
from pathlib import Path
import hashlib
import json
import sys

root = Path(__file__).resolve().parent
manifest = json.loads((root / 'MANIFESTO_SHA256.json').read_text(encoding='utf-8'))
errors = []
for entry in manifest['files']:
    path = root / entry['path']
    if '..' in Path(entry['path']).parts or Path(entry['path']).is_absolute():
        errors.append(f"Caminho inválido no manifesto: {entry['path']}")
        continue
    resolved = path.resolve()
    if not resolved.is_relative_to(root) or any(p.is_symlink() for p in [path, *path.parents] if p != root):
        errors.append(f"Link simbólico ou caminho externo: {entry['path']}")
        continue
    if not path.is_file():
        errors.append(f"Ausente ou tipo não permitido: {entry['path']}")
        continue
    data = path.read_bytes()
    if len(data) != entry['bytes'] or hashlib.sha256(data).hexdigest() != entry['sha256']:
        errors.append(f"Conteúdo diferente: {entry['path']}")
if errors:
    print('\n'.join(errors), file=sys.stderr)
    raise SystemExit(1)
print(f"Integridade conferida: {len(manifest['files'])} arquivos. Não autentica autoria ou elegibilidade.")
