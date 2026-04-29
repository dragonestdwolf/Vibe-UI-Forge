# Generation Log — display-and-brightness-settings-v2

## Prompt

> 参考这个低保真图片，帮我生成一个 harmony 设计语言的「显示和亮度」设置页。

- 输入：用户提供的低保真截图（不是 Figma URL，纯视觉参考）。
- 约束：`render/` 文件夹中都是历史渲染，禁止作为真值参考（沿用上一轮约束）。

## Resource Mode

- `.resources/config.json` 存在，active = `harmony`，projectRoot = `harmony-ui-playground`。

## Route Match

- `route-index.md` → 关键字「显示与亮度」 → `page_type = settings-context-list`。

## Layout

- Layout file: `.resources/harmony/layout/settings-context-list.md`
- Layout source: `harmony-ui-playground/src/layouts/SettingsContextListLayout/SettingsContextListLayout.tsx`
- 使用 slots：HeaderSlot（StatusBar + TitleBar，gap=0）+ ContextSlot（centered 328px）+ ListGroupSlot（gap=12，4 张 list-card）+ HomeIndicator。
- `background = "#F1F3F5"`（鸿蒙 `comp_background_gray`，light）。

## Lo-fi Reading → Composition Plan

| 低保真图区域 | 组件 / 块 | 备注 |
| --- | --- | --- |
| 顶部 08:08 + 信号/电量 | `StatusBar` | mode=light，time="08:08" |
| 「显示和亮度」标题 + 返回 | `TitleBar` | 标题居中（layout 标准），含返回箭头 |
| 「显示模式」段落标签 | `SubHeader leftMode="text" rightMode="none"` | 置于 ContextSlot 内，距下方卡片 8px |
| 浅色 / 深色 预览卡 | 自定义 `ModePreviewCard` | ContextSlot 内单卡：两个简化矩形 + 圆形 radio + label |
| 深色模式 / 定时开启 | `List + ListItem + 值/chevron` | List card 1 |
| 亮 — slider — 暗 + 自动调节 | `List` 内嵌 slider 行 + `ListItem + Switch` | List card 2（合并为同一卡，与 layout 允许的 list-card 内嵌 slider 一致） |
| 护眼模式 / 全天开启 | `List + ListItem + 值/chevron` | List card 3 |
| 字体大小和界面缩放 / > | `List + ListItem + chevron` | List card 4 |

## Reference Sources (consulted, not from `render/`)

- `src/blocks/grouped-list-section.tsx` + stories — list-card 圆角 / footnote 间距规范。
- `src/layouts/SettingsContextListLayout/SettingsContextListLayout.stories.tsx`（DisplayBrightness story）— Slider 嵌入 list 卡片的写法。
- 未读取 `src/render/**` 任何文件作为模板/参考（沿用用户指令）。

## Assets Used (from .resources/harmony/assets.json)

| Asset id | Path | Used For |
| --- | --- | --- |
| phone-preview-light | `src/blocks/assets/pixso-icons/icon-setting-light.png` | 浅色模式预览图（嵌入 ModePreviewCard 浅色矩形内） |
| phone-preview-dark | `src/blocks/assets/pixso-icons/icon-setting-dark.png` | 深色模式预览图（嵌入 ModePreviewCard 深色矩形内） |

## Components Used (from .resources/harmony/components.json)

| Component | Path | Used For |
| --- | --- | --- |
| StatusBar | `src/component/StatusBar` | HeaderSlot 状态栏 |
| TitleBar | `src/component/TitleBar` | HeaderSlot 标题栏（返回 + 标题） |
| SubHeader | `src/component/SubHeader` | ContextSlot「显示模式」段落标签 |
| List / ListItem | `src/component/List` | ListGroupSlot 4 张卡片的行 |
| Switch | `src/component/Switch` | 自动调节开关 |
| Slider | `src/component/Slider` | 亮度调节条 |

## Output Files

- `src/render/display-and-brightness-settings-v2/index.tsx`
- `src/render/display-and-brightness-settings-v2/index.css`
- `src/render/display-and-brightness-settings-v2/index.stories.tsx`
- `src/render/display-and-brightness-settings-v2/index.log.md`（本文件）

## Differences vs v1 (`display-and-brightness-settings`)

| 维度 | v1 | v2（当前） |
| --- | --- | --- |
| ContextSlot | 模式卡 + 真实手机预览图 + 内联 radio + 浅色/深色 | SubHeader「显示模式」+ 简化矩形预览 + 圆形 radio + label |
| 第 1 张 list-card | 亮度滑块 + 自动调节（同卡） | 「深色模式 / 定时开启 >」（独立卡） |
| 第 2 张 list-card | 护眼模式 + 字体大小 | 亮度滑块（亮/暗 cap） + 自动调节（同卡） |
| 第 3 张 list-card | 显示尺寸 | 护眼模式（全天开启） |
| 第 4 张 list-card | — | 字体大小和界面缩放 |
| Footnote | 自动调节会根据环境光线… | （低保真未画，不放） |

## Validation

- `npm run build` — ✓ 1758 modules，1.02s。
- Storybook dev server 已在运行（端口 6006，bg ID `bucudgvgz`）；新 stories 文件会被 Vite watcher 自动捡起。
- 设计资源校验未重跑（本次未改动 `.resources/`，沿用上一轮校验结论）。

## Constraints Honored

- 360px 居中壳层 / 328px 主内容宽度（layout 控制）。
- HeaderSlot status-bar 与 title-bar gap=0。
- ListGroupSlot 卡片间 gap=12（layout 强约束）。
- list 卡片圆角 20px、`comp_background_primary` (#FFFFFF)。
- 所有 Component 来自 `.resources/harmony/components.json`；Layout 来自 markdown spec；不读取 `src/render/**` 作为参考。
