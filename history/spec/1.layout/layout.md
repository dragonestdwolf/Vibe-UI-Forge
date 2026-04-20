# Layout Spec

## 0. Metadata
- **Source Page**: `Page-Render/DrinkSettings/bench-Settings.html`
- **Normalized Source**: `Page-Render/DrinkSettings/bench-Settings-componentized.html`
- **Layout Type**: `mobile-settings-single-column`
- **Canvas**: `360 x 792`
- **Theme Base**: `background_secondary` page canvas + `comp_background_primary` card surface


## 1. Layout Identification
该页面属于标准的移动端设置页，不是 Pixso 节点原样平铺。

判断依据：
- 顶层已经存在稳定的页面壳层：`status bar -> titlebar -> content cards -> note -> bottom indicator`。
- 内容块已经按语义分组，而不是连续的匿名 `div/frame/group`。
- `bench-Settings-componentized.html` 已进一步将其归纳为 `screen / header / section / card / list-item / footer` 结构，说明该页可以稳定抽象为页面框架。

限制说明：
- `bench-Settings.html` 的实现仍大量依赖 `absolute` + 固定 `top` 值，属于“已语义化的高保真还原稿”，不是理想的可扩展布局实现。
- 因此本 layout spec 抽取的是其页面骨架语义，不是照搬其绝对定位写法。

## 2. Hit Rules
命中 `mobile-settings-single-column` 时，页面应同时满足以下特征：
- 画布为单屏移动端竖向比例，页面主内容位于居中的单列内容区。
- 顶部存在稳定壳层：`status bar` 与 `titlebar` 连续排列。
- 主体内容以圆角卡片为核心容器，卡片按单列自上而下堆叠。
- 卡片内部以设置项行为主，典型行为“标签 + 值 + 箭头”或“标签 + 控件”。
- 页面底部可以存在说明文案，但无强制性的主操作区。
- 信息组织优先按设置语义分组，而不是按图层或视觉碎片分组。

## 3. Exclusion Rules
出现以下任一特征时，不应优先命中该布局：
- 顶部存在 tab、segmented control、二级导航切换，且其成为页面主导航。
- 页面主体被 `subheader` 分成多个独立内容区块，区块之间需要标题层级管理。
- 底部存在固定主 CTA、双按钮操作栏或工具栏，且该操作区是主交互重点。
- 页面主体为表单录入、富内容详情、图表看板或多列排版，而非设置项列表。
- 卡片内部以网格、时间轴、内容流为主，而不是设置行。
- 页面必须依赖逐元素绝对定位才能成立，去掉绝对定位后无法保持语义结构。

## 4. Page Skeleton

```html
<main class="layout-mobile-settings">
  <section class="layout-status-bar"></section>
  <header class="layout-titlebar"></header>

  <section class="layout-content">
    <section class="layout-card layout-card-entry"></section>
    <section class="layout-card layout-card-group"></section>
    <p class="layout-note"></p>
  </section>

  <footer class="layout-home-indicator"></footer>
</main>
```

## 5. Shell Rules

### 5.1 Root Canvas
- 画板固定为 `360 x 792`。
- 页面背景使用二级底色，卡片使用一级表面色。
- 页面为单列流向，自上而下阅读。

### 5.2 Safe Areas
- 顶部固定保留两层系统区：
  - `status bar`: `36px`
  - `titlebar`: `56px`
- 底部固定保留 `home indicator` 区域：`28px`

### 5.3 Content Width
- 主内容标准宽度：`328px`
- 水平居中。
- 等价边距：左右各 `16px`

## 6. Vertical Structure

### 6.1 Top Region
- `status bar` 贴顶放置。
- `titlebar` 紧接状态栏下方。
- 标题栏内为：
  - 左侧返回按钮
  - 中部标题
  - 右侧操作区可选

### 6.2 Content Region
- 内容区从标题栏下方开始，使用单列卡片堆叠。
- 本页命中的内容顺序为：
  1. 单行入口卡片：目标设定
  2. 多行设置卡片：提醒
  3. 说明文案区：底部 note

### 6.3 Bottom Region
- 页面最底部为系统 home indicator。
- 不参与业务内容布局。
- 仅作为设备壳层的一部分。

## 7. Block Patterns

### 7.1 Entry Card
用于“进入下一级设置”的单行入口。

结构特征：
- 单卡片。
- 高度约 `64px`。
- 左侧 `icon + title`。
- 右侧 `value + chevron`。

适用场景：
- 目标值
- 默认模式
- 当前选项摘要

