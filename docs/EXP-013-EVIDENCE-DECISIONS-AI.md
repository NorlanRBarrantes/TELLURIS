# EXP-013 — Evidence-first decision dashboard and optional secure AI

**Date:** 2026-11-15 (Costa Rica).
**Status:** GitHub source implemented; 137/137 Node/HTTP/static checks and local Chromium ES/EN desktop/mobile QA passed. Public BanaHosting release and manual live NASA/AI server QA remain unverified. The optional generative AI endpoint is **not live**, has **no repository credential** and is **disabled by default**.
**Baseline:** EXP-012 visual identity, 18 NASA POWER parameters and four existing investigation modes.

## Issue found in code (not a confirmed live-page screenshot audit)

The English and Spanish Explorer include four technical KPI counters (available series, positive/negative slopes and missing sources), an 18-variable evidence matrix and an explanation block near the end. These are honest but make the visitor work too hard to find a selected variable's **actual latest value, unit, slope/decade, annual coverage or matched-year two-site difference**. The first mode also requested all 18 variables at two locations, even before the visitor selected an intended scientific question. The source-first caveats are important but visually compete with data.

The public URL https://projecturiel.earth/en/telluris/explore/ was not directly accessible to the available external audit fetcher. **Do not present this as a witnessed production-browser screenshot review.**

## Implemented browser UX (EXP-013)

1. Default selected mode changed to **one variable, two locations** as a fast guided NASA comparison; the other three established modes remain available. Original NASA requests still require explicit user action.
2. A **selected-variable decision snapshot** appears ahead of the raw source matrix:
   - Latest annual reading A, with NASA-native units and actual data year.
   - Descriptive Theil–Sen slope per decade; empty for circular wind direction / missing data.
   - Observed annual sample coverage `n / requested years` (not a quality or confidence score).
   - Same-calendar-year A−B latest paired difference when available; otherwise A's historical mean.
3. A transparent five-part **decision support panel**: what the source shows; possible influences to test; conditional scenario (explicitly not a forecast); short-term checks; longer-term monitoring/planning options.
4. Guidance is **deterministic and source-type-specific**, uses measured/derived values from the existing numerical engine, and never claims local causal attribution, hazard prediction, risk scoring, policy authority or validated significance. All 18 parameters have domain-specific guidance in ES/EN.
5. The original science matrix is placed behind an accessible details disclosure; available original units, downloads, correlation clues, statistical inference and advanced research form remain unchanged.
6. Every selected-source change updates the visible decision snapshot. Missing NASA series and angular wind prevent invented trend claims.
7. An explicitly optional **Generate AI interpretation** control sends a constrained source brief only after a user's click. It neither exposes a browser key nor pretends to be connected when the server endpoint is unavailable. It reports a clear unavailable state and the deterministic guidance stays visible.

## Scientific reliability and model separation

**Data path:** original NASA POWER -> existing source parser + aggregation -> 18-series matrix -> existing Theil–Sen descriptive values / matched-year pairs -> deterministic snapshot. The deterministic numerical core remains authoritative; generated interpretations cannot write to source records or alter charts, values, statistical limits or original CSV/JSON exports.

**Interpreting future consequences:** use hypotheses and conditional considerations only; an observed historical slope is **not a numerical prediction**, risk level or policy directive. Temperature, precipitation, solar radiation, soil wetness, wind direction and event catalogs have different meanings. Do not infer earthquake risk from NASA POWER or forecast a drought from precipitation slopes. Modelled/satellite products require independent checks before management interventions.

## Optional generative AI architecture: staged, NOT production-connected

