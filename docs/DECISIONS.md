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
