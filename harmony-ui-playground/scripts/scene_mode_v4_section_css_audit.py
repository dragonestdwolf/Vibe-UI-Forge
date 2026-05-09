#!/usr/bin/env python3
"""
Audit CSS for scene-mode-settings-v4 index.tsx lines 323-383 (+ FeaturePromoCard + SwiperNav dots).
Compare font & color declarations to Pixso DSL JSON exports; emit HTML + .xlsx (stdlib only).
"""

from __future__ import annotations

import json
import re
import zipfile
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from typing import Any, Callable, Iterable
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "verification"
DSL_PATHS = [
    ROOT.parent / "pixso_TJB3XguX3utaESStZ5NJqA_page-594-10496.dsl.json",
    ROOT.parent / "pixso_TJB3XguX3utaESStZ5NJqA_page-594-13732.dsl.json",
]

HTML_OUT = OUT_DIR / "scene-mode-v4-section-323-383.html"
XLSX_OUT = OUT_DIR / "scene-mode-v4-section-323-383-css-audit.xlsx"


def walk_json(obj: Any, fn: Callable[[dict], None]) -> None:
    if isinstance(obj, dict):
        fn(obj)
        for v in obj.values():
            walk_json(v, fn)
    elif isinstance(obj, list):
        for x in obj:
            walk_json(x, fn)


def rgba_from_dsl(c: dict) -> tuple[float, float, float, float] | None:
    if not isinstance(c, dict):
        return None
    r = float(c.get("r", 0))
    g = float(c.get("g", 0))
    b = float(c.get("b", 0))
    a = float(c.get("a", 1))
    # Pixso may use 0-255 or 0-1 for rgb; normalize to 0-1
    if r > 1.5 or g > 1.5 or b > 1.5:
        r, g, b = r / 255.0, g / 255.0, b / 255.0
    return (round(r, 5), round(g, 5), round(b, 5), round(a, 5))


def parse_css_color(s: str) -> tuple[float, float, float, float] | None:
    s = s.strip().lower()
    m = re.match(
        r"rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*(?:,\s*([0-9.]+)\s*)?\)",
        s,
    )
    if m:
        r, g, b = float(m.group(1)), float(m.group(2)), float(m.group(3))
        a = float(m.group(4)) if m.group(4) is not None else 1.0
        if r > 1.5 or g > 1.5 or b > 1.5:
            r, g, b = r / 255.0, g / 255.0, b / 255.0
        return (round(r, 5), round(g, 5), round(b, 5), round(a, 5))
    m = re.match(r"#([0-9a-f]{3}|[0-9a-f]{6})\b", s)
    if m:
        h = m.group(1)
        if len(h) == 3:
            h = "".join(ch * 2 for ch in h)
        r = int(h[0:2], 16) / 255.0
        g = int(h[2:4], 16) / 255.0
        b = int(h[4:6], 16) / 255.0
        return (round(r, 5), round(g, 5), round(b, 5), 1.0)
    return None


def color_close(
    a: tuple[float, float, float, float],
    b: tuple[float, float, float, float],
    tol: float = 0.02,
) -> bool:
    return all(abs(a[i] - b[i]) <= tol for i in range(4))


def load_dsl_specs(paths: list[Path]) -> tuple[set[int], set[str], set[int], list[tuple[float, float, float, float]]]:
    font_sizes: set[int] = set()
    font_families: set[str] = set()
    font_weights: set[int] = set()  # 400,500,700 from Regular/Medium/Bold
    colors: list[tuple[float, float, float, float]] = []

    style_to_w = {"Regular": 400, "Medium": 500, "Bold": 700}

    for p in paths:
        data = json.loads(p.read_text(encoding="utf-8"))

        def collect(n: dict) -> None:
            nonlocal font_sizes, font_families, font_weights, colors
            fs = n.get("fontSize")
            if isinstance(fs, (int, float)):
                font_sizes.add(int(fs))
            ff = n.get("fontFamily")
            if isinstance(ff, str) and ff.strip():
                font_families.add(ff.strip())
            fst = n.get("fontStyle")
            if isinstance(fst, str) and fst in style_to_w:
                font_weights.add(style_to_w[fst])
            for paint in n.get("fillPaints") or []:
                c = paint.get("color")
                t = rgba_from_dsl(c) if isinstance(c, dict) else None
                if t:
                    colors.append(t)

        walk_json(data, collect)

    return font_sizes, font_families, font_weights, colors


