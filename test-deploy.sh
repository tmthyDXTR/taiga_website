#!/bin/bash
# Dry run: Simulate rsync without making changes

LOCAL_FOLDER="$HOME/repos/taiga_website/dist/"
REMOTE_HOST="fastcomet"
REMOTE_PATH="taiga.supacoda.de/"

echo "=== Testing rsync (dry run) ==="
rsync -avz --dry-run --checksum --itemize-changes --exclude='.git' "$LOCAL_FOLDER/" "$REMOTE_HOST:$REMOTE_PATH"
echo "=== Dry run complete ==="