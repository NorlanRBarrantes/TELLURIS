# Deployment and operations

## Selected environment

- **Intended public URL:** https://telluris.lynxglobals.net/
- **Hosting provider:** BanaHosting
- **Plan type:** Shared hosting
- **Expected control panel:** cPanel, subject to account verification
- **Status:** Hosting chosen; DNS, SSL, document root, supported runtimes, and live deployment **not yet tested**.

The project must not assume root access, Docker, a permanently running Python service, a Node.js application server, or privileged OS configuration.

## Deployment strategy (proposed)

1. Confirm subdomain and DNS configuration.
2. Confirm HTTPS certificate and document root in the actual hosting account.
3. Confirm available PHP version, HTTPS outbound connections, cron and rewrite support if relevant.
4. Prefer a **static frontend build** with no persistent application server.
5. Add a small PHP proxy/cache only if required, and only after testing it on this account.
6. Keep any validation-oriented Python tooling outside production unless Python hosting support is explicitly confirmed.
7. Upload only compiled public assets and approved server code, excluding internal notes and credentials.
8. Test the actual public URL, application routing, NASA requests, errors, and provenance displays.
9. Confirm accessibility from an incognito browser without authentication.

## Suggested deployment layout, not yet implemented

A Vite build can be deployed into the subdomain's verified document root. If the frontend uses history-based routes, configure an appropriate rewrite to index.html; alternatively prefer hash routing if rewriting cannot be configured. Never add a rewrite that intercepts backend API endpoints.

If a PHP API is needed, publish only safe entrypoints and keep caches, configurations, and nonpublic files outside the public web root where the account allows it. Treat shared hosting as resource constrained: avoid high request concurrency, memory-heavy geographic raster operations, and unbounded API calls.

## Environment and security rules

- Store secrets only in hosting configuration or local ignored files.
- No access keys, cPanel credentials, FTP credentials, or private paths in the repository.
- Enforce TLS and fixed NASA upstream host(s) for any proxy.
- Define rate limits, network timeouts, cache expiry, and error responses.
- Provide a clearly labeled offline demonstration if live NASA data is temporarily unavailable, using genuine, attributed source data.

## Unverified questions

- Does this account expose cPanel's Python or Node.js application managers?
- What PHP version and extensions are active for the subdomain?
- Are external HTTPS requests available from PHP?
- Can static SPA rewrites be configured for this document root?
- Are there hosting-side request, CPU, bandwidth, and rate restrictions relevant to NASA retrieval?
- Are DNS and certificate issuance fully configured?

**Do not mark deployment complete until the live site passes these checks.**

References:
- cPanel generic application support (not a provider-specific guarantee): https://support.cpanel.net/hc/en-us/articles/4408475507479-Does-cPanel-support-Python-Java-or-other-frameworks

## Team and public research landing routes — 2026-11-14

A separate, static public-site package has been prepared for the Project Uriel identity and TELLURIS introductory research content. This section records a deployment intention, **not an operational validation**.

| Route | Purpose |
| --- | --- |
| `https://projecturiel.earth/` | Team homepage, mission and prominent TELLURIS entry point |
| `https://projecturiel.earth/telluris/` | TELLURIS research introduction and question-building preview; not the scientific engine |
| `https://projecturiel.earth/es/` | Spanish team homepage |
| `https://projecturiel.earth/es/telluris/` | Spanish TELLURIS introduction |

Deployment: upload approved static assets to the independently verified document root for `projecturiel.earth`; do not replace its functional SSL or rewrite configuration blindly. Verify HTTP response, HTTPS, canonical redirects, navigation, mobile behavior, sitemap, robots and translated URLs. Confirm that the scientific API and statistical engine remain out of scope for this first landing deployment.

The previously selected `https://telluris.lynxglobals.net/` in this document remains a candidate destination for the scientific application until ADR-004 is reconciled after verified deployments. See ADR-018 in `docs/DECISIONS.md`. Keep publication assertions tied to witnessed tests, not uploaded files alone.


## Deployed-site path for Explorer MVP 0.1

The static Explorer source is `website/public/telluris/explore/`. Project Uriel landing pages link directly to this path. Deploy the complete contents of `website/public/` into the existing BanaHosting document root, preserving the current server-side SSL and routing rules. The prior `telluris.lynxglobals.net` host remains an alternate concept, not a necessary dependency. Production HTTPS/routing and live browser CORS behavior are not yet verified.


## Verified GitHub → BanaHosting incremental release method (2026-11-15)

