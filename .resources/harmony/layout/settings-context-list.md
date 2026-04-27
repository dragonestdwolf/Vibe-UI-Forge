# Layout: settings-context-list

## overview

设置二级页通用布局的一种类型：页面整体 `360px` 宽度居中呈现；顶部固定 StatusBar + TitleBar（居中于页面宽度内），二者之间 gap=0；中部为灵活业务卡片区（支持居中或满宽横滑）；底部为固定 list 卡片组合（卡片间距 12，可内嵌 slider）。适用于"先呈现/预览，后调参/控制"的设置二级页。支持 light / dark 双主题，背景色通过 `background` 参数控制。

## hit_rules

- 情景模式 / 免打扰
- 显示与亮度
- 云空间
- 智慧多窗
- 需要顶部业务可视化（轮播、预览、对比图、容量环等）+ 下方多组设置卡的二级设置页
- 主内容由 1 个"业务展示卡 / 可滑动卡组" + 多个"list 卡片"自上而下垂直堆叠
- 可在 list 卡片中放置 Slider、Switch 控件

## exclusion_rules

- 通用一级"设置"主页（多组设置 list 但无业务展示卡）→ 命中 `mobile-settings`
- 顶部存在 tab / segmented control 作为页面主导航
- 页面主体为表单录入、富文本详情、信息流
- 半模态浮层场景 → 命中 `mobile-sheet`
- 健康任务进度卡片为主体 → 命中 `health-dashboard`
- 底部存在固定主 CTA / 双按钮操作栏

## layout_skeleton

```text
Page
├── AppShell                       # 360 × 800 移动端壳层，居中于视口
│   ├── HeaderSlot                 # 固定 title 区，居中于页面 (gap-between=0)
│   │   ├── status-bar             #   贴顶，居中，36px
│   │   └── title-bar              #   紧贴状态栏，居中，56px，左返回 + 标题 + 右图标组
│   ├── ContextSlot                # 灵活 context 区
│   │   └── FeaturePromoCard       #   FeaturePromoCard 单卡或横向轮播组合 / 预览 / 容量环 / 对比图
│   ├── ListGroupSlot              # 固定 list 区（卡片间距 12px）
│   │   ├── subheader[?]           #   可选副标题标签（subtitle），紧贴下方 list 卡片，间距为 0
│   │   ├── list-card[1]           #   list 卡片，可含 list-item / switch / slider
│   │   ├── list-card[2]
│   │   └── list-card[n]
│   └── FooterSlot                 # 底部说明 / 安全区，默认隐藏
└── HomeIndicator                  # 底部 Home Indicator，28px
```

### Shell Rules

| 区域 | 高度 | 说明 |
|------|------|------|
| AppShell | 360px 宽度，居中于视口 | 容器层；背景色由 `background` 参数决定，支持 light/dark 切换 |
| status-bar | 36px | 贴顶，居中于 360px 壳层内，gap-below=0 |
| title-bar | 56px | 紧贴状态栏，居中于 360px 壳层内，无间距 |
| ContextSlot | flex | 灵活高度，依据业务卡片自适应 |
| ListGroupSlot | flex | 居中于 328px 主内容区；多张 list 卡片之间 gap=12px |
| HomeIndicator | 28px | 底部系统区域，居中 |

### Content Width
- **壳层宽度**：`360px`
- **主内容标准宽度**：`328px`（左右各 `16px` 边距，居中于壳层内）
- **ContextSlot 扩展宽度**：`360px` 满宽（用于横向轮播卡等需要突破边距的场景）

### ContextSlot 间距规范
- ContextSlot 距上方内容（TitleBar 或描述文本）间距为 **8 的倍数**，最小 **16px**，推荐 **24px / 32px / 40px**。
- 若 ContextSlot 下方紧接 Subheader（`leftMode="text"`），则间距为 **0**（gap=0）。

## layout_runtime

