# Settings Page V30 — Generation Log

> 鸿蒙「显示和亮度」设置页

---

## Input

```
鸿蒙设计语言的「显示和亮度」设置页：
- 顶部导航栏带返回箭头和页面标题
- 整体用鸿蒙轻量卡片、大圆角控件、白色背景
- 主模块是显示模式选择卡片，左右并排浅色、深色模式的手机界面预览图，支持切换选择
- 下面依次是选中模式的设置项，使用卡片 list 组件设计
- 亮度调节条、自动调节开关，护眼模式和字体缩放设置项入口
- 整体是白色背景、圆角卡片、极简扁平风的鸿蒙原生 UI，控件清晰，留白舒适
```

---

## Route Matching

| Field | Value |
|-------|-------|
| `page_type` | `mobile-settings` |
| `layout` | `.resources/harmony/layout/mobile-settings.md` |
| `output_dir` | `harmony-ui-playground/src/render/settings-page-v30` |
| `story_id` | `render-setting-page-v30--default` |

**命中依据：**

- 移动端单屏竖向比例，顶部 status bar + titlebar 连续排列。
- 主体以圆角卡片为核心容器，按单列堆叠，底部无主 CTA。
- 符合 `mobile-settings` 的骨架约束（`layout_skeleton` + `exclusion_rules` 均满足）。

---

## Source Grounding

**来源（不参考任何历史 render 页面）：**

| Source | Usage |
|--------|-------|
| `.resources/harmony/layout/mobile-settings.md` | 页面壳层、semantic_tokens（`comp_background_gray`） |
| `.resources/harmony/components.json` | 组件 id → path 解析 |
| `src/component/TitleBarHarmony3267/TitleBarHarmony3267.tsx` | 标题导航栏（Pixso 节点 3267:13296） |
| `src/component/Slider/SliderWithIcons.tsx` | 亮度滑杆（带左右图标） |
| `src/component/Slider/SliderBase.tsx` | 滑杆基础 API |
| `src/component/List/List.tsx` + `ListItem.tsx` | 设置分组容器 + 行级布局 |
| `src/component/Switch/Switch.tsx` | 开关控件 |
| `src/component/StatusBar/StatusBar.tsx` | 顶部系统状态栏 |
| `src/styles/harmony-token.css` | token 定义 |
| `src/index.css` | `@theme inline` 暴露 `comp_background_gray` |

---

## Page Structure

```
DisplayBrightnessPage
├─ StatusBar (time=09:41, backgroundColor=#F1F3F5)
├─ TitleBarHarmony3267
│  ├─ title: 显示和亮度
│  ├─ subtitle: 调节外观与屏幕亮度
│  ├─ left: back chevron SVG
│  └─ right: more dots SVG
├─ Display Mode Card (white, rounded-28px)
│  ├─ PhonePreviewLite (selected when mode=light)
│  ├─ PhonePreviewDark (selected when mode=dark)
│  └─ ModeChips (浅色模式 / 深色模式 toggle)
├─ Brightness Card (white, rounded-24px)
│  ├─ BrightnessSummary (value%, comfort label)
│  ├─ SliderWithIcons (0-100, blue active)
│  └─ 自动亮度调节 + Switch
├─ Settings List (white, rounded-24px)
│  ├─ 护眼模式 + Switch
│  └─ 字体大小与粗细 + TrailingLink
├─ Footer Note
└─ Home Indicator
```

---

## Component Design Decisions

1. **PhonePreviewLite / PhonePreviewDark** — 自定义 SVG 手机预览，无依赖外部组件，按设计稿手绘
2. **ModeChips** — 白色 segmented control，圆角 full，active 态有蓝色阴影
3. **SliderWithIcons** — 使用 HarmonyOS 蓝色 (`#0A59F7`) active track
4. **StatusBar** — `backgroundColor="#F1F3F5"` 与页面背景一致（`comp_background_gray`）
5. **TitleBar** — 使用 `TitleBarHarmony3267`（Pixso 节点 3267:13296）

---

## Generated Files

| File | Description |
|------|-------------|
| `index.tsx` | 显示和亮度设置页源码 |
| `index.stories.tsx` | Storybook 入口，title 为 `Render/Setting Page-V30` |
| `index.log.md` | 本次生成记录 |

---

## Validation

| Command | Result |
|---------|--------|
| `pnpm --dir harmony-ui-playground typecheck` | 通过 |
| `pnpm --dir harmony-ui-playground build-storybook` | 通过（存在非阻塞 chunk warning） |

---

## Metadata

| Field | Value |
|-------|-------|
| `generated_at` | 2026-04-27 |
| `workspace` | `Vibe-UI-Forge-main` |
| `package` | `harmony-ui-playground` |
| `version_label` | `v30` |
| `layout_basis` | `mobile-settings` |
| `page_canvas_token` | `comp_background_gray` (#F1F3F5) |
| `history_render_dependency` | `none` |