### 7.2 Group Card
用于同一主题下的多行设置组合。

结构特征：
- 卡片头部为主题入口行。
- 下方跟随若干设置行。
- 左列承载标签。
- 右列承载控件或当前值。

本页实例：
- 第一行：`title + switch`
- 第二行：`label + value + chevron`
- 第三行：`label + value + chevron`

### 7.3 Informational Note
用于补充说明、限制条件、解释性提示。

规则：
- 位于卡片组下方。
- 不使用卡片容器。
- 文本颜色降级为二级文本。
- 允许多行换行。

## 8. Spatial Tokens

引用来源：`spec/2.theme/mobile-scale.md`

### 8.1 Horizontal
- 页面边距：`--harmony-page-padding-mobile`
- 卡片内边距主值：`--harmony-card-gap-mobile`
- 行内图标与文本间距：`--harmony-inline-gap-mobile` 或 `--harmony-inline-gap-loose-mobile`
- 右侧值与箭头间距：`--harmony-inline-gap-tight-mobile`

### 8.2 Vertical
- `status bar` 之后接 `titlebar`
- `titlebar` 与第一张卡片之间约 `--harmony-space-8`
- 卡片与卡片之间约 `--harmony-card-gap-mobile`
- 卡片与说明文案之间约 `--harmony-card-gap-mobile`

补充约束：
- 页面级 spacing 若没有组件 `Numeric Baseline` 或 fragment 真值，必须优先吸附到 `mobile-scale`。
- 页面级圆角、控制高度与分区节奏同样优先引用 `mobile-scale`，避免移动端页面系统性放大。

## 9. Composition Mapping
该章节定义布局骨架如何映射到组件 spec。后续页面实现或自动生成逻辑，必须先完成这里的装配，再进入模板填充。


### 9.0 Fast Path: Settings Page Priority
- 命中“设置页 / 个人中心设置 / 偏好设置 / 账号与安全 / 隐私管理 / 通知设置”等典型设置语义时，必须优先按本布局装配，而不是先写页面自定义列表结构。
- 设置页中的 `Entry Card`、`Group Card header row`、`Group Card setting row` 默认都由 `list.md` 承载行级布局；差异通过 trailing 内容、外层 card 语义和 `switch/divider` 组合表达。
- 只有当 `list.md` 的左右槽与 trailing rail 明确无法表达目标内容时，才允许退回页面级增强结构，并需在日志中说明原因。
- “个人中心” 若包含设置分组，允许上方存在 profile hero 等页面增强区，但其后的分组设置区仍默认优先复用 `list.md`。

| Layout Block | Component Spec | Variant / Composition | Layout Responsibility | Component Responsibility |
| --- | --- | --- | --- | --- |
| `status bar` | `public.md` | `harmony-public` + `theme(light/dark)` | 负责占据顶部 `36px` 壳层高度，并贴顶对齐 | 负责时间文本、状态图标资源、图标定位与明暗主题切换 |
| `titlebar` | `titlebar.md` | `harmony-titlebar` + `default` | 负责占据 `56px` 壳层高度，并与内容区断开 | 负责左侧返回按钮、标题文本、右侧可选操作槽 |
| `Entry Card` | `list.md` | 外层 `card container` + 单个 `harmony-list(single)` + trailing `value + chevron` | 负责卡片容器、圆角、外边距、卡片堆叠 | 负责单行项的左右槽、文本裁切、箭头与 icon 几何 |
| `Group Card` header row | `list.md` + `switch.md` | 外层 `card container` 首行使用 `harmony-list(single)`，trailing 区替换为 `harmony-switch` | 负责定义该行属于组卡片头部，并与下方行共享同一卡片容器 | `list` 负责左槽信息组织，`switch` 负责开关几何、值态与交互态 |
| `Group Card` setting row | `list.md` | `harmony-list(single)` + trailing `value + chevron` | 负责组内行堆叠、间距与是否插入 `divider` | 负责标签、右值、箭头组合以及最小宽度约束 |
| `Group Card` divider | `divider.md` | `harmony-divider(inset)`，按需插入 | 负责决定是否需要分组分隔与内缩对齐 | 负责分隔线形态、长度与透明度 |
| `Informational Note` | plain text block | 非卡片文本块，不映射为 list 组件 | 负责卡片后说明区位置与宽度 | 负责多行文本内容本身；无需进入组件 spec |

