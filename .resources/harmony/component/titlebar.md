# Spec: titlebar

[Metadata]
- **Component**: `harmony-titlebar`
- **中文名称**: 标题栏
- **Template Source**: `spec/4.template/titlebar-tem.html`
- **Benchmark Source**: `HistoryRender/Component/titlebar/benchmark.html`
- **MCP Source**: component `6:34925` / target `1:8277`


## 1. Content Presentation (内容呈现格式)
- 左侧：圆形返回按钮（40x40，24x24 图标内映射）。
- 中间：标题文本（20/28，Bold）。
- 右侧：圆形操作按钮。

### 1.1 Base Structure
```html
<div class="harmony-titlebar harmony-titlebar-{{state}}">
  <button class="harmony-titlebar-back" type="button">{{leftIcon}}</button>
  <h3 class="harmony-titlebar-title">{{title}}</h3>
  <button class="harmony-titlebar-action" type="button">{{rightIcon}}</button>
</div>
```

### 1.2 Icon/Text/Action Snippet
```html
<div class="harmony-titlebar-slot">{{icon}}{{label}}{{action}}</div>
```

## 2. Interaction States (交互状态)
- `default`：默认态。
- `hover / pressed / focus / disabled`：标题栏交互态（左右按钮与标题可读性联动）。
- `interactive-preview`：状态切换后验证标题仍保持视觉居中。

## 3. Dynamic Response (动态响应)
- **Text Overflow**: 标题默认单行省略，不能侵占左右操作槽的固定交互面积。
- **Slot Constraint**: 左右按钮槽保持稳定宽度，用于维持标题的视觉居中与点击热区。
- **No Stretch Guard**: 返回图标、圆形按钮与右侧操作图标必须保持源比例。
- **Empty/Placeholder**: 缺省数据时展示占位标题或空槽结构，不改变组件外部几何。

## 4. Template Injection (模版注入)
- `{{title}}`: 标题文本
- `{{leftIcon}}`: 左侧图标
- `{{rightIcon}}`: 右侧图标
- `{{state}}`: `default|hover|pressed|focus|disabled`

### 4.1 Numeric Baseline (Pixso MCP 归一值)
- 组件几何：`328x56`（target `1:8277`）。
- 槽位矩阵：
  - 左按钮槽：`40x56`（内部点击面 `40x40`，垂直内边距 `8`）。
  - 中标题槽：`240x56`（左右槽间距 `8`）。
  - 右按钮槽：`40x56`（内部点击面 `40x40`，垂直内边距 `8`）。
- 字体三元组（标题）：`20 / 700 / 28`。
- 图标基线：左右图标绘制框 `24x24`，按钮容器保持 `40x40` 不变。

## 5. Audit Checklist
- [ ] 仅描述视觉表现，不包含业务逻辑。
- [ ] 状态命名与 benchmark 一致。
- [ ] 图标与按钮无拉伸（返回图标/箭头/switch 拇指/状态栏图标）。
- [ ] 与 `spec/4.template/titlebar-tem.html` 的变量契约一致。
