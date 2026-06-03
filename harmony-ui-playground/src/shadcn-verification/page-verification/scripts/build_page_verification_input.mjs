#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseArgs,
  readJson,
  requireArg,
  sha256,
  fileSha256,
  writeJson,
} from "../../component-verification/scripts/lib/stable.mjs";
import { pageOutputDir } from "./lib/page_paths.mjs";
import { materializeStyleChecks } from "./lib/page_checks.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.join(SCRIPT_DIR, "../templates/page_element_registry.example.json");

function normalizeRegistry(registry) {
  if (!registry.pageName) throw new Error("page_element_registry.json 缺少 pageName");
  if (!registry.render?.pageUrl) throw new Error("page_element_registry.json 缺少 render.pageUrl");
  return registry;
}

function buildCustomElements(registry) {
  return (registry.customElements ?? []).map((element) => ({
    elementId: element.elementId,
    name: element.name ?? element.elementId,
    selector: element.selector,
    excluded: Boolean(element.excluded),
    excludeReason: element.excludeReason ?? "",
    styleChecks: element.excluded
      ? []
      : materializeStyleChecks(
          element.styleChecks ??
            (element.stylePreset ? [element.stylePreset] : ["BASIC_STYLE"]),
        ),
    resources: (element.resources ?? []).map((resource) => ({
      resourceId: resource.resourceId ?? `${element.elementId}-resource`,
      selector: resource.selector,
      resourceType: resource.resourceType ?? "icon",
      expectedIcon: resource.expectedIcon ?? "",
      note: resource.note ?? "",
    })),
    layoutChecks: (element.layoutChecks ?? []).map((layout) => ({
      layoutId: layout.layoutId ?? `${element.elementId}-layout`,
      selector: layout.selector ?? element.selector,
      checkType: layout.checkType ?? "align",
      expected: layout.expected ?? { ok: true },
      failType: layout.failType ?? "alignDeduct",
      note: layout.note ?? "",
    })),
  }));
}

async function initTemplate() {
  const args = parseArgs(process.argv.slice(2));
  const pageName = requireArg(args, "page");
  const outPath = path.resolve(args.out ?? pageOutputDir(pageName), "page_element_registry.json");
  const template = await readJson(TEMPLATE_PATH);
  await writeJson(outPath, { ...template, pageName });
  console.log(`[page-input] created registry template: ${outPath}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const registryPath = path.resolve(requireArg(args, "registry"));
  const registry = normalizeRegistry(await readJson(registryPath));
  const outDir = path.resolve(args.out ?? pageOutputDir(registry.pageName));
  await fs.mkdir(outDir, { recursive: true });

  const registryChecksum = await fileSha256(registryPath);
  const input = {
    version: 1,
    pageName: registry.pageName,
    comparisonMode: "spec-only",
    render: {
      pageUrl: registry.render.pageUrl,
      viewport: registry.render.viewport ?? { width: 1440, height: 900 },
      deviceScaleFactor: registry.render.deviceScaleFactor ?? 1,
      waitUntil: registry.render.waitUntil ?? "load",
      waitMs: registry.render.waitMs ?? 1500,
      contentRootSelector: registry.render.contentRootSelector ?? "",
      useStorybookIframe: registry.render.useStorybookIframe !== false,
      useStorybookFrame: Boolean(registry.render.useStorybookFrame),
    },
    layout: {
      gridChecks: registry.layout?.gridChecks ?? [],
      backgroundChecks: registry.layout?.backgroundChecks ?? [],
    },
    presetComponents: (registry.presetComponents ?? []).map((item) => ({
      componentId: item.componentId,
      name: item.name ?? item.componentId,
      invoked: Boolean(item.invoked),
      evidence: item.evidence ?? "",
      note: item.note ?? "",
    })),
    customElements: buildCustomElements(registry),
    domScan: {
      enabled: registry.domScan?.enabled !== false,
      maxElements: Number(registry.domScan?.maxElements ?? 800),
      rootSelector: registry.domScan?.rootSelector ?? "body",
      skipTags: registry.domScan?.skipTags,
    },
    source: {
      registryPath,
      registryChecksum,
    },
  };

  const styleCheckCount = input.customElements.reduce((sum, el) => sum + el.styleChecks.length, 0);
  const resourceCount = input.customElements.reduce((sum, el) => sum + el.resources.length, 0);
  const layoutCheckCount =
    input.layout.gridChecks.length +
    input.layout.backgroundChecks.length +
    input.customElements.reduce((sum, el) => sum + el.layoutChecks.length, 0);

  input.coverage = {
    presetComponentCount: input.presetComponents.length,
    customElementCount: input.customElements.length,
    styleCheckCount,
    resourceCount,
    layoutCheckCount,
    domScanEnabled: input.domScan.enabled,
    domScanMaxElements: input.domScan.maxElements,
  };
  input.checksum = sha256(input);

  const outPath = path.join(outDir, "page_verification_input.json");
  await writeJson(outPath, input);
  console.log(`[page-input] page=${input.pageName}`);
  console.log(`[page-input] checksum=${input.checksum}`);
  console.log(`[page-input] styleChecks=${styleCheckCount} resources=${resourceCount} layout=${layoutCheckCount}`);
  console.log(`[page-input] out=${outPath}`);
}

const runner = process.argv.includes("--init-registry") ? initTemplate : main;
runner().catch((error) => {
  console.error(`[page-input] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
