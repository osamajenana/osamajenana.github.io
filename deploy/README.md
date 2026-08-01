# Deploying to the VPS

Runbook for putting this site on `osamajenana.com`. Every command runs on the
server unless it says otherwise. Do the steps in order — certbot cannot issue a
certificate before DNS resolves, and nginx will not start with a TLS block
pointing at a certificate that does not exist yet.

Assumes Ubuntu 22.04+ and a user with sudo.

> ## This box already runs other projects
>
> Everything below is scoped so it cannot disturb them. Four rules, and section
> 1 checks all four before you touch anything:
>
> 1. **Never replace the system Node.** A NodeSource install upgrades Node for
>    every project on the box at once. Section 2 uses nvm, per-user.
> 2. **Never `rm /etc/nginx/sites-enabled/default`**, and never edit
>    `nginx.conf` itself. This site is one file in `sites-available`, symlinked.
> 3. **Never reuse a port.** `deploy.sh` refuses to run if 3100 is already
>    somebody else's.
> 4. **`pm2 save` writes the whole process list.** That is fine — it saves the
>    other apps too — but only ever run it when they are all healthy.

---

## 0. What you need before starting

- The VPS IP address, and SSH access.
- DNS control for `osamajenana.com`.
- A [Resend](https://resend.com) API key and a verified sender on the domain.
  Without it the contact form works but tells visitors it failed.

---

## 1. Survey the box first

Run this before changing anything. It answers every question the rest of the
runbook depends on, and none of it writes:

```bash
# What is already listening? 3100 and 3199 must be free.
sudo ss -ltnp

# What does PM2 already run? "portfolio" must not be taken.
pm2 list

# Which Node is on PATH, and does another project pin one?
node -v; which node; ls ~/.nvm/versions/node 2>/dev/null

# Which nginx sites exist, and does one already claim default_server?
ls -l /etc/nginx/sites-enabled/
sudo grep -rn "default_server" /etc/nginx/sites-enabled/ /etc/nginx/nginx.conf

# Which certificates are already issued?
sudo certbot certificates 2>/dev/null | grep -E "Certificate Name|Domains"

# Room to build? A Next build wants ~2 GB free and ~1 GB of RAM.
df -h /var; free -m
```

Write down the answers. If **3100 is taken**, pick a free port now and change it
in two files before deploying:

- `ecosystem.config.cjs` → `env.PORT`
- `deploy/nginx.conf` → the `portfolio_app` upstream

If **no site claims `default_server`**, nginx treats the first-loaded block as
the catch-all. Adding this site could change which one that is. It does not
affect any site that matches its own `server_name`, but if you rely on a
specific catch-all, mark it explicitly:

```nginx
listen 443 ssl default_server;
```

If **another project is already a PM2 app called `portfolio`**, deploy with a
different name: `PM2_APP=osama-site ./deploy/deploy.sh`.

---

## 2. Install the runtime — without touching the system Node

If `node -v` already reports 20 or newer and no other project pins a different
version, skip this and use what is there.

Otherwise install nvm for the deploy user only. This puts Node on *your* PATH
and leaves `/usr/bin/node` — and every other project — exactly as it was:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
. ~/.nvm/nvm.sh

nvm install 22
nvm alias default 22
node -v      # v22.x
```

PM2 next. **Check first** — if another project already runs on PM2, reinstalling
can change its version underneath a running daemon:

```bash
pm2 -v || npm install -g pm2
```

nginx and certbot are shared infrastructure; install only what is missing:

```bash
command -v nginx   >/dev/null || sudo apt update && sudo apt install -y nginx
command -v certbot >/dev/null || sudo apt install -y certbot python3-certbot-nginx
command -v git     >/dev/null || sudo apt install -y git
```

`sharp` needs no system libraries on Ubuntu — it ships prebuilt binaries.

---

## 3. Point DNS at the server

At your registrar:

| Type | Name  | Value      |
| ---- | ----- | ---------- |
| A    | `@`   | `<VPS_IP>` |
| A    | `www` | `<VPS_IP>` |

Wait until this returns the VPS IP before continuing:

```bash
dig +short osamajenana.com
```

---

## 4. Create the directories

All under one root, so nothing here shares a path with another project:

```bash
sudo mkdir -p /var/www/portfolio/{repo,releases} /var/log/portfolio /var/www/certbot
sudo chown -R "$USER":"$USER" /var/www/portfolio /var/log/portfolio
```

```
/var/www/portfolio
├── repo/                 the git checkout; builds happen here
├── releases/             timestamped builds, last 3 kept
└── current -> releases/… symlink PM2 runs from
```

`/var/www/certbot` is shared with any other site that uses the webroot challenge.
Creating it is safe; it is a directory, not a config.

---

## 5. Clone and configure

```bash
cd /var/www/portfolio/repo
git clone https://github.com/osamajenana/osamajenana.github.io.git .
git checkout v2-nextjs

cp .env.example .env.production
nano .env.production
```

Fill in:

```ini
NEXT_PUBLIC_SITE_URL="https://osamajenana.com"
RESEND_API_KEY="re_..."
CONTACT_FROM="Portfolio <noreply@osamajenana.com>"
CONTACT_TO="you@example.com"
GITHUB_TOKEN=""            # optional: raises the GitHub API limit for the stats block
```

```bash
chmod 600 .env.production
chmod +x deploy/deploy.sh
```

> `NEXT_PUBLIC_SITE_URL` is baked in at build time — it drives canonical URLs,
> hreflang, OG images, the sitemap and RSS. Getting it wrong means every
> canonical points at the wrong host.

---

## 6. Get a certificate

nginx must already be answering on port 80 — it is, if another site is live.
This issues a certificate for these two names only and touches nothing else:

```bash
sudo certbot certonly --webroot -w /var/www/certbot \
  -d osamajenana.com -d www.osamajenana.com \
  --agree-tos -m you@example.com --no-eff-email
```

`--webroot`, not `--nginx`: the nginx plugin edits server blocks in place, and on
a shared box that means certbot writing into config files you did not intend it
to touch. Webroot only writes a challenge file.

If port 80 is not yet answering for this domain, add a temporary block first:

```bash
sudo tee /etc/nginx/sites-available/osamajenana-acme >/dev/null <<'EOF'
server {
    listen 80;
    server_name osamajenana.com www.osamajenana.com;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 404; }
}
EOF
sudo ln -sf /etc/nginx/sites-available/osamajenana-acme /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Then issue the certificate, then remove that temporary file before step 7:

```bash
sudo rm /etc/nginx/sites-enabled/osamajenana-acme
```

Renewal is a systemd timer already installed for the other sites. Confirm it
still passes for all of them:

```bash
sudo certbot renew --dry-run
```

---

## 7. Install the nginx config

```bash
sudo cp /var/www/portfolio/repo/deploy/nginx.conf \
        /etc/nginx/sites-available/osamajenana.com
sudo ln -sf /etc/nginx/sites-available/osamajenana.com /etc/nginx/sites-enabled/

# Validates EVERY enabled site, not just this one. If it fails, nothing has
# been reloaded yet and the other sites are still serving the old config.
sudo nginx -t && sudo systemctl reload nginx
```

`reload`, never `restart`: reload keeps existing connections alive, so the other
sites do not drop a request.

If `nginx -t` fails, it is almost always one of:

- the certificate paths in step 6 do not match — read the error, it names the file;
- `upstream portfolio_app` collides with an upstream another config defines —
  rename it in `deploy/nginx.conf`.

Do not proceed until `nginx -t` passes.

---

## 8. First deploy

```bash
cd /var/www/portfolio/repo
./deploy/deploy.sh
```

The script refuses to start if port 3100 belongs to another process. Then it
builds into a new release, boots it on a throwaway port, checks that `/en`,
`/ar`, `/en/work`, the CV PDF and `/sitemap.xml` all return 200, and only then
flips the `current` symlink and reloads PM2. If the new build does not answer it
points the symlink back at the previous release and exits non-zero — a broken
build cannot take the site down.

