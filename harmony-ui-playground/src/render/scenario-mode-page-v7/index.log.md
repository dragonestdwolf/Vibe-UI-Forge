# ScenarioModePageV7 Generation Log

## Original User Input
生成移动端设置页面下的二级页面："情景模式"页面，标题栏，标题为情景模式，大标题左侧为返回按钮，右侧有三个图标按钮，分别是新增、问号详情、更多；标题栏下方有一段文字：开启后会自动调整系统功能，让您能全身心投入情景；中间二楼为可以滑动的情景卡片，卡片内容：上方为月亮插画，中间为免打扰标题，标题下方为减少打扰保持专注副文本，副文本下方为"立即"开启按钮；卡片下方挨着导航点；二楼卡片下方为 list 卡片，卡片上方副文本：条件开启，list 采用两行，list左侧为时间图标，list 主文本周日 周六，第二行文本为 22:00-次日 07：00，右侧为已关闭与箭头；list 下方为 divider，下方为高亮色按钮：添加条件；二楼卡片下方带副文本：本功能需调用位置权限，读取位置信息；三楼卡片 list，内容为推荐开启与关闭，右侧为开启 switch 按钮；三楼卡片下方为副文本：基于个人偏好，以及位置、时间等数据信息，智能推荐开启或关闭相应的情景模式，关闭后将影响情景模式的推荐体验。保存命名为Scenario ModePageV7（把之前在 storybook 中 v7 覆盖掉）

## Matched page_type
settings-context-list

## layout file
.resources/harmony/layout/settings-context-list.md

## reference_blocks
- scenario-mode-page-v6 (prior version reference)

## source files read
- harmony-ui-playground/src/component/TitleBar/TitleBar.tsx
- harmony-ui-playground/src/component/List/ListItem.tsx
- harmony-ui-playground/src/component/Switch/Switch.tsx
- harmony-ui-playground/src/component/SubHeader/SubHeader.tsx
- harmony-ui-playground/src/component/SubHeader/SubHeader.css
- harmony-ui-playground/src/component/FeaturePromoCard/FeaturePromoCard.tsx
- harmony-ui-playground/src/component/FeaturePromoCard/FeaturePromoCard.css
- harmony-ui-playground/src/component/Divider/Divider.tsx
- harmony-ui-playground/src/layouts/SettingsContextListLayout/SettingsContextListLayout.tsx
- harmony-ui-playground/src/layouts/SettingsContextListLayout/SettingsContextListLayout.css
- .resources/harmony/layout/settings-context-list.md

## components used
- StatusBar
- TitleBar
- SubHeader (leftMode="text" rightMode="none" className="my-subheader--text-none [my-subheader--above-dots]")
- ListItem
- Divider
- Switch
- FeaturePromoCard (×3 carousel: 免打扰/专注模式/睡眠模式)
- SettingsContextListLayout (contextWidth="bleed")

## generated files
- harmony-ui-playground/src/render/scenario-mode-page-v7/index.tsx  (overwrite)
- harmony-ui-playground/src/render/scenario-mode-page-v7/index.css  (overwrite)
- harmony-ui-playground/src/render/scenario-mode-page-v7/index.stories.tsx  (overwrite)

## key changes vs prior V7
- SubHeader uses `my-subheader--text-none` (removes bottom padding per spec)
- First SubHeader uses `my-subheader--above-dots` (-12px top → pulls toward dots)
- SubHeader + list-card + footnote wrapped in `<div className="flex flex-col">` — ensures 0-gap within group; 12px between groups from parent listGroup gap
- `footnote-text` class on footnotes → layout CSS `.scl-layout__list-group .footnote-text { margin-top: 8px }` handles spacing automatically
- Fixed inactive dot width: added `width: 6px` to `.smpv7-dot` (was missing, causing collapsed dots)
- Removed non-spec `paddingInline: 4` wrapper divs around SubHeaders
- Removed `smpv7-footnote` CSS class (replaced by `footnote-text` + inline style)

## validation
No TypeScript errors in V7 files. Pre-existing errors in v1/v3/v4/scene-mode/SettingsPage are unrelated.
