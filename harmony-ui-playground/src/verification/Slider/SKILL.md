# Slider Design Verification

Use this verification artifact when checking `src/component/Slider` against the exported design DSL in `Slider.json`.

## Inputs

- Design export: `Slider.json`
- Scoring rubric: `src/verification/reference.md`
- Component stories: `Components/Slider` in Storybook

## One Command

```bash
CHROME_BIN=/usr/bin/google-chrome node src/verification/Slider/verify-slider.mjs
```

## Outputs

- `design-extracted.json`: extracted design tokens, sizes, states, typography, and resource expectations
- `actual-styles.json`: computed styles collected from Storybook
- `style-diff.json`: weighted style/resource/variant comparison
- `screenshots/*.png`: design reference and Storybook screenshots
- `report.md`: score, findings, screenshots, and repair suggestions

If Playwright-managed Chromium is installed, `CHROME_BIN` can be omitted. If it is not installed and network is available, run `npx playwright install chromium`.
