const STYLE_CATEGORIES = new Set(["颜色", "圆角", "文本", "阴影", "描边", "间距"]);
const LAYOUT_DEDUCT_FAIL_TYPES = new Set(["alignDeduct", "wrapDeduct"]);

export function isLayoutDeductRow(row) {
  return row.checkCategory === "布局" && row.status === "不符合" && LAYOUT_DEDUCT_FAIL_TYPES.has(row.failType);
}

export function scorePage(rows, input) {
  const layoutGridRows = rows.filter((row) => row.checkCategory === "页面布局" && row.propertyKey?.startsWith("栅格-"));
  const layoutBgRows = rows.filter((row) => row.checkCategory === "页面布局" && row.propertyKey?.startsWith("背景-"));
  const styleRows = rows.filter((row) => STYLE_CATEGORIES.has(row.checkCategory));
  const resourceRows = rows.filter((row) => row.checkCategory === "资源");
  const customLayoutRows = rows.filter(
    (row) => row.checkCategory === "布局" && row.elementKind === "custom",
  );

  const gridTotal = layoutGridRows.filter((row) => row.status !== "已排除").length;
  const gridPass = layoutGridRows.filter((row) => row.status === "符合").length;
  const gridScore = gridTotal ? (gridPass / gridTotal) * 20 : 20;
  const backgroundDeduct = layoutBgRows.filter((row) => row.status === "不符合").length;
  const pageLayoutScore = Math.max(0, Number((gridScore - backgroundDeduct).toFixed(2)));

  const presetTotal = input.presetComponents?.length ?? 0;
  const customTotal = input.customElements?.length ?? 0;
  const elementTotal = presetTotal + customTotal;
  const presetWeight = elementTotal ? (presetTotal / elementTotal) * 80 : 0;
  const customWeight = elementTotal ? (customTotal / elementTotal) * 80 : 0;

  const presetInvoked = (input.presetComponents ?? []).filter((item) => item.invoked).length;
  const presetCompliance = presetTotal ? presetInvoked / presetTotal : 1;
  const presetScore = Number((presetWeight * presetCompliance).toFixed(2));

  const customStyleRows = styleRows.filter((row) => row.elementKind === "custom");
  const customResourceRows = resourceRows.filter((row) => row.elementKind === "custom");
  const styleDenom = customStyleRows.filter((row) => row.status !== "已排除").length;
  const stylePass = customStyleRows.filter((row) => row.status === "符合").length;
  const resourceDenom = customResourceRows.filter((row) => row.status !== "已排除").length;
  const resourcePass = customResourceRows.filter((row) => row.status === "符合").length;

  const resourceInner = resourceDenom ? (resourcePass / resourceDenom) * 30 : 30;
  const styleInner = styleDenom ? (stylePass / styleDenom) * 70 : 70;
  const customLayoutDeduct = customLayoutRows.filter(isLayoutDeductRow).length;
  const customRaw = Number((resourceInner + styleInner).toFixed(2));
  const customFinal = Math.max(0, Number((customRaw - customLayoutDeduct).toFixed(2)));
  const customPageScore = Number(((customWeight / 100) * customFinal).toFixed(2));

  const finalScore = Number((pageLayoutScore + presetScore + customPageScore).toFixed(2));

  return {
    finalScore,
    modules: {
      pageLayout: {
        gridPass,
        gridTotal,
        gridScore: Number(gridScore.toFixed(2)),
        backgroundDeduct,
        score: pageLayoutScore,
      },
      preset: {
        invoked: presetInvoked,
        total: presetTotal,
        weight: Number(presetWeight.toFixed(2)),
        compliance: Number((presetCompliance * 100).toFixed(2)),
        score: presetScore,
      },
      custom: {
        resourcePass,
        resourceTotal: resourceDenom,
        stylePass,
        styleTotal: styleDenom,
        resourceInner: Number(resourceInner.toFixed(2)),
        styleInner: Number(styleInner.toFixed(2)),
        layoutDeduct: customLayoutDeduct,
        raw: customRaw,
        final: customFinal,
        weight: Number(customWeight.toFixed(2)),
        score: customPageScore,
      },
      elements: {
        presetCount: presetTotal,
        customCount: customTotal,
        total: elementTotal,
      },
    },
  };
}
