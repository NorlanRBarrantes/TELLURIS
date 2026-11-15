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


## CI verification — 2026-11-15

GitHub Actions run [#43739956296](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43739956296) completed with SUCCESS at source commit 39d3b654af86e8608f813f8535be90d67e92550a. Reported successful steps: browser-source syntax checks (including globe and evidence), Node scientific/site tests, static localhost HTTP smoke checks (including Natural Earth asset), and site package generation. This confirms automated source/build checks only: manual 3D rendering on target browsers and deployment on BanaHosting remain unverified.

## EXP-003B detailed MODIS QA and solar-geometry screening — 2026-11-15

- Source: authentic two-point MOD13Q1 original-data archive [acquired in EXP-003 #43738048688](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43738048688), 69 composites each, 2023–2025.
- [EXP-003B method QA run #43740806990](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43740806990): **12/12 new deterministic tests PASS**; re-downloaded the original source archive (verified artifact SHA-256), extracted DetailedQA and solar-zenith data, and generated an auditable JSON report.
- Summary QA accepted 51/69 Liberia and 26/69 Limón. Experimental strict QA accepted 44/69 Liberia, **0/69 Limón**. Strict all-land restriction rejected all 69 Limón observations; this is a **single-source-pixel geography/QA** issue needing NASA land/water class inspection, **not a validated regional climate conclusion**. Overlapping rejection reasons cannot be totaled.
- Annual coverage comparison: original 12/year + 2/quarter = Liberia 3/3, Limón 0/3; strict same threshold = Liberia 2/3, Limón 0/3; strict 8/year in 3 quarters = Liberia 3/3, Limón 0/3. **No significance p-values or derived climate trend** were calculated. Five-year climatology threshold is intentionally unmet with only three years of data.
- The QA mask, all-land bit rule, annual thresholds and cycle anomaly are **experimental team-selected policies**, not compulsory NASA scientific guidance. Full methods: [EXP-003B](EXP-003B-MOD13Q1-QA.md).

- **Geographic QA clarified:** [Follow-up original-data reanalysis #43740917213](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43740917213) decoded source land/water bits: Liberia **69 land class 1**; Limón **67 coastline class 2** and **2 shallow-ocean class 0**, zero unambiguous land observations. The strict rejection is therefore a documented **sampling-footprint limitation**, not a statement that Limón has no vegetation. A new mainland reference must be predeclared and verified, without rewriting the original results.

## EXP-003C source-based coastal/inland MODIS site pre-screen — November 15, 2026

- Original team's Gemini spatial-site report preserved in `docs/_working/GEMINI-EXP-003C-ORIGINAL.txt` for provenance. [Protocol](EXP-003C-SPATIAL-PRESCREEN.md) distinguishes unsupported ecological labels, guessed elevation, nominal grid versus NASA POWER actual output and the experiment's QA requirements.
- New [spatial audit](../analysis/exp003c_spatial_screen.py) pre-registers the three suggested inland locations and the Limón/Liberia controls, extracts source 9×9 with a central 3×3 QA/VI subwindow, preserves original NASA JSON and no environmental trend or p calculation.
- [Tests](../tests/test_exp003c_spatial_screen.py) exercise grid geometry, nominal geography, source band presence, mixed-coast rejection, shadow/mixed-cloud masks and absence of trend-driven site selection.
- **Pending source gate until run completes:** actual location QA, remote MCD12Q1 bands availability, forest/landcover year and the provider spatial interpretation must be independently validated before promoting any candidate in the public Explorer.

## NASA MODIS source screening COMPLETE — 2026-11-15

- [EXP-003C original NASA spatial QA run #43743357320](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43743357320): **9/9 tests passing**; all four required Caribbean NASA MOD13Q1 source requests successful; 3 inland candidate 3×3 windows **9/9 land/QA eligible**, original coastal **0/9**; date A2023001 only. Its MCD12Q1 metadata probe found official `LC_Type1` accessible.
- [EXP-003D MCD12Q1 IGBP 2023 run #43743662878](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43743662878): **8/8 tests passing** and **4/4 original NASA annual source calls successful**. 2023 classes: Limón original 13 (urban), Río Banano candidate 2 (evergreen broadleaf forest), Beverley candidate 8 (woody savannas), Hitoy candidate 2 (evergreen broadleaf forest). Different MOD13Q1 and MCD12Q1 pixel sizes mean coastal/urban labels are not necessarily contradictory.
- Experimental candidate A (9.885, -83.135) **chosen for future satellite vegetation acquisition by source quality and 2023 landcover only**; no historical evergreen continuity, climate-grid identity, statistical trend or p-value has been established. [Full audit](EXP-003D-IGBP.md).

## Website regression after EXP-003D source-evidence integration — 2026-11-15

[Github Actions #43744020303](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43744020303): **40/40 Node tests passed (0 failed)**; existing static explorer/browser QA pipeline completed successfully and generated an updated site ZIP. The bilingual research catalog retains exactly **two connected NASA POWER variables**, adds traceable EXP-003C/D source evidence for MODIS vegetation site verification and never offers unsupported MODIS trend APIs. This is a repository/CI check only; current public BanaHosting release still requires an upload/verification step.

**Scientific caution:** the MCD12Q1 2023 class 2 at the proposed Río Banano pixel is not a long-term evergreen-forest history, a verified SINAC boundary nor NASA POWER series equivalence. No NDVI/EVI climate trend or significance decision was added.

## EXP-004 POWER multivariable source/live release — 2026-11-15

- [NASA source verification #43751240278](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43751240278) — 2023 Liberia single-parameter original NASA POWER JSON and 12 months for 15 source codes; [follow-up #43751362556](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43751362556) verified `EVPTRNS`, `GWETROOT`, `GWETTOP` using working communities AG/RE rather than unsupported HY requests (422).
- **18 integrated NASA POWER codes**: T2M, PRECTOTCORR, RH2M, WS10M, WD10M, U10M, V10M, ALLSKY_SFC_SW_DWN, T2M_MAX, T2M_MIN, PS, CLOUD_AMT, QV2M, ALLSKY_SFC_LW_DWN, ALLSKY_SRF_ALB, EVPTRNS, GWETROOT, GWETTOP. All metadata, native units, parameter strings, source communities and aggregation are explicitly validated before public scientific output.
- Website [CI run #43752855041](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43752855041) — **52/52 passing Node tests**, including 18 source metadata and 22 catalog mappings, module source syntax and localhost HTTP routes, plus versioned website artifact. The 2023 API response is source capability evidence, **not** validation of a 1981–2025 climate trend, homogeneity or statistical significance.
- Query-guided bilingual UX and optional coast-to-coast additional NASA fetch implemented. **Pending:** actual BanaHosting deployment, mobile/interactive browser checks and latest build artifact. NASA MK original p remains exploratory.

## EXP-005 — exploratory uncertainty and statistical significance (2026-11-15)

- New deterministic statistical core: `website/public/assets/inference.js` provides **Sen rank-based 95% CI**, Mann–Kendall original p gated to **independent annual years**, 3-year/5-year block-order permutation sensitivity (999 seeded repetitions each), lag-1 heuristic and predeclared early/late half-period slope comparison. The web panel and JSON evidence export explicitly forbid claims of `validatedSignificance` from these incomplete assumptions.
- [Independent SciPy run #43755159596](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43755159596) **PASS 6/6 independent rank-based Sen slope/CI comparisons** (4 real NASA annual EXP-001 series + 2 synthetic cases). All source outputs and reproducible confidence values are printed in job logs.
- [Website QA #43755613674](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43755613674) **66/66 Node tests pass**, including science and NASA archived parity; local HTTP smoke validates site packaging. New inference interfaces and provenance report tests covered. Repository build success **does not certify BanaHosting deployment**.
- No claims of independent source homogeneity, statistically validated hydrological trends or corrected serial autocorrelation p-values. Large historical precipitation slopes require cross-source validation. Method and actual numerical benchmarks: [EXP-005](EXP-005-SIGNIFICANCE.md).

## EXP-006 — GPM IMERG Final V07 precipitation comparator (2026-11-15)

New source-separated precipitation comparison is implemented in [GPM JS module](../website/public/assets/gpm.js) and a bilingual optional Explorer panel. The input is a **local, NASA-original-granule-derived JSON** created by [the HDF5 extractor](../analysis/exp006_extract_imerg.py), not fake data. It validates mm/hr vs POWER mm/day conversion, uses complete matched years, and reports bias/MAE/RMSE/correlation and exploratory slopes. [Protocol](EXP-006-IMERG-CROSS-VALIDATION.md). Raw NASA IMERG granules have **not yet been acquired**, so no actual cross-source results can be claimed at this stage.

## EXP-007 — Five-pillar scientific expansion, first C/E source increment (2026-11-15)

- [GitHub Actions static explorer QA #43764971107](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43764971107): **82/82 Node science/site tests pass**, including real NASA EXP-001 archive parity, new source-month conversion/leap-year and incomplete-year tests, monthly baseline/quarterly calculations, and HTML print-report escaping. Browser syntax and localhost HTTP smoke checks passed; site artifact generated.
- **C source implementation:** NASA POWER monthly adapter retains records from complete years only, with precipitation converted from original mm/day to mm per calendar month; the new bilingual Explorer panel presents first/last selected-year halves, month-matched anomalies and calendar-quarter comparisons. The internal reference period is **not** an official climate normal, and its descriptive differences are **not** inferential significance tests. Archived annual EXP-001 samples have no monthly profile.
- **E source implementation:** EXP-005 report JSON is transformed into bilingual print-ready HTML with annual SVG plot, source provenance, original statistical caveats and table; users choose **Print → Save as PDF**. This is not direct server-generated PDF, and the output requires a real-browser print test.
- **Release boundary:** the current public BanaHosting site was previously verified at **5fddb6c**. These new source commits are in GitHub; no claim of deployed C/E UI, production functional success, or updated site SHA is made until a controlled rollout.
- **A/B/D:** Original NASA GPM granules, true geospatial 3D NASA raster layers and secure LLM provider connection remain unimplemented/unverified. See [EXP-007 scope](EXP-007-FIVE-PILLARS.md). Do not portray them as active capabilities.

## EXP-007 BanaHosting release — 2026-11-15 (operator-observed)

- **Published source commit:** `907b98f600c6bf42d67e317ab00a033a92b37920` (website/public content), after a successful no-write `--check`.
- **Pre-deploy:** seven changed public files were reported: `assets/explorer.css`, `assets/explorer.js`, `assets/science.js`, `assets/scientific-print.js`, `assets/seasonality.js`, `en/telluris/explore/index.html`, and `telluris/explore/index.html`.
- **Backup:** `TELLURIS_BACKUPS/pre-907b98f600c6-20261115_164745.tar.gz`; deploy script reported "Backup verified".
- **HTTPS post-copy verification:** all seven changed files produced `OK HTTPS` comparing deployed HTTP downloads byte-for-byte against the checked-out source. The script printed `COMPLETE: 907b98f600c6; 7 files verified via HTTPS.`
- **Automation:** preceding [GitHub Actions run #43765203183](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43765203183) completed successfully, including script syntax/dry run and site QA. Earlier [scientific module suite #43764971107](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43764971107) passed 82/82 Node tests.
- **Evidence limit:** this deployment record is based on operator-provided BanaHosting shell output and approved CI results; it does **not** establish user-browser interactions, NASA API CORS success, working downloaded PDF, long-term scientific significance, or original GPM IMERG observations. Manual ES/EN/mobile tests for C and E are still required.
- **Release traceability:** later documentation-only commits may advance GitHub `main`; the public site release remains the website/public tree of `907b98f` until another deployment is verified.

## EXP-008 — NASA GIBS source-probed 3D Earth (2026-11-15)

- **Original NASA GIBS live source QA:** [GIBS WMS source probe #43767438162](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43767438162) succeeded with **1536×768** GetMap original responses: `BlueMarble_NextGeneration` JPEG 128,309 bytes (HTTP 200, CORS `*`); `MODIS_Terra_CorrectedReflectance_TrueColor` JPEG 298,833 bytes (HTTP 200, CORS `*`); `MODIS_Terra_L3_Land_Surface_Temp_Daily_Day` PNG 242,533 bytes (HTTP 200, CORS `*`). Original signatures were checked, not only HTTP statuses. This verifies source access at probe time, not scientific source homogenization or live browser rendering.
- **Static and numerical source QA:** [website Actions #43767427309](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43767427309) completed **89/89 Node science/site tests**, JS syntax and local web HTTP smoke, including WMS lon-first axis ordering, source/date allowlisting, NASA original layer identities, spherical UV orientation and Spanish/English controls.
- **Capabilities in GitHub:** NASA Blue Marble base, MODIS Terra true-color, NASA GIBS daytime LST overlay with caveats, original NASA legend URL, globe navigation/zoom/reset/keyboard/auto-rotation, selectable geographic point feeding existing NASA POWER research, CORS/WebGL failure fallback and scientific provenance labels. Static imagery maps are not climate trends or precise air-temperature estimates.
- **Still open:** The production website was last user-verified at the **907b98f** EXP-007 site release. EXP-008 is **not yet deployed/verified on BanaHosting**. Actual desktop/mobile browsers must confirm textures/longitude alignment, NASA legend, CORS in WebGL, 3D picking, click-to-form, page speed, and fallback. A successful GitHub source probe must not be represented as a confirmed user experience.
- **Research boundaries:** MODIS LST (nominal native 1 km; K) differs fundamentally from NASA POWER air temperature T2M; the WMS global map at 1536 pixels cannot provide original per-pixel scientific measurements. No LST climate-trend field or validated significance was created. Full source/protocol: [EXP-008](EXP-008-NASA-GIBS-GLOBE.md).
