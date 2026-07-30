#!/usr/bin/env bash
#
# Deploy the portfolio on the VPS.
#
#   ssh you@vps 'cd /var/www/portfolio/repo && ./deploy/deploy.sh'
#
# Builds into a release directory, then flips a symlink and reloads PM2. The flip
# is what makes this safe: nothing serves a half-copied build, and rolling back is
# repointing the symlink at the previous release.

set -Eeuo pipefail

APP_ROOT="${APP_ROOT:-/var/www/portfolio}"
REPO_DIR="${REPO_DIR:-$APP_ROOT/repo}"
RELEASES_DIR="$APP_ROOT/releases"
CURRENT_LINK="$APP_ROOT/current"
BRANCH="${BRANCH:-v2-nextjs}"
KEEP_RELEASES="${KEEP_RELEASES:-3}"

log()  { printf '\n\033[1;34m==>\033[0m %s\n' "$*"; }
fail() { printf '\n\033[1;31mFAILED:\033[0m %s\n' "$*" >&2; exit 1; }

trap 'fail "line $LINENO"' ERR

# --- preflight ---------------------------------------------------------------
log "Preflight"

command -v node >/dev/null || fail "node is not installed"
command -v npm  >/dev/null || fail "npm is not installed"
command -v pm2  >/dev/null || fail "pm2 is not installed (npm i -g pm2)"

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
[ "$NODE_MAJOR" -ge 20 ] || fail "Node 20+ required, found $(node -v)"
printf '    node %s, npm %s, pm2 %s\n' "$(node -v)" "$(npm -v)" "$(pm2 -v)"

[ -f "$REPO_DIR/.env.production" ] \
  || fail ".env.production is missing in $REPO_DIR — copy .env.example and fill it in"

# The form fails honestly without these, but silently discarding enquiries is
# worse than a loud deploy warning.
if ! grep -q '^RESEND_API_KEY=".\+"' "$REPO_DIR/.env.production"; then
  printf '\n\033[1;33mWARNING:\033[0m RESEND_API_KEY is empty — the contact form will report an error to visitors instead of delivering mail.\n'
fi

# --- fetch -------------------------------------------------------------------
log "Fetching $BRANCH"
cd "$REPO_DIR"
git fetch --prune origin "$BRANCH"
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
COMMIT="$(git rev-parse --short HEAD)"
printf '    at %s — %s\n' "$COMMIT" "$(git log -1 --format=%s)"

# --- build -------------------------------------------------------------------
log "Installing dependencies"
# `npm ci` from the lockfile: a deploy must never resolve a different tree than
# the one CI tested.
npm ci --no-audit --no-fund

log "Building"
set -a
# shellcheck disable=SC1091
. "$REPO_DIR/.env.production"
set +a
npm run build

# --- release -----------------------------------------------------------------
RELEASE="$RELEASES_DIR/$(date -u +%Y%m%d%H%M%S)-$COMMIT"
log "Assembling release $(basename "$RELEASE")"

mkdir -p "$RELEASE"
# The standalone output is already a self-contained app root, so its contents
# become the release root — server.js at the top, as Next documents.
cp -r .next/standalone/. "$RELEASE/"
# Verified against a real build: standalone ships neither of these.
cp -r .next/static "$RELEASE/.next/static"
[ -d public ] && cp -r public "$RELEASE/public"
# Next's standalone server loads .env from its working directory. NEXT_PUBLIC_*
# vars were already inlined during the build above; this is for the server-only
# ones (Resend, GitHub token).
cp .env.production "$RELEASE/.env"
chmod 600 "$RELEASE/.env"
cp ecosystem.config.cjs "$RELEASE/ecosystem.config.cjs"

# --- verify before cutting over ---------------------------------------------
log "Smoke test on a throwaway port"
(cd "$RELEASE" && PORT=3199 HOSTNAME=127.0.0.1 node server.js) &
SMOKE_PID=$!
# shellcheck disable=SC2064
trap "kill $SMOKE_PID 2>/dev/null || true" EXIT

for i in $(seq 1 30); do
  if curl -fsS -o /dev/null "http://127.0.0.1:3199/en"; then break; fi
  [ "$i" -eq 30 ] && fail "the new build did not answer on port 3199 — not cutting over"
  sleep 1
done

for path in /en /ar /en/work /sitemap.xml; do
  code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:3199$path")"
  [ "$code" = "200" ] || fail "$path returned $code on the new build — not cutting over"
  printf '    %-14s %s\n' "$path" "$code"
done

kill $SMOKE_PID 2>/dev/null || true
trap - EXIT

# --- cut over ----------------------------------------------------------------
log "Switching current -> $(basename "$RELEASE")"
PREVIOUS="$(readlink -f "$CURRENT_LINK" 2>/dev/null || true)"
ln -sfn "$RELEASE" "$CURRENT_LINK"

log "Reloading PM2"
if pm2 describe portfolio >/dev/null 2>&1; then
  pm2 reload "$RELEASE/ecosystem.config.cjs" --update-env
else
  pm2 start "$RELEASE/ecosystem.config.cjs"
fi
pm2 save

# --- verify live -------------------------------------------------------------
log "Verifying the live process"
sleep 3
for i in $(seq 1 20); do
  if curl -fsS -o /dev/null "http://127.0.0.1:3100/en"; then
    printf '    port 3100 answering\n'
    break
  fi
  if [ "$i" -eq 20 ]; then
    printf '\n\033[1;31mThe new release is not answering. Rolling back.\033[0m\n'
    [ -n "$PREVIOUS" ] && ln -sfn "$PREVIOUS" "$CURRENT_LINK" && pm2 reload portfolio
    fail "rolled back to $(basename "${PREVIOUS:-none}")"
  fi
  sleep 1
done

# --- prune -------------------------------------------------------------------
log "Pruning old releases (keeping $KEEP_RELEASES)"
cd "$RELEASES_DIR"
ls -1dt ./*/ 2>/dev/null | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf

log "Deployed $COMMIT"
printf '    rollback: ln -sfn %s %s && pm2 reload portfolio\n' \
  "${PREVIOUS:-<no previous release>}" "$CURRENT_LINK"
