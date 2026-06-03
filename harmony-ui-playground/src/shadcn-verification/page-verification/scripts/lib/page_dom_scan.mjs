import { materializeStyleChecks } from "./page_checks.mjs";
import { actualValueForCheck, evaluateActualAgainstSpec } from "./page_spec_match.mjs";
import { isDomCheckCollectible } from "./page_property_applicable.mjs";

/** Full-page DOM scan: all six CSS categories from PAGE_STYLE_PRESETS. */
export const DOM_SCAN_PRESET = "DOM_FULL_STYLE";

const DOM_SCAN_CHECK_IDS = [
  "颜色.fillColor",
  "颜色.textColor",
  "描边.strokeColor",
  "描边.strokeColor.right",
  "描边.strokeColor.bottom",
  "描边.strokeColor.left",
  "描边.strokeWidth",
  "描边.strokeWidth.right",
  "描边.strokeWidth.bottom",
  "描边.strokeWidth.left",
  "圆角.cornerRadius",
  "圆角.topLeft",
  "圆角.topRight",
  "圆角.bottomRight",
  "圆角.bottomLeft",
  "文本.fontFamily",
  "文本.fontSize",
  "文本.fontWeight",
  "文本.lineHeight",
  "阴影.color",
  "阴影.offsetX",
  "阴影.offsetY",
  "阴影.blur",
  "阴影.spread",
  "间距.paddingTop",
  "间距.paddingRight",
  "间距.paddingBottom",
  "间距.paddingLeft",
  "间距.gap",
  "间距.rowGap",
];

export const DEFAULT_DOM_SCAN_CONFIG = {
  enabled: true,
  maxElements: 800,
  rootSelector: "body",
  skipTags: ["script", "style", "noscript", "template", "head", "meta", "link"],
};

export function resolveDomScanConfig(input) {
  const raw = input.domScan ?? {};
  return {
    enabled: raw.enabled !== false,
    maxElements: Number(raw.maxElements ?? DEFAULT_DOM_SCAN_CONFIG.maxElements),
    rootSelector: raw.rootSelector ?? DEFAULT_DOM_SCAN_CONFIG.rootSelector,
    skipTags: raw.skipTags ?? DEFAULT_DOM_SCAN_CONFIG.skipTags,
  };
}

export function getDomScanChecks() {
  return materializeStyleChecks(DOM_SCAN_CHECK_IDS);
}

/**
 * Self-contained browser function (no outer closures — safe for page.evaluate).
 */
