# EXP-009 — Global Earth Systems Observatory and evidence-grounded research

**Project:** Project Uriel / TELLURIS · NASA Space Apps Challenge 2026  
**Date:** 2026-11-15 (America/Costa_Rica)  
**Status:** source implementation completed in GitHub; original 2023 source-batch probe and automated site tests executed. BanaHosting deployment and manual browser verification remain pending.

## Overview

This release turns the existing single-parameter Explorer into a four-mode evidence investigation lab while keeping original EXP-001–008 functions intact. The NASA GIBS Earth globe becomes a full-width primary visualization; below it a bilingual observatory exposes parameter-by-parameter NASA source comparisons, unit-aware charts, predeclared hypothesis cards and deterministic plain-language questions.

## Four comparative modes

1. **One variable / one location** — one NASA POWER parameter at the selected point and annual series.
2. **One variable / two locations** — one NASA POWER parameter at two points, original-unit chart and matched-calendar-year A-minus-B descriptive Sen slope.
3. **All 18 variables / one location** — all verified source codes grouped by original NASA community; 18 source-labeled result rows, their respective units and completeness.
4. **All 18 variables / two locations** — source requests for two points and 18 parameters; optional detailed comparisons by variable and paired annual years.

Both research points can be preset Liberia (10.63,-85.44), Limón (9.99,-83.03) or custom valid coordinates. Duplicate coordinates are rejected. The original archived EXP-001 proof covers ONLY T2M and PRECTOTCORR in Liberia and Limón. The other 16 are explicitly marked unavailable rather than simulated.

