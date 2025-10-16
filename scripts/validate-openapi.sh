#!/usr/bin/env bash
set -euo pipefail

SPEC="docs/API/auth-register.yaml"
echo "Validating $SPEC"
docker run --rm -v "$PWD:/work" -w /work stoplight/spectral:6.11.1 lint "$SPEC"
