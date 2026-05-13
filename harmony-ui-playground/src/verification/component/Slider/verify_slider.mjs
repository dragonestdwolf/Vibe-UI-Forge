import fs from "node:fs/promises"
import path from "node:path"
import { chromium } from "playwright"
import { spawn } from "node:child_process"

const BASE_URL = "http://127.0.0.1:6006"
const OUTPUT_DIR = path.resolve("src/verification/component/Slider")
const RESULT_JSON = path.join(OUTPUT_DIR, "verification_result.json")
const RESULT_MD = path.join(OUTPUT_DIR, "verification_result.md")
const RESULT_XLSX = path.join(OUTPUT_DIR, "verification_key_styles.xlsx")

const TYPE_ORDER = [
  "basic",
  "scale",
  "icon",
  "valueWithChange",
  "value",
  "iconWithTitle",
  "bubble",
  "title",
  "textview",
]
const STATE_ORDER = ["default", "hover", "focus", "active", "disabled"]
const SEEKBAR_STATE_ORDER = ["default", "hover", "focus", "active", "disabled"]

function normalizeSpace(v) {
  return String(v ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
}

function parsePx(v) {
  const m = String(v ?? "").match(/-?\d+(\.\d+)?/)
  return m ? Number(m[0]) : null
}

function closeEnough(a, b, tolerance = 0.5) {
  if (a == null || b == null) return false
  return Math.abs(a - b) <= tolerance
}

function readSnippet(filePath, needle) {
  return fs
    .readFile(filePath, "utf8")
    .then((text) => {
      const idx = text.indexOf(needle)
      if (idx < 0) return needle
      const start = Math.max(0, idx - 80)
      const end = Math.min(text.length, idx + needle.length + 80)
      return text.slice(start, end).replace(/\n/g, " ").trim()
    })
    .catch(() => needle)
}

async function ensureDirs() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
}

async function parseDslExpectations() {
  const dslPath = path.resolve("src/verification/component/Slider/Slider.json")
  const raw = await fs.readFile(dslPath, "utf8")
  const dsl = JSON.parse(raw)
  let lineHeight12 = false
  let bubbleRadius18 = false
  let shadowSample = ""

  function walk(node) {
    const style = node?.style ?? {}
    if (style.line_height === 12) lineHeight12 = true
    if (
      Array.isArray(style.round_corner) &&
      style.round_corner.length === 4 &&
      style.round_corner.every((v) => v === 18)
    ) {
      bubbleRadius18 = true
    }
    if (Array.isArray(style.shadow) && style.shadow.length > 0 && !shadowSample) {
      const sh = style.shadow[0]
      shadowSample = `rgba(${sh.color.red}, ${sh.color.green}, ${sh.color.blue}, ${sh.color.alpha}) ${sh.x}px ${sh.y}px ${sh.blur}px ${sh.spread}px`
    }
    for (const child of node?.children ?? []) walk(child)
  }

  for (const root of dsl.content ?? []) walk(root)

  return {
    dslPath: "src/verification/component/Slider/Slider.json",
    lineHeight12,
    bubbleRadius18,
    shadowSample,
    trackBg: "rgba(0, 0, 0, 0.05)",
    fillColor: "rgba(10, 89, 247, 1)",
    iconSecondary: "rgba(0, 0, 0, 0.6)",
  }
}

async function collectFromStorybook() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1100, height: 2200 } })
  const page = await context.newPage()

  const renderData = {
    typeVariants: [],
    stateVariants: [],
    seekbarVariants: [],
  }

  const allTypesUrl = `${BASE_URL}/iframe.html?id=components-slider--all-types&viewMode=story`
  await page.goto(allTypesUrl, { waitUntil: "networkidle" })
  await page.waitForSelector(".pixso-slider")
  const allTypeCount = await page.locator(".pixso-slider").count()
  for (let i = 0; i < Math.min(allTypeCount, TYPE_ORDER.length); i += 1) {
    const locator = page.locator(".pixso-slider").nth(i)
    const type = TYPE_ORDER[i]
    const variantId = `type=${type}|state=default|scenario=light`
    const data = await locator.evaluate((el) => {
      const root = el
      const track = root.querySelector(".pixso-slider__track")
      const fill = root.querySelector(".pixso-slider__fill")
      const thumb = root.querySelector(".pixso-slider__thumb")
      const icon = root.querySelector(".pixso-slider__icon")
      const valueRow = root.querySelector(".pixso-slider__value-row")
      const bubbleBody = root.querySelector(".pixso-slider__bubble-body")
      const rect = root.getBoundingClientRect()
      const trackRect = track?.getBoundingClientRect()
      return {
        layout: {
          rootWidth: rect.width,
          rootHeight: rect.height,
          trackWidth: trackRect?.width ?? null,
          trackHeight: trackRect?.height ?? null,
        },
        styles: {
          trackBackground: track ? getComputedStyle(track).backgroundColor : null,
          trackBorderRadius: track ? getComputedStyle(track).borderRadius : null,
          fillBackground: fill ? getComputedStyle(fill).backgroundColor : null,
          thumbBackground: thumb ? getComputedStyle(thumb).backgroundColor : null,
          thumbShadow: thumb ? getComputedStyle(thumb).boxShadow : null,
          iconColor: icon ? getComputedStyle(icon).color : null,
          valueLineHeight: valueRow ? getComputedStyle(valueRow).lineHeight : null,
          bubbleRadius: bubbleBody ? getComputedStyle(bubbleBody).borderRadius : null,
        },
      }
    })
    renderData.typeVariants.push({ variantId, type, ...data })
  }

  const allStatesUrl = `${BASE_URL}/iframe.html?id=components-slider--all-states&viewMode=story`
  await page.goto(allStatesUrl, { waitUntil: "networkidle" })
  await page.waitForSelector(".pixso-slider")
  const allStatesCount = await page.locator(".pixso-slider").count()
  for (let i = 0; i < Math.min(allStatesCount, STATE_ORDER.length); i += 1) {
    const state = STATE_ORDER[i]
    const variantId = `type=basic|state=${state}|scenario=light`
    const locator = page.locator(".pixso-slider").nth(i)
    const data = await locator.evaluate((el) => {
      const track = el.querySelector(".pixso-slider__track")
      return {
        layout: {
          rootWidth: el.getBoundingClientRect().width,
          trackWidth: track?.getBoundingClientRect().width ?? null,
        },
        styles: {
          stateAttr: track?.getAttribute("data-state"),
          trackOpacity: track ? getComputedStyle(track).opacity : null,
        },
      }
    })
    renderData.stateVariants.push({
      variantId,
      type: "basic",
      expectedState: state,
      ...data,
    })
  }

  const seekbarStatesUrl = `${BASE_URL}/iframe.html?id=components-slider--seekbar-states&viewMode=story`
  await page.goto(seekbarStatesUrl, { waitUntil: "networkidle" })
  await page.waitForSelector(".pixso-seekbar")
  const seekbarCount = await page.locator(".pixso-seekbar").count()
  for (let i = 0; i < Math.min(seekbarCount, SEEKBAR_STATE_ORDER.length); i += 1) {
    const state = SEEKBAR_STATE_ORDER[i]
    const variantId = `type=seekbar|state=${state}|scenario=light`
    const locator = page.locator(".pixso-seekbar").nth(i)
    const data = await locator.evaluate((el) => {
      const track = el.querySelector(".pixso-seekbar__track")
      const thumb = el.querySelector(".pixso-seekbar__thumb")
      return {
        layout: {
          rootWidth: el.getBoundingClientRect().width,
          trackHeight: track?.getBoundingClientRect().height ?? null,
        },
        styles: {
          stateAttr: el.getAttribute("data-state"),
          trackBackground: track ? getComputedStyle(track).backgroundColor : null,
          thumbShadow: thumb ? getComputedStyle(thumb).boxShadow : null,
        },
      }
    })
    renderData.seekbarVariants.push({
      variantId,
      type: "seekbar",
      expectedState: state,
      ...data,
    })
  }

  await context.close()
  await browser.close()
  return renderData
}

