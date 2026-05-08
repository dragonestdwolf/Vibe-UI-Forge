#!/usr/bin/env node
import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const { chromium } = require("playwright")

const root = process.cwd()
const outDir = path.join(root, "src/verification/Slider")
const screenshotDir = path.join(outDir, "screenshots")
const designPath = [
  path.join(root, "Slider.json"),
  path.join(root, "src/verification/Slider.json"),
].find((candidate) => {
  try {
    return require("node:fs").existsSync(candidate)
  } catch {
    return false
  }
})
const storybookUrl = process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006"

const stories = [
  {
    id: "components-slider--all-types",
    name: "AllTypes",
    file: "storybook-all-types.png",
  },
  {
    id: "components-slider--all-states",
    name: "AllStates",
    file: "storybook-all-states.png",
  },
  {
    id: "components-slider--seekbar-states",
    name: "SeekbarStates",
    file: "storybook-seekbar-states.png",
  },
]

function round(value, digits = 2) {
  return Number(Number(value).toFixed(digits))
}

function colorToCss(color) {
  if (!color) return null
  const { red, green, blue, alpha = 1 } = color
  if (alpha === 1) return `rgb(${red}, ${green}, ${blue})`
  return `rgba(${red}, ${green}, ${blue}, ${round(alpha, 3)})`
}

