# Scientific guardrails and statistical integrity

**Status:** Design requirements proposed after critical review of an external AI-assisted research report (2026-11-14). Not implemented, tested or claimed as a working feature.

## Purpose

TELLURIS should let non-specialists distinguish a plausible physical change from an unreliable statistical inference. Scientific guardrails will explain and test data quality, sample support, method assumptions and uncertainty. These checks must not be represented as automatic proof of significance or causal attribution.

## Tier 0: Required for the first genuine NASA-backed analysis

1. **Provenance:** show provider, collection/source, version when available, selected coordinates or footprint, effective grid/resolution, actual time span, source response timestamp, variable, original units and aggregation method.
2. **Missing values:** inspect per-field provider metadata for documented fill/sentinel codes; exclude non-finite values and documented missing values. Never apply an arbitrary rule such as `value > -900` across all variables, because negative values can be valid for some variables.
3. **Time/units:** align the calendar, convert rate units correctly, distinguish calendar-month mean temperature from precipitation rates and accumulated totals, handle leap years; never infer full years from incomplete time series without a declared completeness rule.
4. **Sample support:** disclose number of valid months/years and reject or flag inadequate coverage. The suggested 85% completeness rule in an external report is **not validated or mandatory**; use an explicit variable-appropriate rule (initially, prefer 12/12 valid months for annual comparisons).
5. **Basic statistics:** report an independently validated trend estimate (e.g., Sen slope in units/year and units/decade), the method and assumptions for its significance test, p-value/CI where applicable, and clearly distinguish lack of evidence from evidence of no change.
6. **Spatial semantics:** a NASA POWER point result represents a gridded model/reanalysis sample, **not** a direct station observation, exact city measurement or entire province/region.
7. **Reproducibility:** retain exact source query and algorithm/version; no fabricated data or generated p-values.

## Tier 1: Add only after the baseline is tested

- **Annual Mann–Kendall:** on adequately complete annual summaries; inspect serial autocorrelation and test assumptions.
- **Seasonal Mann–Kendall:** on properly ordered monthly observations to compare the same months across years. It is not generally correct to apply original MK directly to unadjusted raw monthly series.
- **Serial-dependence modification (e.g., Hamed–Rao):** use an independently validated method when diagnostics justify it. These methods are not uniformly correct under every time-series process and should not be activated just to change significance.
- **Sen confidence interval:** require a documented method and valid assumptions; an alpha level does not automatically guarantee coverage under dependence.
- **Multiple-testing control:** when scanning multiple points/variables, disclose selection and consider false-discovery-rate control. Do not select significant-looking examples after exploratory testing and present them as independently confirmatory results.
- **Aligned paired comparisons:** report both slope estimates with common periods and processing; two separate p-values do not directly test whether the two trends differ.
- **Multi-source comparisons:** GPM IMERG and MERRA-2/POWER differ in spatial/temporal resolution, retrieval methodology, and uncertainty. Compare only correctly aligned periods, units and footprints; disagreement does not automatically invalidate either source.

## Optional research enhancements, NOT required by NASA

- ENSO/Niño-3.4 association analysis (index definition, source, version, lag, detrending, autocorrelation and multiple testing must be documented). **Regressing out ENSO does not isolate an anthropogenic trend or prove causation.** Do not label the residual as the "pure" climate-change signal.
- Pettitt single-change-point analysis with appropriate interpretation and multiple-testing precautions. It does **not** establish a unique physical cause or precise causal change date.
- Selection guidance or AI explanations, strictly constrained to verified source data and results.
- ESP32 auxiliary display. A display of retrospective results is **not** a sensor network or disaster/real-time early-warning system.

## Numerical and performance claims we must NOT make without tests

- Significance values (including `p < 0.001`) or slope signs for Liberia, Limón, India, Europe or any region.
- Guaranteed NASA API latency (e.g., `<2 seconds`) or browser-statistics latency (e.g., `<4 ms`); network/device variability is material.
- Exact TypeScript/Python equality to six decimals before end-to-end fixture comparison. Use declared tolerances and test actual edge cases.
- "100% compatible" shared-hosting support or a specific BanaHosting PHP/Passenger/cPanel capability before account inspection.
- Claims about the identity, proportions of failures, or scientific competence of competing teams without direct evidence.

## Preliminary schema proposal, NOT finalized

A minimal analysis result should distinguish *source observation metadata* from *derived test results* and quality flags. Fields might include:

`source.provider`, `source.collection`, `source.variable`, `source.units`, `location.requested`, `location.effectiveFootprint`, `period.requested`, `period.analyzed`, `quality.validCount`, `quality.warnings`, `method.name`, `method.assumptions`, `trend.slopePerDecade`, `trend.units`, `significance.pValue`, `significance.alpha`, `significance.interpretation`.

Do not pre-populate advanced fields (Hamed-Rao p-values, ENSO correlations, Pettitt year) with invented values. Optional outputs should be absent or null with an explicit not-calculated reason.

## Sources

- [2026 NASA Space Apps challenge](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)
- [NASA POWER monthly API](https://power.larc.nasa.gov/docs/services/api/temporal/monthly/)
- [NASA GPM precipitation data directory](https://gpm.nasa.gov/data/directory)
- [pyMannKendall method definitions](https://github.com/mmhs013/pyMannKendall)
- [Hamed–Rao background from University of Toronto](https://www.utsc.utoronto.ca/~butler/climate-lab/mann-kendall-correlated.pdf)
- [NOAA ONI historical-base-period explanation](https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/ensostuff/ONI_change.shtml)

**Evidence state:** Scientific design only. Completing a validation gate requires actual test artifacts, code commit and source metadata in [VALIDATION.md](VALIDATION.md).