- A PHP reference adapter is available at `backend/telluris-ai.php` **outside the public static deployment root**. The regular deploy script excludes PHP; this is intentional. Do not auto-install the endpoint or modify live cPanel scripts without a controlled operator review.
- Only after testing BanaHosting PHP version, cURL, outbound HTTPS certificate chain, temp directory permissions and source endpoint path, install this file manually as `/api/telluris-ai.php` under a verified PHP-enabled document root. Keep `TELLURIS_AI_ENABLED` unset/disabled until ready.
- Set `OPENAI_API_KEY` and `TELLURIS_AI_MODEL` via secure **server** configuration/environment outside Git and public directories. Never send these to JavaScript. Use restricted provider project credentials and provider spend limits.
- Adapter requires same-origin `Origin`, expected `Host`, custom request header, POST, small JSON payload with allowlisted parameter/years, hard HTTP timeouts, no redirects, TLS validation, fixed 3/hour/IP and 60/day global server-side counters; no user database. These controls reduce abuse but **are not an authenticated enterprise-grade API**, and should be independently security tested before enabling.
- The browser payload contains a selected code, selected coordinates, annual observations, descriptive slope and source metadata; the model receives these values only after direct opt-in. Users must know third-party processing may occur; do not send private information.
- The LLM only explains provided evidence as provisional, proposes testable physical influences and general short/long-term monitoring options. It cannot add or change measurements. The adapter returns explicitly `model_generated_not_scientifically_validated`; rendering uses `textContent` to prevent HTML injection.
- Failure, provider 429, missing PHP or unavailable env leave the non-generative decision brief in place. No mock AI output is presented as generated.
- Before activation: negative security tests (cross-origin, malformed body, rate, denied credentials), browser privacy consent/disclosure test, model prompt-injection evaluation, JSON/schema/claim checks, provider token/cost policy and manual NASA-original reproducibility check.

## Acceptance and release checklist

- [x] GitHub Actions [`explorer-qa` 137/137 tests, static bundle](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43797114489) green after EXP-013.
- [x] Automated local Chromium ES/EN desktop/mobile journey, source archive, advanced disclosure and responsive no-overflow checks ([run #43797114547](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43797114547)); [ ] independent manual screen-reader and live-domain checks.
- [x] Source-archived original EXP-001 T2M and PRECTOTCORR fed into four KPI values and matched-calendar-year difference tests, with source-preserving synthetic negative checks; this is not new physical source validation.
- [x] Wind direction remains circular, no Sen trend KPI, by automated test.
- [ ] NASA network failure produces no fake observations or fabricated advice.
- [ ] All 18 variable categories display contextual and correctly conditional noncausal guidance.
- [x] Source matrix, existing numeric exports and advanced disclosure retained in source/Chromium QA.
- [ ] No LLM enabled or secrets shipped by static deploy; optional backend path verified separately.
- [ ] Full screenshot/browser audit on BanaHosting after explicit operator deployment and rollback plan.
- [ ] If AI is activated later, document configured model, provider license/privacy, secure endpoint tests, cost and evidence safeguards in VALIDATION and AI-USE.

## Method references

- NCAR Climate Data Guide, trend-analysis assumptions and dependence: https://climatedataguide.ucar.edu/climate-tools/trend-analysis
- NASA POWER API and source methodology: https://power.larc.nasa.gov/docs/services/api/temporal/monthly/
- OpenAI API key protection: https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety
- Existing EXP-005 scientific significance: [EXP-005](EXP-005-SIGNIFICANCE.md)
- Existing EXP-009 matrix: [EXP-009](EXP-009-OBSERVATORY.md)
- Existing visual design: [EXP-012](EXP-012-VISUAL-IDENTITY.md)

## EXP-013 verification outcome (2026-11-15, Costa Rica)

- Production and public-browser deployment are **not witnessed** by these GitHub Actions. The static bundle was produced; the deployment job was **skipped**, not successful in production.
- The first Chromium run found an existing stale `obs-drilldown` DOM reference, which prevented the new decision panel from rendering. Corrected in commit `c51586c`. Both subsequent source tests and Chromium acceptance passed. The failed run is intentionally preserved for traceability.
- [Static suite: 137 passed, 0 failed](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43797114489); [Chromium acceptance: success](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43797114547), with screenshots in the retained `telluris-exp010-browser-qa` artifact. Images are local-test renderings, not screenshots from the public domain.
- Optional server backend has not had a verified host PHP lint, auth/rate-limit live penetration test, provider test or deployed credential; keep `TELLURIS_AI_ENABLED` off. Provider response is user-initiated, model-generated and **not** an independently audited climate conclusion.

## EXP-014 status superseding earlier optional AI UI

The team reported HTTP 404 on the optional generative button, which was removed in GitHub commit `122c92f`. The earlier in-browser opt-in references in this file are superseded historical design notes, not current functionality. The deterministic source-grounded interpretation remains. The server-side model prototype has never been deployed. Browser validation for this change is pending because GitHub Actions encountered a repository checkout access failure; the source test suite passed.

### EXP-014 browser QA confirmation

After an initial `actions/checkout` private-repository authentication failure, the second attempt of [workflow #43799927195](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43799927195) succeeded with `EXP010_BROWSER_ACCEPTANCE_PASS`, preserving bilingual desktop/mobile and archive flows. This confirms local generated site behavior, not the public BanaHosting host.
