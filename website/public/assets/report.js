/* TELLURIS EXP-005 portable scientific evidence report, no external dependencies.
 * Labels reflect assumptions; no model-produced p becomes a validated climate
 * significance claim in this document.
 */
export function buildScientificReport(active, context={}) {
  if(!active?.analysis?.points?.length || !active.variable || !active.meta)
    throw new Error("No verified annual observation series loaded.");
  const a=active.analysis,proof=a.status==="exploratory"?a.inference:null;
  return {
    schema:"telluris.exp005.scientific_report.v1",
    generatedUtc:new Date().toISOString(),
    independentProject:"Project Uriel / TELLURIS · NASA Space Apps Challenge 2026",
    nasaAffiliation:"Independent participant project; not sponsored or endorsed by NASA",
    parameter:active.variable,
    unit:context.unit||null,
    coordinateInput:context.inputCoordinates||null,
    label:context.placeLabel||"Selected NASA point",
    originalData:{
      provider:active.meta.kind,
      sources:active.meta.source,
      apiVersion:active.meta.version,
      sourceParameters:[active.variable],
      nativeUnit:active.meta.originalUnit,
      resolvedCoordinates:active.meta.resolvedCoordinates||null,
      sourceURL:active.queryUrl||active.meta.archiveLink||null,
      rawArchiveSha256:active.meta.rawSha256||null,
      requestedYears:active.meta.period||null,
      retrievedUtc:active.meta.retrievedUtc||null,
      annualAggregation:active.meta.aggregation||null,
      fullYearCoverageRequired:true,
      incompleteYears:active.meta.incomplete||[],
      archiveNote:active.meta.note||null
    },
    annualObservations:a.points.map(p=>({year:p.year,value:p.value})),
    analysis:a.status==="descriptive"?{
      type:"circular_annual_descriptive",
      note:"Circular wind bearing is not suitable for a straight-line Sen/MK trend.",
      validatedSignificance:false
    }:{
      type:"annual_monotonic_trend_exploratory",
      period:[a.start,a.end],n:a.n,
      estimate:{
        method:"Theil-Sen",slopePerYear:a.slope,slopePerDecade:a.slopePerDecade,
        ci95RankBasedIndependentYears:proof?.senCI||null
      },
      tests:{
        originalMannKendall:a.mk,
        originalPAssumption:"independent_monotonic_annual_observations",
        serialResidualLag1:a.lag1,
        consecutiveYearPairs:a.lag1Pairs,
        blockOrderPermutations:proof?.blockTests||null,
        blockNullAssumption:"stationary_exchangeable_nonoverlapping_blocks",
        blockMethodLimit:"Nonstandard sensitivity, not a validated universal autocorrelation correction",
        decision:proof?.status||"not_assessed"
      },
      validatedSignificance:false,
      warning:"Source homogeneity, long-term serial dependence, possible nonstationarity and repeated-testing effects are not independently validated."
    },
    pairedDifference:active.pairedDifference?.status==="exploratory"?{
      definition:"selected_location_minus_other_Costa_Rican_coast",
      n:active.pairedDifference.n,
      slopePerDecade:active.pairedDifference.slopePerDecade,
      senCI95:active.pairedDifference.inference?.senCI||null,
      originalMannKendall:active.pairedDifference.mk,
      decision:active.pairedDifference.inference?.status||"not_assessed",
      validatedSignificance:false
    }:null,
    limitations:[
      "Source gridded spatial support is not a station reading or an entire province",
      "Original Mann–Kendall and rank-based Sen confidence interval assume independent annual observations",
      "Block permutation only probes sensitivity under exchangeable stationary blocks; not a Hamed–Rao correction",
      "Multiple comparisons across many NASA parameters are not adjusted",
      "No causal attribution, forecast, certified trend significance or independent product homogeneity validation"
    ],
    reproducibility:{
      code:"https://github.com/NorlanRBarrantes/TELLURIS",
      methodology:"docs/EXP-005-SIGNIFICANCE.md",
      externalReference:"https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.theilslopes.html",
      methodVersion:"EXP-005"
    }
  };
}
