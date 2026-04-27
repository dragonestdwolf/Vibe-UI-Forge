# Settings Page V29 — Generation Log

> 情景模式总览页面

---

## Input

```
还原 Figma 设计：情景模式总览页面
- 深色背景 (#0D0D0D)
- 顶部状态栏（深色模式，时间 20:42）
- 导航栏：返回图标、"情景模式"标题、"..."更多按钮
- 说明文字："自动调整系统功能，更专注"
- 三张情景模式卡片横向排列：
  - 专注（激活态）：紫色渐变背景、白色图标/文字、"专注模式已开启" pill
  - 免打扰：白色毛玻璃背景、"已开启" pill
  - 护眼模式：白色毛玻璃背景、"已开启" pill
- 底部：Home Indicator + "华为鸿蒙系统" / "HarmonyOS" 文字
```

---

## Route Matching

| Field | Value |
|-------|-------|
| `page_type` | `mobile-settings` |
| `layout` | `.resources/harmony/layout/mobile-settings.md` |
| `output_dir` | `harmony-ui-playground/src/render/settings-page-v29` |
| `story_id` | `render-setting-page-v29--default` |

**命中依据：**

- 画布为单屏移动端竖向比例。
- 顶部存在 status bar + titlebar 壳层。
- 主体内容以圆角卡片为核心容器，按单列自上而下堆叠。
- 页面底部存在说明文案，无强制主操作区。
- 本次覆盖旧版"显示和亮度"页面内容。

---

## Source Grounding

| Source | Usage |
|--------|-------|
| `.resources/harmony/layout/mobile-settings.md` | 页面壳层骨架、semantic_tokens |
| `.resources/harmony/components.json` | 组件 id 解析 |
| `src/component/StatusBar/StatusBar.tsx` | 深色模式状态栏 (`mode="dark"`) |
| `src/component/Switch/Switch.tsx` | 开关控件（支持自定义颜色） |
| `src/component/SceneModeCard/SceneModeCard.stories.tsx` | 场景图标 SVG 参考（DoNotDisturbIcon） |
| `src/blocks/water-settings.tsx` | 参考页面结构节奏 |
| `src/styles/harmony-token.css` | token 定义参考 |
| Figma screenshot | 视觉还原依据 |

---

## Page Structure

```
SceneModePage
├─ StatusBar (mode="dark", time="20:42", backgroundColor="#0D0D0D")
├─ Title Bar (dark)
│  ├─ Back button (iconChevronBack)
│  ├─ Title: 情景模式
│  └─ More button (moreIcon SVG)
├─ Subtitle: 自动调整系统功能，更专注
├─ Cards Row
│  ├─ ActiveSceneCard (专注)
│  │  ├─ FocusModeIcon (active)
│  │  ├─ Title: 专注
│  │  ├─ Subtitle: 专注模式已开启
│  │  ├─ StatusPill: 专注模式已开启 (active)
│  │  └─ Switch (white themed)
│  └─ Right column
│     ├─ InactiveSceneCard (免打扰)
│     │  ├─ DoNotDisturbIcon
│     │  ├─ Title: 免打扰
│     │  ├─ Subtitle: 减少打扰保持专注
│     │  ├─ StatusPill: 已开启
│     │  └─ Switch (purple themed)
│     └─ InactiveSceneCard (护眼模式)
│        ├─ EyeProtectionIcon
│        ├─ Title: 护眼模式
│        ├─ Subtitle: 降低蓝光护眼
│        ├─ StatusPill: 已开启
│        └─ Switch (green themed)
├─ Footer
│  ├─ Home indicator
│  ├─ 华为鸿蒙系统
│  └─ HarmonyOS
└─ Page background: #0D0D0D (dark)
```

---

## Key Design Decisions

1. **深色页面背景** `#0D0D0D` — Figma 设计为深色背景，是 `mobile-settings` 的一种变体（深色主题情景模式页）
2. **自定义卡片组件** — `ActiveSceneCard` / `InactiveSceneCard` 根据 Figma 视觉定制，不直接复用 `SceneModeCard`（SceneModeCard 为白色/毛玻璃场景设计）
3. **状态栏使用 `mode="dark"`** — 符合深色背景设计
4. **Switch 颜色主题化** — 激活卡片用白色 Switch，非激活卡片用各自主题色

---

## Generated Files

| File | Description |
|------|-------------|
| `index.tsx` | 情景模式总览页源码 |
| `index.stories.tsx` | Storybook 入口，title 为 `Render/Setting Page-V29` |
| `index.log.md` | 本次生成记录 |

---

## Validation

| Command | Result |
|---------|--------|
| `pnpm --dir harmony-ui-playground typecheck` | 通过 |

---

## Metadata

| Field | Value |
|-------|-------|
| `generated_at` | 2026-04-27 |
| `workspace` | `Vibe-UI-Forge-main` |
| `package` | `harmony-ui-playground` |
| `version_label` | `v29` |
| `layout_basis` | `mobile-settings` (dark variant) |
| `reference` | Figma screenshot URL |
| `history_render_dependency` | `none` |