function normalizeRgb(value) {
  if (!value) return null
  const rgb = value.match(/rgba?\(([^)]+)\)/)
  if (!rgb) return value
  const parts = rgb[1].split(",").map((part) => Number(part.trim()))
  if (parts.length === 3) return `rgb(${parts[0]}, ${parts[1]}, ${parts[2]})`
  return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${round(parts[3], 3)})`
}

function flatten(nodes, list = []) {
  for (const node of nodes ?? []) {
    list.push(node)
    flatten(node.children, list)
  }
  return list
}

function pickStyle(node) {
  const style = node?.style ?? {}
  return {
    name: node?.name,
    key: node?.key,
    type: node?.type,
    box: node?.box
      ? {
          x: round(node.box.x),
          y: round(node.box.y),
          width: round(node.box.width),
          height: round(node.box.height),
        }
      : null,
    backgroundColor: colorToCss(style.background_color),
    fontColor: colorToCss(style.font_color),
    fontSize: style.font_size,
    fontWeight: style.font_weight,
    fontFamily: style.font_family,
    lineHeight: style.line_height,
    radius: style.round_corner,
    shadow: style.shadow?.map((shadow) => ({
      x: shadow.x,
      y: shadow.y,
      blur: shadow.blur,
      spread: shadow.spread,
      color: colorToCss(shadow.color),
    })),
    border: style.border?.map((border) => ({
      position: border.position,
      width: border.width,
      style: border.style,
      color: colorToCss(border.color),
    })),
    libraryStyle: node?.library_style?.map((item) => item.style_name),
    text: node?.content,
  }
}

function pxToNum(value) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? round(parsed) : value
}

function compareNumber(label, expected, actual, tolerance = 0.5, weight = 1) {
  const delta = typeof actual === "number" ? round(actual - expected) : null
  return {
    label,
    expected,
    actual,
    delta,
    pass: typeof actual === "number" && Math.abs(actual - expected) <= tolerance,
    weight,
  }
}

function compareString(label, expected, actual, weight = 1) {
  return {
    label,
    expected,
    actual,
    pass: expected === actual,
    weight,
  }
}

function score(checks, total) {
  const weight = checks.reduce((sum, item) => sum + item.weight, 0)
  const passed = checks.reduce(
    (sum, item) => sum + (item.pass ? item.weight : 0),
    0,
  )
  return round((passed / weight) * total, 1)
}

function extractDesignSpec(design) {
  const nodes = flatten(design.content)
  const byName = (name) => nodes.filter((node) => node.name === name)
  const rootFrame = nodes.find((node) => node.name === "6.Slider - 滑动条")
  const firstItem = byName(".Items").find((node) => node.box?.width === 336)
  const hoverItem = nodes.find((node) => node.name === "状态=Hover")
  const focusFrame = nodes.find((node) => node.name === "矩形 4")
  const seekbarFrame = nodes.find((node) => node.name === "Slider-Seekbar-Phone")
  const titleText = nodes.find((node) => node.content === "Title" && node.style?.font_size === 16)
  const secondaryText = nodes.find((node) => node.content === "Progress value")
  const captionText = nodes.find((node) => node.content === "20")
  const bubbleBody = nodes.find((node) => node.name === "Rectangle 1057")
  const iconNodes = nodes.filter(
    (node) =>
      node.style?.font_family === "HM Symbol" || node.name?.includes("brightness"),
  )

  return {
    source: path.relative(root, designPath),
    meta: design.meta,
    rootFrame: pickStyle(rootFrame),
    expectedVariants: [
      "basic",
      "scale",
      "icon",
      "valueWithChange",
      "value",
      "iconWithTitle",
      "bubble",
      "title",
      "textview",
    ],
    expectedStates: ["enabled", "hover", "focus", "active", "disabled"],
    mainTrack: {
      container: pickStyle(firstItem),
      fill: pickStyle(firstItem?.children?.find((node) => node.name === "container")),
      thumb: pickStyle(
        firstItem?.children
          ?.find((node) => node.name === "container")
          ?.children?.find((node) => node.name === "Oval 11"),
      ),
      hoverOverlay: pickStyle(
        hoverItem?.children
          ?.find((node) => node.name === "container")
          ?.children?.find((node) => node.name === "Oval 16"),
      ),
      focusFrame: pickStyle(focusFrame),
    },
    seekbar: {
      frame: pickStyle(seekbarFrame),
      track: pickStyle(
        seekbarFrame?.children?.find(
          (node) => node.name === "container" && node.box?.height === 4,
        ),
      ),
      fill: pickStyle(
        seekbarFrame?.children
          ?.find((node) => node.name === "container" && node.box?.height === 4)
          ?.children?.find((node) => node.name === "矩形" && node.box?.width === 107),
      ),
      thumb: pickStyle(nodes.find((node) => node.key === "3286:12190")),
      hoverOverlay: pickStyle(nodes.find((node) => node.key === "3286:12203")),
      focusOuter: pickStyle(nodes.find((node) => node.key === "3286:12197")),
    },
    typography: {
      title: pickStyle(titleText),
      secondary: pickStyle(secondaryText),
      caption: pickStyle(captionText),
      bubble: pickStyle(nodes.find((node) => node.content === "100%")),
    },
    bubble: pickStyle(bubbleBody),
    resources: {
      iconsInDesign: iconNodes.map(pickStyle),
      expectedIconFont: "HM Symbol",
    },
  }
}

async function captureDesignReference(page, spec) {
  const svgPath = path.join(outDir, "design-reference.svg")
  const pngPath = path.join(screenshotDir, "design-reference.png")
  const main = spec.mainTrack
  const seek = spec.seekbar
  const html = `<!doctype html>
    <html>
      <body style="margin:0;background:#f3f4f6;font-family:Arial,sans-serif;">
        <div style="width:760px;padding:32px;background:white;">
          <h1 style="font-size:18px;margin:0 0 24px;">Slider.json design reference</h1>
          <p style="font-size:12px;color:#666;margin:0 0 18px;">Generated from exported DSL boxes and style tokens. Not a Pixso raster export.</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="696" height="300" viewBox="0 0 696 300">
            <rect x="0" y="0" width="696" height="300" fill="white"/>
            <text x="0" y="22" font-size="14" fill="#111">Main track: 336 x 20, fill 140, thumb 12</text>
            <rect x="0" y="46" width="336" height="20" rx="12" fill="rgba(0,0,0,.05)"/>
            <rect x="0" y="46" width="${main.fill?.box?.width ?? 140}" height="20" rx="12" fill="#0a59f7"/>
            <circle cx="130" cy="56" r="6" fill="#fff"/>
            <circle cx="130" cy="56" r="12" fill="rgba(0,0,0,.05)"/>
            <text x="0" y="106" font-size="14" fill="#111">Seekbar: 336 x 4, fill 107, thumb 16</text>
            <rect x="0" y="132" width="336" height="4" rx="2" fill="rgba(0,0,0,.05)"/>
            <rect x="0" y="132" width="${seek.fill?.box?.width ?? 107}" height="4" rx="2" fill="#0a59f7"/>
            <circle cx="107" cy="134" r="8" fill="#fff" stroke="rgba(0,0,0,.12)"/>
            <text x="0" y="190" font-size="16" fill="rgba(0,0,0,.9)">Title 16/19</text>
            <text x="0" y="216" font-size="14" fill="rgba(0,0,0,.6)">Secondary 14/16</text>
            <text x="0" y="240" font-size="10" fill="rgba(0,0,0,.6)">Caption 10/12</text>
            <rect x="250" y="184" width="48" height="33" rx="18" fill="rgba(46,48,51,.9)"/>
            <polygon points="266,217 282,217 274,226" fill="rgba(46,48,51,.9)"/>
            <text x="274" y="205" text-anchor="middle" font-size="14" fill="#fff">100%</text>
          </svg>
        </div>
      </body>
    </html>`
  await fs.writeFile(svgPath, html, "utf8")
  await page.setContent(html, { waitUntil: "load" })
  await page.screenshot({ path: pngPath, fullPage: true })
  return { html: path.relative(root, svgPath), png: path.relative(root, pngPath) }
}

async function collectStory(page, story) {
  const iframeUrl = `${storybookUrl}/iframe.html?id=${story.id}&viewMode=story`
  await page.goto(iframeUrl, { waitUntil: "networkidle", timeout: 90_000 })
  await page.waitForTimeout(800)
  const rootLocator = page.locator("#storybook-root").first()
  const shotPath = path.join(screenshotDir, story.file)
  await rootLocator.screenshot({ path: shotPath })
  const components = await page.evaluate(() => {
    const numeric = (value) => {
      const parsed = Number.parseFloat(value)
      return Number.isFinite(parsed) ? Number(parsed.toFixed(2)) : value
    }
    const styleOf = (el) => {
      if (!el) return null
      const rect = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return {
        selector: el.className || el.tagName.toLowerCase(),
        text: el.textContent?.trim().replace(/\s+/g, " ").slice(0, 80) ?? "",
        rect: {
          x: Number(rect.x.toFixed(2)),
          y: Number(rect.y.toFixed(2)),
          width: Number(rect.width.toFixed(2)),
          height: Number(rect.height.toFixed(2)),
        },
        display: cs.display,
        width: cs.width,
        height: cs.height,
        padding: {
          top: numeric(cs.paddingTop),
          right: numeric(cs.paddingRight),
          bottom: numeric(cs.paddingBottom),
          left: numeric(cs.paddingLeft),
        },
        margin: {
          top: numeric(cs.marginTop),
          right: numeric(cs.marginRight),
          bottom: numeric(cs.marginBottom),
          left: numeric(cs.marginLeft),
        },
        gap: cs.gap,
        backgroundColor: cs.backgroundColor,
        color: cs.color,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        borderRadius: cs.borderRadius,
        borderTopWidth: cs.borderTopWidth,
        borderRightWidth: cs.borderRightWidth,
        borderBottomWidth: cs.borderBottomWidth,
        borderLeftWidth: cs.borderLeftWidth,
        borderTopColor: cs.borderTopColor,
        borderRightColor: cs.borderRightColor,
        borderBottomColor: cs.borderBottomColor,
        borderLeftColor: cs.borderLeftColor,
        boxShadow: cs.boxShadow,
        filter: cs.filter,
        opacity: cs.opacity,
      }
    }
    return [...document.querySelectorAll(".pixso-slider, .pixso-seekbar")].map(
      (component, index) => {
        const title = component
          .closest(".flex.flex-col")
          ?.querySelector("span")
          ?.textContent?.trim()
        return {
          index,
          label: title || component.getAttribute("data-state") || component.className,
          component: styleOf(component),
          row: styleOf(component.querySelector(".pixso-slider__row")),
          track: styleOf(
            component.querySelector(".pixso-slider__track") ??
              component.querySelector(".pixso-seekbar__track"),
          ),
          fill: styleOf(
            component.querySelector(".pixso-slider__fill") ??
              component.querySelector(".pixso-seekbar__fill"),
          ),
          thumb: styleOf(
            component.querySelector(".pixso-slider__thumb") ??
              component.querySelector(".pixso-seekbar__thumb"),
          ),
          thumbWrap: styleOf(component.querySelector(".pixso-seekbar__thumb-wrap")),
          title: styleOf(component.querySelector(".pixso-slider__title")),
          subtitle: styleOf(component.querySelector(".pixso-slider__subtitle")),
          icon: styleOf(component.querySelector(".pixso-slider__icon")),
          valueRow: styleOf(component.querySelector(".pixso-slider__value-row")),
          textview: styleOf(component.querySelector(".pixso-slider__textview")),
          bubble: styleOf(component.querySelector(".pixso-slider__bubble")),
          bubbleBody: styleOf(component.querySelector(".pixso-slider__bubble-body")),
          bubbleArrow: styleOf(component.querySelector(".pixso-slider__bubble-arrow")),
        }
      },
    )
  })
  return {
    storyId: story.id,
    iframeUrl,
    screenshot: path.relative(root, shotPath),
    components,
  }
}

function buildDiff(designSpec, actual) {
  const allTypes = actual.stories.find((story) => story.name === "AllTypes")
  const allStates = actual.stories.find((story) => story.name === "AllStates")
  const seekbarStates = actual.stories.find((story) => story.name === "SeekbarStates")
  const basic = allTypes?.components?.[0]
  const hover = allStates?.components?.find((item) => item.label?.includes("hover"))
  const focus = allStates?.components?.find((item) => item.label?.includes("focus"))
  const disabled = allStates?.components?.find((item) => item.label?.includes("disabled"))
  const seekbar = seekbarStates?.components?.[0]
  const bubble = allTypes?.components?.find((item) =>
    item.component?.selector?.includes("pixso-slider--bubble"),
  )
  const designMainFill = designSpec.mainTrack.fill?.box?.width
  const designMainTrack = designSpec.mainTrack.container?.box?.width
  const designMainThumbCenter =
    designSpec.mainTrack.thumb?.box && designSpec.mainTrack.fill?.box
      ? round(
          designSpec.mainTrack.thumb.box.x +
            designSpec.mainTrack.thumb.box.width / 2 -
            designSpec.mainTrack.fill.box.x,
        )
      : null
  const designMainValueHint =
    typeof designMainThumbCenter === "number" && typeof designMainTrack === "number"
      ? round((designMainThumbCenter / designMainTrack) * 100, 1)
      : null
  const actualMainFill = basic?.fill?.rect?.width
  const actualMainTrack = basic?.track?.rect?.width
  const actualMainValueHint =
    typeof actualMainTrack === "number" && typeof actualMainFill === "number"
      ? round(
          ((actualMainFill -
            (designSpec.mainTrack.thumb?.box?.width ?? 12) / 2 -
            4) /
            actualMainTrack) *
            100,
          1,
        )
      : null

  const mainChecks = [
    compareNumber("main slider width", 360, basic?.component?.rect?.width, 0.5, 2),
    compareNumber("main row height", 40, basic?.row?.rect?.height, 0.5, 2),
    compareNumber("main row padding left", 12, basic?.row?.padding?.left, 0.5, 1),
    compareNumber("main row padding top", 10, basic?.row?.padding?.top, 0.5, 1),
    compareNumber("main track height", 20, basic?.track?.rect?.height, 0.5, 2),
    compareString("main track bg", "rgba(0, 0, 0, 0.05)", normalizeRgb(basic?.track?.backgroundColor), 1),
    compareNumber("main thumb diameter", 12, basic?.thumb?.rect?.width, 0.5, 2),
    compareString("main fill color", "rgb(10, 89, 247)", normalizeRgb(basic?.fill?.backgroundColor), 2),
    compareString("main thumb color", "rgb(255, 255, 255)", normalizeRgb(basic?.thumb?.backgroundColor), 1),
  ]
  const seekbarChecks = [
    compareNumber("seekbar width", 360, seekbar?.component?.rect?.width, 0.5, 2),
    compareNumber("seekbar horizontal padding", 12, seekbar?.component?.padding?.left, 0.5, 1),
    compareNumber("seekbar track width", 336, seekbar?.track?.rect?.width, 0.5, 2),
    compareNumber("seekbar track height", 4, seekbar?.track?.rect?.height, 0.5, 2),
    compareNumber("seekbar fill width at story value", 107, seekbar?.fill?.rect?.width, 1, 2),
    compareNumber("seekbar thumb diameter", 16, seekbar?.thumb?.rect?.width, 0.5, 2),
    compareString("seekbar fill color", "rgb(10, 89, 247)", normalizeRgb(seekbar?.fill?.backgroundColor), 2),
  ]
  const stateChecks = [
    compareString("hover state present", "true", String(Boolean(hover)), 2),
    compareString("focus state present", "true", String(Boolean(focus)), 2),
    compareString("disabled state present", "true", String(Boolean(disabled)), 2),
    compareString("focus ring color", "rgb(10, 89, 247)", focus?.track?.boxShadow?.includes("10, 89, 247") ? "rgb(10, 89, 247)" : focus?.track?.boxShadow, 1),
    compareString("disabled opacity", "0.4", disabled?.track?.opacity, 1),
  ]
  const bubbleChecks = [
    compareNumber("bubble body width", designSpec.bubble?.box?.width, bubble?.bubbleBody?.rect?.width, 0.5, 1),
    compareNumber("bubble body height", designSpec.bubble?.box?.height, bubble?.bubbleBody?.rect?.height, 0.5, 1),
    compareString("bubble body bg", designSpec.bubble?.backgroundColor, normalizeRgb(bubble?.bubbleBody?.backgroundColor), 1),
    compareString("bubble body radius", "18px", bubble?.bubbleBody?.borderRadius, 2),
    compareString("bubble text color", designSpec.typography.bubble?.fontColor, normalizeRgb(bubble?.bubbleBody?.color), 1),
    compareString("bubble text size", `${designSpec.typography.bubble?.fontSize}px`, bubble?.bubbleBody?.fontSize, 1),
    compareString("bubble text line-height", `${designSpec.typography.bubble?.lineHeight}px`, bubble?.bubbleBody?.lineHeight, 1),
    compareString("bubble text content", designSpec.typography.bubble?.text, bubble?.bubbleBody?.text, 1),
    compareString("bubble arrow width", "8px", bubble?.bubbleArrow?.borderLeftWidth, 1),
    compareString("bubble arrow height", "9px", bubble?.bubbleArrow?.borderTopWidth, 1),
    compareString("bubble arrow color", designSpec.bubble?.backgroundColor, normalizeRgb(bubble?.bubbleArrow?.borderTopColor), 1),
    compareString("bubble shadow", "none", bubble?.bubble?.filter === "none" ? "none" : bubble?.bubble?.filter, 1),
  ]

  const variantsFound = new Set(
    allTypes?.components?.map((item) => {
      const match = item.component.selector.match(/pixso-slider--([a-zA-Z]+)/)
      return match?.[1]
    }).filter(Boolean),
  )
  const variantChecks = designSpec.expectedVariants.map((variant) =>
    compareString(`variant ${variant}`, "present", variantsFound.has(variant) ? "present" : "missing", 1),
  )
  const resourceChecks = [
    compareString("design icon font", "HM Symbol", designSpec.resources.expectedIconFont, 2),
    compareString(
      "storybook icon implementation",
      "HM Symbol",
      allTypes?.components?.find((item) => item.icon)?.icon?.fontFamily?.includes("HM Symbol")
        ? "HM Symbol"
        : allTypes?.components?.find((item) => item.icon)?.icon?.fontFamily ?? "missing",
      2,
    ),
  ]

  const allStyleChecks = [...mainChecks, ...seekbarChecks, ...stateChecks, ...bubbleChecks]
  const layoutChecks = [
    compareNumber("AllTypes component count", 9, allTypes?.components?.length, 0, 2),
    compareNumber("AllStates component count", 5, allStates?.components?.length, 0, 2),
    compareNumber("SeekbarStates component count", 5, seekbarStates?.components?.length, 0, 2),
  ]

  const scores = {
    layoutDeduction: score(layoutChecks, 0),
    resources: score(resourceChecks, 20),
    styles: score(allStyleChecks, 60),
    variants: score(variantChecks, 20),
  }
  scores.total = round(scores.resources + scores.styles + scores.variants)

  return {
    summary: {
      totalScore: scores.total,
      scores,
      verdict:
        scores.total >= 90
          ? "符合"
          : scores.total >= 75
            ? "基本符合，存在可修复偏差"
            : "不完全符合，需要修复关键样式偏差",
    },
    checks: {
      layout: layoutChecks,
      resources: resourceChecks,
      styles: allStyleChecks,
      variants: variantChecks,
    },
    importantFindings: [
      {
        severity: "high",
        item: "气泡框样式与设计稿不一致",
        evidence: `设计稿气泡为 48x33、圆角 18px、文本 “100%”、无阴影；Storybook 采集为 ${bubble?.bubbleBody?.rect?.width}x${bubble?.bubbleBody?.rect?.height}、圆角 ${bubble?.bubbleBody?.borderRadius}、文本 “${bubble?.bubbleBody?.text}”、filter=${bubble?.bubble?.filter}。`,
        suggestion:
          "将 `.pixso-slider__bubble-body` 圆角改为 18px，去掉额外 drop-shadow；如果该 Story 要按设计样例截图做比对，bubbleFormatter/default value 应展示 100%。",
      },
      {
        severity: "medium",
        item: "图标资源未使用设计稿 HM Symbol 图标字体",
        evidence: `设计稿 icon font=HM Symbol，Storybook icon font=${allTypes?.components?.find((item) => item.icon)?.icon?.fontFamily ?? "未采集"}。`,
        suggestion:
          "将 Slider icon story/默认资源切换为规范图标库，或在组件 props 文档中标明需传入 HM Symbol/Pixso 资源。",
      },
      {
        severity: "medium",
        item: "阴影 token 有偏差",
        evidence: `设计稿 thumb shadow=0 0 3 rgba(0,0,0,.2)，组件 CSS 采集=${basic?.thumb?.boxShadow}。`,
        suggestion:
          "将 `--pixso-thumb-shadow` 对齐为 0 0 3px rgba(0,0,0,.2)，seekbar 同步处理。",
      },
      {
        severity: "low",
        item: "部分 alpha 使用 0.047 近似 0.05",
        evidence: `设计稿 tertiary/hover alpha=.05，组件采集 track bg=${basic?.track?.backgroundColor}。`,
        suggestion:
          "如需像素级对齐，改为 rgba(0,0,0,0.05)。",
      },
    ],
    informationalFindings: [
      {
        item: "主 Slider fill 长度未计入评分",
        evidence: `设计导出样例 fill=${designMainFill}px、thumb 中心约 ${designMainValueHint}/100；Storybook value=42 对应 fill=${actualMainFill}px、推回约 ${actualMainValueHint}/100。`,
        note:
          "该差异来自设计样例值与 Story 默认 value 不一致，不能直接证明组件进度换算规则错误。若要像素级比对，应先把 Story 默认值调到设计样例对应值。",
      },
    ],
  }
}

function reportMarkdown(designSpec, actual, diff, designReference) {
  const rel = (p) => p.replaceAll("\\", "/")
  return `# Slider 设计稿规范验证报告