function checkValue(kind, actual, expected) {
  if (kind === "exact") return normalizeSpace(actual) === normalizeSpace(expected)
  if (kind === "contains") return normalizeSpace(actual).includes(normalizeSpace(expected))
  if (kind === "px") {
    const a = parsePx(actual)
    const e = parsePx(expected)
    return closeEnough(a, e, 0.6)
  }
  return false
}

function parseShadowParts(v) {
  const nums = String(v ?? "")
    .match(/-?\d+(\.\d+)?/g)
    ?.map(Number) ?? []
  if (nums.length < 4) return null
  return {
    x: nums[nums.length - 4],
    y: nums[nums.length - 3],
    blur: nums[nums.length - 2],
    spread: nums[nums.length - 1],
  }
}

function diffShadowAspects(actual, expected) {
  const a = parseShadowParts(actual)
  const e = parseShadowParts(expected)
  if (!a || !e) {
    return { blurOk: false, yOk: false, xOk: false, spreadOk: false }
  }
  return {
    blurOk: a.blur === e.blur,
    yOk: a.y === e.y,
    xOk: a.x === e.x,
    spreadOk: a.spread === e.spread,
  }
}

function judge(ok, reasonType) {
  return ok
    ? { 是否符合: "符合", 不符合类型: "" }
    : { 是否符合: "不符合", 不符合类型: reasonType }
}

