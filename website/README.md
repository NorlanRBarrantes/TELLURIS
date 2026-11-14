# Project Uriel website — initial public landing snapshot

**Version:** initial landing, 2026-11-14  
**Maintained in:** `NorlanRBarrantes/TELLURIS` (source snapshot)

## Pages

| Route | Source |
| --- | --- |
| `/` | `public/index.html` |
| `/telluris/` | `public/telluris/index.html` |
| `/es/` | `public/es/index.html` |
| `/es/telluris/` | `public/es/telluris/index.html` |

This is a standalone, static HTML/CSS/JS site: no build step, database, credentials, live NASA API request or real-data scientific result. The interactive research-question builder produces only questions. Original OG art resides in `public/assets/`. No external front-end libraries.

## Deployment

Copy **contents of `website/public/`** into the verified BanaHosting document root for `projecturiel.earth`; do not copy the enclosing directory. Never overwrite the current production `.htaccess` blindly. See [DEPLOYMENT.md](DEPLOYMENT.md). GitHub commits here **do not deploy automatically**.

## Version integrity

The full initial ZIP delivered to the team was `Project_Uriel_TELLURIS_Website_2026-11-14.zip`. This directory preserves the site assets from the bundle (and the deployment documentation), not server-private data. Website source has its own area so future TELLURIS statistical experiments remain untouched.

Status: website landing content only. Scientific methods and findings must be backed by real NASA observations and verified results. See `docs/VALIDATION.md`. Not endorsed by NASA.
