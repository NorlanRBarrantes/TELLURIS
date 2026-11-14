# Validation and reproducibility record

**Status: Pending execution.** This file is the test protocol and evidence register, not a fabricated test report.

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
| SCI-001 | POWER live retrieval for selected point | Pending | Add request + timestamp + valid response metadata |
| SCI-002 | Units and temporal interpretation | Pending | Source metadata, aggregation example |
| SCI-003 | Missing/fill and incomplete-year handling | Pending | Fixture + expected result |
| SCI-004 | OLS slope against independent reference | Pending | Reproducible fixture/test |
| SCI-005 | Mann-Kendall implementation and ties | Pending | Independent library comparison |
| SCI-006 | Sen's slope and units-per-decade scaling | Pending | Independent reference comparison |
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
| SCI-009 | NASA POWER monthly PRECTOTCORR units and day-weighted totals | Pending | NASA metadata + verified month/year calculation |
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

## How to record completed validations

For each verified item add: execution date (UTC), exact code commit, environment/version, external dataset URI and retrieval time, method, expected and actual values, tolerance, pass/fail status, and link to test artifact or reproducible command. Do not insert personal credentials, raw access logs, or nonredistributable data.

## Demonstration investigations — planned, not yet executed

- Temperature at a specific selected point in Guanacaste.
- Precipitation at a point in Costa Rica.
- Comparison of two point time series with the same period and methodology.

Results must be computed before any place is described as having an observed significant increase or decrease.
