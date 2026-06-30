#!/bin/bash
# Deploy local folder to fastcomet (optimized for speed)

set -euo pipefail

LOCAL_FOLDER="$HOME/repos/taiga_website/dist"
REMOTE_HOST="fastcomet"
REMOTE_PATH="taiga.supacoda.de/"

DRY_RUN=false

show_help() {
  cat <<EOF
Usage: ./deploy.sh [--dry-run|-n] [--help|-h]

Options:
  -n, --dry-run  Show what would be synchronized without changing remote files.
  -h, --help     Show this help message.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -n|--dry-run)
      DRY_RUN=true
      shift
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

if ! command -v rsync >/dev/null 2>&1; then
  echo "Error: rsync is not installed."
  echo "Install it first (e.g. sudo apt install rsync), then rerun this script."
  exit 1
fi

RSYNC_FLAGS=(-avz --checksum)
if [[ "$DRY_RUN" == true ]]; then
  RSYNC_FLAGS+=(--dry-run --itemize-changes)
  echo "=== Starting deployment (dry-run) ==="
else
  echo "=== Starting deployment ==="
fi

rsync -e "ssh -i /home/fern/.ssh/fernFastComet" "${RSYNC_FLAGS[@]}" "$LOCAL_FOLDER/" "$REMOTE_HOST:$REMOTE_PATH"

if [[ "$DRY_RUN" == true ]]; then
  echo "=== Dry-run complete (no files changed) ==="
else
  echo "=== Deployment complete ==="
fi
