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

Do not replace proposed status with accepted until the underlying decision is verified and recorded.