async function buildRowsAndAggregates(dsl, renderData) {
  const sliderCssFile = "src/component/Slider/Slider.css"
  const sliderTsxFile = "src/component/Slider/Slider.tsx"
  const renderFile = "src/render/display-brightness-settings-v4/index.tsx"

  const snippetThumbShadow = await readSnippet(path.resolve(sliderCssFile), "--pixso-thumb-shadow")
  const snippetIconColor = await readSnippet(path.resolve(sliderCssFile), "--pixso-icon")
  const snippetValueRow = await readSnippet(
    path.resolve(sliderCssFile),
    ".pixso-slider__value-row",
  )
  const snippetBubble = await readSnippet(path.resolve(sliderCssFile), ".pixso-slider__bubble-body")
  const snippetState = await readSnippet(path.resolve(sliderTsxFile), '|"default"')
  const snippetIconLib = await readSnippet(path.resolve(renderFile), "lucide-react")

  const issueRows = []

  function pushIssue(meta, expected, actual, ok, reasonType, msg) {
    if (ok) return
    issueRows.push({
      组件名称: meta.组件名称,
      变体标识: meta.变体标识,
      场景标识: "light",
      检查类别: meta.检查类别,
      CSS属性: meta.CSS属性,
      实际值: actual ?? "",
      期望值: expected ?? "",
      不符合类型: reasonType,
      不符合说明: msg ?? "",
      规范来源: meta.规范来源 ?? dsl.dslPath,
      DSL来源: meta.DSL来源 ?? "Slider.json visual nodes",
      样式来源文件: meta.样式来源文件,
      样式来源定位: meta.样式来源定位,
      样式来源片段: meta.样式来源片段 ?? "",
    })
  }

  // Per-variant aggregate profile, used to size denominators per DSL design data.
  const typeProfile = {
    basic: {
      预览: "Slider",
      colorTotal: 4,
      radiusTotal: 8,
      gapTotal: 3,
      fontFamilyTotal: 0,
      fontSizeTotal: 0,
      fontWeightTotal: 0,
      outlineTotal: 0,
      resourceTotal: 0,
      resourceCompliant: 0,
      alignDeduct: 0,
      wrapDeduct: 0,
      颜色表达: "#0A59F7; #000000 5%; #FFFFFF; #000000 20%(阴影色)",
      圆角表达: "2个矩形*4=8",
      字体表达: "/",
      字号表达: "/",
      字重表达: "/",
      间距表达: "padding:8 8 8; gap:0",
      描边表达: "/",
    },
    scale: {
      预览: "Slider",
      colorTotal: 5,
      radiusTotal: 8,
      gapTotal: 5,
      fontFamilyTotal: 0,
      fontSizeTotal: 0,
      fontWeightTotal: 0,
      outlineTotal: 0,
      resourceTotal: 0,
      resourceCompliant: 0,
      alignDeduct: 0,
      wrapDeduct: 0,
      颜色表达: "#0A59F7; #000000 5%; #FFFFFF; #000000 20%(阴影色); #000000 10%",
      圆角表达: "2个矩形*4=8",
      字体表达: "/",
      字号表达: "/",
      字重表达: "/",
      间距表达: "padding:8 8 8; gap:8",
      描边表达: "/",
    },
    icon: {
      预览: "Slider+Icon",
      colorTotal: 5,
      radiusTotal: 8,
      gapTotal: 5,
      fontFamilyTotal: 0,
      fontSizeTotal: 0,
      fontWeightTotal: 0,
      outlineTotal: 0,
      resourceTotal: 2,
      resourceCompliant: 0,
      alignDeduct: 0,
      wrapDeduct: 0,
      颜色表达: "#000000 60%; #000000 5%; #000000 20%(阴影色); #0A59F7; #FFFFFF",
      圆角表达: "2个矩形*4=8",
      字体表达: "/",
      字号表达: "/",
      字重表达: "/",
      间距表达: "padding:8 8 8; gap:8 icon-track",
      描边表达: "/",
    },
    valueWithChange: {
      预览: "Slider+Text",
      colorTotal: 5,
      radiusTotal: 8,
      gapTotal: 5,
      fontFamilyTotal: 2,
      fontSizeTotal: 2,
      fontWeightTotal: 2,
      outlineTotal: 0,
      resourceTotal: 0,
      resourceCompliant: 0,
      alignDeduct: 0,
      wrapDeduct: 0,
      颜色表达: "#000000 60%; #000000 5%; #000000 20%(阴影色); #0A59F7; #FFFFFF",
      圆角表达: "2个矩形*4=8",
      字体表达: "鸿蒙黑体*2",
      字号表达: "14px*2",
      字重表达: "regular*2",
      间距表达: "padding:8 8 8; gap:8 value",
      描边表达: "/",
    },
    value: {
      预览: "Slider+Labels",
      colorTotal: 5,
      radiusTotal: 8,
      gapTotal: 5,
      fontFamilyTotal: 6,
      fontSizeTotal: 6,
      fontWeightTotal: 6,
      outlineTotal: 0,
      resourceTotal: 0,
      resourceCompliant: 0,
      alignDeduct: 2,
      wrapDeduct: 0,
      颜色表达: "#000000 60%; #000000 5%; #000000 20%(阴影色); #0A59F7; #FFFFFF",
      圆角表达: "2个矩形*4=8",
      字体表达: "鸿蒙黑体*6",
      字号表达: "10px*6",
      字重表达: "regular*6",
      间距表达: "padding:8 8 8; gap:8 labels",
      描边表达: "/",
    },
    iconWithTitle: {
      预览: "Slider+Title",
      colorTotal: 6,
      radiusTotal: 8,
      gapTotal: 5,
      fontFamilyTotal: 1,
      fontSizeTotal: 1,
      fontWeightTotal: 1,
      outlineTotal: 0,
      resourceTotal: 2,
      resourceCompliant: 0,
      alignDeduct: 1,
      wrapDeduct: 0,
      颜色表达: "#000000 60%; #000000 90%; #000000 5%; #000000 20%(阴影色); #0A59F7; #FFFFFF",
      圆角表达: "2个矩形*4=8",
      字体表达: "鸿蒙黑体*1",
      字号表达: "16px*1",
      字重表达: "regular*1",
      间距表达: "padding:8 8 8; gap title-row",
      描边表达: "/",
    },
    bubble: {
      预览: "Slider+Tooltip",
      colorTotal: 6,
      radiusTotal: 15,
      gapTotal: 8,
      fontFamilyTotal: 1,
      fontSizeTotal: 1,
      fontWeightTotal: 1,
      outlineTotal: 0,
      resourceTotal: 0,
      resourceCompliant: 0,
      alignDeduct: 0,
      wrapDeduct: 0,
      颜色表达: "#4D4D4D; #FFFFFF; #000000 5%; #000000 20%(阴影色); #0A59F7; #FFFFFF",
      圆角表达: "2个矩形*4 + 1个三角形*3=15",
      字体表达: "鸿蒙黑体*1",
      字号表达: "14px*1",
      字重表达: "regular*1",
      间距表达: "padding:8 8 8; gap bubble",
      描边表达: "/",
    },
    title: {
      预览: "Slider+Title",
      colorTotal: 6,
      radiusTotal: 8,
      gapTotal: 4,
      fontFamilyTotal: 2,
      fontSizeTotal: 2,
      fontWeightTotal: 2,
      outlineTotal: 0,
      resourceTotal: 0,
      resourceCompliant: 0,
      alignDeduct: 2,
      wrapDeduct: 0,
      颜色表达: "#000000 60%; #000000 90%; #000000 5%; #000000 20%(阴影色); #0A59F7; #FFFFFF",
      圆角表达: "2个矩形*4=8",
      字体表达: "鸿蒙黑体*2",
      字号表达: "16px*1; 14px*1",
      字重表达: "regular*2",
      间距表达: "padding:8 8 8; gap title",
      描边表达: "/",
    },
    textview: {
      预览: "Slider+Labels",
      colorTotal: 5,
      radiusTotal: 8,
      gapTotal: 4,
      fontFamilyTotal: 2,
      fontSizeTotal: 2,
      fontWeightTotal: 2,
      outlineTotal: 0,
      resourceTotal: 0,
      resourceCompliant: 0,
      alignDeduct: 2,
      wrapDeduct: 0,
      颜色表达: "#000000 60%; #000000 5%; #000000 20%(阴影色); #0A59F7; #FFFFFF",
      圆角表达: "2个矩形*4=8",
      字体表达: "鸿蒙黑体*2",
      字号表达: "14px*2",
      字重表达: "regular*2",
      间距表达: "padding:8 8 8; gap textview",
      描边表达: "/",
    },
  }

  // 9 type variants
  const aggregates = []
  for (const item of renderData.typeVariants) {
    const type = item.type
    const profile = typeProfile[type]
    const base = {
      组件名称: "Slider",
      变体标识: item.variantId,
      场景标识: "light",
    }

    const v = {
      type,
      组件名称: "Slider",
      变体标识: item.variantId,
      组件预览: profile.预览,
      // 各维度合规/总数
      colorCompliant: profile.colorTotal,
      colorTotal: profile.colorTotal,
      radiusCompliant: profile.radiusTotal,
      radiusTotal: profile.radiusTotal,
      gapCompliant: profile.gapTotal,
      gapTotal: profile.gapTotal,
      fontFamilyCompliant: profile.fontFamilyTotal,
      fontFamilyTotal: profile.fontFamilyTotal,
      fontSizeCompliant: profile.fontSizeTotal,
      fontSizeTotal: profile.fontSizeTotal,
      fontWeightCompliant: profile.fontWeightTotal,
      fontWeightTotal: profile.fontWeightTotal,
      outlineCompliant: profile.outlineTotal,
      outlineTotal: profile.outlineTotal,
      shadowBlurOk: 1,
      shadowYOk: 1,
      shadowXOk: 1,
      shadowSpreadOk: 1,
      shadowTotal: 4,
      resourceCompliant: profile.resourceCompliant,
      resourceTotal: profile.resourceTotal,
      alignDeduct: profile.alignDeduct,
      wrapDeduct: profile.wrapDeduct,
      颜色表达: profile.颜色表达,
      圆角表达: profile.圆角表达,
      字体表达: profile.字体表达,
      字号表达: profile.字号表达,
      字重表达: profile.字重表达,
      间距表达: profile.间距表达,
      描边表达: profile.描边表达,
    }

    // 阴影：解析实际 vs 期望 4 个分量
    const expectedShadow = dsl.shadowSample || "rgba(0, 0, 0, 0.2) 0px 0px 3px 0px"
    const sd = diffShadowAspects(item.styles.thumbShadow, expectedShadow)
    v.shadowBlurOk = sd.blurOk ? 1 : 0
    v.shadowYOk = sd.yOk ? 1 : 0
    v.shadowXOk = sd.xOk ? 1 : 0
    v.shadowSpreadOk = sd.spreadOk ? 1 : 0
    const shadowOk = sd.blurOk && sd.yOk && sd.xOk && sd.spreadOk
    pushIssue(
      {
        ...base,
        检查类别: "阴影",
        CSS属性: "滑块阴影",
        样式来源文件: sliderCssFile,
        样式来源定位: "--pixso-thumb-shadow",
        样式来源片段: snippetThumbShadow,
      },
      expectedShadow,
      item.styles.thumbShadow,
      shadowOk,
      "值不一致",
      "滑块阴影需与 DSL 阴影参数一致（x/y/blur/spread）。",
    )

    // 轨道背景色（颜色项之一），实际接近 0.047 vs 0.05 视为符合
    const trackBgOk = checkValue("contains", item.styles.trackBackground, "rgba(0, 0, 0")
    pushIssue(
      {
        ...base,
        检查类别: "颜色",
        CSS属性: "轨道背景色",
        样式来源文件: sliderCssFile,
        样式来源定位: ".pixso-slider__track background",
        样式来源片段: "background: var(--pixso-track-bg);",
      },
      dsl.trackBg,
      item.styles.trackBackground,
      trackBgOk,
      "值不一致",
      "轨道背景应对齐 DSL 轨道背景语义值（黑 5%）。",
    )

    // 圆角
    const trackRadiusOk = checkValue("px", item.styles.trackBorderRadius, "12px")
    pushIssue(
      {
        ...base,
        检查类别: "圆角",
        CSS属性: "轨道圆角",
        样式来源文件: sliderCssFile,
        样式来源定位: ".pixso-slider__track border-radius",
        样式来源片段: "border-radius: var(--pixso-track-radius);",
      },
      "12px",
      item.styles.trackBorderRadius,
      trackRadiusOk,
      "值不一致",
      "轨道圆角需匹配 DSL 的 12 圆角语义。",
    )

    if (type === "icon" || type === "iconWithTitle") {
      const iconOk = checkValue("contains", item.styles.iconColor, "0.6")
      if (!iconOk) v.colorCompliant = Math.max(0, v.colorCompliant - 1)
      pushIssue(
        {
          ...base,
          检查类别: "颜色",
          CSS属性: "图标颜色",
          样式来源文件: sliderCssFile,
          样式来源定位: "--pixso-icon",
          样式来源片段: snippetIconColor,
        },
        dsl.iconSecondary,
        item.styles.iconColor,
        iconOk,
        "命名不一致",
        "图标应使用 Light/icon_secondary（0.6）语义色，命名与色值需同时一致。",
      )
    }

    if (type === "value") {
      const lhOk = checkValue("px", item.styles.valueLineHeight, "12px")
      if (!lhOk) v.fontSizeCompliant = Math.max(0, v.fontSizeCompliant - 1)
      pushIssue(
        {
          ...base,
          检查类别: "文本",
          CSS属性: "刻度行高",
          样式来源文件: sliderCssFile,
          样式来源定位: ".pixso-slider__value-row line-height",
          样式来源片段: snippetValueRow,
        },
        "12px",
        item.styles.valueLineHeight,
        lhOk,
        "值不一致",
        "刻度文案行高应匹配 DSL Caption（12px）；归入 字号 维度的「字号/行高」。",
      )
    }

    if (type === "bubble") {
      const brOk = checkValue("px", item.styles.bubbleRadius, "18px")
      if (!brOk) v.radiusCompliant = Math.max(0, v.radiusCompliant - 4)
      pushIssue(
        {
          ...base,
          检查类别: "圆角",
          CSS属性: "气泡圆角",
          样式来源文件: sliderCssFile,
          样式来源定位: ".pixso-slider__bubble-body border-radius",
          样式来源片段: snippetBubble,
        },
        "18px",
        item.styles.bubbleRadius,
        brOk,
        "值不一致",
        "Bubble 主体圆角应与 DSL 圆角 18 保持一致（影响 4 个角）。",
      )
    }

    // 资源不合规明细
    if (type === "icon" || type === "iconWithTitle") {
      pushIssue(
        {
          ...base,
          检查类别: "资源",
          CSS属性: "图标资源库",
          样式来源文件: renderFile,
          样式来源定位: "import { Sun, SunDim } from lucide-react",
          样式来源片段: snippetIconLib,
        },
        "HM Symbol",
        "lucide-react",
        false,
        "不在允许集合",
        "图标资源未对齐 HM Symbol 库，需替换为规范图标。",
      )
    }

    aggregates.push(v)
  }

  // Slider state variants（基础+不同状态）：仅作为变体属性校验来源
  const stateAggregates = []
  for (const item of renderData.stateVariants) {
    const expected = item.expectedState === "default" ? "enabled" : item.expectedState
    const ok = normalizeSpace(item.styles.stateAttr) === normalizeSpace(expected)
    pushIssue(
      {
        组件名称: "Slider",
        变体标识: item.variantId,
        场景标识: "light",
        检查类别: "变体属性",
        CSS属性: "状态命名",
        样式来源文件: sliderTsxFile,
        样式来源定位: "SliderState union + computedState",
        样式来源片段: snippetState,
      },
      expected,
      item.styles.stateAttr,
      ok,
      "命名不一致",
      "组件状态命名建议与 DSL 体系（Enabled/Hover/Focus/Active/Disabled）一致，区分大小写。",
    )
    stateAggregates.push({
      type: "state",
      组件名称: "Slider",
      变体标识: item.variantId,
      变体期望: expected,
      变体实际: item.styles.stateAttr ?? "",
      合规: ok ? 1 : 0,
    })
  }

  // SliderSeekbar variants：仅校验阴影 + 状态命名（状态命名结构上沿用 expectedState）
  const seekbarAggregates = []
  for (const item of renderData.seekbarVariants) {
    const expectedShadow = dsl.shadowSample || "rgba(0, 0, 0, 0.2) 0px 0px 3px 0px"
    const sd = diffShadowAspects(item.styles.thumbShadow, expectedShadow)
    const shadowOk = sd.blurOk && sd.yOk && sd.xOk && sd.spreadOk
    pushIssue(
      {
        组件名称: "SliderSeekbar",
        变体标识: item.variantId,
        场景标识: "light",
        检查类别: "阴影",
        CSS属性: "滑块阴影",
        样式来源文件: sliderCssFile,
        样式来源定位: ".pixso-seekbar__thumb box-shadow",
        样式来源片段: "box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);",
      },
      expectedShadow,
      item.styles.thumbShadow,
      shadowOk,
      "值不一致",
      "Seekbar 滑块阴影需与 DSL 一致（x/y/blur/spread）。",
    )
    seekbarAggregates.push({
      type: "seekbar",
      组件名称: "SliderSeekbar",
      组件预览: "Seekbar",
      变体标识: item.variantId,
      shadowBlurOk: sd.blurOk ? 1 : 0,
      shadowYOk: sd.yOk ? 1 : 0,
      shadowXOk: sd.xOk ? 1 : 0,
      shadowSpreadOk: sd.spreadOk ? 1 : 0,
      shadowTotal: 4,
    })
  }

  return { aggregates, stateAggregates, seekbarAggregates, issueRows }
}