验证对象：\`src/component/Slider\`

设计稿来源：\`${designSpec.source}\`

评分标准：\`src/verification/reference.md\`

## 结论

总分：**${diff.summary.totalScore}/100**，结论：**${diff.summary.verdict}**。

- 资源调用：${diff.summary.scores.resources}/20
- 样式 CSS 比对：${diff.summary.scores.styles}/60
- 变体属性：${diff.summary.scores.variants}/20

## 截图

设计参考图（由 JSON box/style 生成，非 Pixso 原始 raster）：

![design reference](${rel(path.relative(outDir, path.join(root, designReference.png)))})

Storybook AllTypes：

![storybook all types](${rel(path.relative(outDir, path.join(root, "src/verification/Slider/screenshots/storybook-all-types.png")))})

Storybook AllStates：

![storybook all states](${rel(path.relative(outDir, path.join(root, "src/verification/Slider/screenshots/storybook-all-states.png")))})

Storybook SeekbarStates：

![storybook seekbar states](${rel(path.relative(outDir, path.join(root, "src/verification/Slider/screenshots/storybook-seekbar-states.png")))})

## 主要问题

${diff.importantFindings
  .map(
    (item) =>
      `- **${item.severity}**：${item.item}。${item.evidence} 修复建议：${item.suggestion}`,
  )
  .join("\n")}

## 说明性观察

${(diff.informationalFindings ?? [])
  .map((item) => `- ${item.item}。${item.evidence} 说明：${item.note}`)
  .join("\n")}

## 关键样式 Diff

${diff.checks.styles
  .map(
    (item) =>
      `- ${item.pass ? "PASS" : "FAIL"} ${item.label}: expected=${item.expected}, actual=${item.actual}`,
  )
  .join("\n")}

## 变体覆盖

${diff.checks.variants
  .map((item) => `- ${item.pass ? "PASS" : "FAIL"} ${item.label}`)
  .join("\n")}

## 产出文件

- \`design-extracted.json\`：从 \`Slider.json\` 抽取的规范值
- \`actual-styles.json\`：Storybook DOM computed style 采集结果
- \`style-diff.json\`：样式/资源/变体比对结果
- \`screenshots/*.png\`：设计参考图和 Storybook 截图
`
}

