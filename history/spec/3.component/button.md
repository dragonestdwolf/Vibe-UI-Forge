# Spec: button

[Metadata]
- **Component**: `harmony-button`
- **中文名称**: 按钮
- **Template Source**: `spec/4.template/button-tem.html`
- **Benchmark Source**: `HistoryRender/Component/button/benchmark.html`
- **MCP Source**: component `16:36612` / target `16:36613`

## 1. Content Presentation (内容呈现格式)
- 内容槽：`icon + label + spinner` 组合。
- overlay/focus/spinner 均为视觉层，禁止与主背景混写。

### 1.1 Base Structure
```html
<div class="harmony-button harmony-button-{{variant}} harmony-button-{{state}}">
  {{icon}}
  <span class="harmony-button-label">{{label}}</span>
  <span class="harmony-button-spinner" {{showSpinner}}></span>
</div>
```

### 1.2 Icon/Text/Action Snippet
```html
<div class="harmony-button-slot">{{icon}}<span>{{label}}</span></div>
```

## 2. Interaction States (交互状态)
- 视觉变体：`emphasized / normal / warning / text`。
- 状态维度：`enabled / hover / pressed / focus / loading / disabled`。
- `interactive-preview`：真实点击、选择、加载态切换。

## 3. Dynamic Response (动态响应)
- **Text Overflow**: 按钮文案默认单行省略，不能因为文案变长而撑高按钮。
- **Inline Layout Stability**: `icon + label + spinner` 的间距与对齐必须稳定；进入 `loading` 态时仅切换内容表现，不改变按钮外部几何。
- **No Stretch Guard**: 图标、spinner、圆角与描边保持源比例，禁止通过拉伸适配尺寸。
- **Empty/Placeholder**: 缺省数据时展示占位文案或空壳结构，不改变组件外部几何。

## 4. Template Injection (模版注入)
- `{{variant}}`: `emphasized|normal|warning|text`
- `{{state}}`: `enabled|hover|pressed|focus|loading|disabled`
- `{{icon}}`, `{{label}}`, `{{showSpinner}}`, `{{disabled}}`

### 4.1 Numeric Baseline (Pixso MCP 归一值)
- 尺寸维度：
  - Medium：容器 `120x40`，圆角 `20`，内边距 `9/16`，内容 gap `8`，文案 `16/500/19`
  - Small：容器 `72x28`，圆角 `14`，内边距 `4/8`，内容 gap `0`，文案 `14/500/20`
- 状态子槽尺寸协议（target `16:36613`）：
  - `loading / Medium`：宽度扩展为 `128`，spinner `24x24`，文案槽宽 `64`
  - `loading / Small`：宽度扩展为 `92`，spinner `16x16`，文案槽宽 `56`
  - `focus / Medium`：外环 `128x48`，描边 `2`
  - `focus / Small`：外环 `80x36`，描边 `2`
- 强调态（Emphasized）与普通态（Normal）共享上述几何基线，颜色与描边由 `variant/state` 控制。

## 5. Audit Checklist
- [ ] 仅描述视觉表现，不包含业务逻辑。
- [ ] 状态命名与 benchmark 一致。
- [ ] 图标与按钮无拉伸（返回图标/箭头/switch 拇指/状态栏图标）。
- [ ] 与 `spec/4.template/button-tem.html` 的变量契约一致。
