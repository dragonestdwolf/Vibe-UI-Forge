# Settings Page V28 — Generation Log

> 免打扰情景模式详情页

---

## Input

```
生成一个"免打扰情景模式"的设置详情页面。
- 顶部状态栏 + 标题栏（标题"免打扰"，左侧返回图标）
- Hero Card：使用 FeaturePromoCard，紫色月亮图标、"免打扰"标题、"减少打扰保持专注"副标题、"立即开启"按钮
- "允许来电"分组：来电（所有人）/ 消息（不允许）下拉选择
- "通知行为"分组：隐藏通知内容、静音、振动（均为开关）
- "其它"分组：重复来电开关
- "关联系统功能"分组：深色模式（同步开启）、护眼模式（不关联）
- 底部说明文案 + Home Indicator
```

---

## Route Matching

| Field | Value |
|-------|-------|
| `page_type` | `mobile-settings` |
| `layout` | `.resources/harmony/layout/mobile-settings.md` |
| `output_dir` | `harmony-ui-playground/src/render/settings-page-v28` |
| `story_id` | `render-setting-page-v28--default` |

**命中依据：**

- 页面为移动端单屏设置详情页，符合 `mobile-settings` 的单列卡片骨架。
- 主体内容由 Hero Card 和设置分组卡片构成，无底部主 CTA，符合布局约束。
- 卡片内部以设置行组织，不命中其它 layout。

---

## Source Grounding

**本次使用以下来源（不参考任何历史 render 页面）：**

| Source | Usage |
|--------|-------|
| `.resources/harmony/layout/mobile-settings.md` | 页面壳层、宽度、布局骨架、semantic_tokens |
| `.resources/harmony/components.json` | 组件 id → path 解析 |
| `src/component/FeaturePromoCard/FeaturePromoCard.tsx` | Hero Card 组件 API |
| `src/component/List/List.tsx` + `ListItem.tsx` | 设置分组容器 + 行级布局 |
| `src/component/Switch/Switch.tsx` | 开关控件 |
| `src/component/StatusBar/StatusBar.tsx` | 顶部系统状态栏 |
| `src/component/TitleBar/TitleBar.tsx` | 标题导航栏 |
| `src/blocks/water-settings.tsx` | 参考设置页结构节奏 |
| `src/styles/harmony-token.css` | 语义 token `comp_background_gray` 定义 |
| `src/index.css` | `@theme inline` 暴露 `--color-comp-background-gray` |

---

## Semantic Tokens Applied

| Semantic Part | Token | Value |
|---------------|-------|-------|
| Page canvas | `comp_background_gray` | `#F1F3F5` |
| Card surface | `comp_background_primary` | white |
| Primary text | `font_primary` | `rgba(0,0,0,0.9)` |
| Secondary text | `font_secondary` | `rgba(0,0,0,0.6)` |
| Primary icons | `icon_primary` | `rgba(0,0,0,0.9)` |
| Secondary icons | `icon_secondary` | `rgba(0,0,0,0.6)` |

---

## Page Structure

```
DoNotDisturbPage
├─ StatusBar (backgroundColor="#F1F3F5")
├─ TitleBar (title: 免打扰, left: iconChevronBack)
├─ FeaturePromoCard (hero-card)
│  ├─ DoNotDisturbIcon (SVG, #542BD7)
│  ├─ title: 免打扰
│  ├─ subtitle: 减少打扰保持专注
│  └─ actionLabel: 立即开启 / 已开启
├─ 允许来电
│  ├─ 来电 / 所有人 (SelectPill)
│  └─ 消息 / 不允许 (SelectPill)
├─ 通知行为
│  ├─ 隐藏通知内容 + Switch
│  ├─ 静音 + Switch
│  └─ 振动 + Switch
├─ 其它
│  └─ 重复来电 + Switch
├─ 关联系统功能
│  ├─ 深色模式 / 同步开启 (SelectPill)
│  └─ 护眼模式 / 不关联 (SelectPill)
├─ Footer note
└─ Home indicator
```

---

## Generated Files

| File | Description |
|------|-------------|
| `index.tsx` | 免打扰情景模式详情页源码 |
| `index.stories.tsx` | Storybook 入口，title 为 `Render/Setting Page-V28` |
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
| `version_label` | `v28` |
| `layout_basis` | `mobile-settings` |
| `hero_card_component` | `feature-promo-card` (FeaturePromoCard) |
| `page_canvas_token` | `comp_background_gray` (#F1F3F5) |
| `history_render_dependency` | `none` |