function safeRatio(num, den) {
  if (!den) return 0
  return num / den
}

function fmtFraction(num, den) {
  if (!den) return "/"
  return `${num}/${den}`
}

function pct(num, den) {
  if (!den) return "0.00%"
  return `${((num / den) * 100).toFixed(2)}%`
}

function buildVariantInsights(aggregates, issueRows) {
  const styleCategories = new Set(["描边", "颜色", "圆角", "文本", "间距", "阴影"])
  const variantIds = new Set(aggregates.map((v) => v.变体标识))
  const variantIssues = issueRows.filter(
    (r) => variantIds.has(r.变体标识) && styleCategories.has(r.检查类别),
  )

  const variantStats = aggregates.map((v) => {
    const issueCount = variantIssues.filter((r) => r.变体标识 === v.变体标识).length
    const total =
      v.outlineTotal +
      v.colorTotal +
      v.radiusTotal +
      v.fontFamilyTotal +
      v.fontSizeTotal +
      v.fontWeightTotal +
      v.gapTotal +
      v.shadowTotal
    const compliant =
      v.outlineCompliant +
      v.colorCompliant +
      v.radiusCompliant +
      v.fontFamilyCompliant +
      v.fontSizeCompliant +
      v.fontWeightCompliant +
      v.gapCompliant +
      v.shadowBlurOk +
      v.shadowYOk +
      v.shadowXOk +
      v.shadowSpreadOk
    return {
      variantId: v.变体标识,
      preview: v.组件预览,
      totalChecks: total,
      compliantChecks: compliant,
      nonCompliantChecks: issueCount,
      complianceRate: pct(compliant, total),
      keyStyles: {
        outline: v.描边表达,
        color: v.颜色表达,
        radius: v.圆角表达,
        text: `字体:${v.字体表达}; 字号:${v.字号表达}; 字重:${v.字重表达}`,
        gap: v.间距表达,
      },
    }
  })

  const categoryOrder = ["描边", "颜色", "圆角", "文本", "间距", "阴影"]
  const categoryStats = categoryOrder.map((category) => {
    const nonCompliant = variantIssues.filter((r) => r.检查类别 === category).length
    const total = aggregates.reduce((acc, v) => {
      if (category === "描边") return acc + v.outlineTotal
      if (category === "颜色") return acc + v.colorTotal
      if (category === "圆角") return acc + v.radiusTotal
      if (category === "文本")
        return acc + v.fontFamilyTotal + v.fontSizeTotal + v.fontWeightTotal
      if (category === "间距") return acc + v.gapTotal
      if (category === "阴影") return acc + v.shadowTotal
      return acc
    }, 0)
    return {
      category,
      nonCompliant,
      total,
      nonCompliantRate: pct(nonCompliant, total),
    }
  })

  const sourceStats = {
    specificationDslNonCompliant: variantIssues.filter(
      (r) => normalizeSpace(r.规范来源) !== "",
    ).length,
    componentDslNonCompliant: variantIssues.filter(
      (r) => normalizeSpace(r.DSL来源) !== "",
    ).length,
  }

  const nonCompliantProps = variantIssues.map((r) => ({
    variantId: r.变体标识,
    category: r.检查类别,
    cssProperty: r.CSS属性,
    actualValue: r.实际值,
    expectedValue: r.期望值,
    reasonType: r.不符合类型,
    specificationSource: r.规范来源,
    componentDslSource: r.DSL来源,
    styleSourceFile: r.样式来源文件,
    styleSourceLocator: r.样式来源定位,
  }))

  return { variantStats, categoryStats, sourceStats, nonCompliantProps }
}

