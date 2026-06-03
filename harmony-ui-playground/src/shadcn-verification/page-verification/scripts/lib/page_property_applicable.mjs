function rawStyle(styles, property) {
  return String(styles?.[property] ?? "").trim();
}

function pxValue(value) {
  const match = String(value).match(/^(-?[\d.]+)px$/i);
  return match ? Number(match[1]) : null;
}

function isTransparentColor(value) {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw || raw === "transparent") return true;
  const match = raw.match(/rgba?\(([^)]+)\)/i);
  if (!match) return false;
  const parts = match[1].split(",").map((part) => part.trim());
  const alpha = parts[3] != null ? Number(parts[3]) : 1;
  return Number.isFinite(alpha) && alpha === 0;
}

const BORDER_WIDTH_BY_KEY = {
  "描边-上-宽度": "border-top-width",
  "描边-右-宽度": "border-right-width",
  "描边-下-宽度": "border-bottom-width",
  "描边-左-宽度": "border-left-width",
};

const BORDER_COLOR_BY_KEY = {
  "描边-上-颜色": "border-top-width",
  "描边-右-颜色": "border-right-width",
  "描边-下-颜色": "border-bottom-width",
  "描边-左-颜色": "border-left-width",
};

const GAP_PROPERTIES = new Set(["gap", "row-gap", "column-gap"]);

/**
 * DOM / registry 采集前判定：不适用则**不生成检查行**（非「已排除」占位）。
 */
export function isDomCheckCollectible(check, styles) {
  const category = check.category;
  const key = check.key ?? "";

  if (category === "阴影") {
    const shadow = rawStyle(styles, "box-shadow");
    if (!shadow || shadow === "none") return false;
  }

  if (category === "颜色" && key.includes("填充")) {
    const fill = rawStyle(styles, "background-color");
    if (isTransparentColor(fill)) return false;
  }

  if (category === "描边") {
    const widthProp = BORDER_WIDTH_BY_KEY[key] ?? BORDER_COLOR_BY_KEY[key];
    if (widthProp) {
      const width = pxValue(rawStyle(styles, widthProp));
      if (width === 0) return false;
    }
  }

  if (category === "间距") {
    const prop = check.property ?? "";
    const value = rawStyle(styles, prop);
    if (!value || value === "normal" || value === "auto") return false;
    if (GAP_PROPERTIES.has(prop)) {
      const display = rawStyle(styles, "display");
      if (display !== "flex" && display !== "grid" && display !== "inline-flex") {
        return false;
      }
    }
  }

  if (category === "文本" && key.includes("行高")) {
    const lineHeight = rawStyle(styles, "line-height");
    if (!lineHeight || lineHeight === "normal") return false;
  }

  return true;
}
