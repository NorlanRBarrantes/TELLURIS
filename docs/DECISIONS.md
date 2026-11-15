# Architecture decision records (ADRs)

Only **approved or explicitly labeled proposed** decisions are published here. Operational brainstorming belongs in the temporary working note or in ignored local files. Record new durable decisions with a date, status, rationale, alternatives and consequences.

## ADR-001 — Product identity

- **Date:** 2026-11-14
- **Status:** Accepted
- **Decision:** The scientific application is named **TELLURIS**, developed by **Project Uriel**.
- **Reason:** A standalone scientific product identity is distinct from the team identity.
- **Impact:** Repository, documentation, and product UI should consistently use TELLURIS.

## ADR-002 — NASA challenge alignment

- **Date:** 2026-11-14
- **Status:** Accepted
- **Decision:** Enter **Be An Earth System Trend Detective!** in the 2026 NASA Space Apps Challenge.
- **Reason:** Analyze environmental variables, location, magnitude of change and statistical significance.
- **Impact:** The challenge's four questions and NASA data must be essential to the demonstrator.

## ADR-003 — Source repository and contribution hygiene

- **Date:** 2026-11-14
- **Status:** Accepted
- **Decision:** Use https://github.com/NorlanRBarrantes/TELLURIS as source of truth, main as default branch, and Conventional Commits in English.
- **Impact:** Keep changes logically scoped, auditable, reversible and accurately described.

## ADR-004 — Public app endpoint and hosting

- **Date:** 2026-11-14
- **Status:** Accepted for provider / hostname; deployment not verified
- **Decision:** Target https://telluris.lynxglobals.net/ on BanaHosting shared hosting.
- **Impact:** Prefer a static deployable interface and do not depend on unverified long-running server processes.

## ADR-005 — Documentation and submission integrity

- **Date:** 2026-11-14
- **Status:** Accepted
- **Decision:** Publish concise, English-language, reviewer-ready documentation. Separate unapproved notes from final documents; do not introduce secrets or unsupported claims. Disclose AI assistance and third-party resources.
- **Impact:** Scientific facts, experimental results and product claims require evidence. Remove the temporary working note before handoff; remember that deleted tracked files remain visible in Git history.

## ADR-006 — Initial science/data direction

- **Date:** 2026-11-14
- **Status:** Proposed; pending actual integration and validation
- **Decision candidate:** Use NASA POWER monthly T2M and PRECTOTCORR point time series for initial investigations, with a Costa Rica case study. Extend to other sources later.
- **Reason:** NASA-maintained API and historical meteorological coverage support the challenge's core statistical workflow.
- **Risks:** Point vs regional interpretation, aggregation, seasonality, autocorrelation, missing data and significance-test assumptions.

## ADR-007 — Proposed deployment architecture

- **Date:** 2026-11-14
- **Status:** Proposed; hosting capability check pending
- **Decision candidate:** Build frontend as static React/TypeScript output. Use optional minimal PHP endpoints and offline scientific validation scripts rather than an assumed persistent Python/Node server.
- **Reason:** Portability to a shared hosting account with unverified app-runner support.

## ADR-008 — Original source license

- **Date:** 2026-11-14
- **Status:** Accepted for initial repository
- **Decision:** License original contributions under MIT; credit every external library, dataset, image and map service under their own applicable terms.
- **Reason:** Explicit OSI-recognized open source license and clear NASA submission reuse conditions.

## ADR-009 — Review and integrate external research and AI suggestions

- **Date:** 2026-11-14
- **Status:** Accepted
- **Decision:** Accept external research and AI-generated proposals (including Google Gemini) as review inputs, not as verified project facts. Cross-check against authoritative NASA documentation, scientific methodology, licensing, implementation feasibility and current decisions before accepting changes.
- **Reason:** Preserve scientific reliability, prevent incompatible design choices, and keep NASA-facing materials focused and auditable.
- **Impact:** Record the source and disposition of material proposals; promote only accepted, justified content into public documentation, code and tests; disclose material AI assistance in docs/AI-USE.md. Keep informal exploration out of the final submission tree.
- **Procedure:** CONTRIBUTING.md → External research and AI-assisted material intake.