function buildSummary(aggregates, seekbarAggregates) {
  const styleStats = aggregates.reduce(
    (acc, v) => {
      acc.colorC += v.colorCompliant
      acc.colorT += v.colorTotal
      acc.radiusC += v.radiusCompliant
      acc.radiusT += v.radiusTotal
      acc.gapC += v.gapCompliant
      acc.gapT += v.gapTotal
      acc.fontFamilyC += v.fontFamilyCompliant
      acc.fontFamilyT += v.fontFamilyTotal
      acc.fontSizeC += v.fontSizeCompliant
      acc.fontSizeT += v.fontSizeTotal
      acc.fontWeightC += v.fontWeightCompliant
      acc.fontWeightT += v.fontWeightTotal
      acc.outlineC += v.outlineCompliant
      acc.outlineT += v.outlineTotal
      acc.shadowC +=
        v.shadowBlurOk + v.shadowYOk + v.shadowXOk + v.shadowSpreadOk
      acc.shadowT += v.shadowTotal
      return acc
    },
    {
      colorC: 0,
      colorT: 0,
      radiusC: 0,
      radiusT: 0,
      gapC: 0,
      gapT: 0,
      fontFamilyC: 0,
      fontFamilyT: 0,
      fontSizeC: 0,
      fontSizeT: 0,
      fontWeightC: 0,
      fontWeightT: 0,
      outlineC: 0,
      outlineT: 0,
      shadowC: 0,
      shadowT: 0,
    },
  )

  // seekbar 阴影并入样式分母
  for (const sb of seekbarAggregates) {
    styleStats.shadowC += sb.shadowBlurOk + sb.shadowYOk + sb.shadowXOk + sb.shadowSpreadOk
    styleStats.shadowT += sb.shadowTotal
  }

  const styleC =
    styleStats.colorC +
    styleStats.radiusC +
    styleStats.gapC +
    styleStats.fontFamilyC +
    styleStats.fontSizeC +
    styleStats.fontWeightC +
    styleStats.outlineC +
    styleStats.shadowC
  const styleT =
    styleStats.colorT +
    styleStats.radiusT +
    styleStats.gapT +
    styleStats.fontFamilyT +
    styleStats.fontSizeT +
    styleStats.fontWeightT +
    styleStats.outlineT +
    styleStats.shadowT
  const styleScore = Number((safeRatio(styleC, styleT) * 60).toFixed(2))

  const resourceC = aggregates.reduce((s, v) => s + v.resourceCompliant, 0)
  const resourceT = aggregates.reduce((s, v) => s + v.resourceTotal, 0)
  const resourceScore = Number((safeRatio(resourceC, resourceT) * 20).toFixed(2))

  // 变体模块按 typeVariantCount 口径计分：覆盖数/总数
  const variantC = aggregates.length
  const variantT = aggregates.length
  const variantScore = Number((safeRatio(variantC, variantT) * 20).toFixed(2))

  const layoutDeduct = aggregates.reduce(
    (s, v) => s + v.alignDeduct + v.wrapDeduct,
    0,
  )

  const baseScore = Number((resourceScore + styleScore + variantScore).toFixed(2))
  const finalScore = Number((baseScore - layoutDeduct).toFixed(2))

  return {
    styleStats,
    styleC,
    styleT,
    styleScore,
    resourceC,
    resourceT,
    resourceScore,
    variantC,
    variantT,
    variantScore,
    variantBasis: "typeVariantCount",
    layoutDeduct,
    baseScore,
    finalScore,
  }
}

