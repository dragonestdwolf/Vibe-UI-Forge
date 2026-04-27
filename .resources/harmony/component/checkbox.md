# Spec: checkbox

[Metadata]
- **Component**: `harmony-checkbox`
- **中文名称**: 复选框
- **Template Source**: `spec/4.template/checkbox-tem.html`
- **Benchmark Source**: `HistoryRender/Component/checkbox/benchmark.html`
- **MCP Source**: component `44:35189` / target `1:10061`

## 1. Content Presentation (内容呈现格式)
- 由外框、选中勾、focus ring 叠层构成。
- 尺寸切换时所有子层同比例映射。

### 1.1 Base Structure
```html
<div class="harmony-checkbox harmony-checkbox-{{size}} harmony-checkbox-{{state}}" aria-checked="{{checked}}">
  <span class="harmony-checkbox-inner"></span>
  <span class="harmony-checkbox-check"></span>
  <span class="harmony-checkbox-focus-ring"></span>
</div>
```

### 1.2 Icon/Text/Action Snippet
```html
<div class="harmony-checkbox-slot"><span class="harmony-checkbox-check"></span></div>
```

## 2. Interaction States (交互状态)
- 尺寸：`sm(16) / md(24)`。
- 值态：`unchecked / checked`。
- 状态维度：`enabled / hover / pressed / focus / disabled`。
- `interactive-preview`：真实点击切换。

## 3. Dynamic Response (动态响应)
- **Size Scaling**: 外框、勾形、focus ring 仅随 `sm / md` 尺寸 token 成组切换，不允许独立缩放。
- **State Layering**: focus ring 属于外围视觉层，显示与隐藏不能改变复选框本体占位。
- **No Stretch Guard**: 方框与勾形必须保持等比渲染，禁止非等比拉伸。
- **Empty/Placeholder**: 缺省数据时展示未选中或空壳结构，不改变组件外部几何。

## 4. Template Injection (模版注入)
- `{{size}}`: `sm|md`
- `{{checked}}`: `true|false`
- `{{state}}`: `enabled|hover|pressed|focus|disabled`
- `{{disabled}}`: disabled attribute

### 4.1 Numeric Baseline (Pixso MCP 归一值)
- 尺寸矩阵（component set `44:35189`）：
  - `sm`: `16x16`
  - `md`: `24x24`
- `sm + unchecked + enabled`（target `1:10061`）：
  - 外框：`16x16`，圆角 `8`
  - 内圈：`13.333x13.333`，偏移 `1.333/1.333`
  - 内圈描边：`1`
- 状态层约束：
  - `checked` 与 `unchecked` 仅切换勾形/底色，不改变外框几何。
  - `focus` 外环为独立层，外扩不侵占本体 `16/24` 几何。

## 5. Audit Checklist
- [ ] 仅描述视觉表现，不包含业务逻辑。
- [ ] 状态命名与 benchmark 一致。
- [ ] 图标与按钮无拉伸（返回图标/箭头/switch 拇指/状态栏图标）。
- [ ] 与 `spec/4.template/checkbox-tem.html` 的变量契约一致。
