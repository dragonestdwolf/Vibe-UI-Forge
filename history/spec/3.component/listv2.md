# Spec: list v2

[Metadata]
- **Component**: `harmony-list`
- **中文名称**: 列表
- **Intent**: 将 `list` 从“单行组件说明”升级为“行轨道 + 分割线派生几何”说明。
- **Template Source**: `spec/4.template/list-tem.html`
- **Benchmark Reference**: `HistoryRender/Component/list/benchmark.html`
- **Companion Preview**: `HistoryRender/Component/list/listv2.html`

## 1. Content Presentation (内容呈现格式)
- `list` 由一个或多个 `list item` 组成；在设置页场景中，多个 item 可组合为一个 `list group card`。
- 单个 `list item` 的横向结构由三条轨道组成：
  - `leading rail`: 图标 / 头像 / 徽标 / 开关前置符号
  - `copy rail`: 标题 / 副标题
  - `trailing rail`: 值文本 / 箭头 / 状态点 / 额外动作
- `content rail` 定义为 `copy rail + trailing rail` 的联合可见区域；它是行内主内容轨道，也是设置项分割线需要对齐的几何基线。
- `list group card` 的视觉外壳可以有圆角、背景、描边，但这些外壳属性不得改变内部轨道对齐关系。

### 1.1 Base Structure
```html
<div class="harmony-list harmony-list-{{state}}">
  <div class="harmony-list-item harmony-list-item-{{itemType}} harmony-list-item-{{state}}">
    <div class="harmony-list-leading">{{icon}}</div>
    <div class="harmony-list-main">
      <div class="harmony-list-copy">
        <span class="harmony-list-title">{{title}}</span>
        <span class="harmony-list-subtitle">{{subtitle}}</span>
      </div>
      <span class="harmony-list-trailing">{{extra}}</span>
    </div>
  </div>
</div>
```

### 1.2 Track Semantics
- `leading rail` 只负责容纳前导视觉元素，不参与 trailing 对齐。
- `harmony-list-main` 是 `content rail` 的结构容器；它同时承载 `copy rail` 与 `trailing rail`。
- 行间分割线若存在，应视为 `list item` 的派生几何，附着于当前行或组容器，不应脱离 `content rail` 单独居中。

### 1.3 Item Type Mapping
- `single`: 单行标题，允许 trailing 信息。
- `double`: 标题 + 副标题，常用于设置页连接状态。
- `triple`: 更高内容密度，但仍保持 `leading rail` 与 `content rail` 的轨道关系。
- `avatar`: 头像类前导视觉，通常拥有更大的 `leading rail` 与更大的 leading gap。

## 2. Interaction States (交互状态)
- 项目形态：`single / double / triple / avatar`
- 状态维度：`default / hover / pressed / focus / selected / disabled`
- `interactive-preview`：允许通过静态类名预览状态，但状态层不得破坏 divider 与轨道对齐关系。

## 3. Dynamic Response (动态响应)
- **Text Overflow**: 标题、副标题、附加文本需按 item type 的行数预算裁切；最后一条可见文本使用省略号。
- **Value Rail Constraint**: `trailing rail` 必须保持最小宽度并右对齐，禁止被左侧文案挤压换行。
- **Content Rail Alignment**: `content rail` 的起点应由 `padding-inline-start + leading size + leading gap` 推导；终点应对齐 `padding-inline-end` 之前的内容边界。
- **Separator Derivation Guard**: 设置页 `list group` 中的行间分割线主轴长度应与当前行的 `content rail` 对齐，自动避开 `leading rail`，不得与整卡等宽，也不得随意居中。
- **No Hardcoded Inset Rule**: 除非 benchmark 明确给出与轨道无关的固定值，否则不得直接用脱离布局语义的 magic number 定义 divider；应优先使用由 `padding / leading size / leading gap / trailing inset` 推导的结果。
- **Variant Coupling Guard**: 当 `itemType`、leading 视觉尺寸、leading gap 或 trailing 结构变化时，divider 起止点必须随 `content rail` 自动更新。
- **Container Accumulation Guard**: 当 `list` 被用于设置页的组卡片时，外层容器高度应由多个 `list item` 与其派生分割线共同累计得到；父容器不得二次收缩破坏行高。
- **No Stretch Guard**: 图标、头像、箭头、状态点保持源比例，禁止容器硬拉伸。
- **Empty/Placeholder**: 缺省数据时展示占位文本或空壳结构，不改变组件外部几何。

## 4. Template Injection (模版注入)
- `{{itemType}}`: `single|double|triple|avatar`
- `{{state}}`: `default|hover|pressed|focus|selected|disabled`
- `{{title}}`, `{{subtitle}}`, `{{extra}}`, `{{icon}}`

### 4.1 Numeric Baseline (Pixso MCP 归一值)
- 容器宽度：`328`
- 高度矩阵：
  - `1 line / Medium`: `48`
  - `2 line / Medium`: `64`
  - `3 line / Medium`: `96`
  - `1 line / Large`: `56`
  - `2 line / Large`: `72`
  - `1 line / XL`: `64`
- 通用水平内边距：`12 / 12`
- 常见 leading 视觉尺寸：
  - settings icon badge: `32`
  - avatar leading: `40`
- 常见 leading gap：
  - settings row: `12`
  - avatar row: `16`
- `content rail start = padding-inline-start + leading size + leading gap`
- `content rail end = container width - padding-inline-end`
- `trailing rail` 的最小宽度约束属于 `content rail` 内部约束，不改变 divider 的外部对齐语义。

## 5. Recommended CSS Strategy (推荐实现策略)
- 优先为 `list item` 声明显式的 `main/content` 容器，例如 `harmony-list-main`。
- 行间分割线推荐使用以下两种策略之一：
  - 作为 `list item::after` 伪元素，直接从当前行变量推导 `inset-inline-start/end`
  - 作为独立 divider 节点，但其起止点必须绑定当前行的轨道变量
- 若实现允许，使用 grid 或具名轨道比手写裸 `margin-left` 更稳健。

## 6. Audit Checklist
- [ ] 文档描述的是轨道关系，而不是单次截图的 magic number 结果。
- [ ] `harmony-list-main` 或同等语义容器明确存在，`content rail` 可被单独识别。
- [ ] 设置页分割线与 `content rail` 对齐，而不是与整卡或 leading rail 对齐。
- [ ] 不同 leading size / gap 下 divider 起点能自动更新。
- [ ] `itemType` 的选择与实际文案行数一致：单行项不误用双行，高副文案项不误压为单行。
- [ ] 若页面中该行可交互，已补齐至少 `hover / pressed / focus` 状态层。