## ADR-010 — Costa Rica paired-point climate investigation

- **Date:** 2026-11-14
- **Status:** Accepted as a research/demo direction; outcome unverified
- **Decision:** Develop a planned Liberia–Limón point-series comparison as an optional, prioritized P1 demonstration after the single-location P0 analysis works. Investigate temperature and precipitation over a matching historical window.
- **Reason:** The NASA challenge explicitly notes that the same Earth variable may evolve differently in nearby regions. Published research relates Caribbean Low-Level Jet variability and Central American rainfall.
- **Scientific boundary:** Seasonal or ENSO-related opposite responses do not establish **opposite multi-decade trends**. Do not assert that a significant dipole exists until actual dataset-based trend and comparison tests support it.
- **Evidence:** [Costa Rica case study](CASE-STUDY-COSTA-RICA.md) and [research references](RESEARCH-REFERENCES.md).

## ADR-011 — Statistical extension and hardware scope

- **Date:** 2026-11-14
- **Status:** Approved direction; implementation and device availability pending
- **Decision:** Keep validated annual trends as the baseline; evaluate seasonal Mann-Kendall and serial-dependence corrections as separately tested enhancements, with explicit method/units. Treat a proposed ESP32 screen as an optional display accessory rather than a scientific sensor or mandatory MVP feature.
- **Reason:** Prevent unjustified significance claims and avoid risking the hosted demo for an unverified device.
- **Constraints:** Do not assume permanent Python hosting on BanaHosting shared; pyMannKendall may be used locally as a calculation/verification reference without becoming a production runtime dependency.

## ADR-012 — External research review and evidence control

- **Date:** 2026-11-14
- **Status:** Accepted
- **Decision:** Incorporate only source-verified scientific claims and feasible design improvements from a team-supplied research report, preserving the distinction between external claims, peer-reviewed context and results generated by TELLURIS.
- **Corrections:** NASA POWER point monthly requests allow 20 parameters; cited San José 30/20/20/20/10 scoring belongs to a **2025 local-event page** and is not established as the 2026 global rubric; named jurors, device availability, correlation coefficients and numerical trend findings are not accepted without individually verified sources.
- **Impact:** No unsupported scoring weights, competitors' alleged failures, historic weather anecdotes, or invented outputs will be promoted into the NASA submission.


## ADR-013 — Evaluate NASA-recommended data tools against NASA POWER

