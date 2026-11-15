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
