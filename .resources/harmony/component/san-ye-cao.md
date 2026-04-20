# Spec: san-ye-cao

[Metadata]
- **Component**: `harmony-san-ye-cao`
- **中文名称**: 三叶草
- **Template Source**: `spec/4.template/san-ye-cao-tem.html`
- **Benchmark Source**: `HistoryRender/Component/san-ye-cao/benchmark.html`
- **MCP Source**: component `3188:4` / target `3187:2332`

## 1. Content Presentation (内容呈现格式)
- 基本结构：右叶 + 顶叶 + 核心 + 左叶。
- 通过 variant 切换四片叶片资源。

### 1.1 Base Structure
```html
<div class="harmony-san-ye-cao harmony-san-ye-cao-{{variant}} harmony-san-ye-cao-{{state}}">
  <span class="harmony-clover-leaf-right">{{leafRight}}</span>
  <span class="harmony-clover-leaf-top">{{leafTop}}</span>
  <span class="harmony-clover-core">{{core}}</span>
  <span class="harmony-clover-leaf-left">{{leafLeft}}</span>
</div>
```

### 1.2 Icon/Text/Action Snippet
```html
<div class="harmony-san-ye-cao-slot">{{icon}}{{label}}{{action}}</div>
```

## 2. Interaction States (交互状态)
- 视觉变体：`variant-a / variant-b`。
- 交互态：`hover`（轻微旋转/缩放）。
- `interactive-preview`：版本切换 + hover 开关。

## 3. Dynamic Response (动态响应)
- **Variant Asset Switch**: 叶片资源仅随 `variant` 切换，切换前后组件占位与中心点保持不变。
- **Motion Constraint**: `hover` 态只允许轻微旋转或缩放，不得改变组件占位框。
- **No Stretch Guard**: 右叶、顶叶、核心、左叶均按源比例渲染，禁止非等比拉伸。
- **Empty/Placeholder**: 缺省数据时展示静态空壳结构，不改变组件外部几何。

## 4. Template Injection (模版注入)
- `{{variant}}`: `a|b`
- `{{state}}`: `default|hover`
- `{{interactive}}`: 是否开启交互动画
- `{{leafRight}}`, `{{leafTop}}`, `{{core}}`, `{{leafLeft}}`: 四叶片资源槽

### 4.1 Numeric Baseline (Pixso MCP 归一值)
- 组件几何：`156x156`（state set target `3187:2332`，variant symbol `3187:2330/2331`）。
- 叶片资源几何（主形）：
  - 顶叶：约 `73x83`
  - 左叶：约 `78x74`
  - 右叶：约 `78x74`
- 子槽尺寸协议：
  - 三个功能 icon：`16x16`
  - 叶片中心对齐基准：组件几何中心点不随 `variant` 变化。
- 变体映射：
  - `完美三叶草` -> `variant-a`
  - `活力三叶草` -> `variant-b`

## 5. Audit Checklist
- [ ] 仅描述视觉表现，不包含业务逻辑。
- [ ] 状态命名与 benchmark 一致。
- [ ] 图标与按钮无拉伸（返回图标/箭头/switch 拇指/状态栏图标）。
- [ ] 与 `spec/4.template/san-ye-cao-tem.html` 的变量契约一致。
