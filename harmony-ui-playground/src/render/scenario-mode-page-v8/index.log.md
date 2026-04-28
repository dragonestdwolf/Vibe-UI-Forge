# ScenarioModePageV8 Generation Log

## Original User Input
生成移动端设置页面下的二级页面："情景模式"页面，标题栏，标题为情景模式，大标题左侧为返回按钮，右侧有三个图标按钮，分别是新增、问号详情、更多；标题栏下方有一段文字：开启后会自动调整系统功能，让您能全身心投入情景；中间二楼为可以滑动的情景卡片，卡片内容：上方为月亮插画，中间为免打扰标题，标题下方为减少打扰保持专注副文本，副文本下方为"立即"开启按钮；卡片下方挨着导航点；二楼卡片下方为 list 卡片，卡片上方副文本：条件开启，list 采用两行，list左侧为时间图标，list 主文本周日 周六，第二行文本为 22:00-次日 07：00，右侧为已关闭与箭头；list 下方为 divider，下方为高亮色按钮：添加条件；二楼卡片下方带副文本：本功能需调用位置权限，读取位置信息；三楼卡片 list，内容为推荐开启与关闭，右侧为开启 switch 按钮；三楼卡片下方为副文本：基于个人偏好，以及位置、时间等数据信息，智能推荐开启或关闭相应的情景模式，关闭后将影响情景模式的推荐体验。保存命名为Scenario ModePageV8

## Matched page_type
settings-context-list

## layout file
.resources/harmony/layout/settings-context-list.md

## reference_blocks
- scenario-mode-page-v7 (prior version reference)

## source files read
- harmony-ui-playground/src/render/scenario-mode-page-v7/index.tsx
- harmony-ui-playground/src/render/scenario-mode-page-v7/index.css
- harmony-ui-playground/src/component/TitleBar/title-bar.tsx
- harmony-ui-playground/src/component/List/List.tsx (ListItem)
- harmony-ui-playground/src/component/Switch/Switch.tsx
- harmony-ui-playground/src/component/SubHeader/SubHeader.tsx
- harmony-ui-playground/src/component/SubHeader/SubHeader.css
- harmony-ui-playground/src/component/FeaturePromoCard/FeaturePromoCard.tsx
- harmony-ui-playground/src/component/Divider/Divider.tsx
- harmony-ui-playground/src/layouts/SettingsContextListLayout/SettingsContextListLayout.tsx
- harmony-ui-playground/src/layouts/SettingsContextListLayout/SettingsContextListLayout.css
- .resources/harmony/layout/settings-context-list.md

## components used
- StatusBar
- TitleBar (leftIcon=返回, rightIcons=[新增, 问号, 更多])
- SubHeader (leftMode="text" rightMode="none" className="my-subheader--text-none")
- ListItem (两行布局：left=TimeIcon, title=周日周六, subtitle=22:00-次日07:00, right=已关闭+箭头)
- Divider (hairline)
- Switch (modelValue=recommendOn)
- FeaturePromoCard (×3: 免打扰/专注模式/睡眠模式)
- SettingsContextListLayout (contextWidth="bleed")

## generated files
- harmony-ui-playground/src/render/scenario-mode-page-v8/index.tsx
- harmony-ui-playground/src/render/scenario-mode-page-v8/index.css
- harmony-ui-playground/src/render/scenario-mode-page-v8/index.stories.tsx
- harmony-ui-playground/src/render/scenario-mode-page-v8/index.log.md

## key changes vs V7

### 1. 描述文字修正（font_secondary + 14px）
- **V7**：`<div style={{ paddingInline:16 }}><p style={{ fontSize:13, color:FONT_TERTIARY }}>` — 使用 FONT_TERTIARY (rgba(0,0,0,0.45)) + 13px，违反 TitleBar 副文本规范
- **V8**：`<p className="scl-header-subtitle">` — 使用布局系统 CSS 类，14px / lh 22px / rgba(0,0,0,0.6)（font_secondary），符合 Font/Subtitle_S/Regular 规范

### 2. 轮播轨道修正（center snap + 32px padding）
- **V7**：自定义 `.smpv7-rail`，`scroll-padding-inline:16px`，卡片用 `scrollSnapAlign:"start"`，违反「选中卡居中」规范
- **V8**：复用布局系统 `scl-carousel-track`，`padding-inline:32px`，卡片继承 `scroll-snap-align:center`，符合规范

### 3. Footnote 颜色修正（font_secondary 0.6）
- **V7**：`className="footnote-text" style={{ color:FONT_TERTIARY }}`，内联 style 覆盖了 CSS 类的正确颜色 0.6 → 错误显示 0.45
- **V8**：仅 `className="footnote-text"`，依赖布局 CSS `.footnote-text { color: rgba(0,0,0,0.6) }`

### 4. CSS 文件简化
- **V7**：包含 `.smpv7-rail`、`.smpv7-hide-scrollbar` 自定义滚动轨道
- **V8**：移除上述类，CSS 仅保留导航点（`.smpv8-dots`/`.smpv8-dot`）和添加条件按钮（`.smpv8-add-btn`）

## validation
- `npx tsc -b` 在 scenario-mode-page-v8/ 目录下无 TypeScript 错误
- 预存在的其他文件错误（v1/v3/v4/scene-mode/SettingsPage）与本次生成无关（V7 log 已记录）
