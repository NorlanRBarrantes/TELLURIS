# Validation and reproducibility record

**Status: EXP-001 authentic NASA input retrieved and basic trend computation independently reproduced; broader scientific inference remains pending.** This is a validation register with clearly bounded evidence.

## Verified EXP-001 real source and web QA — 2026-11-15 UTC

- **SCI-001: Complete / NASA input retrieved.** [Run #43656774519](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43656774519) queried actual NASA POWER MERRA2 JSON for Liberia and Limón, 1985–2025. Original JSON responses archived as run artifacts.
- **SCI-002/SCI-009: Actual source units/coverage checked.** API v2.10.0; T2M C, PRECTOTCORR mm/day, -999 fill; 41 complete calendar years for each point/variable; annual YYYY13 fields excluded.
- **SCI-006 (partial): Independent Sen numerical verification.** SciPy reaggregation and `theilslopes` computed from the raw NASA JSON agree to displayed numeric precision with EXP-001. Dependence-robust significance/CI is still pending.
- **WEB-001: Exploratory browser MVP unit and HTTP smoke tests complete.** [Run #43657393798](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43657393798) passed 12/12 JavaScript scientific tests, parser/metadata/year checks, Python slope parity for archived annual observations and local HTTP route/asset smoke tests. The deployable static artifact was generated.
- **Still pending:** live browser NASA CORS, public BanaHosting HTTPS/routes, accessibility and E2E interactions, multiple NASA sources, precipitation homogeneity, formal significance/uncertainty under serial dependence.

**Scientific concern:** Extremely large precipitation slopes in corrected MERRA2 may be affected by input-product or gauge-network inhomogeneity. Do not present their p-values as validated climate findings.

## Definition of scientific done

- Actual NASA response retrieved successfully and source cited.
- Dataset variables and reported units parsed from metadata.
- Original missing-value sentinels distinguished from real measurements.
- Time steps and annual aggregation verified against input data.
- Statistical computation verified independently.
- Output reproduces from a clearly documented dataset, location, range, algorithm/version.
- Result communicates slope with units, n, significance/uncertainty, limitations.
- Client error behavior tested without synthetic fallback presented as fact.

## Test matrix

| ID | Check | Status | Evidence |
| --- | --- | --- | --- |
| SCI-001 | POWER live retrieval for selected point | **Passed — real NASA source** | [EXP-001 retrieval run #43656774519](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43656774519), API v2.10.0 |
| SCI-002 | Units and temporal interpretation | **Passed — source metadata checked** | Actual T2M C, PRECTOTCORR mm/day, year 13 excluded; [EXP-001](EXPERIMENT-001.md) |
| SCI-003 | Missing/fill and incomplete-year handling | Pending | Fixture + expected result |
| SCI-004 | OLS slope against independent reference | Pending | Reproducible fixture/test |
| SCI-005 | Mann-Kendall implementation and ties | Pending | Independent library comparison |
| SCI-006 | Sen's slope and units-per-decade scaling | **Passed — independent numerical comparison only** | Re-aggregation of original NASA JSON using SciPy; [EXP-001](EXPERIMENT-001.md) |
| SCI-007 | Serial correlation / assumptions disclosed | Pending | Diagnostic or bounded caveat |
| SCI-008 | Geographic footprint and labeling | Pending | Source resolution + selected coordinates |
| UX-001 | Error, loading and no-data states | Pending | Repro steps + screenshot |
| UX-002 | Keyboard and mobile usability | Pending | Test record |
| OPS-001 | Public domain SSL / routing | Pending | Anonymous browser test |
| OPS-002 | Shared-hosting server constraints | Pending | Runtime capability record |
| SUB-001 | Public source, demo and attribution | Pending | Accessible links / submission review |

## Additional case-study and statistical gates

| ID | Check | Status | Evidence |
| --- | --- | --- | --- |
| SCI-009 | NASA POWER monthly PRECTOTCORR units and day-weighted totals | **Passed — source units and numerical aggregation** | Actual NASA 1985–2025 source and independent SciPy reconstruction; physical interpretation still provisional |
| SCI-010 | Two requested locations resolve to distinct effective source grid samples | Pending | Coordinates and grid metadata |
| SCI-011 | Same-period, same-variable comparison and missing-data alignment | Pending | Reproducible two-location fixture |
| SCI-012 | Annual vs seasonal Mann-Kendall behavior and slope units | Pending | Independent tests and method comparison |
| SCI-013 | Serial dependence diagnostic; correction only when justified | Pending | Documented check and test fixture |
| SCI-014 | No claim of opposing long-term trend based solely on ENSO-seasonal contrast | Pending | Case-study narrative review |


## Additional safeguards and research checks (from external report review)

| ID | Check | Status | Evidence |
| --- | --- | --- | --- |
| SCI-015 | Provider fill/sentinel metadata per variable; reject non-finite values without blanket numeric thresholds | Pending | Actual NASA response metadata and fixtures |
| SCI-016 | Annual completeness rule, leap-year weighting and monthly precipitation conversion | Pending | Input/output examples with units |
| SCI-017 | TypeScript numerical tests against Python reference with declared tolerances and edge cases | Pending | Cross-runtime fixtures and CI logs |
| SCI-018 | Cross-source comparison of POWER and IMERG with aligned time, footprint and units | Pending | Named collections, retrievals, comparison protocol |
| SCI-019 | Check ENSO-correlation narrative avoids causal attribution or guaranteed climate outcomes | Pending | Scientific interpretation review |
| OPS-003 | Verify actual cPanel/PHP/runtime capabilities before requiring server proxy/cache | Pending | Anonymized environment verification |
| OPS-004 | Test load, API latency and offline behavior before performance/availability claims | Pending | Local and deployed benchmarks |


## EXP-001 offline prototype verification — 2026-11-14

| ID | Check | Status | Evidence |
| --- | --- | --- | --- |
| QA-001 | Correctly ignore NASA YYYY13 annual summary in monthly aggregation | **Passed — synthetic input only** | tests/test_exp001_power.py |
| QA-002 | Convert precipitation mm/day to annual mm accounting for leap years | **Passed — synthetic input only** | tests/test_exp001_power.py |
| QA-003 | Handle fill values, missing keys, per-variable incomplete years and incorrect units | **Passed — synthetic input only** | tests/test_exp001_power.py |
| QA-004 | Handle empty/sparse series and intersect paired years | **Passed — synthetic input only** | tests/test_exp001_power.py |
| QA-005 | Check known monotonic/tied series and outlier-resistant Sen slope behavior | **Passed — synthetic input only** | tests/test_exp001_power.py |
| QA-006 | Validate coordinate and date range parameters | **Passed — synthetic input only** | tests/test_exp001_power.py |
| SCI-020 | Execute end-to-end experiment on actual NASA POWER JSON and independently verify numerical outputs | **Pending — external network unavailable here** | docs/EXPERIMENT-001.md |
| SCI-021 | Validate original MK significance/CI assumptions and add dependence-aware correction when justified | **Pending** | docs/EXPERIMENT-001.md |

**Local test record:** 11 of 11 tests passed on Python 3.13.5, NumPy 2.3.5, SciPy 1.17.0, Requests 2.32.5 and pytest 9.0.2. Command: python -m pytest -q tests/test_exp001_power.py. The test fixtures are synthetic and **must not be used as observations or evidence that Liberia/Limón climate trends were measured**.

## EXP-001 GitHub Actions automation

- Workflow: [.github/workflows/exp001-qa.yml](../.github/workflows/exp001-qa.yml)
- Purpose: reproduce synthetic parser/statistics QA without any credentials or live NASA API call.
- **CI status: success.** [GitHub Actions run #43640908593](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43640908593) completed successfully on commit bc746cdf with the synthetic-qa job. This does **not** establish real NASA retrieval, empirical climate trends or inference validity for autocorrelated observations.

## EXP-001 adversarial QA — verified 2026-11-14

| ID | Check | Status | Evidence |
| --- | --- | --- | --- |
| ADV-001 | MK tied ranks/variance/continuity against pyMannKendall 1.4.3 | **Passed — synthetic** | tests/test_exp001_adversarial.py |
| ADV-002 | Sen slope uses calendar years with missing-year gaps | **Passed — synthetic** | tests/test_exp001_adversarial.py |
| ADV-003 | Sen is non-additive across paired-series differences | **Passed — corrected synthetic fixture** | tests/test_exp001_adversarial.py |
| ADV-004 | Lag-1 correlation computed after detrending | **Passed — synthetic** | tests/test_exp001_adversarial.py |
| ADV-005 | Lag-1 uses only truly consecutive calendar-year pairs | **Passed — synthetic; prior diagnostic issue fixed** | tests/test_exp001_adversarial.py |
| ADV-006 | No lag-1 estimate when there are no consecutive year pairs | **Passed — synthetic** | tests/test_exp001_adversarial.py |

- **GitHub CI evidence:** [17/17 tests passed, run #43649103042](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43649103042) (includes 11 prior + 6 adversarial tests).
- **CI runtime modernization:** [run #43649183358](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43649183358) **succeeded** with Node 24 compatible actions/checkout@v5 and actions/setup-python@v6.
- **Not validated:** NASA POWER retrieval and real climatological results, temporal dependence assumptions, confidence-interval coverage for autocorrelated observations, and any final Liberia/Limón scientific interpretation.


## EXP-001 fourth Gemini review — 2026-11-14

| ID | Check | Status | Evidence |
| --- | --- | --- | --- |
| ADV-007 | pyMannKendall Hamed–Rao NaN-padding behavior is not treated as a calendar-spacing fix | **Passed — synthetic behavior test** | tests/test_exp001_adversarial.py |
| ADV-008 | A nonstandard provider fill value (-99) is parsed without arbitrary -900 cutoff | **Passed — synthetic** | tests/test_exp001_adversarial.py |
| ADV-009 | Paired Sen slope and difference of aligned individual Sen slopes are labeled separately | **Passed — synthetic** | tests/test_exp001_adversarial.py |
| ADV-010 | EXP-001 does not silently activate Hamed–Rao or claim independence-robust significance | **Passed — synthetic** | tests/test_exp001_adversarial.py |

**CI evidence:** [GitHub Actions run #43650944212](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43650944212) — **21/21 passed**. Preceding failed [run #43650886241](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43650886241) exposed an invalid test assumption about Sen slope with NaN-padded pyMannKendall input. The repaired test passed subsequently. Only synthetic QA is verified; NASA source retrieval and inference on real observations are still pending.


## How to record completed validations

For each verified item add: execution date (UTC), exact code commit, environment/version, external dataset URI and retrieval time, method, expected and actual values, tolerance, pass/fail status, and link to test artifact or reproducible command. Do not insert personal credentials, raw access logs, or nonredistributable data.

## Demonstration investigations — planned, not yet executed

- Temperature at a specific selected point in Guanacaste.
- Precipitation at a point in Costa Rica.
- Comparison of two point time series with the same period and methodology.

Results must be computed before any place is described as having an observed significant increase or decrease.


## Spanish-first public web localization — 2026-11-14 (Costa Rica)

- Source implementation: Spanish canonical routes `/`, `/telluris/`, `/telluris/explore/` and English mirror routes `/en/`, `/en/telluris/`, `/en/telluris/explore/`; historical `/es/` paths retained with Spanish canonical links.
- [GitHub Actions run #43660071020](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43660071020): **28/28 Node tests passed** (12 scientific + 16 language/metadata/asset-path tests) and static HTTP route/asset smoke passed.
- Verified: HTML lang attributes, reciprocal ES/EN selector links, absolute canonical/hreflang, local JS/CSS/favicon references, legacy Spanish URL preservation, dynamic Spanish scientific messages, one shared archived NASA JSON source.
- **Pending:** update hosted cPanel document root; verify all six public routes, actual language switching, live NASA fetch and mobile responsiveness after deployment.
- User screenshots of the previous English version indicate the hosted Explorer is accessible and able to load live NASA POWER; this **does not establish bilingual deployment**, which remains pending.
- Next research gate: [EXP-002 falsifiable seasonal and global comparisons](BENCHMARK-PLAN.md); no pre-set scientific outcomes accepted.

## Formal NASA challenge re-scoping and variable-source research — 2026-11-14

- [Scope decision](SCOPE-2026.md): broad guided Earth-system trend detective mission, replacing any implicit obligation to prove a Costa Rican climate dipole.
- [NASA recommendation traceability](NASA-RECOMMENDATIONS-MATRIX.md): **25** individually mapped official objectives, recommendations, motivations and practical considerations, plus **13** links preserved from the official Resources-tab index.
- [Variable catalog](VARIABLE-CATALOG.md): NASA POWER atmosphere/radiation candidates; GLDAS runoff and soil water; SWOT **estimated river discharge** and reach geometry; MODIS vegetation/temperature/evaporation; GPM precipitation; SMAP soil moisture; GRACE terrestrial water storage; AIRS/OMI atmosphere; PO.DAAC ocean series.
- **Evidence limitation:** Catalog coverage verifies plausible official sources, **not** software integrations or valid climate findings. The only connected NASA variables remain POWER T2M/PRECTOTCORR. River discharge is a 2022+ SWOT reach-level estimate, not a 1985–2025 hydrograph or GLDAS Qs runoff.
- **Next acceptance gates:** validated significance inference, live metadata-driven additional POWER parameters, educational question flow, at least one non-meteorological NASA source extraction, deployment/update verification and publicly reviewable competition submission.

## Team scientific inventory + browseable web catalog — 2026-11-15

- **Source preservation:** The team-submitted original markdown document is preserved at [TEAM-CATALOG-2026-11-15.md](TEAM-CATALOG-2026-11-15.md), with methods review at [TEAM-CATALOG-REVIEW.md](TEAM-CATALOG-REVIEW.md).
- **Data inventory:** [catalog.json](../website/public/telluris/catalog/data/catalog.json), schema `telluris.catalog.2026-11-15.v1`, **2 connected NASA POWER variables + 49 research candidates + 10 derived indicators**, all 49 names/order and six domain categories retained.
- **Bilingual user-facing discovery:** `/telluris/catalog/` (Spanish), `/en/telluris/catalog/` (English); search/filter by topic, Earth-system area and integration status; no operational controls for unconnected variables.
- **Automated checks:** [GitHub Actions run #43729854583](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43729854583) — **34/34 Node tests passed**, browser-source syntax checks and local HTTP smoke checks of both catalog routes and JSON passed, static deployment ZIP generated.
- **Scientific limitation:** these are source/topic proposals, **not** 49 tested NASA endpoints or 10 computed indices. Current production still needs an upload/verification step, and no additional NASA science inference was established.

## EXP-003 — NASA ORNL MODIS vegetation proof-of-capability (2026-11-15)

- Live [ORNL API probe #43737483122](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43737483122): **success**; `/bands`, `/dates` and 1×1 `/subset` returned HTTP 200 for Liberia and Limón; provider metadata verified fill -3000, scale .0001 and valid inclusive range -2000..10000, pixel reliability -1/0..3, 614 composite dates each at probe time, source examples including a cloudy Limón observation correctly excluded.
- An initial probe [#43737375446](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43737375446) failed due to incorrect assumption that `/dates` returned an array instead of `{"dates":[...]}`. Corrected by inspecting actual JSON.
- A new [EXP-003 implementation](EXP-003-VEGETATION.md) stores raw source batches with SHA-256 and computes QA-screened descriptive annual medians. Ten deterministic adapter regression tests were created; record CI completion separately.
- **Not yet validated:** full-year MODIS annual coverage after QA, exact underlying subset collection version, full 2000–2025 trend, independence-adjusted significance, browser presentation or causal attribution.

## EXP-003 research-evidence catalog check — 2026-11-15

- Verified actual ORNL MOD13Q1 API bands, real dates and center-pixel NDVI/EVI/QA: [successful probe #43737483122](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43737483122).
- Website research catalog `C23` links to the actual NASA proof while retaining `implementation_status=not_connected` and **the count of two connected POWER variables**.
- [Website CI #43738552963](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43738552963): **35/35 Node tests passed**, including one explicit guard against showing a research-only MODIS candidate as publicly connected, and local HTTP smoke checks passed.
- [Separate Python EXP-003 acquisition workflow](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43738048688): 2023–2025 original NASA ORNL retrieval and annual QA-screened descriptive medians; confirm its final execution status before claiming live multi-year results.


## 2026-11-15 — Geographic and evidence features

New test fixtures check provisional significance and two-point descriptive comparison. The browser's WebGL behavior and public hosting deployment are not automatically verified by these fixtures. See GitHub Actions for actual run status; no new scientific confidence claim has been made.