GENERIC_FAMILIES = frozenset(
    {
        "inherit",
        "sans-serif",
        "system-ui",
        "-apple-system",
        "blinkmacsystemfont",
        "pingfang sc",
        "microsoft yahei",
    }
)


def family_token_ok(token: str, dsl_families: set[str]) -> bool:
    t = token.strip().strip("\"'").lower()
    if not t or t in GENERIC_FAMILIES:
        return True
    tl = t.replace(" ", "")
    for df in dsl_families:
        dl = df.lower().replace(" ", "")
        if tl == dl or tl in dl or dl in tl:
            return True
        # HarmonyOS Sans vs HarmonyHeiTi — both Harmony* product fonts
        if tl.startswith("harmony") and dl.startswith("harmony"):
            return True
    return False


def font_stack_ok(value: str, dsl_families: set[str]) -> bool:
    parts = re.split(r",\s*", value)
    for p in parts:
        tok = p.strip()
        if not tok:
            continue
        if not family_token_ok(tok, dsl_families):
            return False
    return True


def num_from_len(val: str) -> float | None:
    m = re.match(r"^([0-9.]+)\s*(px|rem)?$", val.strip().lower())
    if not m:
        return None
    n = float(m.group(1))
    unit = m.group(2) or "px"
    if unit == "rem":
        n *= 16.0
    return round(n, 4)


def font_size_ok(val: str, dsl_sizes: set[int]) -> bool:
    """DSL fontSize 为无单位数值；代码中 12 与 12px 视为等价（四舍五入为整数）。"""
    n = num_from_len(val)
    if n is None:
        return False
    return int(round(n)) in dsl_sizes


def weight_ok(w: int, dsl_weights: set[int]) -> bool:
    return w in dsl_weights


def color_ok(val: str, dsl_colors: list[tuple[float, float, float, float]]) -> bool:
    val = val.strip()
    t = parse_css_color(val)
    if t is not None:
        return any(color_close(t, d) for d in dsl_colors)
    # box-shadow / filter 等复合声明中的颜色片段
    for m in re.finditer(
        r"rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*(?:,\s*([0-9.]+)\s*)?\)",
        val,
    ):
        frag = m.group(0)
        t2 = parse_css_color(frag)
        if t2 and any(color_close(t2, d) for d in dsl_colors):
            return True
    return False


@dataclass
class Row:
    region: str
    selector: str
    source: str
    property: str
    value: str
    category: str  # layout | font | color | other
    compliant: str  # 是 | 否 | 不校验
    note: str


