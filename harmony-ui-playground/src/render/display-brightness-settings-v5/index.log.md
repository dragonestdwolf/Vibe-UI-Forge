# Display Brightness Settings V5

## Request

- Pixso URL: `https://pixso.cn/app/design/cM1n2Uqc5JracmWLuyGnOQ?item-id=16:2184`
- Item ID: `16:2184`
- Output target: `harmony-ui-playground/src/render/display-brightness-settings-v5`

## Skill / Grounding

- Applied skill: `.agent/skills/shadcn/SKILL.md`
- Applied workflow: `.cursor/skills/pixso-to-shadcn-react/SKILL.md`
- Resource config: `.resources/config.json`
- Active resource: `harmony`
- Matched page type: `settings-context-list`
- Layout files read:
  - `.resources/harmony/route-index.md`
  - `.resources/harmony/layout/mobile-settings.md`
  - `.resources/harmony/layout/settings-page.md`
- Grounding source files read:
  - `harmony-ui-playground/src/pages/settings-page.tsx`
  - `harmony-ui-playground/src/component/StatusBar/StatusBar.tsx`
  - `harmony-ui-playground/src/component/TitleBar/title-bar.tsx`
  - `harmony-ui-playground/src/component/List/List.tsx`
  - `harmony-ui-playground/src/component/List/ListItem.tsx`
  - `harmony-ui-playground/src/component/Switch/Switch.tsx`
  - `harmony-ui-playground/src/component/Slider/Slider.tsx`

## Pixso MCP Calls

- `getNodeDSL(16:2184)`
- `getImage(16:2184)`
- `getNodeDSL(16:2197)`
- `getImage(16:2197)`
- `getNodeDSL(16:2189)`
- `getImage(16:2189)`
- `getImage(16:2192)`
- `getImage(16:2194)`

## Key Specs Extracted

- Canvas: `360 x 800`, background `#F2F3F5`
- Status bar time: `08:08`
- Title: `显示和亮度`
- Content width: `328px`
- Card radius: `20px`
- Card stack gap: `16px`
- Top card: `328 x 96`
- Brightness card: `328 x 100`
- Single-row cards: `328 x 56`
- Row height: `40px`
- Primary label: `16px / 500 / line-height 16px`
- Right value: `14px / 400 / line-height 14px`
- Accent color: `#0A59F7`
- Divider: `1px`, semi-transparent black

## Implementation Notes

- Reused `StatusBar`, `TitleBar`, `List`, `ListItem`, `Switch`, `Slider`.
- Overrode `ListItem` rhythm locally in page CSS to match Pixso `40px` rows and `296px` divider width.
- Kept brightness area as a dedicated card because the Pixso DSL mixes slider row and switch row in a `100px` card.
- Recreated the top-right display mode pill as local markup because the shipped `Switch` component does not support an inner symbol knob.

## Output Files

- `harmony-ui-playground/src/render/display-brightness-settings-v5/index.tsx`
- `harmony-ui-playground/src/render/display-brightness-settings-v5/index.css`
- `harmony-ui-playground/src/render/display-brightness-settings-v5/index.stories.tsx`
- `harmony-ui-playground/src/render/display-brightness-settings-v5/index.log.md`

## Validation

- `npm run build` in `harmony-ui-playground`: passed
- `npm run build-storybook` in `harmony-ui-playground`: passed
- `node scripts/validate_design_system_resources.mjs`: failed on a pre-existing resource issue
  - `.resources/harmony/layout/mobile-settings.md` references `hero-card`
  - `.resources/harmony/components.json` does not contain `hero-card`

## Visual Verification

- Manual Pixso truth images were used for layout and spacing checks during implementation.
- Storybook static assets for this story loaded successfully on a local HTTP server.
- Automated Storybook screenshot / SSIM verification was not completed.
  - `npx playwright screenshot` captured too early and returned a loading state.
  - `capture_storybook.js` failed in this environment because Playwright headless Chromium hit a macOS permission error (`bootstrap_check_in ... Permission denied (1100)`).

## Result

- Delivered a new render page that matches the provided Pixso node as a single-screen Harmony-style settings page, with reusable list rows plus a dedicated brightness control card.