export function domScanBrowserScript() {
  return function runDomScan(options) {
    function escapeCssIdent(value) {
      if (typeof CSS !== "undefined" && CSS.escape) return CSS.escape(value);
      return String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
    }

    function isVisible(el) {
      const rect = el.getBoundingClientRect();
      if (rect.width < 0.5 || rect.height < 0.5) return false;
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") return false;
      if (Number(style.opacity) === 0) return false;
      return true;
    }

    function buildSelector(el) {
      if (el.id) return `#${escapeCssIdent(el.id)}`;
      const dataSlot = el.getAttribute("data-slot");
      if (dataSlot) {
        const tag = el.tagName.toLowerCase();
        return `${tag}[data-slot="${dataSlot}"]`;
      }
      const parts = [];
      let node = el;
      while (node && node.nodeType === 1 && node.tagName.toLowerCase() !== "html") {
        let part = node.tagName.toLowerCase();
        if (node.id) {
          parts.unshift(`#${escapeCssIdent(node.id)}`);
          break;
        }
        const parent = node.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter((child) => child.tagName === node.tagName);
          if (siblings.length > 1) {
            const index = siblings.indexOf(node) + 1;
            part += `:nth-of-type(${index})`;
          }
        }
        parts.unshift(part);
        node = parent;
      }
      return parts.join(" > ");
    }

    function elementLabel(el) {
      const tag = el.tagName.toLowerCase();
      const id = el.id ? `#${el.id}` : "";
      const cls =
        typeof el.className === "string" && el.className.trim()
          ? `.${el.className.trim().split(/\s+/).slice(0, 2).join(".")}`
          : "";
      const text = (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
      return `${tag}${id}${cls}${text ? ` "${text}"` : ""}`;
    }

    const { propertyKeys, maxElements, rootSelector, skipTags } = options;
    const skip = new Set((skipTags ?? []).map((tag) => String(tag).toLowerCase()));
    const root = document.querySelector(rootSelector ?? "body");
    if (!root) return { elements: [], truncated: false, scannedCount: 0 };

    document.querySelectorAll("[data-pv-scan-id]").forEach((el) => el.removeAttribute("data-pv-scan-id"));

    const candidates = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let node = walker.currentNode;
    while (node) {
      const tag = node.tagName?.toLowerCase?.() ?? "";
      if (!skip.has(tag) && isVisible(node)) candidates.push(node);
      node = walker.nextNode();
    }

    const truncated = candidates.length > maxElements;
    const selected = candidates.slice(0, maxElements);
    const elements = [];

    selected.forEach((el, index) => {
      const scanId = String(index + 1);
      el.setAttribute("data-pv-scan-id", scanId);
      const computed = getComputedStyle(el);
      const styles = {};
      for (const property of propertyKeys) {
        styles[property] = computed.getPropertyValue(property) || computed[property] || "";
      }
      elements.push({
        scanId,
        selector: `[data-pv-scan-id="${scanId}"]`,
        domSelector: buildSelector(el),
        label: elementLabel(el),
        tagName: el.tagName.toLowerCase(),
        rect: (() => {
          const r = el.getBoundingClientRect();
          return {
            x: r.x,
            y: r.y,
            width: r.width,
            height: r.height,
            top: r.top,
            left: r.left,
          };
        })(),
        styles,
      });
    });

    return {
      elements,
      truncated,
      scannedCount: selected.length,
      candidateCount: candidates.length,
    };
  };
}

export async function scanPageDom(scope, config) {
  const checks = getDomScanChecks();
  const propertyKeys = [...new Set(checks.map((check) => check.property))];
  const scanFn = domScanBrowserScript();
  const evaluate = scope.evaluate ?? ((fn, arg) => scope.page.evaluate(fn, arg));
  return evaluate(scanFn, {
    propertyKeys,
    maxElements: config.maxElements,
    rootSelector: config.rootSelector,
    skipTags: config.skipTags,
  });
}

export function rowsFromDomScan(scanResult, input, specs, gapAllowedValues, seqStart = 0) {
  const checks = getDomScanChecks();
  const rows = [];
  let seq = seqStart;

  for (const element of scanResult.elements ?? []) {
    for (const check of checks) {
      if (!isDomCheckCollectible(check, element.styles)) continue;

      seq += 1;
      const actual = actualValueForCheck(check, element.styles);
      const result = evaluateActualAgainstSpec(check, actual, specs, gapAllowedValues);
      if (result.status === "已排除") continue;

      rows.push({
        seq,
        pageName: input.pageName,
        elementId: `dom-${element.scanId}`,
        elementKind: "dom-scan",
        variantId: `dom-scan=${element.scanId}`,
        domSelector: element.domSelector,
        elementLabel: element.label,
        scanId: element.scanId,
        selector: element.selector,
        rect: element.rect,
        checkCategory: check.category,
        propertyKey: check.key,
        checkId: check.checkId,
        expectedValue: result.specReference ?? "../references",
        actualValue: result.actualValue,
        status: result.status,
        failType: result.failType,
        note: result.note ?? "",
      });
    }
  }

  return { rows, nextSeq: seq };
}

export async function clearDomScanMarkers(scope) {
  const evaluate = scope.evaluate ?? ((fn, arg) => scope.page.evaluate(fn, arg));
  await evaluate(() => {
    document.querySelectorAll("[data-pv-scan-id]").forEach((el) => el.removeAttribute("data-pv-scan-id"));
    document.querySelector("[data-verification-report-overlay='true']")?.remove();
  });
}
