# Display Brightness Settings V6

## Iteration Prompt

- 将显示模式的深色、浅色模式可视化展示出来。
- 调整一下视觉重心的展示方式。

## Change Intent

- Preserve the `display-brightness-settings-v5` baseline as the closer-to-Pixso version.
- Create a new `v6` render variation that shifts the visual center upward.
- Replace the original text-first display-mode row with a visual two-mode preview hero.

## Design Changes

- Added a top hero card for `显示模式` with two side-by-side preview tiles.
- Reused real local preview assets:
  - `src/blocks/assets/pixso-icons/icon-setting-light.png`
  - `src/blocks/assets/pixso-icons/icon-setting-dark.png`
- Elevated the selected mode with blue focus ring, lift, and stronger shadow.
- Moved the mode state from a small inline suffix to the primary visual block.
- Kept brightness and secondary settings as flatter support cards so the hierarchy is clearer.

## Output Files

- `harmony-ui-playground/src/render/display-brightness-settings-v6/index.tsx`
- `harmony-ui-playground/src/render/display-brightness-settings-v6/index.css`
- `harmony-ui-playground/src/render/display-brightness-settings-v6/index.stories.tsx`
- `harmony-ui-playground/src/render/display-brightness-settings-v6/index.log.md`

## Validation

- `npm run build` in `harmony-ui-playground`: passed
- `npm run build-storybook` in `harmony-ui-playground`: passed

## Visual Check

- Storybook static build served successfully and the new story assets resolved correctly.
- Automated CLI screenshot still captured Storybook's loading spinner before the story finished painting, so no final pixel screenshot was archived from this run.
