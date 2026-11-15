# Project Uriel website and TELLURIS Explorer 0.1

Static sources: `website/public/`; no server-side runtime, npm installation or database is required on BanaHosting.

## Routes

| Route | Function |
| --- | --- |
| `/`, `/es/` | Project Uriel home |
| `/telluris/`, `/es/telluris/` | TELLURIS scientific project description |
| `/telluris/explore/` | **Working experimental scientific application** |

The explorer loads a versioned, authentic NASA POWER-derived 1985–2025 archive for Liberia/Limón; it can also request NASA POWER directly or import original NASA JSON. It offers temperature and rainfall, year ranges, an annual chart, Theil–Sen slope, a *clearly provisional* original Mann–Kendall p-value, lag-one diagnostic, data provenance, table and CSV export. Grid data are not ground-station readings. Large precipitation shifts require independent product-homogeneity checks.

## Local operation

```bash
cd website
node --test tests/science.test.js
cd public
python -m http.server 8765
# open http://localhost:8765/telluris/explore/
```

The site uses ES modules and needs to be served over HTTP(S) rather than opened by file://. The archived annual dataset is at `public/telluris/explore/data/exp001-annual.json` and links to NASA original-response hashes and the successful EXP-001 GitHub Actions run.

## Deployment

Upload **the contents** of `website/public/` into the actual `projecturiel.earth` document root in BanaHosting cPanel, without overwriting production SSL/.htaccess configuration. GitHub source commits do **not** deploy automatically. The `.github/workflows/explorer-qa.yml` workflow packages this tree into a deployment ZIP after unit tests and an HTTP smoke check.

The browser's direct NASA call depends on NASA's CORS/service availability; the archived source and JSON import are independent fallback paths. NASA is not affiliated with or endorsing this independent Space Apps participant product.
