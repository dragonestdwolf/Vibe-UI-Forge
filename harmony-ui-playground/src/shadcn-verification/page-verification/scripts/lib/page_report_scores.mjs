export function buildReportScores(scores, domSummary, input) {
  const layoutChecks =
    (input.layout?.gridChecks?.length ?? 0) + (input.layout?.backgroundChecks?.length ?? 0);
  const registryCheckCount =
    layoutChecks +
    (input.presetComponents?.length ?? 0) +
    (input.customElements?.reduce(
      (sum, el) => sum + (el.styleChecks?.length ?? 0) + (el.resources?.length ?? 0) + (el.layoutChecks?.length ?? 0),
      0,
    ) ?? 0);

  const registryWeightedScore = scores.finalScore;
  const domComplianceRate = domSummary?.complianceRate ?? null;
  const domCollectedChecks = domSummary?.totalChecks ?? 0;

  const headline =
    registryCheckCount > 0
      ? {
          label: "Registry 加权总分",
          value: registryWeightedScore,
          unit: "/ 100",
          note: domComplianceRate != null ? `DOM 全量合规率 ${domComplianceRate}%（单独统计，见下文）` : "",
        }
      : {
          label: "DOM 规范合规率（主评分）",
          value: domComplianceRate ?? registryWeightedScore,
          unit: "%",
          note:
            "未配置 registry 清单加权项，不以布局基线 20 分作为页面结论；请以 DOM 合规率为准。",
        };

  return {
    registryCheckCount,
    registryWeightedScore,
    domComplianceRate,
    domCollectedChecks,
    headline,
  };
}
