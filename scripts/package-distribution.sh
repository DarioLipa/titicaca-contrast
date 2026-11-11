#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ZIP_PATH="${REPO_ROOT}/titicaca-contrast-release.zip"

rm -f "${ZIP_PATH}"

TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TEMP_DIR}"' EXIT

ITEMS=(
    "README.md"
    "LICENSE"
    ".editorconfig"
    ".gitignore"
    "docs"
    "scripts"
    ".github"
    "web/src"
    "web/public"
    "web/index.html"
    "web/package.json"
    "web/package-lock.json"
    "web/tsconfig.json"
    "web/tsconfig.node.json"
    "web/vite.config.ts"
    "pipeline/src"
    "pipeline/tests"
    "pipeline/config"
    "pipeline/pyproject.toml"
    "pipeline/requirements-lock.txt"
)

for item in "${ITEMS[@]}"; do
    SRC="${REPO_ROOT}/${item}"
    DEST="${TEMP_DIR}/${item}"
    if [ -e "${SRC}" ]; then
        mkdir -p "$(dirname "${DEST}")"
        cp -r "${SRC}" "${DEST}"
    fi
done

find "${TEMP_DIR}" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find "${TEMP_DIR}" -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true

(cd "${TEMP_DIR}" && zip -r "${ZIP_PATH}" . -x "*.DS_Store")

echo "Paquete de distribucion generado exitosamente en: ${ZIP_PATH}"
