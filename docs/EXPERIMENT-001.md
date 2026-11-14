# EXP-001 — Liberia–Limón NASA POWER trend investigation

**Status: CODE AND SYNTHETIC TESTS PASSED; REAL NASA DATA NOT YET RETRIEVED OR ANALYZED.**

## Scientific question

Investigate historical trends in T2M temperature and PRECTOTCORR precipitation at two NASA POWER model/grid samples near Liberia (10.63 N, -85.44 W) and Limón (9.99 N, -83.03 W). These coordinates are provisional point requests, not in-situ station measurements or samples representing entire provinces.

The tentative 1985–2025 period contains 41 calendar years if all requested months are available. Never assert 41 *valid* years before checking the actual response. The paired annual-difference series tests change in Liberia minus Limón over time; it does not by itself identify a climatic driver or prove equality/inequality of separately estimated robust slopes.

## Reproducible implementation

- [Python experiment script](../analysis/exp001_power.py): download NASA POWER monthly point JSON, parse monthly samples, generate year-level and paired summaries, and calculate **exploratory** trend statistics.
- [Python dependencies](../analysis/requirements-exp001.txt): NumPy, SciPy, Requests and pytest.
- [Unit tests](../tests/test_exp001_power.py): 11 deterministic tests based entirely on **synthetic, explicitly non-NASA** inputs.

Use Python 3.10 or later. These instructions assume execution from the repository root.

### Environment and offline unit tests

~~~bash
python -m venv .venv
# Linux / macOS:
source .venv/bin/activate
# Windows PowerShell:
# .\.venv\Scripts\Activate.ps1
python -m pip install -r analysis/requirements-exp001.txt
python -m pytest -q tests/test_exp001_power.py
~~~

### Live NASA POWER request (requires network)

~~~bash
python analysis/exp001_power.py --run --start 1985 --end 2025 --community RE
~~~

The command downloads each original NASA JSON response and writes them with an exploratory report into the Git-ignored folder **data/raw/exp001/**. Do not commit payloads without reviewing redistributability, provenance and file sizes.

### Analyze the retrieved source responses offline

~~~bash
python analysis/exp001_power.py --liberia-file data/raw/exp001/nasa_power_liberia_raw.json --limon-file data/raw/exp001/nasa_power_limon_raw.json
~~~

The script records expected original query, source/response metadata, requested and returned locations, units, missing months, incomplete years, trend summaries and per-location versus paired results. Offline mode does not invent an original retrieval timestamp.

Reference request (illustration, **not an observed result**):  
https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=T2M,PRECTOTCORR&community=RE&longitude=-85.44&latitude=10.63&start=1985&end=2025&format=JSON

## Quality and statistical methods

1. Require actual NASA parameter units and the documented provider fill value. Fail on unexpected units instead of substituting plausible defaults. Negative temperature is valid; negative rainfall rate is not.
2. Explicitly select calendar months 01 through 12, so a possible YYYY13 annual summary is not mistaken for a 13th month.
3. Complete-year policy: 12 valid months **per variable**. Preserve available years of one variable even when another has missing months.
4. Annual temperature: mean weighted by days per month. Annual precipitation: monthly average daily rate (mm/day) multiplied by the true number of days, then summed (mm/year), including leap years.
5. Compute valid-year intersections before Liberia-minus-Limón paired comparisons.
6. Baseline method: Sen slope per decade and original Mann–Kendall test (tie-adjusted variance, continuity correction). A lag-1 correlation of detrended residuals is **diagnostic only**.
7. The reported p-values and Sen confidence intervals **depend on temporal-independence and related method assumptions**. The code does not claim validated Hamed–Rao correction or an automatically justified significance classification.
8. Return an explicit insufficient-years status for short/empty data. The minimum of 10 years is merely a software screening rule, not a climate-science recommendation.

### Repository automation

A minimal [GitHub Actions workflow](../.github/workflows/exp001-qa.yml) runs the 11 **synthetic** QA tests when the experiment source/tests change, on pull requests, or by manual dispatch. It does **not** contact NASA or establish a valid climate finding. CI status must be inspected in GitHub Actions before claiming it passed.

## Execution record — 2026-11-14

- Command: **python -m pytest -q tests/test_exp001_power.py**
- Result: **11 passed, synthetic fixtures only**.
- Local environment: Python 3.13.5, NumPy 2.3.5, SciPy 1.17.0, Requests 2.32.5, pytest 9.0.2.
- Checks: YYYY13 removal; normal/leap-year precipitation; missing-month code and absent keys; per-variable completeness; rejection of invalid units/metadata; temperature/precipitation value handling; empty datasets; basic MK/Sen invariants; outlier robustness; paired-period alignment; coordinate/date validation.
- Live NASA API test: **not completed**. A request from the testing environment failed because the NASA API host could not be resolved externally.
- No real Liberia/Limón values, slopes, confidence intervals, p-values, significance conclusions, server benchmarks or IMERG comparisons have been produced or approved.

## Corrections to Gemini's original draft

The original externally supplied Python script was **not accepted unchanged**. Its arbitrary greater-than-minus-900 filter, silent unit assumptions, coupled variable completeness, empty-data failure paths, and automatic MK/Hamed–Rao method selection were corrected or removed. Reported confidence intervals and p-values are now clearly labeled exploratory until source data and dependence assumptions are checked. The Gemini report itself acknowledged that it had not executed live NASA calculations.

## Before publishing a scientific finding

- Obtain original NASA responses and verify timestamps, source metadata, coordinate semantics, effective grid and actual valid years.
- Confirm units, conversion and monthly year-summary behavior against *real* NASA records.
- Inspect residual serial dependence, appropriate statistical treatment, uncertainty and possible period sensitivity; compare reference calculations independently.
- Obtain a second NASA product, such as [GPM IMERG V07 monthly](https://doi.org/10.5067/GPM/IMERG/3B-MONTH/07), only after the first validated analysis, matching period, units and spatial footprint correctly.
- Update [validation register](VALIDATION.md) with code SHA, source URL, retrieval UTC and actual numeric values once verified.

## References

- [NASA POWER monthly API](https://power.larc.nasa.gov/docs/services/api/temporal/monthly/)
- [NASA POWER methodology](https://power.larc.nasa.gov/docs/methodology/)
- [GPM IMERG directory](https://gpm.nasa.gov/data/directory)
- [SciPy Sen slope](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.theilslopes.html)
- [Hamed & Rao (1998) on autocorrelated data](https://doi.org/10.1016/S0022-1694(97)00125-X)
