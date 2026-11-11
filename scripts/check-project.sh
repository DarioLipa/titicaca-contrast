#!/usr/bin/env bash
set -euo pipefail

echo "Verificando TITICACA CONTRAST..."

cd "$(dirname "$0")/../web"
npm run typecheck
npm run lint
npm run test -- --run
npm run build

cd "../pipeline"
if [ -d ".venv" ]; then
  ./.venv/bin/pytest -q
else
  pytest -q
fi

echo "Verificacion completada con exito."