The NASA POWER Monthly API (https://power.larc.nasa.gov/docs/services/api/temporal/monthly/) permits up to 20 parameters per point; the currently source-verified set is split into **9 RE and 9 AG parameters**. This means a full two-location live comparison needs four sequential requests, not 36 independent requests. Missing or failed responses remain visible. Every NASA response must match its requested coordinates and validated native units before annual aggregation.

## Verified original NASA evidence

[Original NASA POWER grouped source probe #43771373529](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43771373529) succeeded 2026-11-15:

- Liberia, RE community, 9 parameters: HTTP 200 and 9 complete 2023 annual series.
- Liberia, AG community, 9 parameters: HTTP 200 and 9 complete 2023 annual series.
- Limón, RE community, 9 parameters: HTTP 200 and 9 complete 2023 annual series.
- Limón, AG community, 9 parameters: HTTP 200 and 9 complete 2023 annual series.

**36 real NASA site-parameter series for 2023** were returned and inspected for source units, complete months and expected coordinates. This is a 2023 API capability test, NOT a successful public-browser 1985–2025 study, proof of physical model homogeneity or validated statistical significance.

## Scientific safeguards

- The comparative matrix shows **descriptive Theil–Sen slopes** per decade, retaining each NASA POWER parameter's own units. No universal scale, no mixed-unit ranking, no all-variable significance labels.
- Wind direction WD10M is circular; never display a linear Sen slope for this angle.
- Two-site A-minus-B differences use only years with observations in both source series.
- Original single-variable EXP-005 Mann–Kendall p and confidence limits remain conditional on explicitly disclosed statistical assumptions.
- Looking at 18 variables introduces multiplicity and possible common upstream NASA data dependencies. A coincident direction or association does not demonstrate a physical cause.
- No fabricated or interpolated measurements, dates, source hashes or scenario outputs.

### Exactly five predeclared source-aware context clues

The observatory evaluates first differences between **consecutive matched annual years**, only with 12 or more matching changes, using Pearson r. This is descriptive, hypothesis-generating, and does not include a p-value or causal claim.

1. PRECTOTCORR / GWETROOT — rainfall versus root-zone soil wetness.
2. PRECTOTCORR / RH2M — rainfall versus relative humidity.
3. T2M / RH2M — air temperature versus relative humidity.
4. CLOUD_AMT / ALLSKY_SFC_SW_DWN — cloud cover versus solar shortwave input.
5. T2M / PRECTOTCORR — air temperature versus precipitation.

First differencing reduces but does not eliminate trend-driven correlations, autocorrelation, spatial support mismatch or upstream product dependence. These pairings do not establish causal mechanisms.

## Plain-language interpretation versus real generative AI

The new bounded, deterministic explainer answers evidence questions on parameter names, descriptive slope directions, matched-year differences, potential causes that cannot be established, basic uncertainty and the predeclared clues above. It only uses previously computed NASA evidence and does not rewrite scientific calculations. Keyboard-focusable help defines Theil–Sen, p-values, confidence intervals, matched-year contrasts and NASA point-grid limitations.

**This is not a connected generative AI/LLM.** Optional true AI still requires a server-side HTTPS proxy, private provider credentials outside the webroot/Git, structured immutable numeric context, source citations, prompt-injection resistance, cost/rate caps and clear no-evidence refusals. No key is inserted in browser JavaScript; AI claims are not invented.

## 3D map, hover and optional atmosphere

NASA GIBS Blue Marble, dated Terra corrected true color and daytime MODIS land-surface-temperature visuals retain EXP-008 data provenance, native source legend and geography alignment. The full-width Earth globe has longitude/latitude hover tooltips (geography only, never numerical climate data), zoom/reset, accessible keyboard rotation and marker-to-research-form handoff.

A separate, opt-in instructional animation can show stylized wind streaks after loading annual WS10M values, or stylized rain after loading annual PRECTOTCORR totals. Both cases show actual loaded source metadata and clarify that motion direction and positions are decorative, NOT spatial NASA wind/rain maps, current weather or forecasts. Reduced-motion preferences disable particle animation. Missing, invalid or changed data block illustration.

## Shared design treatment

Global site appearance across Project Uriel landing, TELLURIS presentation, catalog and Explorer is refined with a single source CSS theme. The Observatory adds responsive mode selection cards, statistics, scrollable scientific matrix, original-unit chart, explanatory cards and scientific provenance. User-facing text is Spanish/English; source code, Conventional Commits, validation and methodology are English.

Relevant files:

- website/public/assets/matrix-core.js: grouped requests, annual comparisons, predeclared clues and deterministic narrative.
- website/public/assets/observatory.js and observatory.css: responsive evidence lab.
- website/public/assets/globe-weather.js and globe.js: source-gated motion and geographic hover.
- website/public/assets/site.css: shared design system.
- website/tests/matrix-core.test.js and globe-weather.test.js: data-source and interface regression tests.
- .github/workflows/exp009-power-batch-probe.yml: original NASA source compatibility verification.

## Deployment and manual acceptance

After a **green** latest Actions run (Node tests, source syntax, localhost HTTP smoke and site bundle), compare the GitHub checkout with BanaHosting using scripts/deploy-bana-static.sh --check. Review changes; deploy with --deploy only when official contest delivery is protected. The script backs up the previous site and verifies changed files over HTTPS. A GitHub commit is not a production release.

A person must still test in an actual browser: Spanish and English; full-width NASA globe; geographic marker/texture alignment; hover lat/lon; wind/rain source gating; all four comparison modes; archive showing exactly 2 available and 16 unavailable; 2023 live API grouping and full 1985–2025 data; selected variable chart and links; no cause/significance hallucinations; existing single-variable JSON/CSV/PDF exports and EXP-006 import; mobile widths and screen-reader affordances.

**Submission caution:** a real source API probe plus passing synthetic/source tests does not equal complete independent climate validation. No original GPM IMERG files or generative assistant were added in this release.

## Latest source-verified historical coverage and extended deliverables — 2026-11-15

**[NASA POWER full-period grouped source probe #43773261601](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43773261601) — PASS.** The original NASA monthly API responses for Liberia and Limón, RE/AG and all 18 codes were parsed over 1985–2025. Of 36 source/site combinations, **34 have 41 complete annual years (1985–2025)**. The other **two are surface albedo ALLSKY_SRF_ALB**, with **25 complete years (2001–2025)** and explicitly missing 1985–2000 at both locations. This verifies source coverage, not long-term homogeneity, causal interpretation or statistical significance. The comparative matrix presents each series' real date range and count.

The observatory also includes:
- **Editable site A controls directly in the Observatory** (site, coordinates, variable and start/end years), synchronized with the original single-variable form and globe.
- **Original-source comparative JSON export**, preserving source metadata, query links, all available source-derived annual observations, missing-data decisions, per-zone coordinates, original units and same-year pair contrasts. **CSV** is a concise summary, not a row-by-row annual export.
- **Plain-language evidence explanations** for common questions such as which zone has higher mean rainfall, computed on matched-calendar-year NASA observations, not an unrestricted generative model.
- **Focused scientific help**, hover/focus definitions for conditional Mann–Kendall p, Sen trend and CI, and five predeclared, noncausal cross-variable clue cards.

**[GitHub website QA #43773623733](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43773623733) — PASS 107/107** Node source/site tests, JS syntax and localhost HTTP checks, including evidence export, source absence behavior, source-gated atmosphere and bilingual controls. This does **not** constitute a full real-browser WebGL interaction test or publication on BanaHosting.

**Release gate remains open:** EXP-009 was committed to GitHub main but no new BanaHosting deployment output or public-browser screenshots have been supplied. The next release must use the existing backed-up dry-run/deploy and HTTPS-integrity procedure and then actual ES/EN/mobile checks.
