"""Adversarial tests adapted from an external Gemini audit (2026-11-14).

IMPORTANT: The original contributed tests contained two broken assertions:
- a 0.001 absolute tolerance that could not detect small p-value differences;
- a nonadditivity fixture that coincidentally yielded equal Theil-Sen slopes.
These fixtures use the actual EXP-001 code and independently checked references.
All inputs here are synthetic, never NASA observations.
"""
import importlib.util
from pathlib import Path

import numpy as np
import pymannkendall as mk
import pytest
from scipy import stats


path = Path(__file__).resolve().parents[1] / "analysis" / "exp001_power.py"
spec = importlib.util.spec_from_file_location("exp001_adversarial", path)
exp = importlib.util.module_from_spec(spec)
spec.loader.exec_module(exp)


def test_mann_kendall_tied_series_agrees_with_independent_reference():
    # Ties of size 3, 4 and 2; exact ties, not arbitrary fuzzy rounding.
    y = np.array([10.0, 10.0, 10.0, 11.5, 12.0, 12.0,
                  12.0, 12.0, 14.2, 15.0, 15.0, 18.0])
    ours = exp.mann_kendall_independent(y.tolist())
    ref = mk.original_test(y)
    n = len(y)
    tie_term = 3 * 2 * 11 + 4 * 3 * 13 + 2 * 1 * 9
    expected_variance = (n * (n - 1) * (2 * n + 5) - tie_term) / 18.0
    expected_z = (ours["s"] - 1.0) / np.sqrt(expected_variance)

    assert ours["s"] == ref.s
    assert ours["variance_s"] == pytest.approx(expected_variance, abs=1e-12)
    assert ours["variance_s"] == pytest.approx(ref.var_s, abs=1e-12)
    assert ours["z"] == pytest.approx(expected_z, abs=1e-12)
    assert ours["z"] == pytest.approx(ref.z, abs=1e-12)
    assert ours["p_value"] == pytest.approx(ref.p, abs=1e-12)
    _, scipy_p = stats.kendalltau(np.arange(n), y)
    assert abs(ours["p_value"] - scipy_p) > 1e-6  # Deliberately not atol=0.001.


def test_sen_uses_calendar_years_when_some_years_are_missing():
    years = np.array([1990, 1991, 1993, 1994, 1996, 1998,
                      2000, 2002, 2004, 2005, 2007, 2009], dtype=float)
    values = 10.0 + 2.0 * (years - 1990.0)
    expected = np.median([(values[j] - values[i]) / (years[j] - years[i])
                          for i in range(len(years)) for j in range(i + 1, len(years))])
    assert expected == pytest.approx(2.0)
    r = exp.analyze({int(t): float(v) for t, v in zip(years, values)})
    assert r["trend"]["slope_per_decade"] == pytest.approx(20.0)
    scipy_slope = stats.theilslopes(values, years).slope
    assert scipy_slope == pytest.approx(expected)
    # pyMannKendall uses index differences for its returned slope, not real x years.
    assert abs(mk.original_test(values).slope - expected) > 0.1


def test_sen_is_not_linear_in_paired_difference():
    years = np.arange(1985, 1995, dtype=float)
    # Corrected counterexample: the external audit's original numbers
    # coincidentally had slope(A-B) == slope(A)-slope(B).
    a = np.array([-0.52, 0.63, -1.46, -2.99, -0.61,
                  -1.03, 1.8, 0.2, -0.93, -1.11])
    b = np.array([0.56, -0.77, -0.52, -0.03, 0.15,
                  0.16, 0.18, 1.37, 1.77, -1.58])
    slope_a = stats.theilslopes(a, years).slope
    slope_b = stats.theilslopes(b, years).slope
    slope_difference_series = stats.theilslopes(a - b, years).slope
    assert abs(slope_difference_series - (slope_a - slope_b)) > 0.1


def test_lag_one_is_diagnosed_after_detrending():
    rng = np.random.default_rng(42)
    years = np.arange(2000, 2041, dtype=float)
    y = 25.0 + 0.15 * np.arange(len(years)) + rng.normal(0, 0.2, len(years))
    slope = stats.theilslopes(y, years).slope
    detrended = y - slope * (years - years[0])
    lag1_raw = float(np.corrcoef(y[:-1], y[1:])[0, 1])
    lag1_detrended = float(np.corrcoef(detrended[:-1], detrended[1:])[0, 1])
    result = exp.analyze({int(t): float(v) for t, v in zip(years, y)})

    assert lag1_raw > 0.85
    assert abs(lag1_detrended) < 0.3
    assert result["lag1_on_detrended_residuals_diagnostic_only"] == pytest.approx(lag1_detrended)
    assert result["n_consecutive_year_pairs_for_lag1"] == 40


def test_missing_years_do_not_masquerade_as_lag_one_pairs():
    years = [2000, 2001, 2002, 2005, 2006, 2007, 2010,
             2011, 2012, 2015, 2016, 2017]
    observations = {y: 0.3 * (y - 2000) + float((i * i) % 7)
                    for i, y in enumerate(years)}
    outcome = exp.analyze(observations)
    assert outcome["n"] == 12
    assert outcome["n_consecutive_year_pairs_for_lag1"] == 8
    assert outcome["missing_year_gaps"] == [2, 2, 2]
    x = np.array(years, dtype=float)
    values = np.array([observations[y] for y in years], dtype=float)
    slope = stats.theilslopes(values, x).slope
    residuals = values - slope * (x - x[0])
    consecutive = np.flatnonzero(np.diff(x) == 1)
    expected_r1 = float(np.corrcoef(residuals[consecutive],
                                     residuals[consecutive + 1])[0, 1])
    assert outcome["lag1_on_detrended_residuals_diagnostic_only"] == pytest.approx(expected_r1)


def test_insufficient_calendar_pairs_have_no_lag_one_estimate():
    years = list(range(2000, 2020, 2))  # 10 observations; no consecutive year pairs.
    outcome = exp.analyze({y: 1.4 * y + (i % 3) for i, y in enumerate(years)})
    assert outcome["status"] == "exploratory_independence_not_established"
    assert outcome["n_consecutive_year_pairs_for_lag1"] == 0
    assert outcome["lag1_on_detrended_residuals_diagnostic_only"] is None
