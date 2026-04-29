# Generation Log — display-and-brightness-settings

## Prompt

> 鸿蒙设计语言的「显示和亮度」设置页，顶部导航栏带返回箭头和页面标题，整体用鸿蒙轻量卡片、大圆角控件，白色背景。主模块是显示模式选择卡片，左右并排浅色、深色模式的手机界面预览图，支持切换选择。下面依次是选中模式的设置项，使用卡片 list 组件设计。亮度调节条、自动调节开关，护眼模式和字体缩放设置项入口，整体是白色背景、圆角卡片、极简扁平风的鸿蒙原生 UI，控件清晰，留白舒适。
>
> 用户附加约束：`render/` 文件夹中都是历史渲染，禁止作为真值参考。

## Resource Mode

- 检测到 `.resources/config.json`，active = `harmony`，projectRoot = `harmony-ui-playground`。

## Route Match

- `route-index.md` → 命中关键字「显示与亮度」 → `page_type = settings-context-list`。

## Layout

- Layout file: `.resources/harmony/layout/settings-context-list.md`
- Layout source: `harmony-ui-playground/src/layouts/SettingsContextListLayout/SettingsContextListLayout.tsx`
- Skeleton:
  ```
  AppShell
  ├── HeaderSlot (StatusBar + TitleBar，gap=0)
  ├── ContextSlot (显示模式对比卡，centered 328px)
  ├── ListGroupSlot (3 张 list-card，gap=12)
  └── HomeIndicator (28px)
  ```
- `contextWidth = "centered"`（非满宽轮播）。
- `background = "#F1F3F5"`（鸿蒙 `comp_background_gray`，light 模式）。

## Reference Blocks (consulted, not copied from `render/`)

- `grouped-list-section`（`src/blocks/grouped-list-section.tsx` + stories）— 验证了 list 卡片 + footnote 8px 间距规范。
- `SettingsContextListLayout` 自带 stories — 复用其中的 ListItem + Switch / Slider 组合写法。

未读取 `src/render/**` 任意文件作为参考（满足用户明确指令）。`blocks.json` 中 `scenario-mode-page` 虽指向 `src/render/scenario-mode-page-v5/`，但本次生成仅依赖 layout / 组件 / `src/blocks/` 中的 grouped-list-section。

## Needed Components (from components.json)

| Component   | Path                                                  | Used For                       |
| ----------- | ----------------------------------------------------- | ------------------------------ |
| StatusBar   | `src/component/StatusBar`                             | HeaderSlot 顶部状态栏          |
| TitleBar    | `src/component/TitleBar`                              | HeaderSlot 标题栏（返回 + 标题）|
| List / ListItem | `src/component/List`                              | ListGroupSlot 卡片行           |
| Switch      | `src/component/Switch`                                | 自动调节开关                   |
| Slider      | `src/component/Slider`                                | 亮度调节条                     |

## Assets (from assets.json)

| Asset id            | Path                                                    | Used For               |
| ------------------- | ------------------------------------------------------- | ---------------------- |
| phone-preview-light | `src/blocks/assets/pixso-icons/icon-setting-light.png`  | 浅色模式手机预览图     |
| phone-preview-dark  | `src/blocks/assets/pixso-icons/icon-setting-dark.png`   | 深色模式手机预览图     |

辅助图标：
- `icon-chevron-backward.png`（TitleBar 返回箭头）
- `icon-arrow-right-small.png`（list-item 末尾 chevron）

## Source Files Read

- `.resources/config.json`
- `.resources/harmony/route-index.md`
- `.resources/harmony/layout/settings-context-list.md`
- `.resources/harmony/blocks.json`
- `.resources/harmony/components.json`
- `.resources/harmony/assets.json`
- `harmony-ui-playground/components.json`
- `harmony-ui-playground/src/layouts/SettingsContextListLayout/{SettingsContextListLayout.tsx,SettingsContextListLayout.css,SettingsContextListLayout.stories.tsx}`
- `harmony-ui-playground/src/blocks/grouped-list-section.{tsx,css,stories.tsx}`
- `harmony-ui-playground/src/component/{StatusBar,TitleBar,List,Switch,Slider,SubHeader,FeaturePromoCard}/*.{tsx,ts,css}`

## Output Files

- `src/render/display-and-brightness-settings/index.tsx`
- `src/render/display-and-brightness-settings/index.css`
- `src/render/display-and-brightness-settings/index.stories.tsx`
- `src/render/display-and-brightness-settings/index.log.md`（本文件）

## Composition

- **HeaderSlot** — `<StatusBar time="09:41" />` + `<TitleBar title="显示和亮度" leftIcon={iconChevronBack} rightIcons={[]} />`，二者 gap=0，居中于 360px 壳层。
- **ContextSlot** — 自定义 `ModePreviewCard`：白色 24px 圆角卡片内放 2 个 `dab-mode-card__option`（左右并排），每个含 116×200 圆角手机预览图 + 单选标签。选中态使用 `brand_blue` 边框 + 8% 透明度填充。该卡片为 layout markdown `composition_mapping` 中允许的 `display-mode-preview` 形态（自定义 ContextSlot 卡片）。
- **ListGroupSlot** — 三张 list-card，圆角 20px：
  1. 卡 1：`ListItem("亮度")` + 卡内嵌 `Slider`（左右暗/亮太阳图标）+ `ListItem("自动调节") + Switch`。
  2. 中间夹一段 footnote 文本（间距 8px，颜色 `font_secondary`）。
  3. 卡 2：`ListItem("护眼模式" / "已开启" / chevron)` + `ListItem("字体大小与粗细" / "标准" / chevron)`。
  4. 卡 3：`ListItem("显示尺寸" / "默认" / chevron)`。
  list 卡片之间 gap=12（由 layout 强约束）。

## Validation

- `node scripts/validate_design_system_resources.mjs` — ✓ 本次新增的资源（components / assets / layout）全部通过；存在 1 条 pre-existing 错误（`mobile-settings.md` 引用 `hero-card`），与本页面无关。
- `npm run build` — ✓ TypeScript build + Vite production build 均通过（963ms）。
- `npm run build-storybook` — ✓ Storybook 静态构建通过；新 stories 出现在 `Render/DisplayAndBrightnessSettings`。

## Notes / Constraints Honored

- 360px 居中壳层，328px 主内容宽度（由 layout 控制）。
- HeaderSlot status-bar 与 title-bar 之间 gap=0。
- ListGroupSlot 内 list 卡片之间 gap=12。
- list 卡片圆角 20px，背景 `comp_background_primary` (#FFFFFF)。
- footnote 字体 `Body_S/Regular` 12/18/400，颜色 `font_secondary` `rgba(0,0,0,0.6)`，距上方 list 卡片 8px。
- 不使用 `render/` 任何历史文件作为参考（用户明确指令）。
- 所有 Component 来自 `.resources/harmony/components.json`；所有 Asset 来自 `.resources/harmony/assets.json`；Layout 来自 markdown spec。
