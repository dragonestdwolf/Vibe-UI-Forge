# Page Template: settings-page

> 页面模板说明：`settings-page` 是 `mobile-settings` 布局族下的通用设置页模板。  
> 真实来源：`harmony-ui-playground/src/blocks/settings-page.tsx`

## hit_rules

当需求命中 `mobile-settings`，并且同时满足以下特征时，优先参考 `settings-page`：

- 页面标题为“设置”或通用系统设置语义，而不是某个单一功能设置页
- 主体由多组设置卡片组成，每组包含 1 到 3 个设置项
- 设置项类型混合出现：开关项、值展示项、跳转项
- 设置项左侧通常有图标，右侧可能有 Switch、值文本、箭头或状态说明
- 页面内容覆盖多个系统类别，如网络、显示、通知、安全、存储、语言、系统更新、关于设备
- 页面长度可超过单屏，需要保留竖向滚动或自然延展空间

## exclusion_rules

出现以下任一特征时，不应优先使用该模板：

- 只围绕单一功能配置，例如喝水提醒、提醒时间、目标设定，应优先参考 `water-settings`
- 页面主体为健康任务、进度可视化、卡片任务列表，应命中 `health-dashboard`
- 页面主体是底部半模态浮层，应命中 `mobile-sheet`
- 页面需要表单提交、复杂输入或固定底部主操作按钮
- 页面主要内容是图表、信息流、详情页、网格卡片或营销内容

## reference_blocks

- `settings-page`
- `water-settings`

## layout_skeleton

```html
<main class="template-settings-page">
  <section class="template-status-bar"></section>
  <header class="template-titlebar"></header>
  <section class="template-content">
    <section class="template-setting-group template-setting-group-network"></section>
    <section class="template-setting-group template-setting-group-display"></section>
    <section class="template-setting-group template-setting-group-notification"></section>
    <section class="template-setting-group template-setting-group-security"></section>
    <section class="template-setting-group template-setting-group-system"></section>
    <section class="template-setting-group template-setting-group-about"></section>
  </section>
  <footer class="template-home-indicator"></footer>
</main>
```

### Layout Family

| Field | Value |
|---|---|
| layout_family | `mobile-settings` |
| page_template | `settings-page` |
| source_block | `src/blocks/settings-page.tsx` |
| story | `src/blocks/settings-page.stories.tsx` |
| viewport | `360px` width, `792px` min height |
| content_width | `328px` |

## needed_components

- `status-bar`
- `title-bar`
- `list`
- `list-item`
- `switch`
- `divider` (按需)

## composition_mapping

| Template Region | Component | Source Pattern |
|---|---|---|
| `status bar` | `status-bar` | `StatusBar time="09:41"` |
| `titlebar` | `title-bar` | `TitleBar title="设置" leftIcon={...}` |
| `setting group` | `list` | `List className="rounded-[20px] mt-*"` |
| `switch row` | `list-item` + `switch` | `ListItem right={<Switch ... />}` |
| `value row` | `list-item` | `ListItem right={value + chevron}` |
| `jump row` | `list-item` | `ListItem right={chevron}` |
| `group divider` | `list-item` border | 使用 `border={false}` 控制组内末项分割线 |
| `home indicator` | plain markup | 底部系统区域 |

## generation_constraints

- 生成通用设置页时，优先读取 `settings-page.tsx` 的分组节奏和行项组合方式
- 不要把 `settings-page` 当成组件 API；它是页面模板 block
- 保留 `360px` 页面宽度和 `328px` 主内容宽度的移动端壳层约束
- 多组设置卡片应使用 `List` + `ListItem` 组织，不要自由拼接匿名 div 行项
- 开关设置必须使用 `Switch`
- 跳转设置右侧应保持 `value + chevron` 或单独 `chevron` 的结构
- 图标可使用模板中的 lucide 图标模式，但业务特定图标应优先来自参考 block 或实际资产
- 如果需求是单一功能设置页，应优先以 `water-settings` 为 reference block，而不是完整 `settings-page`

## semantic_tokens

| Semantic Part | Template Usage |
|---|---|
| Page canvas | `comp_background_gray` |
| Group card | `List` rounded card |
| Primary text | setting title, titlebar text |
| Secondary text | right-side value, status description |
| Interactive control | `Switch` |
| Navigation affordance | chevron icon |
| Group spacing | `mt-2`, `mt-3`, `mt-4` rhythm from source block |

## source_grounding

默认读取：

- `harmony-ui-playground/src/blocks/settings-page.tsx`
- `harmony-ui-playground/src/blocks/settings-page.stories.tsx`

按需读取：

- `harmony-ui-playground/src/component/StatusBar/StatusBar.tsx`
- `harmony-ui-playground/src/component/TitleBar/title-bar.tsx`
- `harmony-ui-playground/src/component/List/List.tsx`
- `harmony-ui-playground/src/component/Switch/Switch.tsx`
- `harmony-ui-playground/src/component/Divider/Divider.tsx`

## validation_notes

- `settings-page` 必须在 `.resources/harmony/blocks.json` 中存在
- 本文件的 `reference_blocks` 必须能被 `scripts/validate_design_system_resources.mjs` 校验通过
- 生成页应使用 `@/component` alias
- 生成页至少需要通过 `npm run build`
- 如新增 stories，需要通过 `npm run build-storybook`