def add_rows(rows: list[Row], region: str, selector: str, source: str, decls: list[tuple[str, str]], dsl) -> None:
    fs, ff, fw, cols = dsl
    for prop, val in decls:
        p = prop.lower().strip()
        cat = "other"
        compliant = "不校验"
        note = ""

        if p in ("font-family",):
            cat = "font"
            ok = font_stack_ok(val, ff)
            compliant = "是" if ok else "否"
            if not ok:
                note = "font-family 中有 token 未出现在两份 DSL 的 fontFamily 中（已忽略通用 fallback）"
        elif p in ("font-size",):
            cat = "font"
            ok = font_size_ok(val, fs)
            compliant = "是" if ok else "否"
            if not ok:
                note = f"字号数值不在 DSL fontSize 集合 {sorted(fs)[:30]}{'...' if len(fs)>30 else ''} 中（已做 px/无单位等价）"
        elif p in ("font-weight",):
            cat = "font"
            try:
                w = int(float(val))
            except ValueError:
                w = -1
            ok = weight_ok(w, fw) if w >= 0 else False
            compliant = "是" if ok else "否"
            if not ok:
                note = f"字重不在 DSL fontStyle 映射集合 {sorted(fw)} 中"
        elif p in ("line-height", "letter-spacing"):
            cat = "font"
            compliant = "不校验"
            note = "DSL 文本多为 lineHeightUnit=PERCENT，无绝对 px 行高可对齐"
        elif p in ("color", "background-color", "background", "outline-color", "-webkit-text-fill-color", "box-shadow"):
            cat = "color"
            if p == "background" and "rgba" not in val and "#" not in val and "rgb" not in val.lower():
                compliant = "不校验"
                note = "复合 background，未拆解"
            else:
                ok = color_ok(val, cols)
                compliant = "是" if ok else "否"
                if not ok:
                    note = "颜色与两份 DSL 中任一 fillPaints.color（归一化 RGBA，容差≈0.02）不匹配"
        elif any(
            x in p
            for x in (
                "margin",
                "padding",
                "gap",
                "width",
                "height",
                "display",
                "flex",
                "overflow",
                "scroll",
                "snap",
                "transform",
                "opacity",
                "transition",
                "box-shadow",
                "border",
                "outline",
                "cursor",
                "user-select",
                "pointer-events",
                "align",
                "justify",
                "position",
                "inset",
                "top",
                "left",
                "right",
                "bottom",
                "box-sizing",
                "scrollbar",
                "ms-overflow",
                "webkit",
                "radius",
                "border-radius",
                "flex-shrink",
                "flex-grow",
                "min-width",
                "max-width",
                "text-align",
                "white-space",
            )
        ):
            cat = "layout" if "color" not in p else "color"

        rows.append(
            Row(
                region=region,
                selector=selector,
                source=source,
                property=prop,
                value=val,
                category=cat,
                compliant=compliant,
                note=note,
            )
        )


