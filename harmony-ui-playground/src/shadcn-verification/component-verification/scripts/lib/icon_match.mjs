import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

function normalizeSvgMarkup(markup) {
  return String(markup ?? "")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim()
    .toLowerCase();
}

function fingerprint(markup) {
  return crypto.createHash("sha256").update(normalizeSvgMarkup(markup)).digest("hex");
}

async function walkSvgFiles(dir, baseDir, entries = []) {
  const names = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of names) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkSvgFiles(fullPath, baseDir, entries);
      continue;
    }
    if (!entry.name.endsWith(".svg")) continue;
    const relativePath = path.relative(baseDir, fullPath);
    const content = await fs.readFile(fullPath, "utf8");
    entries.push({
      basename: entry.name,
      relativePath,
      fingerprint: fingerprint(content),
      content,
    });
  }
  return entries;
}

export async function buildIconIndex(iconRootDir) {
  const files = await walkSvgFiles(iconRootDir, iconRootDir);
  const byFingerprint = new Map();
  for (const file of files) {
    if (!byFingerprint.has(file.fingerprint)) {
      byFingerprint.set(file.fingerprint, file);
    }
  }
  return { files, byFingerprint };
}

export function matchIcon(outerHTML, _resource, iconIndex) {
  const fp = fingerprint(outerHTML);
  const hit = iconIndex.byFingerprint.get(fp);
  if (hit) {
    return { hit, tier: "strict-content" };
  }
  const normalized = normalizeSvgMarkup(outerHTML);
  for (const file of iconIndex.files) {
    if (normalizeSvgMarkup(file.content) === normalized) {
      return { hit: file, tier: "normalized-content" };
    }
  }
  return { hit: null, tier: null, note: "SVG 指纹未命中 references/icon" };
}