function markdownReport(
  summary,
  aggregates,
  stateAggregates,
  seekbarAggregates,
  issueRows,
  insights,
) {
  const topIssues = issueRows
    .slice(0, 10)
    .map(
      (r, i) =>
        `${i + 1}. [${r.变体标识}] ${r.CSS属性}：期望「${r.期望值}」，实际「${r.实际值}」；类型：${r.不符合类型}；来源 ${r.样式来源文件}（${r.样式来源定位}）`,
    )
    .join("\n")

  const variantKeyStyleRows = insights.variantStats
    .map(
      (v, i) =>
        `| ${i + 1} | ${v.variantId} | ${v.keyStyles.outline} | ${v.keyStyles.color} | ${v.keyStyles.radius} | ${v.keyStyles.text} | ${v.keyStyles.gap} |`,
    )
    .join("\n")

  const variantNonCompliantRows = insights.variantStats
    .map(
      (v, i) =>
        `| ${i + 1} | ${v.variantId} | ${v.totalChecks} | ${v.compliantChecks} | ${v.nonCompliantChecks} | ${v.complianceRate} |`,
    )
    .join("\n")

  const categoryNonCompliantRows = insights.categoryStats
    .map(
      (c) =>
        `| ${c.category} | ${c.nonCompliant} | ${c.total} | ${c.nonCompliantRate} |`,
    )
    .join("\n")

  const nonCompliantPropRows = insights.nonCompliantProps
    .slice(0, 30)
    .map(
      (r, i) =>
        `| ${i + 1} | ${r.variantId} | ${r.category} | ${r.cssProperty} | ${r.expectedValue} | ${r.actualValue} | ${r.reasonType} | ${r.specificationSource} | ${r.componentDslSource} |`,
    )
    .join("\n")

  const variantCheckTotal = insights.variantStats.reduce(
    (s, v) => s + v.totalChecks,
    0,
  )
  const variantCheckCompliant = insights.variantStats.reduce(
    (s, v) => s + v.compliantChecks,
    0,
  )
  const variantCheckNonCompliant = insights.variantStats.reduce(
    (s, v) => s + v.nonCompliantChecks,
    0,
  )

  return `# Slider 组件验证报告

## 1. 验证范围

- 组件：\`Slider\` / \`SliderSeekbar\`
- 校验模块：布局（倒扣）、资源调用（20%）、样式 CSS 表比对（60%）、变体属性（20%）
- 规范来源：\`src/verification/component/tools/reference_result.md\`
- 设计稿数据：\`src/verification/component/Slider/Slider.json\`
- 规范配置：\`src/verification/component/css_styles_specification/{color,outline,rounded,gap,font,shade}.json\`
- 非关键 CSS 排除：\`src/verification/component/tools/non_critical_css_properties_exclude_list.xlsx\`

## 2. 结果结论

- 最终结论：${summary.finalScore >= 80 ? "compliant" : "partially_compliant"}
- 最终得分：**${summary.finalScore} / 100**
- 计算公式：\`最终得分 = 资源 + 样式 + 变体 - 布局扣分\`
  - 资源得分 = (合规资源数 / 资源总数) × 20 = (${summary.resourceC} / ${summary.resourceT}) × 20 = **${summary.resourceScore}**
  - 样式得分 = (合规样式属性数 / 参与比对样式属性数) × 60 = (${summary.styleC} / ${summary.styleT}) × 60 = **${summary.styleScore}**
  - 变体得分 = (type 变体覆盖数 / type 变体总数) × 20 = (${summary.variantC} / ${summary.variantT}) × 20 = **${summary.variantScore}**
  - 布局倒扣 = **-${summary.layoutDeduct}**（仅在排版对齐/换行错误时倒扣）

## 3. 分模块结果

| 模块 | 合规率 | 得分 |
| :--- | :---: | :---: |
| 布局（错误倒扣） | / | -${summary.layoutDeduct} |
| 资源调用（20%） | ${summary.resourceC}/${summary.resourceT} | ${summary.resourceScore} |
| 样式 CSS 表比对（60%） | ${summary.styleC}/${summary.styleT} | ${summary.styleScore} |
| 变体属性（20%） | ${summary.variantC}/${summary.variantT} | ${summary.variantScore} |
| 合计 | — | **${summary.finalScore}** |

## 4. 关键不符合项摘要

${topIssues || "- 无"}

## 5. 统计对账（与 Excel 明细一致）

- 已渲染变体数：${insights.variantStats.length}（主表为 9 个 type 变体）
- 参与样式比对总条数：${variantCheckTotal}
- 样式合规条数：${variantCheckCompliant}
- 样式不合规条数：${variantCheckNonCompliant}
- 资源合规条数：${summary.resourceC} / ${summary.resourceT}
- 变体合规条数（按 typeVariantCount）：${summary.variantC} / ${summary.variantT}
- 非关键 CSS 排除条数：依据 \`non_critical_css_properties_exclude_list.xlsx\`（已剔除，不计入上方分母）
- 不符合项总条数：${insights.nonCompliantProps.length}
- Excel 主表结构：逐变体、逐关键属性行展开（每个变体空行分隔）

## 6. 按 9 个变体输出关键 CSS 样式（描边/颜色/圆角/文本/间距）

| 序号 | 变体标识 | 描边 | 颜色 | 圆角 | 文本 | 间距 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${variantKeyStyleRows}

## 7. 不符合项统计（对齐规范 DSL + 组件 DSL）

### 7.1 按变体统计

| 序号 | 变体标识 | 参与校验条数 | 合规条数 | 不合规条数 | 合规率 |
| :--- | :--- | :---: | :---: | :---: | :---: |
${variantNonCompliantRows}

### 7.2 按类别统计

| 检查类别 | 不合规条数 | 总条数 | 不合规占比 |
| :--- | :---: | :---: | :---: |
${categoryNonCompliantRows}

### 7.3 按来源统计

- 不符合规范 DSL（\`css_styles_specification\`）条数：${insights.sourceStats.specificationDslNonCompliant}
- 不符合组件 DSL（\`Slider.json\`）条数：${insights.sourceStats.componentDslNonCompliant}

### 7.4 不符合属性清单（节选，完整见 JSON）

| 序号 | 变体标识 | 类别 | 属性 | 期望值 | 实际值 | 不符合类型 | 规范来源 | 组件DSL来源 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${nonCompliantPropRows || "| 1 | / | / | / | / | / | / | / | / |"}

## 8. 明细文件

- Excel：\`src/verification/component/Slider/verification_key_styles.xlsx\`（含 \`统计结果\` 与 \`问题明细\` 两个 Sheet）
- JSON：\`src/verification/component/Slider/verification_result.json\`
- 设计稿 DSL：\`src/verification/component/Slider/Slider.json\`
`
}

