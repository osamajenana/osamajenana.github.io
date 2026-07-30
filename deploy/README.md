# Deploying to the VPS

Runbook for putting this site on `osamajenana.com`. Every command runs on the
server unless it says otherwise. Do the steps in order — certbot cannot issue a
certificate before DNS resolves, and nginx will not start with a TLS block
pointing at a certificate that does not exist yet.

Assumes Ubuntu 22.04+ and a user with sudo.

---

## 0. What you need before starting

- The VPS IP address.
- DNS control for `osamajenana.com`.
- A [Resend](https://resend.com) API key and a verified sender on the domain.
  Without it the contact form works but tells visitors it failed.

---

## 1. Point DNS at the server

At your registrar:

| Type | Name  | Value           |
| ---- | ----- | --------------- |
| A    | `@`   | `<VPS_IP>`      |
| A    | `www` | `<VPS_IP>`      |

Wait until this returns the VPS IP before continuing:

```bash
dig +short osamajenana.com
```

---

## 2. Install the runtime

```bash
sudo apt update && sudo apt install -y curl git nginx

# Node 22 LTS. The repo is developed against a newer, non-LTS Node; 22 is the
# version CI tests and the one this box should run.
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

sudo npm install -g pm2

node -v && npm -v && pm2 -v
```

`sharp` needs no system libraries on Ubuntu — it ships prebuilt binaries.

---

## 3. Create the directories

```bash
sudo mkdir -p /var/www/portfolio/{repo,releases} /var/log/portfolio /var/www/certbot
sudo chown -R "$USER":"$USER" /var/www/portfolio /var/log/portfolio
```

Layout:

```
/var/www/portfolio
├── repo/                 the git checkout; builds happen here
├── releases/             timestamped builds, last 3 kept
└── current -> releases/… symlink PM2 runs from
```

---

## 4. Clone and configure

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

## 5. Get a certificate

nginx must be answering on port 80 first, with the default site:

```bash
sudo systemctl start nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly --webroot -w /var/www/certbot \
  -d osamajenana.com -d www.osamajenana.com \
  --agree-tos -m you@example.com --no-eff-email
```

Renewal is installed as a systemd timer. Confirm it:

```bash
sudo systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```

---

## 6. Install the nginx config

```bash
sudo cp /var/www/portfolio/repo/deploy/nginx.conf \
        /etc/nginx/sites-available/osamajenana.com
sudo ln -sf /etc/nginx/sites-available/osamajenana.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t && sudo systemctl reload nginx
```

`nginx -t` failing here almost always means the certificate paths in step 5 do
not match. Read the error before changing anything.

---

## 7. First deploy

```bash
cd /var/www/portfolio/repo
./deploy/deploy.sh
```

The script builds into a new release, boots it on a throwaway port, checks that
`/en`, `/ar`, `/en/work` and `/sitemap.xml` all return 200, and only then flips
the `current` symlink and reloads PM2. If the new build does not answer, it
points the symlink back at the previous release and exits non-zero — a broken
build cannot take the site down.

Then make PM2 survive a reboot:

```bash
pm2 startup          # prints a command; run the command it prints
pm2 save
```

---

## 8. Check it

```bash
curl -I https://osamajenana.com                 # 200, HSTS present
curl -s https://osamajenana.com/ar | grep -o 'dir="rtl"'
curl -sI https://osamajenana.com/api/cv | grep -i content-disposition
curl -s https://osamajenana.com/sitemap.xml | head -5
pm2 logs portfolio --lines 30
```

In a browser: the hero scene animates, the theme toggle works, and **submit the
contact form once** — it should say the message arrived, and the message should
be in your inbox. If it reports an error, `RESEND_API_KEY` or `CONTACT_FROM` is
wrong; `pm2 logs portfolio` says which.

Then run PageSpeed Insights against the live URL and confirm mobile performance
is still in the 90s on real network conditions.

---

## 9. Deploys after the first one

```bash
cd /var/www/portfolio/repo && ./deploy/deploy.sh
```

Or set up the GitHub Actions workflow in `.github/workflows/deploy.yml`, which
runs the same script over SSH after CI passes. It needs four repository secrets:

| Secret            | Value                                              |
| ----------------- | -------------------------------------------------- |
| `SSH_HOST`        | VPS IP or hostname                                 |
| `SSH_USER`        | the deploy user                                    |
| `SSH_PRIVATE_KEY` | private key whose public half is in `authorized_keys` |
| `SSH_PORT`        | usually `22`                                       |

### Rolling back

```bash
ls -1t /var/www/portfolio/releases        # newest first
ln -sfn /var/www/portfolio/releases/<previous> /var/www/portfolio/current
pm2 reload portfolio
```

---

## 10. Analytics (optional)

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
