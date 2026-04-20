# Page Generation

Use this reference when a shadcn task creates or modifies a page, route, screen, dashboard, settings page, landing page, block, template, or Figma-to-page UI.

## Goal

Do not jump directly from a prompt to TSX. Page generation should flow through:

```text
request / Figma
-> project context
-> route matching
-> layout resolution
-> source grounding
-> generation
-> validation
-> generation log
```

The output should be grounded in the local project: existing components, blocks, stories, CSS, tokens, and aliases.

## Modes

### Resource-Aware Project

Use this mode when `.resources/config.json` exists.

1. Read `components.json` for aliases, Tailwind setup, style, icon library, and project conventions.
2. Read package scripts and locate app/routes/pages, component directories, block directories, global CSS, and token files.
3. Read `.resources/config.json` to find `active`, `resources[active].path`, and `resources[active].projectRoot`.
4. Read `.resources/{active}/route-index.md` and match the user request to `page_type`.
5. Read `.resources/{active}/layout/{page_type}.md`.
6. Extract `reference_blocks`, `needed_components`, `layout_skeleton`, `composition_mapping`, and `generation_constraints`.
7. Read `.resources/{active}/blocks.json` and find source files/stories for every reference block.
8. Read `.resources/{active}/components.json` and find source files/stories for every needed component.
9. Read the referenced TSX/stories plus relevant global CSS and token files.
10. Generate the page using project aliases and existing APIs.
11. Validate the generated page or render preview.
12. Write a generation log beside the generated render source.
13. Report grounding.

### Plain shadcn Project

Use this fallback when `.resources/config.json` is missing.

1. Read `components.json`, package scripts, routes/pages, existing components, blocks, and global CSS.
2. Infer a temporary `page_type` from the request, such as `settings`, `dashboard`, `landing`, `profile`, `auth`, `detail`, `list`, or `form`.
3. Build a short layout plan before coding:
   - page intent
   - target route or output file
   - layout skeleton
   - existing components to reuse
   - missing components or registry items
   - validation commands
4. Use shadcn docs/search/add only for missing components that the plan requires.
5. Generate using existing project conventions.
6. Validate the generated page or render preview.
7. Write a generation log beside the generated render source.
8. Report that no `.resources` contract was present and list the assumptions used.

If the user asks to make the project resource-aware, scaffold `.resources/config.json`, `.resources/{system}/route-index.md`, `.resources/{system}/layout/index.md`, `.resources/{system}/blocks.json`, and `.resources/{system}/components.json`.

## Route Matching

For resource-aware projects, `route-index.md` is the source for mapping request intent to `page_type`.

Good route matching records:

```text
matched page_type:
matched route rule:
candidate layouts:
fallback used: yes/no
reason:
```

If multiple page types match, choose the one with the strongest content and layout overlap. Use fallback only when the request is genuinely ambiguous.

## Layout Resolution

Read exactly the matched layout file, usually `.resources/{active}/layout/{page_type}.md`.

Extract:

- `hit_rules`
- `exclusion_rules`
- `reference_blocks`
- `layout_skeleton`
- `needed_components`
- `composition_mapping`
- `generation_constraints`

The layout file decides page structure and reference sources. It does not replace component APIs.

## Source Grounding

Ground generation in source files:

- Reference blocks: TSX and stories from `blocks.json`.
- Needed components: TSX and stories from `components.json`.
- Styling: global CSS, token CSS, Tailwind config or Tailwind v4 theme blocks.
- Imports: aliases from project `components.json`.

Read component markdown only when source and stories do not explain the needed behavior, state, size, interaction, or accessibility contract.

### Reference Boundary

When reasoning about page templates or choosing visual references, do **not** use historical generated pages from render output directories as template references.

Disallowed as reference/template sources:

```text
src/render/**
**/src/render/**
harmony-ui-playground/src/render/**
```

Allowed source grounding:

- `.resources/{active}/layout/**`
- `.resources/{active}/blocks.json` entries that point to stable source blocks, such as `src/blocks/**`
- `.resources/{active}/components.json` entries that point to stable components, such as `src/component/**` or `src/components/**`
- Global CSS, token files, assets, and component stories that belong to blocks/components

Rules:

- `src/render/**` is generated output, not a reusable page-template source.
- Do not infer spacing, component choice, visual quality, or information hierarchy from older `src/render/**` versions.
- If `.resources/{active}/blocks.json`, a layout file, or a template index points a `reference_block` to `src/render/**`, treat that entry as invalid for source grounding and prefer stable `src/blocks/**` or component sources instead.
- Reading `src/render/**` is allowed only when the user explicitly asks to modify, inspect, compare, or continue that specific generated render page. Even then, do not generalize it as a template for new pages.

## Generation Rules

- Reuse existing components and blocks first.
- Follow `layout_skeleton` and `composition_mapping`.
- Use project aliases from `components.json`.
- Use semantic tokens and existing CSS conventions.
- Keep generated files in the project's established route/block/component structure.
- Preserve original shadcn composition, forms, styling, and icon rules.

## Generation Log

Whenever a page is generated into a render preview folder, write a log file in the same folder as the generated source.

Default naming:

```text
src/render/{page-name}/index.tsx
src/render/{page-name}/index.stories.tsx
src/render/{page-name}/index.log.md
```

If the generated entry file is not `index.tsx`, name the log after the entry file, for example `page.log.md` beside `page.tsx`.

The log must record:

- Original user input or a concise quoted summary.
- Matched `page_type`, route/story id, layout file, output directory, and preview URL when available.
- Reference blocks/templates considered, with an explicit note that historical `src/render/**` pages were not used as templates.
- Components, assets, tokens, and icons used.
- Generated files.
- Validation commands and results.
- Any known limitations, environment issues, or skipped checks.

## Validation

Prefer the project's own scripts. Common checks:

```bash
node scripts/validate_design_system_resources.mjs
npm run build
npm run build-storybook
```

Use the package manager from the project when available. If a command is absent or fails for environment reasons, state that clearly and include the next useful check.

## Required Report

When finishing a page generation task, report:

```text
matched page_type:
layout file:
reference_blocks:
needed_components:
source files read:
generated files:
generation log:
validation:
```
