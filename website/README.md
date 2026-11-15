# Project Uriel website and TELLURIS Explorer 0.1

Static sources: `website/public/`; no server-side runtime, npm installation or database is required on BanaHosting.

## Routes

| Route | Function |
| --- | --- |
| `/` | **Spanish (default)** — Project Uriel home |
| `/telluris/` | **Spanish (default)** — TELLURIS project |
| `/telluris/explore/` | **Spanish (default)** — scientific explorer |
| `/en/`, `/en/telluris/`, `/en/telluris/explore/` | Matching English pages |
| `/es/`, `/es/telluris/` | Legacy Spanish links retained, canonicalized to root routes |

The explorer loads a versioned, authentic NASA POWER-derived 1985–2025 archive for Liberia/Limón; it can also request NASA POWER directly or import original NASA JSON. It offers temperature and rainfall, year ranges, an annual chart, Theil–Sen slope, a *clearly provisional* original Mann–Kendall p-value, lag-one diagnostic, data provenance, table and CSV export. Grid data are not ground-station readings. Large precipitation shifts require independent product-homogeneity checks.

## Local operation

```bash
cd website
node --test tests/*.test.js
cd public
python -m http.server 8765
# open http://localhost:8765/telluris/explore/
```

The site uses ES modules and needs to be served over HTTP(S) rather than opened by file://. The archived annual dataset is at `public/telluris/explore/data/exp001-annual.json` and links to NASA original-response hashes and the successful EXP-001 GitHub Actions run.

## Deployment

Upload **the contents** of `website/public/` into the actual `projecturiel.earth` document root in BanaHosting cPanel, without overwriting production SSL/.htaccess configuration. GitHub source commits do **not** deploy automatically. The `.github/workflows/explorer-qa.yml` workflow packages this tree into a deployment ZIP after unit tests and an HTTP smoke check.

The browser's direct NASA call depends on NASA's CORS/service availability; the archived source and JSON import are independent fallback paths. NASA is not affiliated with or endorsing this independent Space Apps participant product.


## Spanish-first site maintenance

Spanish is the primary content language; the header language switch provides explicit ES/EN navigation. Metadata use canonical, hreflang and x-default per localized route; the sitemap includes only the six canonical URLs. The explorer's messages, chart labels, units, source metadata headings, errors and warnings are localized in `assets/explorer.js` without modifying raw NASA variables or calculations. The legacy `/es/` pages remain accessible for old bookmarks. The archived NASA annual dataset is a single shared path under `/telluris/explore/data/`.

The [bilingual CI run #43660071020](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43660071020) passed 28/28 Node tests plus static HTTP route checks. Upload the refreshed site to BanaHosting before expecting the public domain to display Spanish at root. Preserve current permissions (directories typically 755; public static files 644).

## Research variable catalog from team contribution — November 15

The Spanish-first browseable inventory is at `/telluris/catalog/`, with English at `/en/telluris/catalog/`. The site reads [catalog.json](public/telluris/catalog/data/catalog.json) and exposes **2 genuinely connected NASA POWER variables, 49 research candidates and ten proposed derived indicators**. The catalog is a discovery/roadmap interface, **NOT** a claim that 49 additional NASA source integrations work. Unconnected cards have no functional "analyze" button; the two connected items link to the existing working explorer. All records and their review provenance are in [TEAM-CATALOG-REVIEW.md](../docs/TEAM-CATALOG-REVIEW.md).

## EXP-003 vegetation research evidence (not connected)

The catalog's `C23` card (NDVI/EVI) now links to a successful [real NASA ORNL MOD13Q1 API probe](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43737483122). This is a research proof-of-capability **not an enabled third public variable**, and does not imply that MODIS multiyear statistics have been validated. The [latest website CI run #43738552963](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43738552963) passed **35/35 Node tests** plus all local HTTP smoke checks.


## New interactive geography / interpretation module

Both Explorer language routes now have a WebGL geographic globe, with a Natural Earth public-domain coastlines file and a pinned Three.js CDN dependency. The globe maps navigation points, not measured values. The deterministic evidence assistant uses only existing computed statistics and marks climate significance provisional. The archive supports an explicitly descriptive Liberia/Limón point comparison; generative AI is not connected. See docs/FEATURES-3D-EVIDENCE-AI.md for accepted scope and remaining verification.
