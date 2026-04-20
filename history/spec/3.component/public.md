# Spec: public

[Metadata]
- **Component**: `harmony-public`
- **中文名称**: 公共状态栏
- **Template Source**: `spec/4.template/public-tem.html`
- **Benchmark Source**: `HistoryRender/Component/public/benchmark.html`
- **MCP Source**: component `1:8291`


## 1. Content Presentation (内容呈现格式)
- 文本区：时间文本（15/20，Medium）。
- 图标区：右侧固定 `96x13` 图标槽，内部四个状态图标必须按固定子槽绝对定位排列，不得改成等距拉伸布局。
- 图标顺序（从左到右）：`wifi` → `single-card` → `dual-card` → `battery/cell`
- 注意：Pixso 源命名里最后一个 25.75x13 的电池样式节点名为 `cell`，但其几何与视觉实际上承担电池槽角色；页面实现应以几何真值为准，不得因为命名歧义重排顺序。

### 1.1 Base Structure
```html
<div class="harmony-public harmony-public-{{theme}}">
  <span class="harmony-public-time">{{time}}</span>
  <span class="harmony-public-icons">
    <i class="harmony-public-icon harmony-public-icon-wifi">{{wifiIcon}}</i>
    <i class="harmony-public-icon harmony-public-icon-single-card">{{singleCardIcon}}</i>
    <i class="harmony-public-icon harmony-public-icon-dual-card">{{dualCardIcon}}</i>
    <i class="harmony-public-icon harmony-public-icon-battery">{{batteryIcon}}</i>
  </span>
</div>
```

### 1.2 Icon/Text/Action Snippet
```html
<div class="harmony-public-slot">
  <span class="harmony-public-icons">
    <i class="harmony-public-icon harmony-public-icon-wifi">{{wifiIcon}}</i>
    <i class="harmony-public-icon harmony-public-icon-single-card">{{singleCardIcon}}</i>
    <i class="harmony-public-icon harmony-public-icon-dual-card">{{dualCardIcon}}</i>
    <i class="harmony-public-icon harmony-public-icon-battery">{{batteryIcon}}</i>
  </span>
</div>
```

## 2. Interaction States (交互状态)
- `light`：浅色状态栏。
- `dark`：深色状态栏。
- `interactive-preview`：主题切换时图标资源与文字对比度同步变化。

## 3. Dynamic Response (动态响应)
- **Time Overflow**: 时间文本保持单行展示，不允许换行或推挤右侧图标组。
- **Icon Layout Contract**: 四个状态图标必须在固定图标槽内按源定位排列，不能改成等距拉伸布局。
- **Sub-slot Contract**: 每个图标必须占据自己的固定子槽；`wifi / single-card / dual-card / battery` 的顺序、宽高、left/top 偏移不得互换。
- **Theme Asset Switch**: `light / dark` 切换时，文字对比度与图标资源应同步切换。
- **Empty/Placeholder**: 缺省数据时保留时间槽与图标槽，不改变组件外部几何。
- **Stable Asset Contract**: 状态栏图标必须优先复用仓库内已经验证过的稳定资源与固定槽位实现；禁止为了“看起来接近”而临时重画 WiFi/卡槽/电池结构。
- **No Template Guessing Guard**: 页面组合时不得把 `public` 简化成 `flex + 4 个图标平均分配`。一旦脱离 `96x13` 固定槽与四个子槽定位，极易在不同浏览器和缩放条件下出现错位、挤压或重叠。
- **No Iconfont Substitution Guard**: 中间两个卡槽图标（`single-card`、`dual-card`）不得用 `icon-font` 或私造 glyph 代替；应继续使用仓库内稳定资源或等价可追溯资产。

## 4. Template Injection (模版注入)
- `{{theme}}`: `light|dark`
- `{{time}}`: 时间文本
- `{{wifiIcon}}`: WiFi 图标资源
- `{{singleCardIcon}}`: 单卡图标资源
- `{{dualCardIcon}}`: 双卡图标资源
- `{{batteryIcon}}`: 电池图标资源

### 4.1 Numeric Baseline (Pixso MCP 归一值)
- 容器几何：`360x36`，内边距 `8/24/8/24`（light/dark 一致）。
- 时间文本：字号 `15`，字重 `500`，行高基线 `20`（Dark）；Light 文本框高度 `18`（视觉行高仍按 `20` 约束）。
- 图标组容器：`96x13`。
- 图标子槽基线：
  - WiFi：`15.344x12.001`，`left=0.401`，`top=0.796`
  - Single Card：`21.500x12.000`，`left=21.398`，`top=0.797`
  - Dual Card：`17.500x12.000`，`left=47.398`，`top=0.797`
  - Battery/Cell：`25.750x13.000`，`left=70.250`，`top=0`
- 图标组位置：相对父容器 `left=240`，`top=11.5`
- 时间文本框：`40x18`，`left=24`，`top=9`
- 当前稳定实现说明：
  - 页面与 benchmark 已验证方案使用仓库内固定资源引用承载四个图标槽。
  - `single-card` 与 `dual-card` 当前稳定实现不走 `HMSymbol` / icon-font。
  - 若未来要替换为矢量或字体方案，必须在不改变四个子槽几何的前提下进行，并先通过页面级回归验证。

### 4.2 Implementation Lessons (经验回写)
- 经验 1：`public` 不是通用“图标横排容器”，而是一个带固定几何子槽的状态栏组件；不能按普通 flex icon row 去理解。
- 经验 2：中间两个卡槽图标最容易在简化实现时出错。若改成 flex 平分、字体 glyph 或临时手绘，通常会在页面里出现挤压、重叠或视觉歧义。
- 经验 3：页面实现应优先直接复用 `HistoryRender/Component/public/benchmark.html` 与稳定页面版本中已经通过验证的图标资源引用方式，而不是重新发明一套“接近”的状态栏图形。

## 5. Audit Checklist
- [ ] 仅描述视觉表现，不包含业务逻辑。
- [ ] 状态命名与 benchmark 一致。
- [ ] 图标与按钮无拉伸（返回图标/箭头/switch 拇指/状态栏图标）。
- [ ] 与 `spec/4.template/public-tem.html` 的变量契约一致。
- [ ] 右侧图标组实现为 `96x13` 固定槽，而不是简单 `flex space-between`。
- [ ] `wifi / single-card / dual-card / battery` 的顺序与几何偏移与 Pixso 一致。
- [ ] 未因节点命名歧义把 `dual-card`、`battery/cell` 槽位互换。
- [ ] 页面实现未把 `single-card`、`dual-card` 替换为 icon-font、临时 SVG 或 flex 平均分配方案。
- [ ] 页面实现优先复用了仓库内已验证的稳定图标资源引用方式。