**Observed production release:** commit \`5fddb6c\` was manually copied to the BanaHosting document root \`/home/cvzvwazj/projecturiel.earth\` and five affected files matched their public HTTPS SHA-256 checks. This does **not** mean newer GitHub source commits are deployed. GitHub checkout is kept outside the web root at \`/home/cvzvwazj/telluris-source\`; it uses a repository-specific read-only SSH Deploy Key. Do not store private keys in the public document root.

The release script [\`scripts/deploy-bana-static.sh\`](../scripts/deploy-bana-static.sh) replaces earlier broken \`/dev/fd/63\` process substitution and ZIP-dependent manual deployments. It supports \`--check\` (no changes) and \`--deploy\` (explicit deployment), compares only \`website/public/\`, skips \`.htaccess\` and \`.well-known/\`, refuses unknown extensions/symlinks, archives the existing public root, copies changed files without \`--delete\`, verifies every changed file over HTTPS and writes \`TELLURIS_BACKUPS/production-current.txt\`. If verification fails, it attempts to restore the backup and remove newly introduced files.

The script received Bash syntax + dry-run validation in [Actions #43765203183](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43765203183). A dry run on GitHub's Linux runner is **not** a confirmed BanaHosting deployment; that remains a manual acceptance gate.

### On the existing BanaHosting SSH shell

\`\`\`bash
export GIT_SSH_COMMAND="ssh -i $HOME/.ssh/telluris_deploy -o IdentitiesOnly=yes"
git -C "$HOME/telluris-source" fetch origin main
git -C "$HOME/telluris-source" pull --ff-only origin main
bash "$HOME/telluris-source/scripts/deploy-bana-static.sh" --check
\`\`\`

Review the changed file list and verify that the GitHub Actions website QA run is successful. Once the NASA submission and live demo are protected, release explicitly:

\`\`\`bash
bash "$HOME/telluris-source/scripts/deploy-bana-static.sh" --deploy
cat "$HOME/TELLURIS_BACKUPS/production-current.txt"
\`\`\`

After deployment: open both language routes, test archived/live NASA retrieval, the EXP-005 statistical caveats, EXP-006 IMERG import restrictions, the new EXP-007C monthly panel using real monthly NASA JSON and EXP-007E browser Print → Save as PDF, plus mobile layout and network failures. Do not claim EXP-007 fully operational until witnessed. Record the published full commit, visual QA and issues in docs/VALIDATION.md. Keep secrets and research-only materials out of \`website/public/\`.

### Production validation record — 2026-11-15, EXP-007

The BanaHosting operator executed `git fetch` and `git pull --ff-only` to advance the private checkout from `5fddb6c` to `907b98f`. The checked-in deployment script `--check` identified **7 differences** and confirmed production remained untouched. The explicit `--deploy` execution created and verified backup `TELLURIS_BACKUPS/pre-907b98f600c6-20261115_164745.tar.gz`; all seven updated/new ES/EN Explorer and `assets/` files passed source-versus-HTTPS byte comparisons. Script output finished `COMPLETE: 907b98f600c6; 7 files verified via HTTPS.`

**Production published source at this check:** `907b98f600c6bf42d67e317ab00a033a92b37920`. No automatic deployment is implied for later `main` commits. EXP-007C and E are released as public assets but manual browser, print-to-PDF and original NASA source replay remain open validation tasks.

### EXP-010 judge homepage and Explorer release gate

The GitHub source now serves TELLURIS directly at root `/` and `/en/`, with standalone team pages `/about/`, `/en/about/`. Existing links `/telluris/`, `/en/telluris/` remain canonicalized copies; Explorer and scientific catalog retain their URLs. New source files include `website/public/assets/journey.css`, `website/public/assets/site-choice.js`, team HTML and rewritten landing pages.

Before publication, confirm the official NASA submission is safe; run the source website QA and EXP-010 browser QA. Then, on BanaHosting with the existing read-only SSH deploy key, update `$HOME/telluris-source` via `git fetch/pull --ff-only`, compare through `bash "$HOME/telluris-source/scripts/deploy-bana-static.sh" --check` and only then run `--deploy`. The script backs up and HTTPS-verifies changed public files; it does **not** delete unrelated server files or unreferenced old `assets/globe-weather.js`. No destructive cleanup is authorized here.

Production acceptance should open in **logged-out** and fresh-cache browser sessions: `/`, `/en/`, `/about/`, `/en/about/`, both Explorer routes and both catalogs. Check five-section user journey, functional CTA, A/B constraints, NASA GIBS geographic alignment, original NASA data, scientific export/PDF, mobile layout and external CDN-failure fallback. Log the published commit and public source hashes. GitHub CI successes are NOT proof of production release.

### EXP-011 slide engine and original event endpoints — release checklist

The statically served site adds `assets/journey-slider.js`, `assets/natural-events-core.js` and `assets/natural-events.js` plus existing `journey.css` and `observatory.css` updates, all indexable ES/EN landing aliases, Explorer HTML and catalog source metadata. The full homepage is a manual slider: verify every numbered tab, left/right arrows, keyboard and mobile swipe; no document-level vertical scroll. Mobile active-slide internal overflow is allowed so explanations are never clipped.

The event panel uses only HTTPS original data from earthquake.usgs.gov and eonet.gsfc.nasa.gov. GitHub original API checks do not prove third-party browser CORS at projecturiel.earth. Browser QA uses explicit fixtures, not a production API success claim; test a direct deployed request and inspect console/network failures manually. Preserve original NASA POWER and GIBS scientific paths.

With the existing BanaHosting checkout and read-only GitHub SSH key, run `git fetch/pull --ff-only`, `scripts/deploy-bana-static.sh --check`, review changes, and only then `--deploy` with script backups and HTTPS source verification. Never deploy automatically during official hackathon submission. Record exact commit SHA, public cache-versioned routes and browser screenshots.

### EXP-012 public visual identity rollout

New static files in `website/public/assets/`: `visual-identity.css` and `uriel-symbol-128.png`. The 12 public HTML pages reference these with a cache-busted CSS URL. `journey-slider.js` now wires the slide 00 “Skip presentation” button to the final presentation slide. The only primary Explore CTA remains at slide 05. No source-processing modules were changed.

Verify GitHub site and Chromium QA first. On BanaHosting, use the **read-only** SSH deploy key to update `$HOME/telluris-source`, then run `scripts/deploy-bana-static.sh --check`; inspect the changed files, and only run `--deploy` if appropriate for the official NASA submission stage. The existing deployment script backs up changed server files and verifies HTTPS served content; do not manually delete public files or overwrite unrelated site data.

Review `/`, `/en/`, all slide chapters (especially intro skip), `/about/`, `/en/about/`, Explorer and scientific catalog on mobile and desktop. Confirm logo is transparent, no unexpected horizontal scrolling or nested input overlap, language-switch continuity, real NASA source availability and browser CORS for USGS/EONET. Public production is not claimed until after manual checks.