def build_inventory(dsl) -> list[Row]:
    rows: list[Row] = []
    # --- index.tsx section: Tailwind expanded (default theme 1rem=16px) ---
    add_rows(
        rows,
        "section.mt-6",
        "section.scene-block",
        "index.tsx Tailwind",
        [("margin-top", "24px")],
        dsl,
    )
    add_rows(
        rows,
        "轮播轨道",
        ".mode-rail",
        "index.tsx Tailwind + inline",
        [
            ("margin-left", "-16px"),
            ("margin-right", "-16px"),
            ("display", "flex"),
            ("scroll-snap-type", "x mandatory"),
            ("column-gap", "12px"),
            ("row-gap", "12px"),
            ("overflow-x", "auto"),
            ("padding-top", "4px"),
            ("padding-bottom", "8px"),
            ("padding-left", "58px"),
            ("padding-right", "58px"),
            ("scroll-padding-inline", "58px"),
            ("-ms-overflow-style", "none"),
            ("scrollbar-width", "none"),
        ],
        dsl,
    )
    add_rows(
        rows,
        "轮播轨道滚动条隐藏",
        ".mode-rail::-webkit-scrollbar",
        "index.tsx Tailwind arbitrary",
        [
            ("display", "none"),
        ],
        dsl,
    )
    add_rows(
        rows,
        "卡片外层列表项",
        ".mode-slide",
        "index.tsx Tailwind",
        [
            ("flex-shrink", "0"),
            ("scroll-snap-align", "center"),
        ],
        dsl,
    )
    add_rows(
        rows,
        "FeaturePromoCard 选中态 className",
        ".my-feature-promo-card.selected",
        "index.tsx + FeaturePromoCard.css",
        [
            ("transition-property", "all"),
            ("transition-duration", "200ms"),
            ("box-shadow", "0 12px 28px rgba(0, 0, 0, 0.06)"),
        ],
        dsl,
    )
    add_rows(
        rows,
        "FeaturePromoCard 未选中态 className",
        ".my-feature-promo-card.dim",
        "index.tsx",
        [
            ("transform", "scale(0.985)"),
            ("opacity", "0.8"),
        ],
        dsl,
    )
    # FeaturePromoCard.css — root
    add_rows(
        rows,
        "FeaturePromoCard 根",
        ".my-feature-promo-card",
        "FeaturePromoCard.css",
        [
            ("position", "relative"),
            ("box-sizing", "border-box"),
            ("width", "244px"),
            ("height", "220px"),
            ("background", "rgba(255, 255, 255, 0.8)"),
            ("border-radius", "24px"),
            ("user-select", "none"),
            ("font-family", '"HarmonyOS Sans", "HarmonyOS Sans SC", "HarmonyHeiTi", -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'),
        ],
        dsl,
    )
    add_rows(
        rows,
        "FeaturePromoCard 内层定位容器",
        ".my-feature-promo-card__inner",
        "FeaturePromoCard.css",
        [
            ("position", "absolute"),
            ("inset", "0"),
            ("pointer-events", "none"),
        ],
        dsl,
    )
    add_rows(
        rows,
        "FeaturePromoCard 图标槽",
        ".my-feature-promo-card__icon",
        "FeaturePromoCard.css",
        [
            ("position", "absolute"),
            ("left", "50%"),
            ("top", "14px"),
            ("width", "64px"),
            ("height", "64px"),
            ("transform", "translateX(-50%)"),
            ("display", "flex"),
            ("align-items", "center"),
            ("justify-content", "center"),
        ],
        dsl,
    )
    add_rows(
        rows,
        "FeaturePromoCard 图标子 svg/img",
        ".my-feature-promo-card__icon > svg",
        "FeaturePromoCard.css",
        [
            ("display", "block"),
            ("width", "100%"),
            ("height", "100%"),
        ],
        dsl,
    )
    add_rows(
        rows,
        "FeaturePromoCard 标题",
        ".my-feature-promo-card__title",
        "FeaturePromoCard.css",
        [
            ("position", "absolute"),
            ("left", "0"),
            ("right", "0"),
            ("top", "90px"),
            ("margin", "0"),
            ("text-align", "center"),
            ("font-size", "24px"),
            ("font-weight", "700"),
            ("line-height", "28px"),
            ("color", "rgba(0, 0, 0, 0.898)"),
            ("letter-spacing", "0"),
        ],
        dsl,
    )
    add_rows(
        rows,
        "FeaturePromoCard 副标题",
        ".my-feature-promo-card__subtitle",
        "FeaturePromoCard.css",
        [
            ("position", "absolute"),
            ("left", "0"),
            ("right", "0"),
            ("top", "120px"),
            ("margin", "0"),
            ("text-align", "center"),
            ("font-size", "14px"),
            ("font-weight", "700"),
            ("line-height", "16px"),
            ("color", "rgba(0, 0, 0, 0.4)"),
            ("letter-spacing", "0"),
        ],
        dsl,
    )
    add_rows(
        rows,
        "FeaturePromoCard CTA 文案",
        ".my-feature-promo-card__action-text",
        "FeaturePromoCard.css",
        [
            ("font-size", "16px"),
            ("font-weight", "500"),
            ("line-height", "24px"),
            ("color", "rgba(10, 89, 247, 1)"),
            ("white-space", "nowrap"),
            ("letter-spacing", "0"),
        ],
        dsl,
    )
    add_rows(
        rows,
        "FeaturePromoCard CTA 底",
        ".my-feature-promo-card__action",
        "FeaturePromoCard.css",
        [
            ("position", "absolute"),
            ("left", "16px"),
            ("right", "16px"),
            ("top", "164px"),
            ("height", "40px"),
            ("box-sizing", "border-box"),
            ("padding-left", "16px"),
            ("padding-right", "16px"),
            ("padding-top", "0"),
            ("padding-bottom", "0"),
            ("border", "none"),
            ("border-radius", "20px"),
            ("background", "rgba(0, 0, 0, 0.047)"),
            ("display", "inline-flex"),
            ("align-items", "center"),
            ("justify-content", "center"),
            ("cursor", "pointer"),
            ("pointer-events", "auto"),
            ("transition", "background 160ms ease, transform 160ms ease"),
            ("font-family", "inherit"),
        ],
        dsl,
    )
    # SwiperNav
    add_rows(
        rows,
        "导航行容器",
        ".swiper-nav-row",
        "index.tsx Tailwind",
        [
            ("margin-top", "4px"),
            ("display", "flex"),
            ("justify-content", "center"),
        ],
        dsl,
    )
    add_rows(
        rows,
        "SwiperNav 根 (dots)",
        ".my-swiper-nav.my-swiper-nav--dots",
        "SwiperNav.css + index !w-auto",
        [
            ("box-sizing", "border-box"),
            ("display", "inline-flex"),
            ("align-items", "center"),
            ("justify-content", "center"),
            ("width", "auto"),
            ("height", "32px"),
            ("font-family", '"HarmonyOS Sans", "HarmonyOS Sans SC", "HarmonyHeiTi", -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'),
        ],
        dsl,
    )
    add_rows(
        rows,
        "SwiperNav 圆点容器",
        ".my-swiper-nav__dots",
        "SwiperNav.css",
        [
            ("display", "inline-flex"),
            ("align-items", "center"),
            ("justify-content", "center"),
            ("column-gap", "8px"),
            ("row-gap", "8px"),
            ("height", "6px"),
        ],
        dsl,
    )
    add_rows(
        rows,
        "SwiperNav 圆点",
        ".my-swiper-nav__dot",
        "SwiperNav.css + inline vars",
        [
            ("width", "6px 或 12px (CSS 变量 --swiper-dot-width)"),
            ("height", "6px (或变量 --swiper-dot-height)"),
            ("border-radius", "4px"),
            ("background", "rgba(0, 0, 0, 0.098)"),
            ("flex", "0 0 auto"),
        ],
        dsl,
    )
    add_rows(
        rows,
        "SwiperNav 圆点激活",
        ".my-swiper-nav__dot--active",
        "SwiperNav.css",
        [
            ("background", "rgba(10, 89, 247, 1)"),
        ],
        dsl,
    )
    # Summary panel
    add_rows(
        rows,
        "当前模式说明卡片",
        ".mode-summary",
        "index.tsx Tailwind",
        [
            ("margin-top", "8px"),
            ("border-radius", "18px"),
            ("background-color", "rgba(255, 255, 255, 0.7)"),
            ("padding", "12px 16px"),
        ],
        dsl,
    )
    add_rows(
        rows,
        "当前模式说明卡片 标题行",
        ".mode-summary 内 div（class: flex items-center gap-2）",
        "index.tsx Tailwind",
        [
            ("display", "flex"),
            ("align-items", "center"),
            ("column-gap", "8px"),
            ("row-gap", "8px"),
        ],
        dsl,
    )
    add_rows(
        rows,
        "「当前模式」标签",
        ".mode-summary .label",
        "index.tsx Tailwind",
        [
            ("font-size", "13px"),
            ("line-height", "13px"),
            ("font-weight", "500"),
            ("color", "#0A59F7"),
        ],
        dsl,
    )
    add_rows(
        rows,
        "模式名称",
        ".mode-summary .title",
        "index.tsx",
        [
            ("font-size", "16px"),
            ("line-height", "16px"),
            ("font-weight", "500"),
            ("color", "rgba(0, 0, 0, 0.9)"),
        ],
        dsl,
    )
    add_rows(
        rows,
        "模式摘要段落",
        ".mode-summary .summary",
        "index.tsx",
        [
            ("margin-top", "8px"),
            ("font-size", "12px"),
            ("line-height", "18px"),
            ("color", "rgba(0, 0, 0, 0.6)"),
        ],
        dsl,
    )
    return rows


