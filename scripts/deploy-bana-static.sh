#!/usr/bin/env bash
# Incremental, backed-up TELLURIS deployment to BanaHosting.
# Does not depend on /dev/fd, remove unrelated files or replace server-managed SSL.
set -Eeuo pipefail
umask 077
MODE="${1:---check}"
[[ "$MODE" == "--check" || "$MODE" == "--deploy" ]] || {
  echo "Usage: bash scripts/deploy-bana-static.sh --check|--deploy" >&2
  exit 2
}
REPO="${TELLURIS_REPO:-$HOME/telluris-source}"
SRC="$REPO/website/public"
DST="${TELLURIS_ROOT:-$HOME/projecturiel.earth}"
URL="https://projecturiel.earth"
BACKUPS="$HOME/TELLURIS_BACKUPS"
[[ -d "$REPO/.git" && -d "$SRC" && -d "$DST" ]] || {
  echo "ERROR: missing Git checkout, website/public or document root" >&2
  exit 1
}
[[ -z "$(git -C "$REPO" status --porcelain -- website/public)" ]] || {
  echo "ERROR: uncommitted website/public changes" >&2; exit 1
}
COMMIT="$(git -C "$REPO" rev-parse --verify HEAD)"
SHORT="${COMMIT:0:12}"

TMP="$(mktemp -d "$HOME/.telluris-release.XXXXXXXX")"
CHANGES="$TMP/changed"
NEWFILES="$TMP/new"
ALLFILES="$TMP/all"
: > "$CHANGES"
: > "$NEWFILES"
BACKUP=""
ROLLBACK=0

cleanup() {
  status=$?
  set +e
  if (( status != 0 && ROLLBACK == 1 )); then
    echo "ERROR: release failed; restoring original public files..." >&2
    tar -xzf "$BACKUP" -C "$DST" || echo "RESTORE FAILED: $BACKUP" >&2
    while IFS= read -r -d '' rel; do
      rm -f "$DST/$rel"
    done < "$NEWFILES"
  fi
  while IFS= read -r -d '' rel; do
    rm -f "$DST/$rel.telluris-next-$$"
  done < "$CHANGES"
  rm -rf "$TMP"
  return "$status"
}
trap cleanup EXIT

find "$SRC" -type f -print0 > "$ALLFILES"
COUNT=0
while IFS= read -r -d '' path; do
  rel="${path#"$SRC"/}"
  case "$rel" in
    .htaccess|.well-known/*) continue ;;
    *.html|*.js|*.css|*.json|*.geojson|*.svg|*.png|*.webp|*.ico|*.jpg|*.jpeg|*.txt|*.xml) ;;
    *) echo "ERROR: unsupported public file type: $rel" >&2; exit 1 ;;
  esac
  if [[ -L "$DST/$rel" ]]; then
    echo "ERROR: target symlink refused: $rel" >&2; exit 1
  fi
  if [[ -e "$DST/$rel" && ! -f "$DST/$rel" ]]; then
    echo "ERROR: target is not a regular file: $rel" >&2; exit 1
  fi
  if [[ ! -f "$DST/$rel" ]] || ! cmp -s "$path" "$DST/$rel"; then
    printf '%s\0' "$rel" >> "$CHANGES"
    echo "CHANGE $rel"
    COUNT=$((COUNT+1))
    if [[ ! -e "$DST/$rel" ]]; then printf '%s\0' "$rel" >> "$NEWFILES"; fi
  fi
done < "$ALLFILES"

echo "Source commit: $COMMIT"
echo "Changed public files: $COUNT"
if [[ "$MODE" == "--check" ]]; then
  echo "DRY-RUN: production untouched."
  exit 0
fi
if (( COUNT == 0 )); then
  echo "No deployment required."
  exit 0
fi
command -v curl >/dev/null || { echo "ERROR: curl missing" >&2; exit 1; }
mkdir -p "$BACKUPS"
chmod 700 "$BACKUPS"
[[ -w "$DST" ]] || { echo "ERROR: document root not writable" >&2; exit 1; }
BACKUP="$BACKUPS/pre-$SHORT-$(date +%Y%m%d_%H%M%S).tar.gz"
tar --exclude='*.zip' --exclude='*.tar.gz' -czf "$BACKUP" -C "$DST" .
[[ -s "$BACKUP" ]] && tar -tzf "$BACKUP" >/dev/null || {
  echo "ERROR: backup verification failed" >&2; exit 1;
}
echo "Backup verified: $BACKUP"
ROLLBACK=1
while IFS= read -r -d '' rel; do
  target="$DST/$rel"
  install -d -m 755 "$(dirname "$target")"
  next="$target.telluris-next-$$"
  cp "$SRC/$rel" "$next"
  chmod 644 "$next"
  mv -f "$next" "$target"
done < "$CHANGES"
while IFS= read -r -d '' rel; do
  curl -fsSL --max-time 25 -H 'Cache-Control: no-cache' \
    "$URL/$rel?version=$SHORT" -o "$TMP/remote"
  cmp -s "$SRC/$rel" "$TMP/remote" || {
    echo "ERROR: HTTPS content mismatches source: $rel" >&2; exit 1;
  }
  echo "OK HTTPS $rel"
done < "$CHANGES"
printf 'commit=%s\ndeployed_at_utc=%s\nbackup=%s\nfiles_updated=%s\n' \
  "$COMMIT" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$BACKUP" "$COUNT" \
  > "$BACKUPS/production-current.txt"
ROLLBACK=0
echo "COMPLETE: $SHORT; $COUNT files verified via HTTPS."
echo "NOTE: manual browser interaction and scientific source QA remain separate."