| 能力 | 源码支撑 | 说明 |
|---|---|---|
| Slot 装配 | `SettingsContextListLayout` | 装配 HeaderSlot / ContextSlot / ListGroupSlot / FooterSlot |
| Header 零间距 | `HeaderSlot.gap=0` | StatusBar 与 TitleBar 之间不留间距 |
| 居中呈现 | `AppShell` | 页面整体 `360px` 宽度居中于视口，StatusBar 和 TitleBar 均居于 360px 壳层中心 |
| 双主题背景 | `background` 参数 | `background="#F1F3F5"`（light）或 `background="#000000"`（dark），ThemeProvider 驱动切换 |
| List 卡片间距 | `ListGroupSlot.gap=12` | 多张 list 卡片之间统一 12px 垂直间距 |
| ContextSlot 满宽 | `contextWidth="bleed"` | 横向轮播等场景可通过 `contextWidth="bleed"` 突破 328px 限制至 360px |
| 显隐控制 | `showContext` / `showFooter` | 控制业务区与底部区是否渲染 |
| 空 slot | `none` | slot 为 none 时不保留空容器 |
| Slider 嵌入 | `list-item.right=<Slider/>` 或 整行替换 | 允许 list-card 内放置滑块控件 |

## fixed_blocks

| Block | 位置 | 是否必选 | 说明 |
|---|---|---|---|
| status-bar | HeaderSlot | 是 | 系统状态栏，居中于 360px 壳层，theme 跟随 `background` 参数 |
| title-bar | HeaderSlot | 是 | 标题栏，居中于 360px 壳层，左返回；右侧图标组按需 |
| list-card | ListGroupSlot | 是 | 至少一张 list 卡片，圆角 20–24px |
| subheader | ListGroupSlot | 否 | 可选副标题标签，置于 list 卡片上方，距下方 list 卡片间距为 0 |

## slots

| Slot | 默认 Block | 可替换 Block 清单 | 是否必选 | 说明 |
|---|---|---|---|---|
| HeaderSlot | title-bar | title-bar / search-header | 是 | 状态栏 + 标题栏组合，二者间距固定为 0 |
| ContextSlot | FeaturePromoCard | scene-mode-carousel / FeaturePromoCard / display-mode-preview / cloud-storage-overview / multi-window-preview / hero-promo-card / none | 否 | 业务展示卡片；可横向滚动（轮播）或纵向静态卡；多卡时使用横向 scroll-snap 轨道 |
| ListGroupSlot | settings-list-group | settings-list-group / slider-list-group / grouped-list-section | 是 | list 卡片堆叠，可选 subheader 副标题置于最上方，距下方 list 卡片间距为 0 |
| SubheaderSlot | subtitle | subtitle / none | 否 | 副标题标签（使用 `leftMode="text"` + `text` 属性），紧贴下方 list 卡片，**subheader 与 list 卡片间距为 0**（gap=0） |
| FooterSlot | none | footer-note / bottom-actions / none | 否 | 底部说明文案或操作 |

## visibility_rules

| 区域 | 默认 | 何时隐藏 |
|---|---|---|
| HeaderSlot | 显示 | 永远显示，不可隐藏 |
| ContextSlot | 显示 | 页面无业务展示需求时隐藏（直接进入 list 区） |
| ListGroupSlot | 显示 | 永远显示，不可隐藏 |
| FooterSlot | 显示 | 需要底部说明或底部操作时显示 |

## needed_components

- status-bar
- title-bar
- subheader
- list
- list-item
- switch
- swiper（按需）
- slider
- divider（按需）
- FeaturePromoCard（按需）
- icon-tile（按需，list-item 左侧图标）

## reference_blocks

- settings-page
- scenario-mode-page-v3（FeaturePromoCard 在 ContextSlot 横向轮播的典型实现）

## composition_mapping

