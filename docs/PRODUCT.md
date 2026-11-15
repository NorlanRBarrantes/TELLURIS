# Product vision and scope

## Identity

- **Product:** TELLURIS
- **Team:** Project Uriel
- **Working positioning:** Earth System Trend Intelligence
- **Audience:** Students, science educators, researchers, and curious members of the public.
- **Demo focus:** Guided, source-aware investigation across the Earth system; Liberia and Limón are introductory cases, not a predetermined dipole.
- **Long-term vision:** Global, multi-variable, multi-source investigations across atmosphere, land/vegetation, freshwater, river reaches, and oceans.

## The problem

Earth science observations are rich but often difficult to discover, process, compare, and interpret correctly. A graph alone does not tell users whether an apparent change is sufficiently supported by the data.

## Value proposition

TELLURIS turns a learner's question about environmental change into a **reproducible evidence case**: a documented NASA mission/model variable, valid geographic footprint, time range, series, trend/rate, statistically justified significance assessment, and plain-language interpretation. Hypotheses may be confirmed, rejected or inconclusive. See [formally approved 2026 scope](SCOPE-2026.md) and [full NASA recommendations matrix](NASA-RECOMMENDATIONS-MATRIX.md).

## Proposed minimum viable product

**P0 — Required for a credible demonstration**
1. Begin with a research question and select a documented NASA variable from a **discoverable** catalog, with an understandable definition; location type and time support depend on the chosen product.
2. Retrieve genuine NASA historical values and disclose the dataset and retrieval parameters.
3. Show the time series and the time span used for estimation.
4. Estimate the slope and report meaningful units.
5. Perform a correctly implemented significance test and disclose the result and limitations.
6. Handle missing values and invalid / insufficient inputs without fabricating output.
7. Demonstrate at least two NASA-backed investigations, including one interpretable/non-significant or inconclusive case when supported by the actual data.
8. Explain the statistical inference in plain language and preserve technical evidence/export; unsupported significance is never labeled validated.
9. Keep NASA challenge *Potential Considerations* and all 13 resource references in a tracked roadmap, even when not yet implemented.

**Scientific guardrails (P0 baseline):** Explicit provenance, units, temporal coverage, missing-value diagnostics and clear significance limitations are required with every reported trend. Advanced corrections and multi-dataset comparisons are optional extensions, not prerequisites for meeting the NASA challenge. See [Scientific guardrails](SCIENTIFIC-GUARDRAILS.md).

**P1 — Broader scientific platform, not prerequisites for every initial demo**
- Extend verified NASA POWER beyond temperature/rain to RH2M, WS10M, ALLSKY_SFC_SW_DWN, with appropriate units and source-specific aggregation.
- Add a second mission/data family: e.g. GLDAS hydrology, MODIS NDVI via AppEEARS, GPM IMERG precipitation or marine SST; keep SWOT river discharge in a dedicated reach-based workflow.
- Show scientific-domain categories and sources that are researched but not yet connected, without offering nonworking buttons.

- Compare two locations using identical variables, time spans, and procedures.
- Export the provenance and results of an investigation.
- Provide accessible language for scientific terminology.
- Introduce a second investigation scenario.

**Demonstration scenario — conditional P1 priority:** A side-by-side, NASA-backed comparison of two **point** samples (initial candidates: Liberia and Limón) on the same variable and overlapping period. The comparison should be built only after P0 can calculate and display a valid result for a single point. A contrasting seasonal response does not establish an opposing long-term trend. See [Costa Rica case study](CASE-STUDY-COSTA-RICA.md).

- Explain potential statistical pitfalls in an educational comparison view, after reference computations are validated.
- Consider one higher-resolution NASA source (GPM IMERG V07B) for a fixed, thoroughly documented precipitation case, only after P0 is functional.

**P2 — Not required for the hackathon**
- Conversational AI assistance, if it can be constrained to verified results.
- Additional third/fourth NASA missions beyond the first two validated providers, as bandwidth permits. Their inclusion is **retained in the scientific catalog**, not rejected.
- Large-area spatial trend maps or globally indexed searching.
- Authentication, user accounts, or a complex 3D globe.

## Example research questions — hypotheses, not findings

- Is estimated near-surface air temperature increasing at a selected location in Guanacaste?
- How do precipitation trends at comparable sampling points differ between Costa Rica's Pacific and Caribbean sides?
- Are apparent trends consistent after correcting for seasonality or changing the analysis period?

Do **not** write that a region is warming, drying, greening, or recovering until a real dataset and validated analysis support that specific statement.

## Optional physical demonstration

An ESP32-based auxiliary monitor with a ~5-inch display has been **proposed in an external research brief**, but no specific board, wiring, firmware, screen resolution, or member availability has been confirmed. Hardware is an **optional enhancement** only after the core scientific app works. It would display a result snapshot from the validated analysis, not operate as a scientific sensor or disaster warning system.


## User workflow (target)

Question → variable selection → explicit spatial/time selection → NASA data retrieval → quality checks → trend estimate → significance test → transparent interpretation.

## Acceptance gates

- **Data:** Real NASA response/archived source; no synthetic values presented as evidence.
- **Science:** Units, methodology, sample count, period, missing-data policy, and test limitations are visible.
- **Engineering:** Reproducible method and tests; secure hosting configuration.
- **Communication:** Clear evidence statement and correct attribution.
- **Delivery:** Public, accessible demo and project link for reviewers.

## Non-goals

Weather forecasting, disaster warnings, causal attribution without suitable modeling, precise local ground-station claims from coarse NASA gridded data, and unvalidated AI-generated scientific conclusions.
