# Spec: bindsheet

[Metadata]
- **Component**: `harmony-bindsheet`
- **中文名称**: 半模态底部弹层
- **Template Source**: `spec/4.template/bindsheet-tem.html`
- **Benchmark Source**: `HistoryRender/Component/bindsheet/benchmark.html`
- **MCP Source**: component `61:35425` / target `1:11799`

## 1. Content Presentation (内容呈现格式)
- 蒙层容器（360x792）+ 底部 sheet（360x748）。
- sheet 内部：handle、header（title+close）、content 区。

### 1.1 Base Structure
```html
<div class="harmony-bindsheet harmony-bindsheet-{{state}}" data-draggable="{{draggable}}">
  <div class="harmony-bindsheet-mask" {{showMask}}></div>
  <div class="harmony-bindsheet-sheet harmony-bindsheet-sheet-{{state}}">
    <header class="harmony-bindsheet-header">{{title}}</header>
    <div class="harmony-bindsheet-content">{{content}}</div>
  </div>
</div>
```

### 1.2 Icon/Text/Action Snippet
```html
<div class="harmony-bindsheet-slot"><span>{{title}}</span></div>
```

## 2. Interaction States (交互状态)
- 结构态：`expanded / half / collapsed`。
- 控件态：关闭按钮 `hover / focus`。
- `interactive-preview`：支持拖拽高度并吸附到三档。

## 3. Dynamic Response (动态响应)
- **Header Overflow**: 标题默认单行省略，关闭按钮槽位保持固定交互面积。
- **Height Contract**: `expanded / half / collapsed` 仅改变 sheet 高度；蒙层始终覆盖整块画布。
- **Content Scroll Ownership**: 内容超出 sheet 可视高度时，应由内部 content 区滚动，外部壳层几何不变。
- **Empty/Placeholder**: 缺省数据时保留 handle、header、content 三段结构，不改变组件外部几何。
- **Root Mounting Contract**: 当 `bindsheet` 与 `size` 组合时，必须挂载到 `harmony-size` 根层并使用 `absolute + inset:0` 锚定 `360x792` 整页画布；禁止作为 `.harmony-size-content` 的流式子节点。
- **Mask Ownership Contract**: 遮罩必须由独立节点 `.harmony-bindsheet-mask` 承担，`sheet` 仅负责面板本体，不得把遮罩色直接挂在 `.harmony-bindsheet-sheet` 或内容层。

## 4. Template Injection (模版注入)
- `{{state}}`: `expanded|half|collapsed`
- `{{title}}`, `{{content}}`
- `{{draggable}}`: 是否允许拖拽
- `{{showMask}}`: 是否显示遮罩

### 4.1 Numeric Baseline (Pixso MCP 归一值)
- 蒙层容器：`360x792`，上内偏移 `44`。
- sheet 几何：`360x748`，顶部圆角 `32`，内边距 `8/16/0/16`。
- 遮罩透明度：`0.2`（整屏独立遮罩层）。
- handle：容器 `96x16`，条体 `48x4`，圆角 `2`。
- header：
  - 单行：高度 `56`，标题 `20/700/24`
  - 双行：高度 `69`，标题 `20/700/24`，副标题 `14/400/19`
- 关闭按钮：`40x40`，圆角 `20`。

### 4.2 Composition Layering (与 Size 组合时)
- 推荐层级顺序（由下到上）：
  1. `size` 页面底层内容（含 `public`、业务内容、home-indicator）
  2. `bindsheet-mask`（`360x792` 全屏遮罩）
  3. `bindsheet-sheet`（底部面板，`360x748`，`top:44` 或 `bottom:0`）
- `bindsheet` 根容器必须是 `size` 根容器的直接子节点，且具有独立 stacking context（如 `z-index`）。

## 5. Audit Checklist
- [ ] 仅描述视觉表现，不包含业务逻辑。
- [ ] 状态命名与 benchmark 一致。
- [ ] 图标与按钮无拉伸（返回图标/箭头/switch 拇指/状态栏图标）。
- [ ] 与 `spec/4.template/bindsheet-tem.html` 的变量契约一致。
- [ ] `bindsheet` 作为 root overlay 挂载到 `harmony-size` 根层（非 content 流式挂载）。
- [ ] `.harmony-bindsheet-mask` 为独立全屏遮罩节点，且尺寸锁定 `360x792`。
