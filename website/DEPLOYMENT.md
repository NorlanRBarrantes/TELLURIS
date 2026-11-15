# Project Uriel — public web site (deployable static bundle)

Prepared: 2026-11-14. Deployment is **not** performed by this package.

## Scope and URLs

| Public route | Language | Purpose |
|---|---|---|
| `/` | English | Team identity and large TELLURIS call to action |
| `/es/` | Spanish | Team identity in Spanish |
| `/telluris/` | English | Science-first product research preview |
| `/es/telluris/` | Spanish | Product research preview in Spanish |

Built as plain HTML/CSS/JavaScript, with no external dependencies, tracking cookies or build-time production server.

## Deployment to BanaHosting

1. Back up the current contents of the cPanel document root shown for `projecturiel.earth`: `/home/cvzvwazj/projecturiel.earth/`.
2. Upload the **contents of this bundle's `site/` directory**, not the enclosing directory, to the domain document root. You should end up with `/home/cvzvwazj/projecturiel.earth/index.html` and `/home/cvzvwazj/projecturiel.earth/telluris/index.html`.
3. If the root already contains an `index.php` or `index.html` placeholder, back it up and remove it from the public document root after confirming it is not needed by an active app. If both exist and Apache picks the PHP index first, ask cPanel support or set `DirectoryIndex index.html index.php` in your existing `.htaccess`.
4. Do **not** overwrite the existing `.htaccess` if it is responsible for HTTPS. `.htaccess.example` is an optional rule and must be merged carefully only when needed.
5. Verify HTTPS and canonical paths in an anonymous browser; check all 4 routes, CSS/JS, navigation, links and `/robots.txt` and `/sitemap.xml`.
6. If deployment succeeds, document the actual verification UTC time, live URL and certificate/routing test in the TELLURIS repository. The new location does not prove the planned analysis app has been deployed.

### Safe cPanel terminal inspection (read only)
```bash
ls -lah ~/projecturiel.earth
ls -lah ~/projecturiel.earth/telluris
curl -sSI https://projecturiel.earth/
curl -sSI https://projecturiel.earth/telluris/
curl -sSI https://projecturiel.earth/es/
curl -sSI https://projecturiel.earth/es/telluris/
curl -sSI https://projecturiel.earth/sitemap.xml
```

## Validation and integrity

- No live NASA data is retrieved. The interactive question builder drafts **questions only**; it never computes a trend.
- QA claim (11 synthetic tests passed) comes from TELLURIS `docs/VALIDATION.md`, 2026-11-14 and is explicitly not a real-data result.
- External source references: [NASA challenge](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/), [NASA POWER](https://power.larc.nasa.gov/), [NASA POWER monthly API](https://power.larc.nasa.gov/docs/services/api/temporal/monthly/).
- Design and OpenGraph images are original assets. No NASA insignia or NASA-sourced imagery is used.
- The connected GitHub source repository `NorlanRBarrantes/TELLURIS` was **private** at preparation time and is not linked from the public pages.
- This bundle is not the planned functioning scientific product; it is a public introduction and a useful interactive research-question draft.

## Repository alignment checklist

TELLURIS `docs/DECISIONS.md` currently contains ADR-004 specifying a planned app at `telluris.lynxglobals.net` and `docs/DEPLOYMENT.md` also mentions that planned endpoint. Record the newly selected site information in the repo before final submission:

- Team home: `https://projecturiel.earth/`.
- Public TELLURIS introduction: `https://projecturiel.earth/telluris/`.
- Previous app endpoint `https://telluris.lynxglobals.net/`: clarify as a secondary/legacy candidate until deliberately retired (do not quietly contradict accepted ADR-004).
- Do not state that the scientific engine is deployed or scientifically validated without actual evidence.
- Preserve the existing Python analysis and test pipeline; this landing package does not replace them.
- Update AI-use disclosure to mention assistance in preparing this static website.
- Record public deployment QA evidence with date and tested route statuses in `docs/VALIDATION.md`.

## SEO

Static title/description, `lang` and hreflang, canonical URL, OpenGraph, Twitter preview, `robots.txt`, `sitemap.xml`, descriptive internal links and JSON-LD WebPage/WebSite metadata are provided. Indexing is controlled by search engines, not guaranteed. After publishing, verify a domain property in Google Search Console and submit `https://projecturiel.earth/sitemap.xml`.

## Copyright

Original site source and illustrations prepared for Project Uriel. The pages link to NASA data sources, but do not claim to be a NASA product or imply NASA endorsement.


## TELLURIS Explorer 0.1 static release

This bundle now includes the functional `/telluris/explore/` route, associated browser ES modules/CSS and authentic NASA POWER-derived archived annual series. The [Explorer QA workflow](../.github/workflows/explorer-qa.yml) packages a static-site ZIP once the 12 JavaScript scientific tests and local HTTP smoke checks pass.

To update a site that is already running on BanaHosting, retain the existing HTTPS/.htaccess setup, back up the current document root, then copy the **contents** of `website/public/` (or the CI ZIP contents) into that root. Verify `/telluris/explore/` loads the archived series, and attempt **Request live NASA data** separately; the latter may be restricted by cross-origin browser policy. Do not claim production deployment until it is confirmed from a browser.

The browser displays exploratory Theil–Sen and original MK computations on authentic NASA-derived model data; this is not a publication-grade climate significance inference.
