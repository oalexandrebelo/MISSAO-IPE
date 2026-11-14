#!/bin/sh
set -eu
KIT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
if ! command -v node >/dev/null 2>&1; then
  printf '%s\n' 'Node não encontrado. Instale Node 24 ou superior, ou abra COMECE_AQUI.html para usar os arquivos portáteis.'
  exit 1
fi
exec node "$KIT_DIR/ab-mission-ipe/scripts/serve-presentation-kit.mjs"