| 页面区域 | 优先使用 | 可替换为 | 说明 |
|---|---|---|---|
| HeaderSlot | title-bar | search-header | 是否需要搜索；二者均与 status-bar 紧贴 |
| ContextSlot | FeaturePromoCard | scene-mode-carousel / FeaturePromoCard / display-mode-preview / cloud-storage-overview / multi-window-preview / none | 选择匹配业务的展示卡片；多卡时使用横向 scroll-snap 轨道（如 `scenario-mode-page-v3` 三卡轮播） |
| ListGroupSlot | settings-list-group | slider-list-group | 含 Slider 时优先 slider-list-group |
| SubheaderSlot | subtitle | none | **副标题标签（使用 `leftMode="text"` + `text` 属性）**，置于 list 卡片上方，**subheader 与下方 list 卡片间距为 0**（gap=0）；使用 `font_tertiary` token；**一般无右侧蓝色操作按钮**（`rightMode` 应省略或为 `none`） |
| ContextSlot 间距 | 16px / 24px / 32px / 40px | — | ContextSlot 距上方内容（TitleBar 或描述文本）间距为 8 的倍数，最小 16px，推荐 24 / 32 / 40px；若 ContextSlot 下方紧接 Subheader 则间距为 0 |
| List 卡片间距 | gap-12 | — | 卡片间垂直间距固定为 12px，不允许 0 / 24 等 |
| 卡片内行项 | list-item | list-item + switch / list-item + slider / list-item + value+chevron | 依据交互类型选择 |
| FooterSlot | none | footer-note | 需展示策略说明 / 跳转个性化设置时显示 |
| List 卡片下方副文本 | FootnoteText / footnote | — | 副文本距上方 list 卡片间距固定为 8px |

## generation_constraints

- 只能从 slots 的可替换 Block 清单中选择，不要临时发明新 Block。
- 如果 slot 选择 `none`，对应区域不要保留空白容器。
- **居中约束**：页面整体 `360px` 宽度居中于视口；StatusBar 和 TitleBar 均居于壳层中心（CSS `margin: 0 auto`），不可偏左或偏右。
- HeaderSlot 中 status-bar 与 title-bar 之间间距必须为 0；不允许插入 padding / margin / 任何中间区块。
- **背景色约定**：通过 `background` 参数控制。Light 模式使用 `#F1F3F5`，Dark 模式使用 `#000000`；不得硬编码背景色。
- ListGroupSlot 内多张 list 卡片之间的垂直间距固定为 12px；首张卡片距 ContextSlot 间距 ≥ 16px。
- **ContextSlot 间距约束**：中间业务卡片（ContextSlot）距上方内容（TitleBar 或描述文本）间距为 **8 的倍数**，最小 **16px**，推荐 **24px / 32px / 40px**。
- **ContextSlot + Subheader 间距**：若 ContextSlot 下方紧接 Subheader（`leftMode="text"`），则 ContextSlot 距 Subheader 间距为 **0**（gap=0）。
- **SubheaderSlot 间距约束**：subheader 距下方 list 卡片间距为 0（gap=0），不得插入任何额外间距。
- **Subheader 样式规范**：当 Subheader 位于 list 卡片上方时，一般仅使用 `text` 内容，**无右侧蓝色操作按钮**（`rightMode` 应为 `none` 或不加 rightMode）；仅有 text 的 Subheader 视觉更简洁。
- **Footnote 间距约束**：list 卡片下方副文本（如功能说明、注意事项）距上方 list 卡片间距为 8px。
- ContextSlot 高度由业务卡片决定，不要对 ContextSlot 设硬编码高度；横向轮播必须支持 `scroll-snap`；多张 FeaturePromoCard 横向排列时使用 `display:flex + gap-12 + overflow-x:auto + scroll-snap-type:x mandatory` 轨道组合。
- list 卡片圆角统一为 20–24px，背景为 `comp_background_primary`，与页面背景保持对比。
- **list 图标规范**：list-item 左侧图标统一使用 `light/icon_primary`（`rgba(0,0,0,0.9)`，stroke-width 1.5–1.8px）；若有圆形背景容器，背景为 `rgba(10,89,247,0.08)`（品牌蓝 8% 透明度）。
- list 卡片内允许嵌入 `slider`，应与 list-item 同列对齐；slider 行不再追加箭头。
- Markdown 中声明的 slot 和显隐规则，layout 源码必须有对应能力。
- 页面中的 Component 必须来自 `components.json`。
- 页面中的 Block 必须来自 `blocks.json` 或 layout 明确允许的 reference_blocks。
- 如果需要裁剪 Block 内部区域，先参考对应 `block/*.md` 的可隐藏规则。
- 保留 `360px` 页面宽度和 `328px` 主内容宽度的移动端壳层约束；ContextSlot 横滑卡组可至 `360px` 满宽。
- 设置行优先复用 list / list-item，不要自由拼接匿名 div。