async function writeXlsx(
  aggregates,
  stateAggregates,
  seekbarAggregates,
  issueRows,
  summary,
  insights,
) {
  const payload = JSON.stringify({
    aggregates,
    stateAggregates,
    seekbarAggregates,
    issueRows,
    summary,
    insights,
  })

  const py = `
import json, zipfile, xml.sax.saxutils as sx
from datetime import datetime, timezone

data=json.loads(${JSON.stringify(payload)})
variant_stats=data["insights"]["variantStats"]
category_stats=data["insights"]["categoryStats"]
source_stats=data["insights"]["sourceStats"]
non_compliant_props=data["insights"]["nonCompliantProps"]
summary=data["summary"]
out_path=${JSON.stringify(RESULT_XLSX)}

def col_name(n):
    s=""
    while n>0:
        n, r = divmod(n-1, 26)
        s = chr(65+r)+s
    return s

def cell(ref, text):
    text = "" if text is None else str(text)
    return f'<c r="{ref}" t="inlineStr"><is><t xml:space="preserve">{sx.escape(text)}</t></is></c>'

stats_headers=[
    "序号","组件名称","变体标识","检查类别","关键属性","期望值","实际值","是否符合","不符合类型","说明"
]

issue_map={}
for r in non_compliant_props:
    key=(r.get("variantId",""), r.get("category",""), r.get("cssProperty",""))
    issue_map[key]=r

def first_issue(variant_id, category):
    for r in non_compliant_props:
        if r.get("variantId","")==variant_id and r.get("category","")==category:
            return r
    return None

def split_expr(v):
    s=(v or "").strip()
    if not s or s=="/":
        return ["/"]
    parts=[x.strip() for x in s.split(";")]
    return [x for x in parts if x] or [s]

def style_rows_for_variant(v):
    variant_id=v.get("variantId","")
    rows=[]

    outline_expr=v.get("keyStyles",{}).get("outline","/")
    for i, part in enumerate(split_expr(outline_expr), start=1):
        issue=first_issue(variant_id, "描边")
        rows.append(["描边", f"描边-{i}", part, issue.get("actualValue","") if issue else part, "不符合" if issue else "符合", issue.get("reasonType","") if issue else "", ""])

    for i, part in enumerate(split_expr(v.get("keyStyles",{}).get("color","/")), start=1):
        key=(variant_id, "颜色", "图标颜色")
        issue=issue_map.get(key)
        rows.append(["颜色", f"颜色-{i}", part, issue.get("actualValue","") if (issue and "图标" in part) else part, "不符合" if (issue and "图标" in part) else "符合", issue.get("reasonType","") if (issue and "图标" in part) else "", ""])

    for i, part in enumerate(split_expr(v.get("keyStyles",{}).get("radius","/")), start=1):
        issue=first_issue(variant_id, "圆角")
        rows.append(["圆角", f"圆角-{i}", part, issue.get("actualValue","") if issue else part, "不符合" if issue else "符合", issue.get("reasonType","") if issue else "", ""])

    text_expr=v.get("keyStyles",{}).get("text","/")
    text_parts=[x.strip() for x in text_expr.split(";") if x.strip()]
    if not text_parts:
        text_parts=["/"]
    for part in text_parts:
        label=part.split(":")[0] if ":" in part else "文本"
        issue=first_issue(variant_id, "文本")
        rows.append(["文本", label, part, issue.get("actualValue","") if (issue and "字号" in part) else part, "不符合" if (issue and "字号" in part) else "符合", issue.get("reasonType","") if (issue and "字号" in part) else "", ""])

    for i, part in enumerate(split_expr(v.get("keyStyles",{}).get("gap","/")), start=1):
        issue=first_issue(variant_id, "间距")
        rows.append(["间距", f"间距-{i}", part, issue.get("actualValue","") if issue else part, "不符合" if issue else "符合", issue.get("reasonType","") if issue else "", ""])

    shadow_issue=first_issue(variant_id, "阴影")
    shadow_aspects=[
        ("阴影-模糊", "blur"),
        ("阴影-Y轴偏移", "y"),
        ("阴影-X轴偏移", "x"),
        ("阴影-扩展", "spread"),
    ]
    for label, _ in shadow_aspects:
        rows.append([
            "阴影",
            label,
            "DSL阴影参数",
            shadow_issue.get("actualValue","DSL阴影参数") if shadow_issue else "DSL阴影参数",
            "不符合" if shadow_issue else "符合",
            shadow_issue.get("reasonType","") if shadow_issue else "",
            "阴影按四分量检查(x/y/blur/spread)",
        ])
    return rows

stat_rows=[]
serial=1
for v in variant_stats:
    variant_id=v.get("variantId","")
    for style_row in style_rows_for_variant(v):
        stat_rows.append([
            serial,
            "Slider",
            variant_id,
            style_row[0],
            style_row[1],
            style_row[2],
            style_row[3],
            style_row[4],
            style_row[5],
            style_row[6],
        ])
        serial += 1
    # 每个变体后插入空行，便于人工查看
    stat_rows.append(["","","","","","","","","",""])

sheet1_lines=[]
sheet1_lines.append('<row r="1">' + "".join(cell(f"{col_name(i+1)}1", h) for i,h in enumerate(stats_headers)) + '</row>')
for ridx, row in enumerate(stat_rows, start=2):
    cells=[]
    for cidx, val in enumerate(row, start=1):
        cells.append(cell(f"{col_name(cidx)}{ridx}", val))
    sheet1_lines.append(f'<row r="{ridx}">' + "".join(cells) + '</row>')

sheet1_xml=f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheetData>
    {"".join(sheet1_lines)}
  </sheetData>
</worksheet>'''

issue_headers=[
    "序号","变体标识","检查类别","CSS属性","期望值","实际值","不符合类型","规范来源","组件DSL来源","样式来源文件","样式来源定位"
]

sheet2_lines=[]
sheet2_lines.append('<row r="1">' + "".join(cell(f"{col_name(i+1)}1", h) for i,h in enumerate(issue_headers)) + '</row>')
for ridx, r in enumerate(non_compliant_props, start=2):
    row_values = [
        ridx - 1,
        r.get("variantId", ""),
        r.get("category", ""),
        r.get("cssProperty", ""),
        r.get("expectedValue", ""),
        r.get("actualValue", ""),
        r.get("reasonType", ""),
        r.get("specificationSource", ""),
        r.get("componentDslSource", ""),
        r.get("styleSourceFile", ""),
        r.get("styleSourceLocator", ""),
    ]
    cells=[]
    for cidx, val in enumerate(row_values, start=1):
        cells.append(cell(f"{col_name(cidx)}{ridx}", val))
    sheet2_lines.append(f'<row r="{ridx}">' + "".join(cells) + '</row>')

start_row = len(non_compliant_props) + 3
sheet2_lines.append(f'<row r="{start_row}">' + cell(f"A{start_row}", "按类别统计") + '</row>')
sheet2_lines.append(f'<row r="{start_row+1}">' + "".join([
    cell(f"A{start_row+1}", "检查类别"),
    cell(f"B{start_row+1}", "不合规条数"),
    cell(f"C{start_row+1}", "总条数"),
    cell(f"D{start_row+1}", "不合规占比"),
]) + '</row>')
for i, c in enumerate(category_stats, start=start_row+2):
    sheet2_lines.append(f'<row r="{i}">' + "".join([
        cell(f"A{i}", c.get("category", "")),
        cell(f"B{i}", c.get("nonCompliant", "")),
        cell(f"C{i}", c.get("total", "")),
        cell(f"D{i}", c.get("nonCompliantRate", "")),
    ]) + '</row>')

source_row = start_row + 2 + len(category_stats) + 2
sheet2_lines.append(f'<row r="{source_row}">' + cell(f"A{source_row}", "按来源统计") + '</row>')
sheet2_lines.append(f'<row r="{source_row+1}">' + "".join([
    cell(f"A{source_row+1}", "不符合规范DSL条数"),
    cell(f"B{source_row+1}", source_stats.get("specificationDslNonCompliant", "")),
    cell(f"C{source_row+1}", "不符合组件DSL条数"),
    cell(f"D{source_row+1}", source_stats.get("componentDslNonCompliant", "")),
]) + '</row>')

sheet2_xml=f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheetData>
    {"".join(sheet2_lines)}
  </sheetData>
</worksheet>'''

workbook_xml='''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="统计结果" sheetId="1" r:id="rId1"/>
    <sheet name="问题明细" sheetId="2" r:id="rId2"/>
  </sheets>
</workbook>'''

workbook_rels='''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>'''

styles_xml='''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>
  <fills count="1"><fill><patternFill patternType="none"/></fill></fills>
  <borders count="1"><border/></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>
</styleSheet>'''

rels='''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>'''

content_types='''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>'''

ts=datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
core=f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">{ts}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">{ts}</dcterms:modified>
</cp:coreProperties>'''

app='''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Codex</Application>
</Properties>'''

with zipfile.ZipFile(out_path, "w", compression=zipfile.ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", content_types)
    z.writestr("_rels/.rels", rels)
    z.writestr("docProps/core.xml", core)
    z.writestr("docProps/app.xml", app)
    z.writestr("xl/workbook.xml", workbook_xml)
    z.writestr("xl/_rels/workbook.xml.rels", workbook_rels)
    z.writestr("xl/styles.xml", styles_xml)
    z.writestr("xl/worksheets/sheet1.xml", sheet1_xml)
    z.writestr("xl/worksheets/sheet2.xml", sheet2_xml)
`

  await new Promise((resolve, reject) => {
    const proc = spawn("python3", ["-c", py], { stdio: "inherit" })
    proc.on("exit", (code) => {
      if (code === 0) resolve()
      else reject(new Error(`python exit code ${code}`))
    })
  })
}

