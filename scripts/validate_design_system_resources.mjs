#!/usr/bin/env node

/**
 * Design System Skill v1.0 - Resource Consistency Validator
 *
 * Validates that:
 * 1. blocks.json files/stories paths exist
 * 2. components.json path/stories paths exist
 * 3. layout reference_blocks reference existing blocks
 * 4. layout needed_components reference existing components
 * 5. block dependencies reference existing components
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PROJECT_ROOT = join(ROOT, 'harmony-ui-playground');

let exitCode = 0;
const errors = [];

function logError(msg) {
  errors.push(msg);
  console.error(`✗ ${msg}`);
  exitCode = 1;
}

function logSuccess(msg) {
  console.log(`✓ ${msg}`);
}

function loadJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (e) {
    logError(`Failed to parse JSON: ${filePath}`);
    return null;
  }
}

function checkPath(relativePath, projectRoot = PROJECT_ROOT) {
  return existsSync(join(projectRoot, relativePath));
}

// Load configs
const configPath = join(ROOT, '.resources', 'config.json');
const config = loadJson(configPath);
if (!config) process.exit(1);

const resourcePath = join(ROOT, config.resources[config.active].path);
const projectRoot = join(ROOT, config.resources[config.active].projectRoot);

console.log(`\n=== Design System Resource Validation ===`);
console.log(`Active resource: ${config.active}`);
console.log(`Resource path: ${resourcePath}`);
console.log(`Project root: ${projectRoot}\n`);

// Load blocks.json
const blocksPath = join(resourcePath, 'blocks.json');
const blocksData = loadJson(blocksPath);
if (!blocksData) process.exit(1);

// Load components.json
const componentsPath = join(resourcePath, 'components.json');
const componentsData = loadJson(componentsPath);
if (!componentsData) process.exit(1);

// Build lookup sets
const blockIds = new Set(blocksData.blocks.map(b => b.id));
const componentIds = new Set(componentsData.components.map(c => c.id));

// ============================================
// 1. Validate blocks.json files and stories
// ============================================
console.log('--- Validating blocks.json ---');

for (const block of blocksData.blocks) {
  // Check files (files is an array of strings like ["src/blocks/water-settings.tsx"])
  for (const file of block.files || []) {
    if (!checkPath(file)) {
      logError(`blocks.json > ${block.id} > files: "${file}" does not exist`);
    } else {
      logSuccess(`blocks.json > ${block.id} > files: "${file}" exists`);
    }
  }

  // Check stories (stories is an array of strings)
  if (!block.stories || block.stories.length === 0) {
    console.log(`⚠ blocks.json > ${block.id} > stories: empty (${block.stories?.reason || 'no reason provided'})`);
  } else {
    for (const story of block.stories || []) {
      if (!checkPath(story)) {
        logError(`blocks.json > ${block.id} > stories: "${story}" does not exist`);
      } else {
        logSuccess(`blocks.json > ${block.id} > stories: "${story}" exists`);
      }
    }
  }

  // Check dependencies
  for (const dep of block.dependencies || []) {
    if (!componentIds.has(dep)) {
      logError(`blocks.json > ${block.id} > dependencies: "${dep}" not found in components.json`);
    }
  }
}

// ============================================
// 2. Validate components.json paths and stories
// ============================================
console.log('\n--- Validating components.json ---');

for (const comp of componentsData.components) {
  // Check path directory exists
  const compPath = join(projectRoot, comp.path);
  if (!existsSync(compPath)) {
    logError(`components.json > ${comp.id} > path: "${comp.path}" does not exist`);
  } else {
    logSuccess(`components.json > ${comp.id} > path: "${comp.path}" exists`);
  }

  // Check stories
  if (comp.stories) {
    if (!checkPath(comp.stories)) {
      logError(`components.json > ${comp.id} > stories: "${comp.stories}" does not exist`);
    } else {
      logSuccess(`components.json > ${comp.id} > stories: "${comp.stories}" exists`);
    }
  }
}

// ============================================
// 3. Validate layout markdown reference_blocks and needed_components
// ============================================
console.log('\n--- Validating layout markdown files ---');

const layoutDir = join(resourcePath, 'layout');
const layoutFiles = [
  'mobile-settings.md',
  'health-dashboard.md',
  'mobile-sheet.md'
];

for (const layoutFile of layoutFiles) {
  const layoutPath = join(layoutDir, layoutFile);
  if (!existsSync(layoutPath)) {
    logError(`layout > ${layoutFile}: file does not exist`);
    continue;
  }

  console.log(`\nValidating: ${layoutFile}`);
  const content = readFileSync(layoutPath, 'utf-8');

  // Extract reference_blocks
  const refBlocksMatch = content.match(/## reference_blocks\n\n([\s\S]*?)(?=\n## |\n---|$)/);
  if (refBlocksMatch) {
    const refs = refBlocksMatch[1]
      .split('\n')
      .filter(line => line.trim().startsWith('- `'))
      .map(line => line.match(/- `([^`]+)`/)?.[1])
      .filter(Boolean);

    for (const ref of refs) {
      if (!blockIds.has(ref)) {
        logError(`layout > ${layoutFile} > reference_blocks: "${ref}" not found in blocks.json`);
      } else {
        logSuccess(`layout > ${layoutFile} > reference_blocks: "${ref}" exists in blocks.json`);
      }
    }
  }

  // Extract needed_components
  const neededMatch = content.match(/## needed_components\n\n([\s\S]*?)(?=\n## |\n---|$)/);
  if (neededMatch) {
    const needed = neededMatch[1]
      .split('\n')
      .filter(line => line.trim().startsWith('- `'))
      .map(line => line.match(/- `([^`]+)`/)?.[1])
      .filter(Boolean);

    for (const comp of needed) {
      if (!componentIds.has(comp)) {
        logError(`layout > ${layoutFile} > needed_components: "${comp}" not found in components.json`);
      } else {
        logSuccess(`layout > ${layoutFile} > needed_components: "${comp}" exists in components.json`);
      }
    }
  }
}

// ============================================
// Summary
// ============================================
console.log('\n=== Validation Summary ===');
if (exitCode === 0) {
  console.log('✓ All validations passed');
} else {
  console.log(`✗ ${errors.length} error(s) found`);
  console.log('\nErrors:');
  errors.forEach(e => console.log(`  - ${e}`));
}

process.exit(exitCode);
