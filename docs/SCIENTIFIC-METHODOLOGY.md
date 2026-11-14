# Scientific methodology — proposed protocol

**Status:** Method design only. This document does not claim that an analysis has run or passed validation.

## Scientific question and unit of analysis

Define a variable, source, spatial sampling support, calendar coverage, temporal resolution, and unit of measurement **before** computing a trend. For point datasets, state the coordinates and effective data grid. Geographic labels should be treated as navigation aids unless spatial aggregation is explicitly implemented.

## Processing pipeline

1. Acquire NASA response plus metadata; retain retrieval provenance.
2. Validate response shape, units, calendar timestamps, and coordinate agreement.
3. Remove documented missing-value sentinels and invalid observations.
4. Reject incomplete years or disclose and justify a completeness threshold.
5. Aggregate to annual values as justified by the variable; preserve annual sample count.
6. Estimate a trend with an explicit x-axis in years.
7. Test the trend using an appropriate method.
8. Report units per year and per decade, method, p-value/CI, valid n, coverage, warnings, and attribution.

## Candidate statistical procedures

**Ordinary least squares (OLS).** Fits an intercept and linear slope. Clearly state if a p-value/CI depends on residual independence, homoscedasticity, and other model assumptions. A fitted line alone is not sufficient evidence of significance.

**Mann–Kendall test.** A rank-based test for monotonic trend. Implement tie handling and continuity correction correctly, or reuse a well-verified licensed library. A naive asymptotic approximation may be inaccurate for small sample sizes and serially correlated observations.

**Sen's slope.** Robust estimator of the median of pairwise slopes. Specify the time scale and demonstrate numerical agreement against an independent implementation.

### Interpretation policy

- Report the **effect size** as well as its uncertainty and the significance test.
- A p-value below a predeclared threshold (illustratively 0.05) is evidence **against a specified null**, not the probability that a hypothesis is true.
- 'Not statistically significant' must not be translated into 'no change exists.'
- Correlation and parallel trends do not by themselves establish causation.
- If many locations/variables are scanned, address multiple-testing bias.
- Annual aggregation may reduce seasonal structure but does not automatically remove serial correlation. Check autocorrelation or use a justified method before interpreting p-values.
- Nonlinear behavior and different trends in different subperiods require appropriate caveats.

## Proposed minimum quality standard

- Prefer a sufficiently long time span, e.g. 20+ complete years for first demonstrations; the threshold is an analytical design choice, not a NASA mandate.
- Require input sanity checks and make minimum sample size explicit in code.
- Test known synthetic increasing, decreasing, flat, tied, and gapped series to verify algorithms. Synthetic test inputs must never be labeled as observations.
- Use an **independent** reference implementation (for example SciPy and/or a validated Mann–Kendall package) for a fixed test fixture.
- Verify numerical tolerance, time-unit scaling, leap years, and missing-data behavior.
- Compare any independent aggregation or plotted results against original NASA records.

## Reporting template

- Question and exact location/sample area
- Data provider + collection + retrieval metadata
- Variable and units
- Period requested / valid period and n
- Aggregation and missing-data protocol
- Slope, uncertainty, and method
- Statistical test, p-value or confidence interval, assumptions
- Interpretation **without causal overreach**
- Limitations and repeatability instructions

## Scientific references

- Challenge: https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/
- POWER monthly service: https://power.larc.nasa.gov/docs/services/api/temporal/monthly/
- NASA POWER methodology: https://power.larc.nasa.gov/docs/methodology/

Scientific results will be added **only after** a real-data execution and independent verification.
