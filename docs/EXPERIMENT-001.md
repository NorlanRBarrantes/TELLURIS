# EXP-001 — Liberia–Limón NASA POWER trend investigation

**Status: REAL NASA DATA RETRIEVED; EXPLORATORY SLOPES REPRODUCED; SCIENTIFIC INFERENCE PENDING.**

## Verified NASA POWER acquisition — 2026-11-15 UTC

**Status:** Real NASA POWER monthly-point data retrieved and processed; exploratory numerical slopes independently recalculated. Significance/uncertainty under serial dependence, precipitation product homogeneity and public browser deployment remain **unverified**.

- [GitHub Actions source run #43656774519](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43656774519), artifact `exp001-nasa-power-originals` (original raw NASA JSON for two sites and Python EXP-001 output; 30-day retention).
- NASA API `v2.10.0`; header source `MERRA2`; fill `-999`; period 1985-01-01 through 2025-12-31; T2M units `C`, PRECTOTCORR units `mm/day`. Each site/variable has 41 complete annual aggregates, with 41 explicit `YYYY13` summary keys excluded.
- Point returned: Liberia `[-85.44,10.63,94.64]`; Limón `[-83.03,9.99,354.78]`, geographic coordinates and NASA-reported source elevation—not station observations.

| NASA model grid sample | Sen T2M (°C/decade) | Sen rainfall (mm/decade) | Original MK p T2M* | Original MK p PREC* |
| --- | ---: | ---: | ---: | ---: |
| Liberia | -0.11268630 | +434.85162 | 0.08570791 | 0.0000000161 |
| Limón | +0.16786322 | +918.76865 | 0.0000001762 | 0.0000000003415 |

*Original MK p-values are **exploratory**, not corrected/validated for serial dependence; do **not** present them as final scientific significance claims.*

An independent local re-aggregation of the **original monthly JSON**, using exact month lengths and SciPy's `stats.theilslopes` with real calendar years, reproduced all four Python trend estimates to numeric precision. In contrast, rainfall period means were extremely different (Liberia: ~793 mm/year for 1985–2004 vs ~2002 for 2005–2025; Limón ~1510 vs ~3469). This strongly motivates an **inhomogeneity assessment** with independent satellite and gauge products. NASA's [MERRA-2 precipitation documentation](https://power.larc.nasa.gov/docs/methodology/data/sources_meteorology/) and [Reichle et al., 2017](https://journals.ametsoc.org/view/journals/clim/30/5/jcli-d-16-0570.1.xml) note limitations and possible gauge-network discontinuities; our specific series have not yet been attributed to any mechanism.

**Source integrity:** Source-original SHA-256 Liberia `2630001674b075e90a5a0d17edbc22370e8feb43a7df4e6230ab28958a27fd8b`; Limón `5c202f4d083412a53755a5900b4423ceebd1040efe496838377af93aa6299a19`. Rounded 41-year annual source samples are committed as [EXP-001 Explorer data](../website/public/telluris/explore/data/exp001-annual.json); they explicitly link to the retrieval run and original SHA-256 fingerprints.

## Static Explorer 0.1 — implemented and tested

[Explorer source](../website/public/telluris/explore/index.html) uses pure browser ES modules and authentic NASA-derived annual data for an immediately usable, reproducible historical demonstration. Supports configurable location/variable/period, live POWER request (CORS unverified), importing source NASA JSON, historical chart, independently tested Sen slope, original MK p explicitly labeled *exploratory*, lag-1 diagnostic, original NASA provenance and CSV download. Tests: [GitHub Actions static MVP run #43657393798](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43657393798), **12/12 Node scientific/browser-source tests and static HTTP smoke passed**. Static website artifact created for manual cPanel upload.

**Do not equate a working static app or numerical algorithm parity with scientifically validated climate inference or verified public deployment.**

**Historical notes further below:** Some earlier sections still describe the initial inability to access NASA; that stage was superseded by the verified 2026-11-15 UTC acquisition recorded above. Their old test statuses are retained as an audit trail, not current status.

## Scientific question

Investigate historical trends in T2M temperature and PRECTOTCORR precipitation at two NASA POWER model/grid samples near Liberia (10.63 N, -85.44 W) and Limón (9.99 N, -83.03 W). These coordinates are provisional point requests, not in-situ station measurements or samples representing entire provinces.

The tentative 1985–2025 period contains 41 calendar years if all requested months are available. Never assert 41 *valid* years before checking the actual response. The paired annual-difference series tests change in Liberia minus Limón over time; it does not by itself identify a climatic driver or prove equality/inequality of separately estimated robust slopes.

## Reproducible implementation

- [Python experiment script](../analysis/exp001_power.py): download NASA POWER monthly point JSON, parse monthly samples, generate year-level and paired summaries, and calculate **exploratory** trend statistics.
- [Python dependencies](../analysis/requirements-exp001.txt): NumPy, SciPy, Requests and pytest.
- [Unit tests](../tests/test_exp001_power.py): 11 baseline tests and [10 adversarial tests](../tests/test_exp001_adversarial.py) based entirely on **synthetic, explicitly non-NASA** inputs.

Use Python 3.10 or later. These instructions assume execution from the repository root.

### Environment and offline unit tests

~~~bash
python -m venv .venv
# Linux / macOS:
source .venv/bin/activate
# Windows PowerShell:
# .\.venv\Scripts\Activate.ps1
python -m pip install -r analysis/requirements-exp001.txt
python -m pytest -q tests/test_exp001_power.py tests/test_exp001_adversarial.py
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

A minimal [GitHub Actions workflow](../.github/workflows/exp001-qa.yml) runs the 11 **synthetic** QA tests when the experiment source/tests change, on pull requests, or by manual dispatch. It does **not** contact NASA or establish a valid climate finding. The first CI run [#43640908593](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43640908593), on commit bc746cdf, **completed successfully**. This confirms only the synthetic Python tests in the hosted runner, not NASA-data or statistical independence validation.

## Execution record — 2026-11-14

- Command: **python -m pytest -q tests/test_exp001_power.py**
- Result: **11 passed, synthetic fixtures only**.
- Local environment: Python 3.13.5, NumPy 2.3.5, SciPy 1.17.0, Requests 2.32.5, pytest 9.0.2.
- Checks: YYYY13 removal; normal/leap-year precipitation; missing-month code and absent keys; per-variable completeness; rejection of invalid units/metadata; temperature/precipitation value handling; empty datasets; basic MK/Sen invariants; outlier robustness; paired-period alignment; coordinate/date validation.
- Live NASA API test: **not completed**. A request from the testing environment failed because the NASA API host could not be resolved externally.
- No real Liberia/Limón values, slopes, confidence intervals, p-values, significance conclusions, server benchmarks or IMERG comparisons have been produced or approved.

## Corrections to Gemini's original draft

The original externally supplied Python script was **not accepted unchanged**. Its arbitrary greater-than-minus-900 filter, silent unit assumptions, coupled variable completeness, empty-data failure paths, and automatic MK/Hamed–Rao method selection were corrected or removed. Reported confidence intervals and p-values are now clearly labeled exploratory until source data and dependence assumptions are checked. The Gemini report itself acknowledged that it had not executed live NASA calculations.

## Adversarial audit of EXP-001 — 2026-11-14

A team-supplied Gemini analysis proposed independent statistical tests but **did not receive the three actual repository files**. Its recommendations were checked against the real code; we did not treat its hypothetical issues as confirmed bugs.

**Already correctly implemented before this audit:**
- Original Mann–Kendall tie correction and continuity correction, confirmed against pyMannKendall 1.4.3 for a deterministic tied-value fixture.
- SciPy `theilslopes(values, years)` uses the actual calendar year axis and does not collapse missing years into adjacent indices.
- Detrending before estimating serial correlation; exclusions of YYYY13, documented fill values and day-weighted annual aggregation.
- Paired annual Liberia-minus-Limón difference is a trend **in the time-varying gap**, not a causal inference or a guarantee that Sen(A−B)=Sen(A)−Sen(B).

**Errors in Gemini's suggested tests:**
1. Its original Theil–Sen nonadditivity fixture yielded exactly equal slopes in that particular example, so the intended `assert not np.isclose(...)` would fail. Replaced with a deterministic counterexample where the estimated slopes genuinely differ.
2. Its original `not np.isclose(MK_p, SciPy_p, atol=1e-3)` was unsuitable: the observed difference in the provided example is about 0.000025, much smaller than 0.001. We now test our MK values against pyMannKendall with tight tolerance and show the non-equivalence to SciPy's uncorrected p-value separately.

**Confirmed implementation issue and fix:**

The prior lag-1 diagnostic correlated adjacent **retained** observations even across calendar-year gaps. `analysis/exp001_power.py` now considers only consecutive calendar-year pairs, reports their count, and returns null when too few pairs support a correlation estimate. This is diagnostic quality control; it is **not** a Hamed–Rao correction or proof of serial independence.

**Reproducible checks:**

- Original synthetic tests: [tests/test_exp001_power.py](../tests/test_exp001_power.py), 11 cases.
- Adversarial synthetic tests: [tests/test_exp001_adversarial.py](../tests/test_exp001_adversarial.py), 6 cases using SciPy and pyMannKendall 1.4.3.
- Run: `python -m pytest -q tests/test_exp001_power.py tests/test_exp001_adversarial.py`
- [GitHub Actions run #43649103042](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43649103042) — **17 passed**, `fix: validate calendar gaps in EXP-001 statistical diagnostics`.
- [GitHub Actions run #43649183358](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43649183358) — **success** after updating GitHub Actions to Node 24 compatible checkout@v5 and setup-python@v6. The same 17 synthetic checks run again.

**Boundaries:** No actual NASA POWER response was downloaded in this review; this is **software unit-test evidence, not empirical Earth-science validation**. Sen confidence intervals and original MK p-values remain exploratory for real, potentially autocorrelated climate observations. No new physical trend, p-value, or climate attribution is asserted.

Reference specifications: [SciPy theilslopes](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.theilslopes.html), [pyMannKendall source](https://github.com/mmhs013/pyMannKendall), [NASA POWER monthly API](https://power.larc.nasa.gov/docs/services/api/temporal/monthly/).


## Before publishing a scientific finding

- Obtain original NASA responses and verify timestamps, source metadata, coordinate semantics, effective grid and actual valid years.
- Confirm units, conversion and monthly year-summary behavior against *real* NASA records.
- Inspect residual serial dependence, appropriate statistical treatment, uncertainty and possible period sensitivity; compare reference calculations independently.
- Obtain a second NASA product, such as [GPM IMERG V07 monthly](https://doi.org/10.5067/GPM/IMERG/3B-MONTH/07), only after the first validated analysis, matching period, units and spatial footprint correctly.
- Update [validation register](VALIDATION.md) with code SHA, source URL, retrieval UTC and actual numeric values once verified.

## Fourth external Gemini audit — reviewed against current repository (2026-11-14)

A team-supplied second-generation adversarial report enumerated six possible defects but stated that Gemini had not actually received the current source files. The report was **not treated as a verified diagnosis**. Each claim was compared to `analysis/exp001_power.py` at commit cc2cd26 and to the statistical-library source.

| Gemini claim | Review result |
| --- | --- |
| Hamed–Rao applied to missing-year sequences with compressed time | **Not applicable to EXP-001**: production experiment does not call Hamed–Rao or auto-select it. For future integration, actual calendar spacing requires a justified method. |
| Missing precipitation month discards otherwise valid T2M year | **Already handled**: monthly completeness is evaluated independently per variable, and paired comparisons align common years per variable. |
| Improper lag-1 normalization when years are missing | **Already handled**: after detrending, the implementation calculates Pearson correlation over actual consecutive calendar-year pairs; does not use the full-series-variance denominator or an unvalidated significance threshold. |
| Fixed -900 cutoff, ignored NASA fill metadata / asymmetric missing keys | **Already handled**: parse exact `header.fill_value`, reject unknown unit metadata, and examine 12 expected month keys for each variable. No claim is made about unverified alternate API schemas. |
| Automatic Hamed–Rao selection based on only Pearson lag-1 | **Not applicable**: MK p-values and Sen CIs remain explicitly conditional on independence. A lag-1 estimate is diagnostic only. |
| Sen(A-B) versus Sen(A)-Sen(B) interpretation | **True methodological caution, now clearer in output**: `paired_difference[var].slope_comparison` exposes both distinct estimators over the **same common calendar years**, labeled exploratory. |

### Correcting a misleading proposed NaN workaround

The supplied report advised padding a missing-year grid with `np.nan` before calling `pymannkendall.hamed_rao_modification_test`. In the library's code, the MK statistic/variance path skips NaNs and effectively compresses its time axis. The slope calculation path can nevertheless return **different Sen slopes** for padded versus compressed inputs. Our synthetic regression test observed equal p-values and corrected variances but different reported slopes. Hence **NaN padding alone is not a validated remedy**, and EXP-001 still does not use Hamed–Rao as a definitive correction.

Source review: [pyMannKendall implementation](https://github.com/mmhs013/pyMannKendall/blob/master/pymannkendall/pymannkendall.py).

### New interpretation fields (non-breaking addition)

In the per-variable `paired_difference` structure:

- `slope_comparison.liberia_sen_on_common_years_per_decade`
- `slope_comparison.limon_sen_on_common_years_per_decade`
- `slope_comparison.difference_of_individual_sen_slopes_per_decade`
- `slope_comparison.sen_slope_of_paired_difference_per_decade`

Because the median-of-pairwise-slopes estimator is nonlinear, the final two values **need not agree**. Neither is a causal claim or a formal proof of differences between underlying robust slopes. If too few common years are available, a status is returned instead of invented slopes.

### Verified synthetic QA

- Four new tests protect metadata-defined sentinel handling, distinguish Hamed–Rao `NaN` behavior, check paired-slope output and verify that the code does not claim Hamed–Rao-based significance.
- Total: **21 of 21 synthetic tests passed** in [GitHub Actions run #43650944212](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43650944212) (Python 3.12, pyMannKendall 1.4.3 and SciPy).
- An earlier test draft in [run #43650886241](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43650886241) failed because it incorrectly asserted that NaN padding left Sen slope unchanged. The assertion was corrected after inspecting the actual library behavior; it was a **test assumption error**, not a discovered TELLURIS climate-engine defect.
- **Scientific gate remains pending:** no actual NASA POWER response or verified Liberia/Limón climatological trends resulted from this audit.


## References

- [NASA POWER monthly API](https://power.larc.nasa.gov/docs/services/api/temporal/monthly/)
- [NASA POWER methodology](https://power.larc.nasa.gov/docs/methodology/)
- [GPM IMERG directory](https://gpm.nasa.gov/data/directory)
- [SciPy Sen slope](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.theilslopes.html)
- [Hamed & Rao (1998) on autocorrelated data](https://doi.org/10.1016/S0022-1694(97)00125-X)