Then make PM2 survive a reboot:

```bash
pm2 startup      # prints a command; run the command it prints
pm2 save         # saves ALL PM2 apps — check `pm2 list` is healthy first
```

If PM2 was already set up by another project, `pm2 startup` is a no-op and you
only need `pm2 save`.

---

## 9. Check it — this site, then the others

```bash
curl -I https://osamajenana.com                        # 200, HSTS present
curl -s -o /dev/null -w '%{redirect_url}\n' https://osamajenana.com/   # → /en
curl -s https://osamajenana.com/ar | grep -o 'dir="rtl"'
curl -sI https://osamajenana.com/cv/Osama-Jenana-CV.pdf | grep -i content-type
curl -s https://osamajenana.com/sitemap.xml | head -5
pm2 logs portfolio --lines 30
```

Then confirm nothing else moved:

```bash
pm2 list                       # every other app still "online"
sudo nginx -t                  # still valid
# and load each of the other sites in a browser
```

In a browser: the page opens in **English** and in the **dark theme**, the stack
diagram animates, the theme toggle works, and **submit the contact form once** —
it should say the message arrived, and the message should be in your inbox. If it
reports an error, `RESEND_API_KEY` or `CONTACT_FROM` is wrong; `pm2 logs
portfolio` says which.

Then run PageSpeed Insights against the live URL.

---

## 10. Deploys after the first one

```bash
cd /var/www/portfolio/repo && ./deploy/deploy.sh
```

Or set up the GitHub Actions workflow in `.github/workflows/deploy.yml`, which
runs the same script over SSH after CI passes. It needs four repository secrets:

| Secret            | Value                                                 |
| ----------------- | ----------------------------------------------------- |
| `SSH_HOST`        | VPS IP or hostname                                    |
| `SSH_USER`        | the deploy user                                       |
| `SSH_PRIVATE_KEY` | private key whose public half is in `authorized_keys` |
| `SSH_PORT`        | usually `22`                                          |

### Rolling back

```bash
ls -1t /var/www/portfolio/releases        # newest first
ln -sfn /var/www/portfolio/releases/<previous> /var/www/portfolio/current
pm2 reload portfolio
```

### Removing this site entirely

Leaves every other project untouched:

```bash
pm2 delete portfolio && pm2 save
sudo rm /etc/nginx/sites-enabled/osamajenana.com
sudo nginx -t && sudo systemctl reload nginx
sudo rm -rf /var/www/portfolio /var/log/portfolio
sudo certbot delete --cert-name osamajenana.com
```

---

## 11. Analytics (optional)

Vercel Analytics is not available here — this is not Vercel. Self-hosted
[Umami](https://umami.is) is cookieless, GDPR-clean, and on-brand for someone
who runs their own infrastructure. Once it is up, add to `.env.production` and
redeploy:

```ini
NEXT_PUBLIC_UMAMI_SRC="https://analytics.osamajenana.com/script.js"
NEXT_PUBLIC_UMAMI_WEBSITE_ID="..."
```

You will also need to append that origin to `script-src` and `connect-src` in
the CSP in `deploy/nginx.conf`, or the browser will block the script. The
zero-effort alternative is Cloudflare Web Analytics.

---

## One thing to decide separately

The GitHub repository is named `osamajenana.github.io`, so **GitHub Pages serves
whatever is on `main`** — which is still the old static site, and still working.

Nothing here touches that. But if you ever merge `v2-nextjs` into `main`, Pages
will try to serve raw Next.js source and the old URL will break. Before doing
that, either:

- point Pages at the `legacy-static` branch, so `osamajenana.github.io` keeps
  serving the old site as an archive; or
- turn Pages off once `osamajenana.com` is live.