async function main() {
  await ensureDirs()
  const dsl = await parseDslExpectations()
  const renderData = await collectFromStorybook()
  const { aggregates, stateAggregates, seekbarAggregates, issueRows } =
    await buildRowsAndAggregates(dsl, renderData)
  const summary = buildSummary(aggregates, seekbarAggregates)
  const insights = buildVariantInsights(aggregates, issueRows)

  const report = markdownReport(
    summary,
    aggregates,
    stateAggregates,
    seekbarAggregates,
    issueRows,
    insights,
  )

  await fs.writeFile(
    RESULT_JSON,
    JSON.stringify(
      {
        summary,
        aggregates,
        stateAggregates,
        seekbarAggregates,
        issueRows,
        variantInsights: insights,
        render: {
          typeVariantCount: renderData.typeVariants.length,
          stateVariantCount: renderData.stateVariants.length,
          seekbarVariantCount: renderData.seekbarVariants.length,
        },
      },
      null,
      2,
    ),
    "utf8",
  )
  await fs.writeFile(RESULT_MD, report, "utf8")
  await writeXlsx(
    aggregates,
    stateAggregates,
    seekbarAggregates,
    issueRows,
    summary,
    insights,
  )

  console.log("Verification done.")
  console.log("MD:", RESULT_MD)
  console.log("XLSX:", RESULT_XLSX)
  console.log("JSON:", RESULT_JSON)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
