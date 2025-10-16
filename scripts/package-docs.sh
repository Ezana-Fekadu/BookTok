#!/usr/bin/env bash
set -euo pipefail

NAME="booktok-docs"
STAMP="$(date +%Y%m%d-%H%M%S)"
HASH="$(git rev-parse --short HEAD 2>/dev/null || echo 'no-git')"
OUT="${NAME}-${STAMP}-${HASH}.zip"

echo "Creating ${OUT} …"
zip -r "${OUT}" \
  README.md \
  docs/PRD.md \
  docs/DesignCopy.md \
  docs/SecurityChecklist.md \
  docs/CompetitiveLandscape.md \
  docs/API/auth-register.yaml \
  frontend/components/MainNavigationBar.tsx \
  backlog/EngineeringBacklog.csv

echo "SHA256:"
shasum -a 256 "${OUT}" || sha256sum "${OUT}" || true
