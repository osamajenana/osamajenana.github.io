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
PM2_APP="${PM2_APP:-portfolio}"
SMOKE_PORT="${SMOKE_PORT:-3199}"

log()  { printf '\n\033[1;34m==>\033[0m %s\n' "$*"; }
warn() { printf '\n\033[1;33mWARNING:\033[0m %s\n' "$*"; }
fail() { printf '\n\033[1;31mFAILED:\033[0m %s\n' "$*" >&2; exit 1; }

trap 'fail "line $LINENO"' ERR

# True when something other than our own PM2 app is listening on $1.
port_taken_by_other() {
  local port="$1"
  command -v ss >/dev/null || return 1
  ss -ltnH "sport = :$port" 2>/dev/null | grep -q . || return 1
  # Ours, if PM2 already runs this app and it holds that port.
  pm2 pid "$PM2_APP" >/dev/null 2>&1 || return 0
  local pid
  pid="$(pm2 pid "$PM2_APP" 2>/dev/null || true)"
  [ -n "$pid" ] && ss -ltnpH "sport = :$port" 2>/dev/null | grep -q "pid=$pid," && return 1
  return 0
}

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

# The app's port is defined once, in ecosystem.config.cjs. Reading it here
# rather than repeating it means the health checks below cannot drift from the
# port the process actually binds.
APP_PORT="$(node -p "require('$REPO_DIR/ecosystem.config.cjs').apps[0].env.PORT")"
printf '    app port %s, pm2 app "%s"\n' "$APP_PORT" "$PM2_APP"

# This box runs other projects. Binding a port one of them already owns is the
# one mistake here that breaks somebody else's site, so it is a hard stop.
if port_taken_by_other "$APP_PORT"; then
  fail "port $APP_PORT is already in use by another process.
    Something else on this VPS owns it. Pick a free port, change env.PORT in
    ecosystem.config.cjs and the upstream in deploy/nginx.conf to match, then
    re-run. Check with:  ss -ltnp | grep :$APP_PORT"
fi

if port_taken_by_other "$SMOKE_PORT"; then
  fail "smoke-test port $SMOKE_PORT is in use. Re-run with SMOKE_PORT=<free port>."
fi

# The form fails honestly without these, but silently discarding enquiries is
# worse than a loud deploy warning.
if ! grep -q '^RESEND_API_KEY=".\+"' "$REPO_DIR/.env.production"; then
  warn "RESEND_API_KEY is empty — the contact form will report an error to visitors instead of delivering mail."
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
(cd "$RELEASE" && PORT=$SMOKE_PORT HOSTNAME=127.0.0.1 node server.js) &
SMOKE_PID=$!
# shellcheck disable=SC2064
trap "kill $SMOKE_PID 2>/dev/null || true" EXIT

for i in $(seq 1 30); do
  if curl -fsS -o /dev/null "http://127.0.0.1:$SMOKE_PORT/en"; then break; fi
  [ "$i" -eq 30 ] && fail "the new build did not answer on port $SMOKE_PORT — not cutting over"
  sleep 1
done

for path in /en /ar /en/work /cv/Osama-Jenana-CV.pdf /sitemap.xml; do
  code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$SMOKE_PORT$path")"
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
if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
  pm2 reload "$RELEASE/ecosystem.config.cjs" --update-env
else
  pm2 start "$RELEASE/ecosystem.config.cjs"
fi
pm2 save

# --- verify live -------------------------------------------------------------
log "Verifying the live process"
sleep 3
for i in $(seq 1 20); do
  if curl -fsS -o /dev/null "http://127.0.0.1:$APP_PORT/en"; then
    printf '    port %s answering\n' "$APP_PORT"
    break
  fi
  if [ "$i" -eq 20 ]; then
    printf '\n\033[1;31mThe new release is not answering. Rolling back.\033[0m\n'
    [ -n "$PREVIOUS" ] && ln -sfn "$PREVIOUS" "$CURRENT_LINK" && pm2 reload "$PM2_APP"
    fail "rolled back to $(basename "${PREVIOUS:-none}")"
  fi
  sleep 1
done

# --- prune -------------------------------------------------------------------
log "Pruning old releases (keeping $KEEP_RELEASES)"
cd "$RELEASES_DIR"
ls -1dt ./*/ 2>/dev/null | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf

log "Deployed $COMMIT"
printf '    rollback: ln -sfn %s %s && pm2 reload %s\n' \
  "${PREVIOUS:-<no previous release>}" "$CURRENT_LINK" "$PM2_APP"
