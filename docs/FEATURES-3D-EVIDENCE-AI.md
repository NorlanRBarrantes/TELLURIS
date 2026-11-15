# 3D Globe, Scientific Evidence Assistant, and AI Roadmap

Date: 2026-11-15. Status: Source implemented in main; CI and public-browser/deployment verification must be checked separately.

## Implemented 3D geographic navigation

- The Spanish and English Explorer include a WebGL globe from website/public/assets/globe.js.
- Three.js r170 is dynamically loaded from pinned jsDelivr CDN. Three.js is MIT licensed.
- Coastline geometry uses local ne_110m_land.geojson, Natural Earth public-domain land outlines.
- Clicking a marked point selects Liberia or Limón, while selecting an arbitrary sphere position fills custom coordinates and clears stale results. No observation is inferred from a map pixel.
- The globe colors are schematic, not NASA climate measurements. Accessible location buttons and the original scientific form remain if WebGL fails.
- The browser needs internet access to load Three.js. The static hosting does not require Node.js or Python server processes.

## Implemented evidence explanations and location comparison

- Existing NASA POWER-derived series, Theil–Sen slopes, original Mann–Kendall p values and lag-one diagnostics are reused. The statistical computation itself was not changed.
- When loading the archived real NASA dataset for Liberia or Limón, the Explorer also computes the same variable and period at the other sample point and describes both slopes separately.
- This is a point-to-point descriptive comparison. It is NOT a validated hypothesis test of differences between slopes, a regional average, or proof of causality.
- The deterministic evidence module responds to selected question categories: trend, provenance, limitations, original p-value and comparison. It only uses the currently loaded analysis, with warnings about provisional climate inference.
- Node tests in website/tests/evidence.test.js check claim guardrails and comparison wording. Real browser verification remains separate from syntax and unit tests.

## Generative AI: designed, NOT connected

The current scientific assistant is rule-based and is NOT a connected LLM. A true LLM integration must be conditional on a server-side adapter and security acceptance:

1. Confirm BanaHosting can host a secure API endpoint and outbound HTTPS; do not assume support.
2. Store provider API keys in server-only secrets, never in public JavaScript or git.
3. Allowlist scientific variables, methods, coordinates and URLs. Rate limit requests and bound costs.
4. Pass immutable structured evidence containing exact NASA dataset/source, timestamps, units, point coordinates, slope, period, n, original p-value and explicit provisional warnings.
5. Use schema-constrained responses, a claim checker against source evidence and safe refusal for missing data. The LLM cannot overwrite the scientific engine's calculations.
6. Add adversarial prompting tests, model identification and transparent AI-use disclosures before shipping a public generative assistant.

## Independent attribution

- NASA POWER data source: https://power.larc.nasa.gov/ . NASA does not endorse this participant project.
- Natural Earth: https://www.naturalearthdata.com/about/terms-of-use/ (public domain). Source dataset: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson .
- Three.js r170: https://github.com/mrdoob/three.js/tree/r170 (MIT license).

## Verification checklist (not yet claimed as passed)

- node --check website/public/assets/globe.js
- node --check website/public/assets/evidence.js
- node --test website/tests/*.test.js
- Manually open ES/EN, rotate globe, select both sample points, select custom coords, and verify result reset.
- Validate local Natural Earth fetch, CDN fallback, archived paired sample, chart and provenance.
- Confirm the public domain uses the committed new static files; a GitHub commit does not publish on BanaHosting.
## EXP-008 follow-up — real NASA geospatial imagery

The original implementation documented above was a geography-only WebGL selector. That limitation is superseded at **source level** by [EXP-008 NASA GIBS globe](EXP-008-NASA-GIBS-GLOBE.md): authentic Blue Marble, dated Terra MODIS true-color and L3 daytime land-surface-temperature images rendered as selectable globe layers. The WMS source responses at 1536×768 and CORS were independently checked in [NASA probe #43767438162](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43767438162). ES/EN source CI passed 89/89 tests in [run #43767427309](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43767427309). **No updated BanaHosting browser release or visual verification is yet claimed.** MODIS land-surface temperatures cannot substitute for POWER T2M or be extracted from screenshot RGB values; generative AI remains disconnected.
