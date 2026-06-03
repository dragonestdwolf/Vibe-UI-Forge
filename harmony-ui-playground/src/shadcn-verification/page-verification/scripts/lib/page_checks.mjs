export const PAGE_STYLE_PRESETS = {
  "颜色.fillColor": {
    category: "颜色",
    key: "颜色-填充",
    property: "background-color",
  },
  "颜色.textColor": {
    category: "颜色",
    key: "颜色-文本",
    property: "color",
  },
  "颜色.iconColor": {
    category: "颜色",
    key: "颜色-图标",
    property: "color",
  },
  "描边.strokeColor": {
    category: "描边",
    key: "描边-上-颜色",
    property: "border-top-color",
  },
  "描边.strokeColor.right": {
    category: "描边",
    key: "描边-右-颜色",
    property: "border-right-color",
  },
  "描边.strokeColor.bottom": {
    category: "描边",
    key: "描边-下-颜色",
    property: "border-bottom-color",
  },
  "描边.strokeColor.left": {
    category: "描边",
    key: "描边-左-颜色",
    property: "border-left-color",
  },
  "描边.strokeWidth": {
    category: "描边",
    key: "描边-上-宽度",
    property: "border-top-width",
  },
  "描边.strokeWidth.right": {
    category: "描边",
    key: "描边-右-宽度",
    property: "border-right-width",
  },
  "描边.strokeWidth.bottom": {
    category: "描边",
    key: "描边-下-宽度",
    property: "border-bottom-width",
  },
  "描边.strokeWidth.left": {
    category: "描边",
    key: "描边-左-宽度",
    property: "border-left-width",
  },
  "圆角.cornerRadius": {
    category: "圆角",
    key: "圆角-统一",
    property: "border-radius",
  },
  "圆角.topLeft": {
    category: "圆角",
    key: "圆角-左上",
    property: "border-top-left-radius",
  },
  "圆角.topRight": {
    category: "圆角",
    key: "圆角-右上",
    property: "border-top-right-radius",
  },
  "圆角.bottomRight": {
    category: "圆角",
    key: "圆角-右下",
    property: "border-bottom-right-radius",
  },
  "圆角.bottomLeft": {
    category: "圆角",
    key: "圆角-左下",
    property: "border-bottom-left-radius",
  },
  "文本.fontFamily": {
    category: "文本",
    key: "文本-字体",
    property: "font-family",
  },
  "文本.fontSize": {
    category: "文本",
    key: "文本-字号",
    property: "font-size",
  },
  "文本.fontWeight": {
    category: "文本",
    key: "文本-字重",
    property: "font-weight",
  },
  "文本.lineHeight": {
    category: "文本",
    key: "文本-行高",
    property: "line-height",
  },
  "阴影.color": {
    category: "阴影",
    key: "阴影-颜色",
    property: "box-shadow",
  },
  "阴影.offsetX": {
    category: "阴影",
    key: "阴影-X偏移",
    property: "box-shadow",
  },
  "阴影.offsetY": {
    category: "阴影",
    key: "阴影-Y偏移",
    property: "box-shadow",
  },
  "阴影.blur": {
    category: "阴影",
    key: "阴影-模糊",
    property: "box-shadow",
  },
  "阴影.spread": {
    category: "阴影",
    key: "阴影-扩展",
    property: "box-shadow",
  },
  "间距.paddingTop": {
    category: "间距",
    key: "间距-上",
    property: "padding-top",
  },
  "间距.paddingRight": {
    category: "间距",
    key: "间距-右",
    property: "padding-right",
  },
  "间距.paddingBottom": {
    category: "间距",
    key: "间距-下",
    property: "padding-bottom",
  },
  "间距.paddingLeft": {
    category: "间距",
    key: "间距-左",
    property: "padding-left",
  },
  "间距.gap": {
    category: "间距",
    key: "间距-横向gap",
    property: "gap",
  },
  "间距.rowGap": {
    category: "间距",
    key: "间距-纵向gap",
    property: "row-gap",
  },
};

const DETAIL_PRESETS = {
  BASIC_STYLE: [
    "颜色.fillColor",
    "颜色.textColor",
    "圆角.cornerRadius",
    "文本.fontFamily",
    "文本.fontSize",
    "文本.fontWeight",
  ],
  FULL_STYLE: [
    "颜色.fillColor",
    "颜色.textColor",
    "描边.strokeColor",
    "描边.strokeWidth",
    "圆角.topLeft",
    "圆角.topRight",
    "圆角.bottomRight",
    "圆角.bottomLeft",
    "文本.fontFamily",
    "文本.fontSize",
    "文本.fontWeight",
    "文本.lineHeight",
    "阴影.color",
    "阴影.offsetY",
    "阴影.blur",
  ],
};

export function expandStyleCheckIds(checkIds = []) {
  const list = typeof checkIds === "string" ? [checkIds] : checkIds;
  const result = [];
  for (const item of list) {
    if (DETAIL_PRESETS[item]) {
      result.push(...DETAIL_PRESETS[item]);
      continue;
    }
    if (!PAGE_STYLE_PRESETS[item]) {
      throw new Error(`Unknown page style check preset: ${item}`);
    }
    result.push(item);
  }
  return result;
}

export function materializeStyleChecks(checkIds = []) {
  return expandStyleCheckIds(checkIds).map((id) => {
    const preset = PAGE_STYLE_PRESETS[id];
    return {
      checkId: id,
      category: preset.category,
      key: preset.key,
      property: preset.property,
      expectedStatus: "spec-only",
      expected: "/",
    };
  });
}
