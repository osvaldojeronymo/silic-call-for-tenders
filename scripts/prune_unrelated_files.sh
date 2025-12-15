#!/usr/bin/env bash
set -euo pipefail

# Prune files not related to the JSON form-renderer implementation.
# Default: dry-run (only lists). Use --archive to move, or --delete to git rm.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
cd "$ROOT_DIR"

MODE="dry-run" # dry-run | archive | delete
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
ARCHIVE_DIR="${ROOT_DIR}/_archive/${TIMESTAMP}"

if [[ ${1:-} == "--archive" ]]; then
  MODE="archive"
elif [[ ${1:-} == "--delete" ]]; then
  MODE="delete"
elif [[ -n ${1:-} && ${1:-} != "--dry-run" ]]; then
  echo "Usage: $0 [--dry-run|--archive|--delete]" >&2
  exit 1
fi

# Keep patterns relative to repo root
KEEP_PATTERNS=(
  "package.json"
  "tsconfig.json"
  "vite.config.ts"
  "form-renderer.html"
  "docs/**"
  "scripts/prune_unrelated_files.sh"
  "src/form-renderer/**"
  "src/data/schema_formulario_gerador_edital_caixa_v1.json"
  ".gitignore"
  "README*.md"
)

matches_keep() {
  local f="$1"
  for pat in "${KEEP_PATTERNS[@]}"; do
    if [[ "$pat" == **/** ]]; then
      # recursive glob: convert to regex
      local regex
      regex="^${pat//\./\\.}"
      regex="${regex//\*\*/.*}"
      regex="${regex//\*/[^/]*}"
      if [[ "$f" =~ $regex ]]; then
        return 0
      fi
    else
      if [[ "$f" == $pat ]]; then
        return 0
      fi
    fi
  done
  return 1
}

if ! command -v git >/dev/null 2>&1; then
  echo "git is required to enumerate tracked files." >&2
  exit 1
fi

# Read git tracked files with UTF-8 paths (no quoted escapes), NUL-delimited
FILES=()
while IFS= read -r -d '' f; do
  FILES+=("$f")
done < <(git -c core.quotepath=false ls-files -z)

TO_REMOVE=()
for f in "${FILES[@]}"; do
  if matches_keep "$f"; then
    continue
  fi
  TO_REMOVE+=("$f")
done

echo "Found ${#TO_REMOVE[@]} files not matching keep criteria."

if [[ "$MODE" == "dry-run" ]]; then
  printf '%s\n' "${TO_REMOVE[@]}"
  echo
  echo "Dry run. Nothing changed. Use --archive to move or --delete to git rm."
  exit 0
fi

if [[ "$MODE" == "archive" ]]; then
  echo "Archiving to: $ARCHIVE_DIR"
  mkdir -p "$ARCHIVE_DIR"
  for f in "${TO_REMOVE[@]}"; do
    dest_dir="$ARCHIVE_DIR/$(dirname "$f")"
    mkdir -p "$dest_dir"
    git mv -f "$f" "$dest_dir/" 2>/dev/null || {
      mkdir -p "$(dirname "$dest_dir/$f")"
      mv "$f" "$dest_dir/"
      git add -A "$dest_dir/$(basename "$f")" || true
    }
  done
  echo "Archived ${#TO_REMOVE[@]} files. Review changes with: git status && git diff --staged"
  exit 0
fi

if [[ "$MODE" == "delete" ]]; then
  echo "Deleting ${#TO_REMOVE[@]} files via git rm"
  for f in "${TO_REMOVE[@]}"; do
    git rm -r -- "$f"
  done
  echo "Deleted. Review with: git status"
  exit 0
fi