装配约束：
- `Entry Card` 与 `Group Card` 的差异在于容器级分组，而不是新增另一套行组件。
- `list.md` 仍是设置页行级承载的主组件，差异通过 trailing content 与外层容器语义表达。
- `switch.md` 仅承载开关自身，不负责头部行的标题、间距与卡片容器。
- `divider.md` 只在组卡片内部需要视觉分割时插入，不是该布局的必选组件。
- `Group Card` 内若某行存在主副文案两行信息，优先按 `list.md` 的双行高度档装配，而不是继续沿用单行高度。
- `Group Card` 容器高度必须由内部 `list item` 与 `divider` 的几何累计得到；例如两个 `64px` 行加一个 `1px` 分割线，应得到 `129px`，而不是由父容器再次压缩。

## 10. Adaptive Behavior

### 10.1 Fixed Shell vs Scrollable Content
- `status bar`、`titlebar`、`home indicator` 属于固定壳层，不参与内容高度竞争。
- 页面默认由内容区承担高度增长；当内容总高度超过壳层之间的可用空间时，应优先让内容区滚动，而不是压缩壳层高度。
- 若实现为整页滚动，固定壳层仍应保持其几何高度与语义边界不变。
- 若存在 `bindsheet` 等全屏覆盖组件，必须以 root overlay 方式挂载到 `harmony-size` 根层（`absolute/inset:0`），遮罩覆盖 `360x792` 全画布，不得仅覆盖 `.harmony-size-content`。

### 10.2 Text Growth
- `titlebar` 标题默认单行省略，不能顶掉左侧返回按钮，也不能要求右侧操作槽缩成零宽。
- 设置行右值默认单行展示，值区必须保持最小宽度，避免时间、数字与箭头换行。
- `note` 允许增长为多行文本；增长方向只向下扩展，不反向侵占上方卡片。

### 10.3 Card Growth
- `Entry Card` 高度以单行设置项为基准，不因右值变化而增高。
- `Group Card` 高度由内部行数决定；若新增设置行，容器应沿纵向增长。
- 组卡片内的开关、箭头、图标等固定几何元素禁止被拉伸以换取高度或宽度。
- 若 `Group Card` 位于滚动内容区或 flex 列容器内，必须防止其被父级 `flex-shrink` 压缩；容器高度应忠实反映内部行高累计。

### 10.4 Variant Priority
- `mobile-settings-single-column` 为默认变体，前提是页面底部没有主操作区。
- 当 note 下方出现明确的主操作按钮行时，应切换到 `mobile-settings-single-column-with-actions`。
- 若页面同时出现固定底部操作区与复杂分段导航，应优先重新评估布局类型，而不是强行落入本变体。

## 11. Semantic Token Usage
布局层必须绑定语义 token，而不是直接写死颜色值。

| Semantic Part | Recommended Token |
| --- | --- |
| Page canvas | `background_secondary` |
| Card surface | `comp_background_primary` |
| Titlebar title / primary labels | `font_primary` |
| Right-side value / note text / secondary labels | `font_secondary` |
| Primary icons | `icon_primary` |
| Secondary icons / chevron | `icon_secondary` |
| Divider inside group card | `comp_divider` |
| Titlebar icon button background / neutral control surface | `comp_background_secondary` |
| Hover overlay | `interactive_hover` |
| Pressed overlay | `interactive_pressed` |
| Focus highlight | `interactive_focus` |

应用约束：
- `note` 不得直接复用一级文本 token，应降级为 `font_secondary`。
- 卡片容器、说明文本、分割线必须与 light/dark 主题联动切换。
- 壳层背景、卡片表面、行内控件覆盖层必须使用语义 token，禁止在 layout 实现中硬编码 Figma 提取色值。

## 12. Component Placement Contract
此布局命中时，页面应优先复用以下组件 spec：
- `public.md`
- `titlebar.md`
- `list.md`
- `switch.md`
- `divider.md`（若组卡片内部需要分隔）

补充说明：
- `subheader.md` 不是该布局的必选项。
- `checkbox.md`、`button.md` 仅在扩展设置场景下按需加入。
- `size.md` 可作为设备壳层或预览容器使用，但不是内容区装配组件。

## 13. Rendering Constraints
- 禁止把整页实现为连续的匿名 frame 容器。
- 禁止把所有区块继续写成逐元素绝对定位；允许仅保留壳层级的固定区，如状态栏和 home indicator。
- 卡片内容必须以可复用的 `entry row / setting row / control row / note` 进行组织。
- 卡片内部优先使用 `flex` 或纵向流式布局。
- 右侧值区必须保持最小宽度，防止时间值与箭头挤压换行。
- 实现输出必须先满足 `Composition Mapping`，再做模板注入与样式微调。

