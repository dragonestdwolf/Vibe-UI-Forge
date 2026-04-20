# Spec: switch

[Metadata]
- **Component**: `harmony-switch`
- **中文名称**: 开关
- **Template Source**: `spec/4.template/switch-tem.html`
- **Benchmark Source**: `HistoryRender/Component/switch/benchmark.html`
- **MCP Source**: component `44:35265` / target `1:10219`


## 1. Content Presentation (内容呈现格式)
- 轨道（36x20）与拇指（16x16）构成。
- `aria-checked` 驱动 on/off 位移与颜色切换。

### 1.1 Base Structure
```html
<div class="harmony-switch harmony-switch-{{state}}" aria-checked="{{checked}}">
  <span class="harmony-switch-track"></span>
  <span class="harmony-switch-thumb"></span>
</div>
```

### 1.2 Icon/Text/Action Snippet
```html
<div class="harmony-switch-slot"><span class="harmony-switch-thumb"></span></div>
```

## 2. Interaction States (交互状态)
- 值态：`off / on`。
- 状态维度：`enabled / hover / pressed / focus / disabled`。
- `interactive-preview`：点击切换 `aria-checked`。

## 3. Dynamic Response (动态响应)
- **State Geometry**: `off / on` 切换仅通过轨道颜色与拇指位移表达，组件外部占位保持不变。
- **Overlay Layering**: `hover / pressed / focus` 的覆盖层必须叠加在轨道之上，不能改变轨道尺寸。
- **No Stretch Guard**: 轨道与拇指必须保持源尺寸比例，禁止通过拉伸适配父容器。
- **Empty/Placeholder**: 缺省数据时展示关闭态或空壳结构，不改变组件外部几何。
- **Carrier Reset Guard**: 若实现层使用 `<button>` 承载 `switch` 交互，必须显式清除原生按钮默认外观（如黑色描边、默认 padding、系统 appearance）；不得让用户感知为“按钮”。

## 4. Template Injection (模版注入)
- `{{checked}}`: `true|false`
- `{{state}}`: `enabled|hover|pressed|focus|disabled`
- `{{disabled}}`: disabled attribute

### 4.1 Numeric Baseline (Pixso MCP 归一值)
- 组件几何：`36x20`（target `1:10219`）。
- 轨道：圆角 `12`。
- 拇指：`16x16`，圆角 `8`，垂直偏移 `2`。
- 位移矩阵（checked）：
  - `off`：thumb `x=2`
  - `on`：thumb `x=18`
- 颜色态：`on + enabled` 使用强调底色；`off` 使用中性轨道色。

## 5. Audit Checklist
- [ ] 仅描述视觉表现，不包含业务逻辑。
- [ ] 状态命名与 benchmark 一致。
- [ ] 图标与按钮无拉伸（返回图标/箭头/switch 拇指/状态栏图标）。
- [ ] 与 `spec/4.template/switch-tem.html` 的变量契约一致。
- [ ] 若 `switch` 借用 `<button>` 承载交互，模板已清除默认按钮描边、padding 与 appearance。
