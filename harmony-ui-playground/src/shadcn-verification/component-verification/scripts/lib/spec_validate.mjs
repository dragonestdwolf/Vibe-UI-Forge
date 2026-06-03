import fs from "node:fs/promises";
import path from "node:path";
import { readJson } from "./stable.mjs";

function parseRgbaChannel(value) {
  const raw = String(value ?? "").trim();
  const match = raw.match(/rgba?\(([^)]+)\)/i);
  if (!match) return null;
  const parts = match[1].split(",").map((part) => part.trim());
  const nums = parts.map((part) => Number.parseFloat(part));
  if (nums.some((n) => !Number.isFinite(n))) return null;
  return {
    r: nums[0],
    g: nums[1],
    b: nums[2],
    a: nums[3] ?? 1,
  };
}

function formatRgba({ r, g, b, a }) {
  const alpha = Number.isFinite(a) ? a : 1;
  const rounded =
    alpha >= 1
      ? 1
      : Math.round(alpha * 100000) / 100000;
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${rounded})`;
}

export function normalizeColorValue(value) {
  const raw = String(value ?? "").trim();
  if (!raw || raw === "transparent") return raw;
  const rgba = parseRgbaChannel(raw);
  if (rgba) return formatRgba(rgba);
  return raw.toLowerCase();
}

function collectColorValues(colorJson) {
  const values = new Set();
  for (const theme of ["light", "dark"]) {
    for (const item of colorJson[theme] ?? []) {
      if (item?.value) values.add(normalizeColorValue(item.value));
    }
  }
  return values;
}

function pxNumber(value) {
  const raw = String(value ?? "").trim();
  const match = raw.match(/^(-?[\d.]+)px$/i);
  if (match) return Number(match[1]);
  const num = Number(raw);
  return Number.isFinite(num) ? num : null;
}

function shadowFromToken(entry) {
  const { offsetX, offsetY, blurRadius, spreadRadius, colorRgba } = entry;
  const color = formatRgba({
    r: colorRgba.r,
    g: colorRgba.g,
    b: colorRgba.b,
    a: colorRgba.a,
  });
  return `${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius ?? 0}px ${color}`;
}

function collectShadowValues(shadeJson) {
  const values = new Set();
  for (const theme of ["light", "dark"]) {
    for (const item of shadeJson[theme] ?? []) {
      values.add(shadowFromToken(item));
      values.add(shadowFromToken(item).replace(/, /g, ","));
    }
  }
  return values;
}

function parseShadowParts(boxShadow) {
  const raw = String(boxShadow ?? "").trim();
  if (!raw || raw === "none") return null;
  const color = raw.match(/rgba?\([^)]+\)/i)?.[0] ?? "";
  const withoutColor = raw.replace(/rgba?\([^)]+\)/gi, "").trim();
  const lengths = withoutColor.match(/-?[\d.]+px/g) ?? [];
  return {
    color: normalizeColorValue(color),
    offsetX: lengths[0] ?? "/",
    offsetY: lengths[1] ?? "/",
    blur: lengths[2] ?? "/",
    spread: lengths[3] ?? "0px",
    full: raw,
  };
}

export async function loadSpecIndex(referencesDir) {
  const [color, gap, font, rounded, outline, shade] = await Promise.all([
    readJson(path.join(referencesDir, "color.json")),
    readJson(path.join(referencesDir, "gap.json")),
    readJson(path.join(referencesDir, "font.json")),
    readJson(path.join(referencesDir, "rounded.json")),
    readJson(path.join(referencesDir, "outline.json")),
    readJson(path.join(referencesDir, "shade.json")),
  ]);

  const colors = collectColorValues(color);
  const gapAllowed = new Set(gap.rules?.allowedValues ?? []);
  const roundedAllowed = new Set(rounded.rules?.allowedValues ?? []);
  const outlineWidths = new Set(outline.rules?.allowedWidthValues ?? []);
  const fontFamilies = new Set(font.rules?.allowedFontFamilies ?? []);
  const fontSizes = new Set(font.rules?.allowedFontSizes ?? []);
  const fontWeights = new Set(font.rules?.allowedFontWeights ?? []);
  const lineHeights = new Set(font.rules?.allowedLineHeights ?? []);
  const shadows = collectShadowValues(shade);

  return {
    colors,
    gapAllowed,
    roundedAllowed,
    outlineWidths,
    fontFamilies,
    fontSizes,
    fontWeights,
    lineHeights,
    shadows,
    references: {
      color: "color.json",
      gap: "gap.json",
      font: "font.json",
      rounded: "rounded.json",
      outline: "outline.json",
      shade: "shade.json",
    },
  };
}

function fontFamilyMatches(actual, allowedFamilies) {
  const raw = String(actual ?? "").toLowerCase();
  for (const family of allowedFamilies) {
    if (raw.includes(String(family).toLowerCase())) return true;
  }
  return false;
}

function lineHeightMatches(actual, allowed) {
  const px = pxNumber(actual);
  if (px !== null) return allowed.has(px);
  const num = Number(actual);
  if (Number.isFinite(num)) {
    for (const size of allowed) {
      if (Math.abs(num - size) < 0.6) return true;
    }
  }
  return false;
}

function shadowPartValid(key, actual, specs) {
  const parts = parseShadowParts(actual);
  if (!parts) return { valid: false, reference: specs.references.shade };
  if (specs.shadows.has(parts.full)) {
    return { valid: true, reference: specs.references.shade };
  }
  if (key.includes("颜色")) {
    return { valid: specs.colors.has(parts.color), reference: specs.references.shade };
  }
  if (key.includes("X偏移")) {
    const px = pxNumber(parts.offsetX);
    return { valid: px === 0 || specs.shadows.size > 0, reference: specs.references.shade };
  }
  if (key.includes("Y偏移") || key.includes("模糊") || key.includes("扩展")) {
    return { valid: true, reference: specs.references.shade };
  }
  return { valid: specs.shadows.has(parts.full), reference: specs.references.shade };
}

export function validateCheckAgainstSpec(check, specs) {
  const actual = String(check.expected ?? "").trim();
  const { category, key } = check;

  if (!actual || actual === "/" || actual === "none") {
    return { status: "skipped", valid: false, reference: "", failType: "" };
  }

  if (category === "颜色") {
    const valid = specs.colors.has(normalizeColorValue(actual));
    return {
      status: "ok",
      valid,
      reference: specs.references.color,
      failType: valid ? "" : "不在允许集合",
    };
  }

  if (category === "描边") {
    if (key.includes("宽度")) {
      const px = pxNumber(actual);
      const valid = px !== null && specs.outlineWidths.has(px);
      return {
        status: "ok",
        valid,
        reference: specs.references.outline,
        failType: valid ? "" : "不在允许集合",
      };
    }
    const valid = specs.colors.has(normalizeColorValue(actual));
    return {
      status: "ok",
      valid,
      reference: specs.references.outline,
      failType: valid ? "" : "不在允许集合",
    };
  }

  if (category === "圆角") {
    const px = pxNumber(actual);
    const valid = px !== null && specs.roundedAllowed.has(px);
    return {
      status: "ok",
      valid,
      reference: specs.references.rounded,
      failType: valid ? "" : "不在允许集合",
    };
  }

  if (category === "文本") {
    if (key.includes("字体")) {
      const valid = fontFamilyMatches(actual, specs.fontFamilies);
      return {
        status: "ok",
        valid,
        reference: specs.references.font,
        failType: valid ? "" : "不在允许集合",
      };
    }
    if (key.includes("字号")) {
      const px = pxNumber(actual);
      const valid = px !== null && specs.fontSizes.has(px);
      return {
        status: "ok",
        valid,
        reference: specs.references.font,
        failType: valid ? "" : "不在允许集合",
      };
    }
    if (key.includes("字重")) {
      const weight = Number(actual);
      const valid = Number.isFinite(weight) && specs.fontWeights.has(weight);
      return {
        status: "ok",
        valid,
        reference: specs.references.font,
        failType: valid ? "" : "不在允许集合",
      };
    }
    if (key.includes("行高")) {
      const valid = lineHeightMatches(actual, specs.lineHeights);
      return {
        status: "ok",
        valid,
        reference: specs.references.font,
        failType: valid ? "" : "不在允许集合",
      };
    }
    return { status: "skipped", valid: false, reference: specs.references.font, failType: "" };
  }

  if (category === "阴影") {
    const result = shadowPartValid(key, actual, specs);
    return {
      status: "ok",
      valid: result.valid,
      reference: result.reference,
      failType: result.valid ? "" : "不在允许集合",
    };
  }

  if (category === "间距") {
    const px = pxNumber(actual);
    const valid = px !== null && specs.gapAllowed.has(px);
    return {
      status: "ok",
      valid,
      reference: specs.references.gap,
      failType: valid ? "" : "不在允许集合",
    };
  }

  return { status: "skipped", valid: false, reference: "", failType: "" };
}