## 14. Variant Definition

### 14.1 `mobile-settings-single-column`
适用于：
- 系统设置页
- 设备设置页
- 健康/提醒/偏好配置页

核心特征：
- 单屏移动端
- 顶部标题栏
- 中部若干圆角卡片
- 底部说明文案可选
- 无底部主操作按钮时，内容重心偏上

### 14.2 `mobile-settings-single-column-with-actions`
在本变体基础上扩展：
- 内容区底部增加操作按钮行
- 按钮位于 note 下方、home indicator 上方
- 适用于“保存设置 / 恢复默认”类页面

### 14.3 `mobile-sheet-overlay`（典型半模态框架页）
适用于：
- 以 `size` 壳层为底，叠加 `bindsheet` 的半模态页面。
- 背景内容可见但不可操作，主交互集中在底部 sheet。
- 如“服药提醒弹层”“设置二级详情半模态”“确认/编辑半模态”。

核心结构（强制）：
```html
<main class="layout-mobile-sheet-overlay">
  <div class="layout-size-root">
    <section class="layout-status-bar"></section>
    <section class="layout-page-content"></section>
    <footer class="layout-home-indicator"></footer>

    <section class="layout-bindsheet-overlay">
      <div class="layout-bindsheet-mask"></div>
      <div class="layout-bindsheet-sheet layout-bindsheet-sheet-{{state}}">
        <div class="layout-bindsheet-handle"></div>
        <header class="layout-bindsheet-header"></header>
        <div class="layout-bindsheet-content"></div>
      </div>
    </section>
  </div>
</main>
```

挂载与定位约束（强制）：
- `layout-size-root` 必须是 `360x792` 且 `position: relative`。
- `layout-bindsheet-overlay` 必须是 `position: absolute; inset: 0; width: 360px; height: 792px`。
- `layout-bindsheet-mask` 必须独立节点，覆盖 `360x792` 全画布；禁止把遮罩色挂在 sheet 本体上。
- `layout-bindsheet-sheet` 必须底部锚定（`bottom:0`），禁止作为普通文档流节点参与页面排版。
- 禁止将 `bindsheet` 挂在 `.harmony-size-content` 等流式内容槽中。

高度可调约束（强制）：
- 至少支持三档高度：`expanded / half / collapsed`。
- 高度切换只允许改变 `sheet` 高度与内部滚动区高度；遮罩尺寸与根锚点不变。
- 推荐基线：
  - `expanded`: `748px`
  - `half`: `~50%` 画布高度（可按业务定义固定值）
  - `collapsed`: 保留 header 与最小内容可见区
- 内容溢出时，滚动所有权在 `layout-bindsheet-content`，而不是根画布。

层级约束（强制）：
- 从下到上：页面内容层 -> `bindsheet-mask` -> `bindsheet-sheet`。
- `bindsheet-sheet` 必须高于 mask，且低于全局 toast/dialog（若存在）。

## 15. Audit Checklist
- [ ] 能明确识别为“移动端设置页”而非通用详情页。
- [ ] `Hit Rules` 与 `Exclusion Rules` 无冲突，且能排除 tab、主 CTA、复杂分段页面。
- [ ] 页面骨架先于组件拼装被命中。
- [ ] 主内容宽度统一为 `328px` 居中列。
- [ ] `Composition Mapping` 能将每个页面块唯一映射到组件 spec。
- [ ] 卡片被抽象为“单行入口卡”和“多行设置组卡”两类，而不是逐节点描述。
- [ ] `Adaptive Behavior` 已覆盖超长标题、超长右值、多行 note 与内容溢出场景。
- [ ] `Semantic Token Usage` 已覆盖页面、卡片、文本、图标、divider 与交互覆盖层。
- [ ] 文档描述的是布局结构，不包含业务逻辑。
- [ ] 设置行的 `single / double / avatar` 变体选择与内容行数一致，而不是统一套用单一高度。
- [ ] `Group Card` 的最终高度等于内部 `list item` 与 `divider` 的累计几何，未被 flex 容器二次压缩。
- [ ] 设置行的 `hover / pressed / focus` 状态层已接入，不止还原静态外观。
- [ ] 半模态场景命中 `mobile-sheet-overlay` 时，`bindsheet` 以 root overlay 绝对定位挂载（`inset:0`）。
- [ ] 半模态遮罩为独立 `mask` 节点且覆盖 `360x792`，不与 sheet 合并。
- [ ] 半模态至少具备 `expanded/half/collapsed` 三档高度语义，且仅 `sheet` 高度变化。
