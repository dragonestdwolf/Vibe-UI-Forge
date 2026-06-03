#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { parseArgs, readJson, requireArg, sha256, writeJson } from "../../component-verification/scripts/lib/stable.mjs";
import { pageOutputDir } from "./lib/page_paths.mjs";
import { loadSpecIndex } from "../../component-verification/scripts/lib/spec_validate.mjs";
import { buildIconIndex, matchIcon } from "../../component-verification/scripts/lib/icon_match.mjs";
import { actualValueForCheck, evaluateActualAgainstSpec } from "./lib/page_spec_match.mjs";
import { scorePage } from "./lib/page_score.mjs";
import {
  clearDomScanMarkers,
  resolveDomScanConfig,
  rowsFromDomScan,
  scanPageDom,
} from "./lib/page_dom_scan.mjs";
import { prepareRenderPage } from "./lib/page_render_context.mjs";
import { buildReportScores } from "./lib/page_report_scores.mjs";
import { isDomCheckCollectible } from "./lib/page_property_applicable.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REFERENCES_DIR = path.resolve(SCRIPT_DIR, "../../references");
const ICON_REFERENCE_DIR = path.join(REFERENCES_DIR, "icon");
const requireFromCwd = createRequire(path.join(process.cwd(), "package.json"));

const SYSTEM_BROWSER_PATHS = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
];

async function findSystemBrowser() {
  for (const browserPath of SYSTEM_BROWSER_PATHS) {
    try {
      await fs.access(browserPath);
      return browserPath;
    } catch {
      // continue
    }
  }
  return null;
}

function parsePx(value) {
  const raw = String(value ?? "").trim();
  const match = raw.match(/^(-?[\d.]+)px$/i);
  if (match) return Number(match[1]);
  const num = Number(raw);
  return Number.isFinite(num) ? num : null;
}

async function loadGapAllowedValues() {
  const gap = JSON.parse(await fs.readFile(path.join(REFERENCES_DIR, "gap.json"), "utf8"));
  return new Set(gap.rules?.allowedValues ?? []);
}

function pushRow(rows, row) {
  rows.push(row);
}

function evaluateLayoutCheck(layout, captured) {
  if (!captured) return false;
  const checkType = layout.checkType ?? "align";
  if (checkType === "align" || checkType === "wrap") {
    if (!layout.manualReview) return false;
    return Boolean(layout.expected?.ok);
  }
  return true;
}

async function verifyResource(resource, scope, lazyIconIndex, input, elementId, seq, rows) {
  const base = {
    pageName: input.pageName,
    elementId,
    elementKind: "custom",
    variantId: `element=${elementId}`,
    selector: resource.selector,
  };
  const captured = await scope.evaluate((selector) => {
    const el = document.querySelector(selector);
    if (!el) return { found: false, outerHTML: null };
    const svg = el.closest("svg") ?? (el.tagName.toLowerCase() === "svg" ? el : el.querySelector("svg"));
    return { found: true, outerHTML: svg?.outerHTML ?? null };
  }, resource.selector);

  if (!captured.found || !captured.outerHTML) {
    pushRow(rows, {
      seq,
      ...base,
      checkCategory: "资源",
      propertyKey: resource.resourceId,
      expectedValue: "references/icon",
      actualValue: "/",
      status: "无法判定",
      failType: "来源不可追溯",
      note: captured.found ? "无法采集 SVG" : "selector 未找到",
    });
    return;
  }

  const iconIndex = await lazyIconIndex.get();
  const hash = matchIcon(captured.outerHTML, resource, iconIndex);
  const matched = Boolean(hash.hit);
  pushRow(rows, {
    seq,
    ...base,
    checkCategory: "资源",
    propertyKey: resource.resourceId,
    expectedValue: "references/icon",
    actualValue: matched ? `${hash.hit.basename} (${hash.hit.relativePath})` : "/",
    status: matched ? "符合" : "不符合",
    failType: matched ? "" : "不在允许集合",
    note: matched ? `matchTier=${hash.tier ?? "strict-content"}` : (hash.note ?? "SVG 指纹未命中"),
  });
}