- **Date:** 2026-11-14
- **Status:** Under evaluation; no replacement approved
- **Question:** Why use NASA POWER for TELLURIS when the challenge lists Giovanni, Hydrology Time Series, AppEEARS and other resources?
- **Finding:** POWER is a NASA-operated analysis-ready data service and provides MERRA-2-based meteorological series with a documented temporal REST API. It can satisfy the NASA-mission/model data requirement. The named challenge resources are useful alternatives or validation tools, but their presence in the resource list is not a mandate to build against their interfaces.
- **Trade-off:** POWER is convenient for an initial point-based trend engine, but its conventional meteorological grid and specialized parameter catalog may be insufficient for detailed spatial or vegetation investigations. Giovanni/GLDAS and AppEEARS offer broader scientific sources, with different access and workflow complexities.
- **Next decision gate:** Test a real NASA POWER result and investigate one challenge-listed alternative (Giovanni or GES DISC) for the same scientific question. Consider AppEEARS if a MODIS vegetation use case is prioritized. Do not imply actual integration, independent verification, or dataset equivalence before testing.
- **Detail:** [Data source selection comparison](DATA-SOURCES.md#source-selection-nasa-power-vs-challenge-listed-resources-review-2026-11-14) and [official resource catalog](NASA-CHALLENGE-RESOURCES.md).

## ADR-014 — Scientific guardrails as a product differentiator

- **Date:** 2026-11-14
- **Status:** Accepted as a product direction; implementation pending
- **Decision:** Make data-provenance, unit, completeness, assumption and uncertainty warnings integral to every TELLURIS result. Consider a learner-facing comparison between naive and assumption-aware statistical methods after both are independently verified.
- **Rationale:** Increase scientific usefulness without inventing findings or incorrectly declaring significance.
- **Scope:** Start with baseline quality checks and a tested trend; conditional advanced methods and multiple-source comparisons belong to later stages.
- **Reference:** [Scientific guardrails](SCIENTIFIC-GUARDRAILS.md).

## ADR-015 — Client-side statistics proposal and deployment safeguards

- **Date:** 2026-11-14
- **Status:** Proposed; requires implementation/hosting verification
- **Decision candidate:** TypeScript numerical engine in the browser with independent Python-based fixture validation; statically deployable UI, optional bounded PHP proxy/cache in BanaHosting shared hosting.
- **Rationale:** Avoid presuming persistent server processes; a small, independently testable scientific core is likely suitable for static hosting.
- **Caution:** No assertion of <2 s API calls, <4 ms calculations, exact decimal parity, or guaranteed shared-hosting support before measuring them.

## ADR-016 — Research claims and external Gemini review

- **Date:** 2026-11-14
- **Status:** Accepted
- **Decision:** Treat the team's second Gemini-assisted report as a source of proposals rather than a validated experiment. Reject unsupported pre-declared statistical outcomes for Costa Rica and global cases, non-evidenced competition statements, and claims that ENSO regression attributes climate change. Keep a paired Costa Rica investigation and test IMERG as an optional complementary NASA product.
- **Rationale:** NASA explicitly accepts baseline linear-trend analyses; advanced methods are scientific enhancements, not mandatory competition requirements. Every claim requires a traceable method and source.
- **Supporting documents:** [Scientific guardrails](SCIENTIFIC-GUARDRAILS.md), [Data sources](DATA-SOURCES.md), and [Scientific methodology](SCIENTIFIC-METHODOLOGY.md).


## ADR-017 — Reproducible NASA POWER experiment after Gemini script review

- **Date:** 2026-11-14
- **Status:** Experimental code and synthetic unit tests accepted; actual NASA-data validity pending
- **Decision:** Integrate a corrected Python EXP-001 investigation script and reproducible synthetic QA tests into analysis/ and tests/. Preserve original NASA response and metadata when externally retrieved. Avoid applying Hamed–Rao automatically based only on one lag-1 diagnostic.
- **Rationale:** The contributed Gemini experiment made no live numerical claims and supplied a useful starting point, but required stronger handling of missing values, per-variable completeness, unit validation, empty series and scientific assumptions.
- **Verification:** 11/11 deterministic local synthetic tests passed on 2026-11-14; external NASA endpoint access failed in the execution environment. This is **not** confirmation of a real Earth-science result.
- **Implementation:** [EXP-001](EXPERIMENT-001.md), [source script](../analysis/exp001_power.py), [unit tests](../tests/test_exp001_power.py).
- **Next gate:** Verify real NASA payloads, spatial semantics, valid years and an appropriate independence-aware statistical inference before promoting any finding to the product interface or NASA submission.

Do not replace proposed status with accepted until the underlying decision is verified and recorded.

## ADR-018 — Project Uriel team site and TELLURIS public introduction

- **Date:** 2026-11-14
- **Status:** Accepted site structure; public deployment pending verification
- **Decision:** Use `https://projecturiel.earth/` as the Project Uriel team homepage and `https://projecturiel.earth/telluris/` as the public, introductory TELLURIS research page.
- **Language:** English is the canonical international-review landing language; Spanish translations use `/es/` and `/es/telluris/` and explicit alternate-language metadata.
- **Reason:** Distinguish the team's identity from the scientific product, provide a clear project entry point, and keep scientifically accurate public context visible while the software is being investigated.
- **Compatibility with ADR-004:** The earlier `https://telluris.lynxglobals.net/` remains a previously selected candidate for the eventual scientific application, not a verified production deployment. Reconcile or retire that destination deliberately after actual deployment checks; the new `/telluris/` introduction does not establish the analysis engine is operating.
- **Content integrity:** The landing does not claim validated real NASA trends, scientific significance, API integration, or NASA endorsement. A research-question builder may draft hypothetical questions but must not present invented measurements.
- **Publication gate:** Publish a static bundle on BanaHosting, preserve the current HTTPS configuration, verify each route and language, then record observed public behavior in `docs/VALIDATION.md`.
- **Repository gate:** Commit the reviewed static site source to version control before declaring release reproducible; no committed site source or successful deployment is asserted by this ADR.

## ADR-019 — Adversarial QA and calendar-gap correction for EXP-001

- **Date:** 2026-11-14
- **Status:** Accepted; deterministic QA verified, NASA real-data analysis pending
- **Decision:** Integrate six adversarial tests using SciPy and pyMannKendall as references, and ensure annual lag-1 diagnostics use only consecutive calendar-year pairs. Correct flawed assertions from the third team-supplied Gemini audit rather than accepting them verbatim.
- **Rationale:** Original MK tie/continuity handling and calendar-aware Sen slope already passed review. The supplied nonadditivity and p-value-difference fixtures were unsuitable, while the code's prior lag-1 handling across gaps warranted a genuine correction.
- **Evidence:** [EXP-001 audit](EXPERIMENT-001.md#adversarial-audit-of-exp-001--2026-11-14); [CI run #43649103042](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43649103042), 17/17 synthetic tests passed.
- **Boundary:** No live NASA POWER measurements, climatological significance, or causal explanation is established by synthetic unit tests.

## ADR-020 — Reject unsupported Gemini defect claims; clarify paired Sen reporting

- **Date:** 2026-11-14
- **Status:** Accepted; synthetic CI verified, scientific real-data validation pending
- **Decision:** Treat the six alleged flaws in the fourth Gemini report as hypotheses until checked against current source. Keep original MK inference explicitly exploratory, retain per-variable completeness and metadata-based missing-value handling, and **do not** introduce Hamed–Rao solely through NaN padding or an AR(1) threshold.
- **Product improvement:** Add separate, clearly labeled matched-calendar-year Sen slopes and paired-difference slope in the EXP-001 output, without conflating the estimators or declaring causal/statistical equivalence.
- **Evidence:** Four additional adversarial tests, 21/21 total passed in [CI #43650944212](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43650944212). The initial failed NaN-padding test was corrected rather than mislabeled as a production defect.
- **Reference:** [EXP-001 fourth Gemini audit](EXPERIMENT-001.md#fourth-external-gemini-audit--reviewed-against-current-repository-2026-11-14).
- **Limitation:** The exercise tested deterministic synthetic input only; no NASA Earth-science results or source API responses were validated.

## ADR-021 — Start actual development with NASA-backed static Explorer 0.1

- **Date:** 2026-11-14 in Costa Rica / 2026-11-15 UTC for NASA acquisition
- **Status:** Accepted implementation; public hosting and publication-grade inference not verified
- **Decision:** Use a zero-dependency ES module browser MVP under `/telluris/explore/` (alongside team and research pages) for single-point annual T2M and precipitation, NASA-source provenance, an authentic archived NASA sample, direct NASA fetch and optional raw JSON import, Sen trend, explicitly exploratory original MK p, lag-one diagnostic and CSV export.
- **Scientific evidence:** [EXP-001](EXPERIMENT-001.md), live POWER run #43656774519 (1985–2025, 41 years both points/variables), independent Python/SciPy re-aggregation and slope parity.
- **Software evidence:** [Browser MVP CI run #43657393798](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43657393798), 12 scientific tests + HTTP smoke succeeded.
- **Tradeoff:** A static vanilla ES module implementation meets shared-hosting constraints immediately; React/TypeScript remains a future option, not a prerequisite.
- **Important warnings:** NASA model-grid samples are not meteorological station observations; large rainfall trends may be nonhomogeneous; original MK inference is not independence-robust. No assumption of NASA endorsement or production deployment.
- **Deployment:** Build-free site archive is available in the CI artifact for manual BanaHosting upload. Browser direct NASA CORS and production routing must be separately verified.


## ADR-022 — Spanish-first bilingual site and independently falsifiable regional benchmarks

- **Date:** 2026-11-14 (Costa Rica)
- **Status:** Spanish-first localization implemented and tested; EXP-002 benchmark protocol proposed, not experimentally executed
- **Website:** Spanish canonical pages at `/`, `/telluris/`, `/telluris/explore/`; English pages at corresponding `/en/` routes. Keep old `/es/` pages functional but canonicalized; use explicit ES/EN top-nav links and accurate hreflang/sitemap. Localize scientific UI messages, not variable codes/source values.
- **Motivation:** Project Uriel is based in Costa Rica but requires an accessible international presentation.
- **Verification:** [Bilingual CI run #43660071020](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43660071020), 28/28 Node tests passed, six routes, asset paths and HTTP smoke validated. **Changes in GitHub do not automatically publish to BanaHosting.**
- **Science:** [EXP-002 protocol](BENCHMARK-PLAN.md) registers JJA Liberia/Limón, same-Pacific control, IMERG precipitation cross-source check and optional global contrasts as research hypotheses, **not pre-known positive/negative trends**. Do not use simple non-significant p as proof of equivalence, and do not ignore climate autocorrelation in permutation tests.
- **Next:** Explorer 0.2 comparative mode after source/QA validation; user-visible production bilingual behavior pending upload and browser inspection.

## ADR-023 — Approve Earth-system detective scope and retain every NASA recommendation

- **Date:** 2026-11-14 (Costa Rica)
- **Status:** **Accepted** as product strategy; individual new source integrations remain research/proposed
- **Decision:** Position TELLURIS as a guided, global, multi-variable, multi-source *Earth System Trend Detective*, not as a Costa Rica climate-dipole proof. Map **all** four mandatory NASA objectives and every optional consideration/resource to a traceable requirement/status/evidence record, without confusing NASA's optional suggestions with required integrations.
- **Scientific families:** Air/meteorology, chemistry/profiles, radiation, vegetation/land temperature, terrestrial water cycle, runoff, **SWOT estimated river discharge**, ocean SST/height and GRACE terrestrial water storage. Distinguish model grid/runoff vs river reach/flow, units and short vs long observation spans.
- **Near-term completion:** Preserve functional EXP-001; add learner-facing question-based discovery, variable explanations and independently justified significance; expand POWER variables (RH2M, WS10M, ALLSKY_SFC_SW_DWN) after API checks; add one verified distinct NASA data-source case and two examples. Keep JJA/IMERG/cross-region hypotheses in EXP-002 for validation.
- **Rejected practices:** Predetermining slope signs/p-values, treating GLDAS runoff as a river-gauge discharge measurement, making source integrations appear live based on a documentation entry, blindly importing Gemini's proposed statistical code or declaring short SWOT series a multidecadal trend.
- **Evidence:** [Formal scope](SCOPE-2026.md), [full NASA brief/resource matrix](NASA-RECOMMENDATIONS-MATRIX.md), [variable research catalog](VARIABLE-CATALOG.md), [official NASA resource index](NASA-CHALLENGE-RESOURCES.md), [existing EXP-001 validation](EXPERIMENT-001.md).

## ADR-024 — Preserve and integrate team scientific inventory as research catalog

- **Date:** 2026-11-15 (Costa Rica)
- **Status:** Accepted for documented discovery scope; **NOT accepted as 49 connected variables**
- **Contribution:** Team-submitted inventory prepared from a request by a Project Uriel member (the user's sister), preserved verbatim as [TEAM-CATALOG-2026-11-15.md](TEAM-CATALOG-2026-11-15.md).
- **Decision:** Retain every one of its **49 candidate measurements/phenomena** and **10 proposed derived indicators** alongside the 2 connected NASA POWER variables. Expose a clearly labeled, searchable, bilingual **research inventory** but no executable buttons for unsupported sources. Preserve original six categories, with scientific cross-references and distinctive data types.
- **Science:** NASA FIRMS detections vs burned area, GLDAS runoff vs SWOT river discharge, LST vs air temperature, USGS earthquake events vs NASA mission measures, short records, QA and incomplete seismic catalog protections. Do not claim earthquake prediction or scientifically validated anomaly trends without tests.
- **Implementation evidence:** [Normalized catalog](../website/public/telluris/catalog/data/catalog.json), [source review](TEAM-CATALOG-REVIEW.md), [source scope](SCOPE-2026.md). Any delivered UI is a roadmap, not evidence of 49 new NASA API integrations.
- **Schedule:** Preserve submission priority; add more NASA data sources only after end-to-end retrieval and source-specific verification.

## ADR-025 — Prioritize NASA MODIS Terra NDVI/EVI, gate inclusion on QA and real acquisition

- **Date:** 2026-11-15 (Costa Rica)
- **Status:** Experimental adapter accepted; production public integration and climate inference **not yet approved**
- **Input:** Team-forwarded Gemini source comparison of MODIS/ORNL, FIRMS and VIIRS Black Marble; original claims checked against NASA documentation and [real ORNL probe](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43737483122).
- **Decision:** First distinct mission product for TELLURIS is MODIS `MOD13Q1` EVI/NDVI using the official unauthenticated ORNL DAAC TESViS API, subject to actual collection version verification, strict QA/filtering, temporal completeness checks and reproducible raw archives.
- **Not adopted from Gemini:** `raw_vi <= -2000` erroneous rejection, 10-day FIRMS area window (official maximum is 5), "correlation proves rain control", any claim of guaranteed contest outcome, or raw single-pixel NDVI described as citywide forest coverage.
- **Integration boundaries:** Maintain FIRMS/Black Marble in research backlog; no fabricated APIs, NDVI/EVI trends, significance p-values or public integration badges before real checks.
- **Evidence:** [EXP-003 audit/protocol](EXP-003-VEGETATION.md), [QA adapter](../analysis/exp003_modis.py), [tests](../tests/test_exp003_modis.py).


## 2026-11-15 — Geographic globe and grounded assistant

Approved: implement a 3D geographic navigation layer, deterministic source-grounded explanations and an exploratory two-point archive comparison. All computed statistics remain unchanged and provisional. True generative AI requires a separately validated secure backend before activation. See FEATURES-3D-EVIDENCE-AI.md.

## ADR-026 — Retain both MODIS QA policies for source-grounded sensitivity auditing

- **Date:** 2026-11-15 (Costa Rica)
- **Status:** Accepted as experimental QA audit; **strict land mask and annual anomaly methodology NOT yet approved for public trend inference**
- **Input:** User-forwarded Gemini audit of Terra orbital drift, MOD13Q1 VI Quality, seasonal missingness and climatological anomaly method.
- **Decision:** Preserve original 2023–2025 MODIS records and original EXP-003 statistical summaries; separately decode detailed VI_Quality, apply an explicit experimental strict mask to both summary rank 0 and rank 1, record solar zenith, compare the original 12/2 and alternative 8/3 coverage thresholds, and prevent seasonal climatology from being estimated from only three years.
- **Empirical evidence:** [NASA original-data acquisition #43738048688](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43738048688); [12 deterministic QA tests and actual-record reanalysis #43740806990](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43740806990).
- **Unexpected finding:** Limón's chosen single MODIS pixel fails the experimental strict all-land filter on all 69 composite dates. Investigate its specific NASA land/water class and consider a predeclared inland alternative. Do not describe this as a region-wide NDVI failure.
- **Rejected:** An automatic solar-zenith regression "correction", unvalidated Hamed–Rao p-values, causal conclusions, asserting 8/3 eliminates MNAR, or claiming cross-sensor tests already executed.
- **Methods and caveats:** [EXP-003B method audit](EXP-003B-MOD13Q1-QA.md).

### ADR-026 geographic follow-up (same date)

A second real-source run confirmed that the selected Limón point is classified 67 times as MOD13Q1 QA shoreline (code 2) and twice as shallow ocean (code 0), while Liberia is land (code 1) across all 69 composites. Do not relax QA to force a vegetation trend at the shoreline point. Evaluate an inland land pixel under a separate source-provenance record instead. Evidence: [#43740917213](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43740917213).

## ADR-027 — Pre-register an independent MODIS spatial-site suitability screen

- **Date:** 2026-11-15 (Costa Rica)
- **Status:** ACCEPTED as evidence-first **experimental** spatial audit; exact inland site selection and public activation **not yet approved**.
- **Source:** team-forwarded Gemini coordinates, source report preserved in [original research](./_working/GEMINI-EXP-003C-ORIGINAL.txt), independently critiqued in [EXP-003C](EXP-003C-SPATIAL-PRESCREEN.md).
- **Plan:** Use ORNL MOD13Q1 original `VI_Quality` + `pixel_reliability` plus NDVI/EVI; request full central-grid window, compare source 1×1 versus central 3×3 without computing any slopes. Store raw SHA-256 and separate a MODIS 16-day site validity check from verified land cover and native-grid consistency.
- **Crucial caveats:** Gemini's Hitoy candidate (9.671, -83.024) is **outside** the nominal MERRA cell latitude range asserted in the same report. A nominal grid box does not prove identical POWER API outputs. Names, landcover, altitudes, and protected boundaries are research claims until verified.
- **No cherry-picking:** Original coastal pixel stays archived; candidate points are fixed before any scientific time trend results. No A/B winner based on effect size or statistical significance.
- **Code and test evidence:** [spatial pre-screen](../analysis/exp003c_spatial_screen.py), [test suite](../tests/test_exp003c_spatial_screen.py), [NASA API workflow](../.github/workflows/exp003c-spatial-screen.yml). Status of live run must be verified before describing source findings.

## ADR-028 — Prefer pre-registered Río Banano candidate for next NASA vegetation pilot

- **Date:** 2026-11-15 (Costa Rica)
- **Status:** Accepted for **follow-up data acquisition only**, not public scientific trend conclusions or geographic reserve identification.
- **Source evidence:** [MOD13Q1 original QA / 9 Python tests #43743357320](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43743357320) and [MCD12Q1 annual IGBP 2023 / 8 tests #43743662878](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43743662878).
- **Decision:** Retain all three Gemini-proposed inland sites without looking at NDVI/EVI slopes. Prioritize **candidate A (9.885, -83.135)** for longer MOD13Q1 sample acquisition: 9/9 land and clean MOD13Q1 pixels on A2023001, MCD12Q1 IGBP **class 2 evergreen broadleaf forest** in 2023, nominal MERRA grid box in range. Candidate B is class 8 woody savanna; candidate C is class 2 but outside the stated nominal MERRA latitude box. The original Limón source pixel is preserved as a coastal negative control.
- **Caveat:** IGBP 2023 alone cannot establish forest stability, actual legal reserve limits, site elevation or stable long-term NDVI quality. Each product has a distinct footprint; **no claim of identical NASA POWER point values** or climate causality is authorized.
- **Next:** Verify spatial provenance in more years, then 2000–2025 MODIS QA and Terra/Aqua sensitivity; investigate statistical inference only after coverage checks.
