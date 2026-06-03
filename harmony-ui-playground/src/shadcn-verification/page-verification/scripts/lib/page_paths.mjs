import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
/** harmony-ui-playground/src/shadcn-verification */
export const VERIFICATION_ROOT = path.resolve(SCRIPT_DIR, "../../..");
export const OUTPUT_ROOT = path.join(VERIFICATION_ROOT, "output");

export function normalizePageDirName(pageName) {
  return String(pageName ?? "")
    .replace(/([a-z0-9])([A-Z])/g, "$1$2")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}

export function pageOutputDir(pageName) {
  return path.join(OUTPUT_ROOT, normalizePageDirName(pageName));
}

export function pageOutputFile(pageName, fileName) {
  return path.join(pageOutputDir(pageName), fileName);
}
