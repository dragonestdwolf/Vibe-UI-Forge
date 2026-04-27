# Resource Contract

Use this reference when a project has `.resources/config.json`, when creating a resource-aware shadcn project, or when maintaining page generation indexes.

## Directory Structure

```text
.resources/
├── config.json
└── {designSystem}/
    ├── route-index.md
    ├── blocks.json
    ├── components.json
    ├── assets.json
    ├── layout/
    │   ├── index.md
    │   └── {page_type}.md
    └── component/
        └── {component_id}.md
```

`{designSystem}` is not fixed. Examples include `harmony`, `default`, or a product design system name.

## config.json

`config.json` selects the active design system resource set.

```json
{
  "active": "default",
  "resources": {
    "default": {
      "path": ".resources/default",
      "projectRoot": "."
    }
  }
}
```

- `active`: resource key to use by default.
- `resources[active].path`: resource directory containing route, layout, block, and component indexes.
- `resources[active].path`: resource directory containing route, layout, block, component, and asset indexes.
- `resources[active].projectRoot`: project root for generated code and source grounding.

## Markdown Read Policy

| File | Default read? | Purpose |
| --- | --- | --- |
| `route-index.md` | yes | Map prompt/Figma intent to `page_type`. |
| `layout/{page_type}.md` | yes | Define layout skeleton, reference blocks, needed components, and constraints. |
| `assets.json` | yes, when present | Map asset ids to stable local image or media files for source grounding. |
| `component/{component_id}.md` | no | Human-readable component semantics; read only when TSX/stories are insufficient. |
| `history/spec/**` | no | Historical audit/reference material, not default generation input. |

TSX, stories, CSS, and tokens remain the true source for generated code.

## route-index.md

`route-index.md` maps user intent to layout files.

Recommended shape:

```markdown
# Route Index

| page_type | layout | hit_rules | exclusion_rules |
| --- | --- | --- | --- |
| settings | layout/settings.md | settings / preferences / account controls | analytics / chart |
| dashboard | layout/dashboard.md | dashboard / metrics / overview | settings form |

## Fallback

Use `settings` when the page type is unclear.
```

Each page type should point to one layout markdown file.

## layout/{page_type}.md

Each layout markdown should include:

````markdown
# settings

## hit_rules
- Settings, preferences, account controls.

## exclusion_rules
- Data-heavy analytics dashboards.

## reference_blocks
- account-settings
- notification-settings

## related_assets
- account-hero-light
- account-hero-dark

## layout_skeleton
```html
<main>
  <header data-slot="title" />
  <section data-slot="content" />
</main>
```

## needed_components
- button
- switch
- card

## composition_mapping
- boolean setting -> Switch
- grouped settings -> Card

## generation_constraints
- Reuse reference block spacing and hierarchy.
- Component APIs must come from TSX source.
````

`reference_blocks` must exist in `blocks.json`. `needed_components` must exist in `components.json` or be installable/creatable through the shadcn workflow.
When `related_assets` or `asset_mapping` is present, those asset ids must exist in `assets.json`.

## blocks.json

`blocks.json` is the agent page generation index. It does not need to be a valid shadcn CLI registry.

`blocks.json` must point to stable source blocks, not historical generated render pages. Do not register `src/render/**` files as `reference_blocks`; render directories are output artifacts and may contain experimental or low-quality generations that should not influence future template reasoning.

Recommended shape:

```json
{
  "name": "default",
  "sourceRoot": "src",
  "blocks": [
    {
      "id": "account-settings",
      "pageType": "settings",
      "description": "Settings page with grouped account controls.",
      "files": ["src/blocks/account-settings.tsx"],
      "stories": ["src/blocks/account-settings.stories.tsx"],
      "dependencies": ["button", "switch", "card"],
      "assets": ["account-hero-light", "account-hero-dark"],
      "tags": ["settings", "form"]
    }
  ]
}
```

Required fields:

- `id`
- `files`
- `dependencies`

Recommended fields:

- `pageType`
- `description`
- `stories`
- `assets`
- `tags`

Forbidden reference paths:

```text
src/render/**
**/src/render/**
```

If a legacy resource index already contains one of these paths, treat that block as invalid for new page grounding. Replace it with a stable block under `src/blocks/**` or a documented component/template source before using it as a reference.

## components.json Resource Index

`.resources/{system}/components.json` maps component ids to local source. It is separate from the shadcn project `components.json`.

Recommended shape:

```json
{
  "components": [
    {
      "id": "switch",
      "name": "Switch",
      "path": "src/components/ui/switch.tsx",
      "export": "Switch",
      "stories": "src/components/ui/switch.stories.tsx",
      "spec": ".resources/default/component/switch.md"
    }
  ]
}
```

Required fields:

- `id`
- `path`
- `export`

Recommended fields:

- `name`
- `stories`
- `spec`

## assets.json Resource Index

`.resources/{system}/assets.json` maps asset ids to stable local files that page generation can reuse as visual truth.

Recommended shape:

```json
{
  "assets": [
    {
      "id": "phone-preview-light",
      "name": "Phone Preview Light",
      "description": "Light mode phone preview thumbnail",
      "type": "image",
      "path": "src/blocks/assets/pixso-icons/icon-setting-light.png",
      "usage": "display mode preview"
    }
  ]
}
```

Required fields:

- `id`
- `type`
- `path`

Recommended fields:

- `name`
- `description`
- `usage`
- `ossUrl`

## Registry Boundary

Keep these roles separate:

- Project `components.json`: shadcn config for aliases, style, Tailwind, registries, and resolved paths.
- shadcn registry: CLI-installable registry items that follow shadcn schema.
- `.resources/{system}/blocks.json`: agent page generation index for local blocks and examples.
- `.resources/{system}/components.json`: agent component source index.
- `.resources/{system}/assets.json`: agent visual asset source index for local images and media.

Do not assume `.resources/{system}/blocks.json` can be passed to the shadcn CLI. If CLI compatibility is needed, generate a separate shadcn-compatible registry from the resource index.

## Maintenance Checklist

When adding a layout:

1. Add `.resources/{system}/layout/{page_type}.md`.
2. Register it in `.resources/{system}/layout/index.md` when that index exists.
3. Add route rules to `.resources/{system}/route-index.md`.
4. Ensure every `reference_blocks` id exists in `blocks.json`.
5. Ensure every `needed_components` id exists in `.resources/{system}/components.json`.
6. Ensure no `reference_blocks` resolve to `src/render/**`.
7. Ensure every `related_assets` / `asset_mapping` id exists in `.resources/{system}/assets.json` when those sections are present.

When adding a block:

1. Add or update the source TSX and stories.
2. Register the block in `.resources/{system}/blocks.json`.
3. Ensure every dependency exists in `.resources/{system}/components.json`.
4. Do not register generated render previews from `src/render/**` as blocks.
5. Register any reusable visual assets in `.resources/{system}/assets.json` and reference them by id from the block or matched layout.

When adding a component:

1. Add or update source and exports.
2. Register the component in `.resources/{system}/components.json`.
3. Add component markdown only when human-readable semantics are needed.

When adding a reusable visual asset:

1. Add or update the stable local file under the project root.
2. Register it in `.resources/{system}/assets.json`.
3. Reference it from the matched layout via `related_assets` / `asset_mapping` or from a block entry via `assets`.