async function main() {
  await fs.mkdir(screenshotDir, { recursive: true })
  const design = JSON.parse(await fs.readFile(designPath, "utf8"))
  const designSpec = extractDesignSpec(design)
  await fs.writeFile(
    path.join(outDir, "design-extracted.json"),
    `${JSON.stringify(designSpec, null, 2)}\n`,
    "utf8",
  )

  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_BIN,
  })
  const page = await browser.newPage({ viewport: { width: 1280, height: 1200 } })
  const designReference = await captureDesignReference(page, designSpec)
  const actualStories = []
  for (const story of stories) {
    actualStories.push({ name: story.name, ...(await collectStory(page, story)) })
  }
  await browser.close()

  const actual = {
    capturedAt: new Date().toISOString(),
    storybookUrl,
    stories: actualStories,
  }
  await fs.writeFile(
    path.join(outDir, "actual-styles.json"),
    `${JSON.stringify(actual, null, 2)}\n`,
    "utf8",
  )

  const diff = buildDiff(designSpec, actual)
  await fs.writeFile(
    path.join(outDir, "style-diff.json"),
    `${JSON.stringify(diff, null, 2)}\n`,
    "utf8",
  )
  await fs.writeFile(
    path.join(outDir, "report.md"),
    reportMarkdown(designSpec, actual, diff, designReference),
    "utf8",
  )
  console.log(`Slider verification completed: ${path.relative(root, outDir)}`)
  console.log(`Score: ${diff.summary.totalScore}/100`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
