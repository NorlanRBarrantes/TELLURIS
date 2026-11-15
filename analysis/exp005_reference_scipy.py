#!/usr/bin/env python3
"""EXP-005 independent SciPy cross-check of JS Sen slope and 95% bounds.

Requires scipy, reads JSON lines generated from authentic NASA EXP-001 archive
and synthetic controlled fixtures. Does NOT approve statistical significance.
"""
import json,sys
from scipy.stats import theilslopes

def run(path):
    results=json.load(open(path,encoding="utf-8"))
    assert len(results)>=6
    for record in results:
        x=record["years"]
        y=record["values"]
        scipy=theilslopes(y,x,alpha=.95,method="joint")
        got=record["js"]
        for name,expected,observed in (
            ("slope",scipy.slope,got["slope"]),
            ("low_95",scipy.low_slope,got["low"]),
            ("high_95",scipy.high_slope,got["high"])):
            difference=abs(float(expected)-float(observed))
            tolerance=1e-10*max(1,abs(float(expected)))
            if difference > tolerance:
                raise AssertionError(
                    f'{record["label"]} {name}: SciPy {expected} vs JS {observed}, delta={difference}'
                )
        print("SCIPY_PARITY",record["label"],"sen",scipy.slope,
              "95pct",scipy.low_slope,scipy.high_slope,flush=True)
    print("PASS_SEN_CI_INDEPENDENT_REFERENCE",len(results),flush=True)

if __name__=="__main__":
    run(sys.argv[1])
