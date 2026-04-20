# Spec: medicen-card

[Metadata]
- **Component**: `harmony-medicen-card`
- **中文名称**: 药卡
- **Template Source**: `spec/4.template/medicen-card-tem.html`
- **Benchmark Source**: `HistoryRender/Component/medicen-card/benchmark.html`
- **MCP Source**: component `3188:2895` / target `3188:2893`

## 1. Content Presentation (内容呈现格式)
- Header：时间 + 服药状态标签。
- Body：药品图标 + 名称/描述 + 时间信息。
- 标签图标与药品图标按源尺寸渲染。

### 1.1 Base Structure
```html
<div class="harmony-medicen-card harmony-medicen-card-{{status}} harmony-medicen-card-{{state}}">
  <header class="harmony-medicen-card-head">
    <time class="harmony-medicen-card-time">{{time}}</time>
    <span class="harmony-medicen-card-status">{{status}}</span>
  </header>
  <div class="harmony-medicen-card-body">
    <div class="harmony-medicen-card-drug-name">{{drugName}}</div>
    <div class="harmony-medicen-card-drug-desc">{{drugDesc}}</div>
    <div class="harmony-medicen-card-record-time">{{recordTime}}</div>
  </div>
</div>
```

### 1.2 Icon/Text/Action Snippet
```html
<div class="harmony-medicen-card-slot">{{icon}}{{label}}{{action}}</div>
```

## 2. Interaction States (交互状态)
- 业务态：`done(已服药) / pending(服药) / disabled`。
- 辅助态：`hover / pressed / focus`（演示区）。
- `interactive-preview`：文案与时间随状态切换。

## 3. Dynamic Response (动态响应)
- **Text Overflow**: 药品名称默认单行省略，描述与时间信息按设计行数预算裁切。
- **Header Constraint**: 顶部时间与状态标签必须保持同一行对齐，不能因文案变长而打散结构。
- **No Stretch Guard**: 药品图标、状态图标与标签背景保持源比例与圆角规格。
- **Empty/Placeholder**: 缺省数据时展示占位文案或空壳结构，不改变组件外部几何。

## 4. Template Injection (模版注入)
- `{{status}}`: `done|pending|disabled`
- `{{time}}`, `{{drugName}}`, `{{drugDesc}}`, `{{recordTime}}`
- `{{state}}`: `default|hover|pressed|focus`

### 4.1 Numeric Baseline (Pixso MCP 归一值)
- 卡片宽度：`328`，圆角 `20`，内边距 `14/0/4/0`，纵向间距 `12`。
- 高度矩阵：
  - 待服药/已服药 + 1 条：`122`
  - 待服药/已服药 + 2 条：`186`
  - 待服药/已服药 + 3 条：`250`
- Header 行：高度 `28`，左右内边距 `12`，时间字体 `16/700/19`。
- 状态胶囊：`78x28`，圆角 `14`，内边距 `4/8`，文案 `14/500/20`。
- 药项行：高度 `64`，左右内边距 `12`，图标 `24x24`，行内 gap `16`。
- 文案层级：药名 `16/500/22`，说明 `14/400/19`，记录时间 `14/400/19`。
- 状态背景：
  - `pending`: 卡片底色 `#FFFFFF`
  - `done`: 卡片底色 alpha `0.05`

## 5. Audit Checklist
- [ ] 仅描述视觉表现，不包含业务逻辑。
- [ ] 状态命名与 benchmark 一致。
- [ ] 图标与按钮无拉伸（返回图标/箭头/switch 拇指/状态栏图标）。
- [ ] 与 `spec/4.template/medicen-card-tem.html` 的变量契约一致。