def write_html(path: Path) -> None:
    """Static HTML mirroring the JSX block (one card column for brevity)."""
    html = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8"/>
  <title>scene-mode-settings-v4 §323–383 静态 HTML</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; background: #e8e8e8; padding: 24px; }
    .shell { width: 328px; margin: 0 auto; background: #F2F3F5; padding: 0 16px 32px; }

    .scene-block { margin-top: 24px; }

    .mode-rail {
      margin-left: -16px; margin-right: -16px;
      display: flex; scroll-snap-type: x mandatory; gap: 12px;
      overflow-x: auto; padding: 4px 58px 8px;
      scroll-padding-inline: 58px;
      -ms-overflow-style: none; scrollbar-width: none;
    }
    .mode-rail::-webkit-scrollbar { display: none; }

    .mode-slide { flex-shrink: 0; scroll-snap-align: center; }

    /* FeaturePromoCard (abbrev) */
    .my-feature-promo-card {
      position: relative; width: 244px; height: 220px;
      background: rgba(255,255,255,0.8); border-radius: 24px;
      font-family: "HarmonyOS Sans", "HarmonyOS Sans SC", "HarmonyHeiTi", sans-serif;
    }
    .my-feature-promo-card__inner { position: absolute; inset: 0; pointer-events: none; }
    .my-feature-promo-card__icon {
      position: absolute; left: 50%; top: 14px; width: 64px; height: 64px;
      transform: translateX(-50%); display: flex; align-items: center; justify-content: center;
      background: #ddd; border-radius: 12px;
    }
    .my-feature-promo-card__title {
      position: absolute; left: 0; right: 0; top: 90px; margin: 0; text-align: center;
      font-size: 24px; font-weight: 700; line-height: 28px; color: rgba(0,0,0,0.898);
    }
    .my-feature-promo-card__subtitle {
      position: absolute; left: 0; right: 0; top: 120px; margin: 0; text-align: center;
      font-size: 14px; font-weight: 700; line-height: 16px; color: rgba(0,0,0,0.4);
    }
    .my-feature-promo-card__action {
      position: absolute; left: 16px; right: 16px; top: 164px; height: 40px;
      border: none; border-radius: 20px; background: rgba(0,0,0,0.047);
      display: inline-flex; align-items: center; justify-content: center;
      pointer-events: auto; cursor: pointer; font-family: inherit;
    }
    .my-feature-promo-card__action-text {
      font-size: 16px; font-weight: 500; line-height: 24px; color: rgba(10,89,247,1);
      white-space: nowrap;
    }
    .selected { box-shadow: 0 12px 28px rgba(0,0,0,0.06); transition: all 200ms; }
    .dim { transform: scale(0.985); opacity: 0.8; transition: all 200ms; }

    .swiper-nav-row { margin-top: 4px; display: flex; justify-content: center; }
    .my-swiper-nav__dots { display: inline-flex; align-items: center; gap: 8px; height: 6px; }
    .my-swiper-nav__dot {
      width: 6px; height: 6px; border-radius: 4px; background: rgba(0,0,0,0.098); flex: 0 0 auto;
    }
    .my-swiper-nav__dot.on { width: 12px; background: rgba(10,89,247,1); }

    .mode-summary {
      margin-top: 8px; border-radius: 18px; background: rgba(255,255,255,0.7);
      padding: 12px 16px;
    }
    .mode-summary .row { display: flex; align-items: center; gap: 8px; }
    .mode-summary .label { font-size: 13px; line-height: 13px; font-weight: 500; color: #0A59F7; }
    .mode-summary .title { font-size: 16px; line-height: 16px; font-weight: 500; color: rgba(0,0,0,0.9); }
    .mode-summary .summary { margin-top: 8px; font-size: 12px; line-height: 18px; color: rgba(0,0,0,0.6); }
  </style>
</head>
<body>
  <div class="shell">
    <section class="scene-block">
      <div class="mode-rail" role="list" aria-label="情景模式轮播">
        <div class="mode-slide" role="listitem">
          <div class="my-feature-promo-card selected">
            <div class="my-feature-promo-card__inner">
              <div class="my-feature-promo-card__icon"></div>
              <div class="my-feature-promo-card__title">免打扰</div>
              <div class="my-feature-promo-card__subtitle">减少打扰保持专注</div>
              <button type="button" class="my-feature-promo-card__action">
                <span class="my-feature-promo-card__action-text">当前模式</span>
              </button>
            </div>
          </div>
        </div>
        <div class="mode-slide" role="listitem">
          <div class="my-feature-promo-card dim">
            <div class="my-feature-promo-card__inner">
              <div class="my-feature-promo-card__icon"></div>
              <div class="my-feature-promo-card__title">个人</div>
              <div class="my-feature-promo-card__subtitle">个人日程更从容</div>
              <button type="button" class="my-feature-promo-card__action">
                <span class="my-feature-promo-card__action-text">设为当前模式</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="swiper-nav-row">
        <div class="my-swiper-nav__dots" aria-hidden="true">
          <span class="my-swiper-nav__dot on"></span>
          <span class="my-swiper-nav__dot"></span>
          <span class="my-swiper-nav__dot"></span>
          <span class="my-swiper-nav__dot"></span>
        </div>
      </div>

      <div class="mode-summary">
        <div class="row">
          <span class="label">当前模式</span>
          <span class="title">免打扰</span>
        </div>
        <p class="summary">左右滑动卡片即可切换模式，当前模式会在本页实时生效。</p>
      </div>
    </section>
  </div>
</body>
</html>
"""
    path.write_text(html, encoding="utf-8")


def col_letter(n: int) -> str:
    s = ""
    while n >= 0:
        s = chr(n % 26 + ord("A")) + s
        n = n // 26 - 1
    return s


def write_xlsx(rows: list[Row], path: Path) -> None:
    """Minimal OOXML xlsx: sheet1 inline strings, style 0 default, 1 red font."""
    headers = ["区域", "选择器", "来源", "属性", "属性值", "类别", "是否符合DSL", "说明"]

    def cell_ref(r: int, c: int) -> str:
        return f"{col_letter(c)}{r + 1}"

    xml_rows = []
    for i, row in enumerate([headers] + [[r.region, r.selector, r.source, r.property, r.value, r.category, r.compliant, r.note] for r in rows]):
        cells = []
        for j, val in enumerate(row):
            s = escape(str(val))
            if i == 0:
                cells.append(f'<c r="{cell_ref(i,j)}" t="inlineStr"><is><t xml:space="preserve">{s}</t></is></c>')
            else:
                rrow = rows[i - 1]
                use_red = (
                    rrow.compliant == "否"
                    and rrow.category in ("font", "color")
                    and j in (3, 4)
                )
                style = ' s="1"' if use_red else ""
                cells.append(f'<c r="{cell_ref(i,j)}" t="inlineStr"{style}><is><t xml:space="preserve">{s}</t></is></c>')
        xml_rows.append(f'<row r="{i+1}">' + "".join(cells) + "</row>")

    sheet_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>{"".join(xml_rows)}</sheetData>
</worksheet>"""

    styles_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <font><sz val="11"/><color theme="1"/><name val="Calibri"/></font>
    <font><sz val="11"/><color rgb="FFFF0000"/><name val="Calibri"/></font>
  </fonts>
  <fills count="1"><fill><patternFill patternType="none"/></fill></fills>
  <borders count="1"><border/></borders>
  <cellXfs count="2">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
  </cellXfs>
</styleSheet>"""

    workbook_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="CSS审计" sheetId="1" r:id="rId1"/></sheets>
</workbook>"""

    rels_workbook = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>"""

    rels_root = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>"""

    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>"""

    buf = BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types)
        z.writestr("_rels/.rels", rels_root)
        z.writestr("xl/workbook.xml", workbook_xml)
        z.writestr("xl/_rels/workbook.xml.rels", rels_workbook)
        z.writestr("xl/styles.xml", styles_xml)
        z.writestr("xl/worksheets/sheet1.xml", sheet_xml)
    path.write_bytes(buf.getvalue())


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    dsl = load_dsl_specs(DSL_PATHS)
    rows = build_inventory(dsl)
    write_html(HTML_OUT)
    write_xlsx(rows, XLSX_OUT)
    bad = [r for r in rows if r.compliant == "否" and r.category in ("font", "color")]
    print("Wrote", HTML_OUT)
    print("Wrote", XLSX_OUT)
    print("DSL font sizes count:", len(dsl[0]), "sample", sorted(list(dsl[0]))[:25])
    print("Non-compliant font/color rows:", len(bad))
    for r in bad:
        print(f"  - {r.selector} {r.property}={r.value}")


if __name__ == "__main__":
    main()
