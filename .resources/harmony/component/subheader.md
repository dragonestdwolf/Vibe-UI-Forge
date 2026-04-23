# Spec: subheader

[Metadata]
- **Component**: `harmony-subheader`
- **中文名称**: 二级标题栏
- **Template Source**: `spec/4.template/subheader-tem.html`
- **Benchmark Source**: `HistoryRender/Component/subheader/benchmark.html`
- **MCP Source**: component `36:35581` / target `36:35366`

## 1. Content Presentation (内容呈现格式)
- 左区：主标题+副标题纵向排布。
- 右区：操作文本按钮右对齐。

### 1.1 Base Structure
```html
<div class="harmony-subheader harmony-subheader-{{state}}">
  <div class="harmony-subheader-left">
    <h3 class="harmony-subheader-title">{{title}}</h3>
    <p class="harmony-subheader-subtitle">{{subtitle}}</p>
  </div>
  <button class="harmony-subheader-action harmony-subheader-action-{{actionState}}" {{showAction}}>{{actionText}}</button>
</div>
```

### 1.2 Icon/Text/Action Snippet
```html
<div class="harmony-subheader-slot">{{icon}}{{label}}{{action}}</div>
```

## 2. Interaction States (交互状态)
- 容器态：`default / disabled`（影响整行可读性与交互开关）。
- 操作态：`default / hover / pressed / focus / disabled`（仅作用于右侧操作位）。
- `interactive-preview`：容器态与操作态可独立切换，验证维度分离。

## 3. Dynamic Response (动态响应)
- **Text Overflow**: 主标题与副标题按既定行数预算裁切，默认使用省略号收尾。
- **Action Slot Constraint**: 右侧操作文本或按钮保持最小点击区域与右对齐，不能被左侧标题区挤压到换行。
- **No Stretch Guard**: 操作文案、图标与分隔空间保持源比例与间距节奏。
- **Empty/Placeholder**: 缺省数据时展示无操作或占位标题结构，不改变组件外部几何。

## 4. Template Injection (模版注入)
- `{{title}}`, `{{subtitle}}`, `{{actionText}}`
- `{{state}}`: `default|disabled`
- `{{actionState}}`: `default|hover|pressed|focus|disabled`
- `{{showAction}}`: 是否显示右侧操作

### 4.1 Numeric Baseline (Pixso MCP 归一值)
- 组件几何：`328x72`（target `36:35366`）。
- 左区（`.left`）：`190x69`，内边距 `18(top) / 0 / 8(bottom) / 0`，垂直 gap `2`。
- 右区（`.right`）：`138x72`，内边距 `28(top) / 0 / 8(bottom) / 0`，右对齐。
- 字体三元组：
  - 主标题：`20 / 700 / 28`
  - 副标题：`14 / 400 / 19`
  - 右侧动作：`14 / 500 / 20`
- 最小交互槽：右侧动作区最小点击高度 `40`。

## 5. Audit Checklist
- [ ] 仅描述视觉表现，不包含业务逻辑。
- [ ] 状态命名与 benchmark 一致。
- [ ] 图标与按钮无拉伸（返回图标/箭头/switch 拇指/状态栏图标）。
- [ ] 与 `spec/4.template/subheader-tem.html` 的变量契约一致。
