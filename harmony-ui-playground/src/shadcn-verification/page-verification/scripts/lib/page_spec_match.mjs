import { validateCheckAgainstSpec } from "../../../component-verification/scripts/lib/spec_validate.mjs";

function extractBoxShadowPart(boxShadow, key) {
  const raw = String(boxShadow ?? "").trim();
  if (!raw || raw === "none") return "/";
  const color = raw.match(/rgba?\([^)]+\)/i)?.[0];
  if (key.includes("颜色")) return color ?? "/";
  const withoutColor = raw.replace(/rgba?\([^)]+\)/gi, "").trim();
  const lengths = withoutColor.match(/-?[\d.]+px/g) ?? [];
  if (key.includes("X偏移")) return lengths[0] ?? "/";
  if (key.includes("Y偏移")) return lengths[1] ?? "/";
  if (key.includes("模糊")) return lengths[2] ?? "/";
  if (key.includes("扩展")) return lengths[3] ?? "0px";
  return raw;
}

export function actualValueForCheck(check, styles) {
  const raw = styles?.[check.property] ?? "/";
  if (check.property === "box-shadow") return extractBoxShadowPart(raw, check.key ?? "");
  return raw || "/";
}

export function evaluateActualAgainstSpec(check, actualValue, specs, gapAllowedValues) {
  const actual = String(actualValue ?? "").trim();
  if (!actual || actual === "/" || actual === "none" || actual === "transparent") {
    if (check.category === "阴影" && actual === "none") {
      return {
        status: "已排除",
        failType: "",
        note: "无阴影，不参与计分",
        actualValue: actual,
      };
    }
    return {
      status: "无法判定",
      failType: "来源不可追溯",
      note: "无法采集有效 computed 值",
      actualValue: actual || "/",
    };
  }

  if (check.category === "间距" && gapAllowedValues) {
    if (!actual || actual === "normal" || actual === "auto") {
      return {
        status: "已排除",
        failType: "",
        note: "间距属性未生效（normal/auto）",
        actualValue: actual || "/",
        specReference: "../references/gap.json",
      };
    }
    const match = actual.match(/^(-?[\d.]+)px$/i);
    const px = match ? Number(match[1]) : Number(actual);
    const valid = Number.isFinite(px) && gapAllowedValues.has(px);
    return {
      status: valid ? "符合" : "不符合",
      failType: valid ? "" : "不在允许集合",
      note: valid ? "" : `间距 ${px}px 不在 gap.json allowedValues`,
      actualValue: actual,
      specReference: "../references/gap.json",
    };
  }

  const pseudoCheck = {
    category: check.category,
    key: check.key,
    expected: actual,
    expectedStatus: "ok",
    token: check.token,
  };
  const validation = validateCheckAgainstSpec(pseudoCheck, specs);
  if (validation.status === "skipped") {
    return {
      status: "无法判定",
      failType: "来源不可追溯",
      note: `规范校验跳过：${check.category}/${check.key}`,
      actualValue: actual,
      specReference: validation.reference,
    };
  }
  if (validation.valid) {
    return {
      status: "符合",
      failType: "",
      note: "",
      actualValue: actual,
      specReference: validation.reference,
    };
  }
  return {
    status: "不符合",
    failType: validation.failType || "不在允许集合",
    note: validation.reference ? `规范来源 ${validation.reference}` : "",
    actualValue: actual,
    specReference: validation.reference,
  };
}