function markStaticUnavailable(rows, input, seqStart, note) {
  let seq = seqStart;
  for (const check of input.layout?.gridChecks ?? []) {
    seq += 1;
    pushRow(rows, {
      seq,
      pageName: input.pageName,
      elementId: "page",
      elementKind: "page",
      variantId: "page=layout",
      checkCategory: "页面布局",
      propertyKey: `栅格-${check.layoutId}`,
      expectedValue: "gap.json allowedValues",
      actualValue: "/",
      status: "无法判定",
      failType: "来源不可追溯",
      note,
    });
  }
  for (const check of input.layout?.backgroundChecks ?? []) {
    seq += 1;
    pushRow(rows, {
      seq,
      pageName: input.pageName,
      elementId: "page",
      elementKind: "page",
      variantId: "page=layout",
      checkCategory: "页面布局",
      propertyKey: `背景-${check.layoutId}`,
      expectedValue: "color.json",
      actualValue: "/",
      status: "无法判定",
      failType: "来源不可追溯",
      note,
    });
  }
  for (const element of input.customElements ?? []) {
    for (const check of element.styleChecks ?? []) {
      seq += 1;
      pushRow(rows, {
        seq,
        pageName: input.pageName,
        elementId: element.elementId,
        elementKind: "custom",
        variantId: `element=${element.elementId}`,
        selector: element.selector,
        checkCategory: check.category,
        propertyKey: check.key,
        expectedValue: "/",
        actualValue: "/",
        status: element.excluded ? "已排除" : "无法判定",
        failType: "",
        note,
      });
    }
    for (const resource of element.resources ?? []) {
      seq += 1;
      pushRow(rows, {
        seq,
        pageName: input.pageName,
        elementId: element.elementId,
        elementKind: "custom",
        variantId: `element=${element.elementId}`,
        selector: resource.selector,
        checkCategory: "资源",
        propertyKey: resource.resourceId,
        expectedValue: "references/icon",
        actualValue: "/",
        status: "无法判定",
        failType: "来源不可追溯",
        note,
      });
    }
  }
  return seq;
}

function summarizeDomScan(domRows) {
  const denom = domRows.filter((row) => row.status !== "已排除").length;
  const pass = domRows.filter((row) => row.status === "符合").length;
  const fail = domRows.filter((row) => row.status === "不符合").length;
  const unknown = domRows.filter((row) => row.status === "无法判定").length;
  const elementCount = new Set(domRows.map((row) => row.scanId)).size;
  return {
    elementCount,
    totalChecks: domRows.length,
    pass,
    fail,
    unknown,
    excluded: domRows.filter((row) => row.status === "已排除").length,
    complianceRate: denom ? Number(((pass / denom) * 100).toFixed(2)) : 100,
  };
}

function buildExcelRow(row, { includeDomFields = false } = {}) {
  const base = {
    序号: row.seq,
    页面名称: row.pageName,
    元素标识: row.variantId,
    检查类别: row.checkCategory,
    关键属性: row.propertyKey,
    期望值: row.expectedValue,
    实际值: row.actualValue,
    是否符合: row.status,
    不符合类型: row.failType,
    说明: row.note,
  };
  if (includeDomFields) {
    return {
      ...base,
      DOM序号: row.scanId ?? "",
      DOM路径: row.domSelector ?? "",
      元素描述: row.elementLabel ?? "",
    };
  }
  return base;
}

