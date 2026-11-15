# Technical architecture — implemented MVP and planned source-adapter expansion

## Current verified baseline (2026-11-14)

TELLURIS Explorer 0.1 is **already implemented**, with static HTML/CSS/native JavaScript modules under `website/public/`, a shared scientific module `website/public/assets/science.js`, real NASA POWER meteorological time series for Liberia/Limón and an archived NASA-origin annual dataset. Source access works in the user’s browser according to their supplied public-site screenshots. The Spanish-first/English mirror route code is committed to GitHub and needs its deployment status verified separately.

The original TypeScript+React/Vite design below remains **an earlier proposal only**; do not present it as the actual MVP. No server-side Python, Node, PHP API or permanent database is required for the current deployed static code.

**New formal direction:** A guided and multi-source Earth-system explorer, with source-specific adapters. POWER point samples, MODIS rasters, SWOT river reaches, GRACE water-storage anomalies and ocean along-track/area observations have **different spatial supports and data semantics**. A generic variable selector is not sufficient without dataset-specific normalization, QA and eligibility checks. See [formal scope](SCOPE-2026.md) and [variable catalog](VARIABLE-CATALOG.md).

## Design principles

- Prioritize scientific verifiability and reproducibility over visual effects.
- Make NASA source metadata first-class application data.
- Prefer a small build compatible with shared hosting.
- Separate data retrieval, scientific calculation, and UI presentation.
- Do not publish credentials, debug files, or unvalidated scientific claims.

## Hosting-aware baseline

The current public team website is at **https://projecturiel.earth/**, hosted on BanaHosting shared hosting. The older https://telluris.lynxglobals.net/ is a previous candidate hostname, **not** the current canonical Explorer route. Actual public Explorer route: https://projecturiel.earth/telluris/explore/. Backend PHP/Python runtime availability remains unverified and is not required for the static MVP.

**Historical framework proposal (NOT the current implementation; reconsider only if required):**
- Responsive frontend: TypeScript + React, compiled with Vite to static files.
- Browser UI: a lightweight map and time-series visualization library after license/accessibility review.
- Backend: minimal PHP API/proxy only if cross-origin data access or caching requires it.
- Analytics: deterministic, tested algorithms; run locally/offline where necessary and make results inspectable. Optional Python reference calculations for validation are development tools, not a production dependency.
- Data: NASA POWER historical API; optional persisted JSON examples with explicit source provenance.

**Why not assume FastAPI in production?** Generic cPanel can support Python deployment when the relevant server feature is installed, but the specific shared-hosting account's Python/ASGI support has not been confirmed. Avoid making permanent Python workers, Docker, SSH, or Node.js servers mandatory until verified.

## Logical flow

User selects location, variable and date range
→ input validation and source metadata
→ NASA API retrieval via browser or narrow server proxy
→ data quality / temporal normalization
→ independently tested trend computations
→ time-series chart + interpretation + provenance
→ optional export

## Security and reliability boundaries

- Permit only a fixed HTTPS NASA API host in any server-side proxy; never proxy arbitrary user URLs (SSRF prevention).
- Strictly validate latitude, longitude, time span, and variable allowlist.
- Set outbound timeouts, response size limits, retries with bounds, and appropriate caching.
- Do not let users pass arbitrary file paths or URLs to the backend.
- No secrets in frontend assets or committed history.
- Handle upstream errors gracefully with a visible data-unavailable state.
- Do not silently fall back to invented results.
- Avoid saving personal information and refrain from adding unnecessary login.

## Client-side statistical engine — proposed, not yet benchmarked

An external analysis proposed implementing deterministic analysis in TypeScript, optionally in a Web Worker, with Python/SciPy/pyMannKendall used locally or in CI as an independent reference. This is **plausible** for modest annual/monthly series and compatible with static hosting; it remains a candidate until numerical correctness, performance and browser behavior are tested.

The public site would preferentially load a static build. A narrowly scoped PHP proxy/cache may help with cross-origin requests or upstream outages **only if the actual shared-hosting account supports the required network and filesystem operations**. No real BanaHosting capability, subdomain deployment, guaranteed cache latency or uptime has been verified. Cached demonstrations must identify their source/period/version and must never masquerade as fresh data.

An API schema should distinguish observations, provenance, QA warnings, method identifiers and optional outputs. Do not freeze fields for experimental methods that have not been implemented. See [Scientific guardrails](SCIENTIFIC-GUARDRAILS.md).


## Optional prototype hardware — no hosting dependency

A research contribution proposed an ESP32 touch-display console for showing comparison results. This **is not a requirement** of TELLURIS or the NASA challenge. Device availability, exact model, display resolution, firmware stack, and connectivity remain unverified.

If undertaken **after** a working, tested web analysis, the device should consume a small, versioned, read-only result payload with: location label, parameter, units, source, period, slope and units, p-value, test method, data timestamp, quality flags, and a clearly descriptive (not alarmist) significance label. If results have not been computed, display "unavailable" instead of guessed values.

No claims of live Earth sensing, real-time warning, disaster forecasting, or sensor data capture are justified by a screen that displays historical NASA-derived results. Serial/Wi-Fi transport is a demo-specific optimization, not part of the mandatory public shared-hosting architecture.


## Proposed code organization

- website/public/ — **implemented** static frontend, shared browser scientific module, NASA archive and bilingual pages
- api/ — optional hosting-compatible backend, once implemented
- analysis/ — **implemented** Python EXP-001 NASA-backed analysis and experimental validation scripts
- tests/ and website/tests/ — **implemented** scientific/parser and site/i18n automated tests
- docs/ — public review-ready project record
- docs/_working/ — non-sensitive temporary working notes, removed before submission

The implemented paths above are present; `api/` and other backend notes remain **only optional architecture targets**, not claims of running services.

## Architecture validation gate

Before implementation is finalized, inspect cPanel runtime and site document root; verify whether external HTTPS requests work, whether URL rewriting is available, and whether any backend runtime is necessary. If server-side capabilities are limited, prefer a statically deployable demonstration with verifiable precomputed NASA-backed cases.

## Scientific discovery catalog and connector gating — 2026-11-15

The team research index is stored as static versioned JSON at `website/public/telluris/catalog/data/catalog.json`, with a bilingual read-only search interface at `/telluris/catalog/` (ES) and `/en/telluris/catalog/` (EN). Scientific entries distinguish **connected** NASA data (2), **research** topics (49) and **derived** indicators (10). The browse interface can only route connected NASA values to the existing Explorer. No API route is invented for unsupported variables.

The future connector contract must distinguish `source_dataset`, `measured_or_estimated_quantity`, `phenomenon_or_event`, `derived_indicator`, `spatial_support` (model grid/region/river reach/event), `temporal_support`, `data_quality` and `validation_state`. Seismic catalogs and FIRMS event records must not be treated as meteorological monthly point observations. The versioned team source and corrections are preserved in [catalog review](TEAM-CATALOG-REVIEW.md).
