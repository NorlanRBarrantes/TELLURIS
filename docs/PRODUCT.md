# Product vision and scope

## Identity

- **Product:** TELLURIS
- **Team:** Project Uriel
- **Working positioning:** Earth System Trend Intelligence
- **Audience:** Students, science educators, researchers, and curious members of the public.
- **Demo focus:** Historical temperature and precipitation investigations with Costa Rican examples.
- **Long-term vision:** Reusable global investigations, not a country-specific climate dashboard.

## The problem

Earth science observations are rich but often difficult to discover, process, compare, and interpret correctly. A graph alone does not tell users whether an apparent change is sufficiently supported by the data.

## Value proposition

TELLURIS aims to turn a question about environmental change into a **reproducible evidence case**: a NASA dataset, a geographic selection, a clearly specified time range, a processed time series, a tested trend, and an interpretation with caveats.

## Proposed minimum viable product

**P0 — Required for a credible demonstration**
1. Select a coordinate-based location and either temperature or precipitation.
2. Retrieve genuine NASA historical values and disclose the dataset and retrieval parameters.
3. Show the time series and the time span used for estimation.
4. Estimate the slope and report meaningful units.
5. Perform a correctly implemented significance test and disclose the result and limitations.
6. Handle missing values and invalid / insufficient inputs without fabricating output.
7. Demonstrate at least one reproducible investigation.

**P1 — Valuable if P0 is stable**
- Compare two locations using identical variables, time spans, and procedures.
- Export the provenance and results of an investigation.
- Provide accessible language for scientific terminology.
- Introduce a second investigation scenario.

**P2 — Not required for the hackathon**
- Conversational AI assistance, if it can be constrained to verified results.
- Additional missions/datasets (e.g., GPM or MODIS).
- Large-area spatial trend maps or globally indexed searching.
- Authentication, user accounts, or a complex 3D globe.

## Example research questions — hypotheses, not findings

- Is estimated near-surface air temperature increasing at a selected location in Guanacaste?
- How do precipitation trends at comparable sampling points differ between Costa Rica's Pacific and Caribbean sides?
- Are apparent trends consistent after correcting for seasonality or changing the analysis period?

Do **not** write that a region is warming, drying, greening, or recovering until a real dataset and validated analysis support that specific statement.

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