## semantic_tokens

| Semantic Part | Light Token | Dark Token |
|---|---|---|
| Page canvas（壳层背景） | `comp_background_gray` `#F1F3F5` | `comp_background_gray` `#000000` |
| Card surface（list 卡片背景） | `comp_background_primary` `#FFFFFF` | `comp_background_primary` `#1A1A1A` |
| Title / primary labels | `font_primary` `rgba(0,0,0,0.9)` | `font_primary` `rgba(255,255,255,0.9)` |
| Right-side value / note | `font_secondary` `rgba(0,0,0,0.6)` / `font_tertiary` `rgba(0,0,0,0.45)` | `font_secondary` `rgba(255,255,255,0.6)` / `font_tertiary` `rgba(255,255,255,0.45)` |
| Brand accent | `brand_blue` `#0A59F7` — 用于强调、Switch on、Slider 轨道 | `brand_blue` `#0A59F7`（保持一致） |
| Primary icons | `icon_primary` | `icon_primary`（跟随 token 变化） |
| Secondary icons / chevron | `icon_secondary` | `icon_secondary`（跟随 token 变化） |
| List 内图标（list-item left） | `light/icon_primary` `rgba(0,0,0,0.9)` | `dark/icon_primary` `rgba(255,255,255,0.9)` |
| Subheader / Section label | `font_tertiary` `rgba(0,0,0,0.45)` | `font_tertiary` `rgba(255,255,255,0.45)` |
| Divider | `comp_divider` | `comp_divider`（跟随 token 变化） |

> **List 图标规范**：list-item 左侧图标统一使用 `light/icon_primary`（`rgba(0,0,0,0.9)`，stroke-width 约 1.5–1.8px），不得使用彩色或纯白图标。若图标有圆形背景容器，使用 `rgba(10,89,247,0.08)`（即 `brand_blue` 8% 透明度）。

### Background 参数约定

| 主题 | `background` 值 | 使用场景 |
|---|---|---|
| Light | `#F1F3F5`（鸿蒙 `comp_background_gray`） | 通用设置二级页，如情景模式、显示与亮度等 |
| Dark | `#000000`（鸿蒙 `comp_background_gray` dark） | 深色模式下的全屏深色页 |
| 页面可定制 | `#FFFFFF` 或其他 | 纯白背景覆盖场景（如 V2 免打扰页） |

调用 `SettingsContextListLayout` 时通过 `background` 参数传入；ThemeProvider 驱动主题切换时，同步更新该参数值。

## validation_notes

- ContextSlot 与 ListGroupSlot 必须能独立验收：context 卡片可单独故事预览，list 组合可单独故事预览。
- list 卡片间距测量必须为 12px（允许 ±1px 渲染误差）。
- HeaderSlot 中 status-bar 底边与 title-bar 顶边像素级贴合（gap=0）。
- 生成页至少需要通过 `npm run build`；新增 stories 通过 `npm run build-storybook`。