const NAVIGATION_TIMEOUT_MS = 15000;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(requireArg(args, "input"));
  const input = await readJson(inputPath);
  const outDir = path.resolve(args.out ?? pageOutputDir(input.pageName));
  const staticOnly = args["static-only"] === "true" || args.staticOnly === "true";
  const domScanConfig = resolveDomScanConfig(input);

  const specs = await loadSpecIndex(REFERENCES_DIR);
  const gapAllowedValues = await loadGapAllowedValues();
  const XLSX = requireFromCwd("xlsx");

  const registryRows = [];
  let domRows = [];
  let seq = 0;
  let domScanMeta = null;
  const executablePath = args.browser ?? (await findSystemBrowser());
  let browser = null;
  let renderMode = "computed-style";
  let renderWarning = "";
  let effectivePageUrl = input.render.pageUrl;
  let navigationMode = "direct";
  let renderScopeKind = "page";

  const lazyIconIndex = {
    promise: null,
    async get() {
      if (!this.promise) this.promise = buildIconIndex(ICON_REFERENCE_DIR);
      return this.promise;
    },
  };

  if (staticOnly) {
    renderMode = "static-registry-only";
    renderWarning = "已指定 --static-only，跳过浏览器采集";
    markStaticUnavailable(registryRows, input, seq, renderWarning);
  } else {
    let chromium;
    try {
      ({ chromium } = requireFromCwd("playwright"));
    } catch (error) {
      renderMode = "static-registry-only";
      renderWarning = `Playwright 不可用：${error instanceof Error ? error.message : String(error)}`;
    }

    if (!renderWarning) {
      try {
        browser = await chromium.launch({ headless: true, executablePath: executablePath || undefined });
      } catch (error) {
        renderMode = "static-registry-only";
        renderWarning = `未找到可用浏览器：${error instanceof Error ? error.message : String(error)}`;
      }
    }

    if (!browser) {
      markStaticUnavailable(registryRows, input, seq, renderWarning);
    } else {
      const page = await browser.newPage({
        viewport: input.render.viewport,
        deviceScaleFactor: input.render.deviceScaleFactor ?? 1,
      });
      page.setDefaultTimeout(NAVIGATION_TIMEOUT_MS);
      page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT_MS);
      let navigated = false;
      let scope = null;
      try {
        const prepared = await prepareRenderPage(page, {
          ...input.render,
          navigationTimeoutMs: NAVIGATION_TIMEOUT_MS,
        });
        scope = prepared.scope;
        effectivePageUrl = prepared.effectiveUrl;
        navigationMode = prepared.navigationMode;
        renderScopeKind = scope.kind;
        navigated = true;
      } catch (navError) {
        renderMode = "static-registry-only";
        renderWarning = `页面无法访问（${input.render.pageUrl}）：${navError instanceof Error ? navError.message : String(navError)}`;
        markStaticUnavailable(registryRows, input, seq, renderWarning);
      } finally {
        if (!navigated) {
          await page.close().catch(() => {});
          await browser.close().catch(() => {});
        }
      }

      if (navigated) {
        try {
          for (const check of input.layout?.gridChecks ?? []) {
            seq += 1;
            const captured = await scope.evaluate((selectorAndProp) => {
              const el = document.querySelector(selectorAndProp.selector);
              if (!el) return null;
              const computed = getComputedStyle(el);
              return computed.getPropertyValue(selectorAndProp.property) || computed[selectorAndProp.property];
            }, { selector: check.selector, property: check.property ?? "padding-left" });
            const px = parsePx(captured);
            const valid = px !== null && gapAllowedValues.has(px);
            pushRow(registryRows, {
              seq,
              pageName: input.pageName,
              elementId: "page",
              elementKind: "page",
              variantId: "page=layout",
              selector: check.selector,
              checkCategory: "页面布局",
              propertyKey: `栅格-${check.layoutId}`,
              expectedValue: "gap.json allowedValues",
              actualValue: captured ?? "/",
              status: captured == null ? "无法判定" : valid ? "符合" : "不符合",
              failType: captured == null ? "来源不可追溯" : valid ? "" : "不在允许集合",
              note: check.note ?? "",
            });
          }

          for (const check of input.layout?.backgroundChecks ?? []) {
            seq += 1;
            const captured = await scope.evaluate((selector) => {
              const el = document.querySelector(selector);
              if (!el) return null;
              return getComputedStyle(el).backgroundColor;
            }, check.selector);
            const result = evaluateActualAgainstSpec(
              { category: "颜色", key: "颜色-填充", property: "background-color" },
              captured,
              specs,
              null,
            );
            pushRow(registryRows, {
              seq,
              pageName: input.pageName,
              elementId: "page",
              elementKind: "page",
              variantId: "page=layout",
              selector: check.selector,
              checkCategory: "页面布局",
              propertyKey: `背景-${check.layoutId}`,
              expectedValue: "color.json",
              actualValue: result.actualValue,
              status: captured == null ? "无法判定" : result.status,
              failType: captured == null ? "来源不可追溯" : result.failType,
              note: result.note ?? check.note ?? "",
            });
          }

          for (const element of input.customElements ?? []) {
            if (element.excluded) continue;
            const capturedBundle = await scope.evaluate(({ selector, checks }) => {
              const el = document.querySelector(selector);
              if (!el) return { found: false, styles: {} };
              const computed = getComputedStyle(el);
              const styles = {};
              for (const check of checks) styles[check.property] = computed.getPropertyValue(check.property) || computed[check.property];
              return { found: true, styles };
            }, { selector: element.selector, checks: element.styleChecks });

            for (const check of element.styleChecks ?? []) {
              if (capturedBundle.found && !isDomCheckCollectible(check, capturedBundle.styles)) {
                continue;
              }
              seq += 1;
              if (!capturedBundle.found) {
                pushRow(registryRows, {
                  seq,
                  pageName: input.pageName,
                  elementId: element.elementId,
                  elementKind: "custom",
                  variantId: `element=${element.elementId}`,
                  selector: element.selector,
                  checkCategory: check.category,
                  propertyKey: check.key,
                  expectedValue: "/",
                  actualValue: "/",
                  status: "无法判定",
                  failType: "来源不可追溯",
                  note: "selector 未找到",
                });
                continue;
              }
              const actual = actualValueForCheck(check, capturedBundle.styles);
              const result = evaluateActualAgainstSpec(check, actual, specs, gapAllowedValues);
              pushRow(registryRows, {
                seq,
                pageName: input.pageName,
                elementId: element.elementId,
                elementKind: "custom",
                variantId: `element=${element.elementId}`,
                selector: element.selector,
                checkCategory: check.category,
                propertyKey: check.key,
                expectedValue: result.specReference ?? "../references",
                actualValue: result.actualValue,
                status: result.status,
                failType: result.failType,
                note: result.note ?? "",
              });
            }

            for (const layout of element.layoutChecks ?? []) {
              seq += 1;
              const captured = await scope.evaluate((selector) => {
                const el = document.querySelector(selector);
                if (!el) return null;
                const rect = el.getBoundingClientRect();
                const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
                return {
                  width: rect.width,
                  height: rect.height,
                  x: rect.x,
                  y: rect.y + scrollY,
                  top: rect.top + scrollY,
                  left: rect.left,
                };
              }, layout.selector ?? element.selector);
              const checkType = layout.checkType ?? "align";
              const needsManual = checkType === "align" || checkType === "wrap";
              const manualReady = Boolean(layout.manualReview);
              const ok = evaluateLayoutCheck(layout, captured);
              pushRow(registryRows, {
                seq,
                pageName: input.pageName,
                elementId: element.elementId,
                elementKind: "custom",
                variantId: `element=${element.elementId}`,
                selector: layout.selector ?? element.selector,
                rect: captured ?? undefined,
                checkCategory: "布局",
                propertyKey: layout.layoutId,
                expectedValue: JSON.stringify(layout.expected),
                actualValue: captured ? JSON.stringify(captured) : "/",
                status: !captured
                  ? "无法判定"
                  : needsManual && !manualReady
                    ? "无法判定"
                    : ok
                      ? "符合"
                      : "不符合",
                failType: !captured
                  ? "来源不可追溯"
                  : needsManual && !manualReady
                    ? "来源不可追溯"
                    : ok
                      ? ""
                      : layout.failType ?? "alignDeduct",
                note:
                  needsManual && !manualReady
                    ? "align/wrap 需设置 manualReview:true 并在人工复核后填写 expected.ok"
                    : layout.note ?? "",
              });
            }

            for (const resource of element.resources ?? []) {
              seq += 1;
              await verifyResource(resource, scope, lazyIconIndex, input, element.elementId, seq, registryRows);
            }
          }

          if (domScanConfig.enabled) {
            const scanResult = await scanPageDom(scope, domScanConfig);
            const domBuilt = rowsFromDomScan(scanResult, input, specs, gapAllowedValues, seq);
            domRows = domBuilt.rows;
            seq = domBuilt.nextSeq;
            domScanMeta = {
              scannedCount: scanResult.scannedCount,
              candidateCount: scanResult.candidateCount,
              truncated: scanResult.truncated,
              maxElements: domScanConfig.maxElements,
              ...summarizeDomScan(domRows),
            };
          }

          await clearDomScanMarkers(scope);
          await page.close();
        } finally {
          await browser.close().catch(() => {});
        }
      }
    }
  }

  const rows = [...registryRows, ...domRows];
  const scores = scorePage(registryRows, input);
  const domSummary = domRows.length ? summarizeDomScan(domRows) : null;
  const reportScores = buildReportScores(scores, domSummary, input);

  const run = {
    version: 2,
    inputChecksum: input.checksum,
    registryChecksum: input.source?.registryChecksum ?? "",
    renderMode,
    renderWarning,
    domScan: domScanMeta,
    rows,
    registryRows,
    domRows,
    scores,
    checksum: sha256({ rows, scores, domScanMeta }),
  };
  await writeJson(path.join(outDir, "verification_run.json"), run);

  const failRows = rows.filter((row) => row.status === "不符合");
  const registryFailRows = registryRows.filter((row) => row.status === "不符合");

  const md = [
    `# ${input.pageName} 页面验证报告`,
    "",
    `## 评分摘要`,
    "",
    `- **${reportScores.headline.label}**: **${reportScores.headline.value}${reportScores.headline.unit}**`,
    ...(reportScores.headline.note ? [`- ${reportScores.headline.note}`] : []),
    `- Registry 加权得分: ${reportScores.registryWeightedScore} / 100（清单检查项 ${reportScores.registryCheckCount} 条）`,
    ...(reportScores.domComplianceRate != null
      ? [
          `- DOM 全量合规率: ${reportScores.domComplianceRate}%（有效检查 ${reportScores.domCollectedChecks} 条，未生效属性不采集）`,
        ]
      : []),
    "",
    `- pageVerificationInputChecksum: \`${input.checksum}\``,
    `- registryChecksum: \`${input.source?.registryChecksum ?? ""}\``,
    `- comparisonMode: \`spec-only\`（无页面 DSL，仅对照 references 规范）`,
    `- renderMode: \`${renderMode}\``,
    `- navigationMode: \`${navigationMode}\`（scope: \`${renderScopeKind}\`）`,
    `- effectivePageUrl: \`${effectivePageUrl}\``,
    ...(renderWarning ? [`- renderWarning: ${renderWarning}`] : []),
    "",
    "## 页面元素统计",
    "",
    `- 页面元素总数: ${scores.modules.elements.total}`,
    `- 预置组件: ${scores.modules.elements.presetCount}（权重 ${scores.modules.preset.weight}%）`,
    `- 自定义元素: ${scores.modules.elements.customCount}（权重 ${scores.modules.custom.weight}%）`,
    "",
    ...(domSummary
      ? [
          "## DOM 全量扫描",
          "",
          `- 扫描元素数: ${domScanMeta?.scannedCount ?? 0}${domScanMeta?.truncated ? `（候选 ${domScanMeta?.candidateCount}，已截断至 maxElements=${domScanMeta?.maxElements}）` : ""}`,
          `- 检查条数: ${domSummary.totalChecks}`,
          `- 符合: ${domSummary.pass}，不符合: ${domSummary.fail}，无法判定: ${domSummary.unknown}，已排除: ${domSummary.excluded}`,
          `- DOM 合规率: ${domSummary.complianceRate}%（不计入加权总分）`,
          "",
        ]
      : []),
    "## 分模块结果",
    "",
    `- 页面布局: 栅格 ${scores.modules.pageLayout.gridPass}/${scores.modules.pageLayout.gridTotal}，栅格得分 ${scores.modules.pageLayout.gridScore}；背景倒扣 ${scores.modules.pageLayout.backgroundDeduct}；模块得分 ${scores.modules.pageLayout.score}`,
    `- 预置组件: 调用 ${scores.modules.preset.invoked}/${scores.modules.preset.total}，合规率 ${scores.modules.preset.compliance}%，得分 ${scores.modules.preset.score}`,
    `- 自定义组件: 资源 ${scores.modules.custom.resourcePass}/${scores.modules.custom.resourceTotal}（内层 ${scores.modules.custom.resourceInner}），样式 ${scores.modules.custom.stylePass}/${scores.modules.custom.styleTotal}（内层 ${scores.modules.custom.styleInner}），布局倒扣 ${scores.modules.custom.layoutDeduct}，折算得分 ${scores.modules.custom.score}`,
    "",
    "## 统计对账",
    "",
    `- registry 条数: ${registryRows.length}（不符合 ${registryFailRows.length}）`,
    ...(domRows.length ? [`- DOM 全量扫描条数: ${domRows.length}（不符合 ${domRows.filter((row) => row.status === "不符合").length}）`] : []),
    `- 合计条数: ${rows.length}`,
    `- 不符合: ${failRows.length}`,
    `- 无法判定: ${rows.filter((row) => row.status === "无法判定").length}`,
    `- 已排除: ${rows.filter((row) => row.status === "已排除").length}`,
    "",
    "## 不符合摘要",
    "",
    ...(failRows.length
      ? failRows
          .slice(0, 80)
          .map(
            (row) =>
              `- [${row.status}] ${row.variantId} / ${row.checkCategory} / ${row.propertyKey}: 实际 \`${row.actualValue}\`（${row.failType}${row.note ? `；${row.note}` : ""}）`,
          )
      : ["- 无"]),
    ...(failRows.length > 80 ? ["", `- … 另有 ${failRows.length - 80} 条，见 Excel「问题明细」`] : []),
    "",
  ].join("\n");
  await fs.writeFile(path.join(outDir, "verification_result.md"), md, "utf8");

  const domHeaders = [
    "序号",
    "页面名称",
    "DOM序号",
    "DOM路径",
    "元素描述",
    "元素标识",
    "检查类别",
    "关键属性",
    "期望值",
    "实际值",
    "是否符合",
    "不符合类型",
    "说明",
  ];
  const registryMainRows = registryRows.map((row) => buildExcelRow(row));
  const domMainRows = domRows.map((row) => buildExcelRow(row, { includeDomFields: true }));
  const issueRows = [...registryMainRows, ...domMainRows].filter((row) => row.是否符合 === "不符合");

  const wb = XLSX.utils.book_new();
  if (domMainRows.length) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(domMainRows, { header: domHeaders }), "DOM全量扫描");
  }
  const issueHeaders = domMainRows.length
    ? domHeaders
    : [
        "序号",
        "页面名称",
        "元素标识",
        "检查类别",
        "关键属性",
        "期望值",
        "实际值",
        "是否符合",
        "不符合类型",
        "说明",
      ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(issueRows, { header: issueHeaders }), "问题明细");
  XLSX.writeFile(wb, path.join(outDir, "verification_key_styles.xlsx"));

  await writeJson(path.join(outDir, "verification_manifest.json"), {
    inputPath,
    pageUrl: input.render.pageUrl,
    effectivePageUrl,
    navigationMode,
    renderScopeKind,
    viewport: input.render.viewport,
    renderMode,
    renderWarning,
    browserPath: executablePath,
    domScan: domScanMeta,
    scores,
    reportScores,
    runChecksum: run.checksum,
  });

  console.log(`[page-verify] score=${scores.finalScore}`);
  if (domSummary) {
    console.log(
      `[page-verify] domScan elements=${domSummary.elementCount} checks=${domSummary.totalChecks} fail=${domSummary.fail}`,
    );
  }
  console.log(`[page-verify] out=${outDir}`);
}

main().catch((error) => {
  console.error(`[page-verify] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
