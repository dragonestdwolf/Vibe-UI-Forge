# Spec: bottomtab

[Metadata]
- **Component**: `harmony-bottomtab`
- **中文名称**: 底部页签
- **Template Source**: `spec/4.template/bottomtab-tem.html`
- **Benchmark Source**: `HistoryRender/Component/bottomtab/benchmark.html`
- **MCP Source**: component `66:20967` / item-port `7:46449` / item-land `80:13293`

## 1. Content Presentation (内容呈现格式)
- 组件由 `surface + content rail + safe-area rail` 三层构成。
- `content rail` 内承载多个等宽页签项，页签项内容固定为 `icon + label`。
- `land=off` 时页签项使用纵向结构（icon 在上、label 在下）；`land=on` 时页签项使用横向结构（icon 在左、label 在右）。
- 页签项仅允许一个激活态，激活态图标与文案同步强调；未激活态整体弱化展示。
- 图标策略特例：`bottomtab` 不跟随全局“线性图标优先”默认规则，本组件默认必须使用 `fill` 图标。

### 1.1 Base Structure
```html
<nav class="harmony-bottomtab harmony-bottomtab-count-{{count}} harmony-bottomtab-land-{{land}}">
  <div class="harmony-bottomtab-surface">
    <div class="harmony-bottomtab-content">
      {{items}}
    </div>
    <div class="harmony-bottomtab-safe-area">{{safeArea}}</div>
  </div>
</nav>
```

### 1.2 Icon/Text/Action Snippet
```html
<button class="harmony-bottomtab-item harmony-bottomtab-item-activated">
  <span class="harmony-bottomtab-item-icon">{{icon}}</span>
  <span class="harmony-bottomtab-item-label">{{label}}</span>
</button>
```

说明：上面的 `{{icon}} / {{label}}` 仅用于说明 `items` 插槽中的单项结构语义，不属于根模板强制输入契约。

## 2. Interaction States (交互状态)
- 数量维度：`2 / 3 / 4 / 5`。
- 布局维度：`land=off / on`。
- 单项值态：`activated / default`。
- `interactive-preview`：点击切换激活项；再次点击当前激活项时可回滚页面顶部或指定锚点。

## 3. Dynamic Response (动态响应)
- **Equal Width Contract**: 页签项宽度必须随 `count` 在 360 宽内容轨道内等比分配，不允许因为文案长短改变单项宽度。
- **Layout Mode Guard**: `land=off` 固定为竖向 `icon + label`；`land=on` 固定为横向 `icon + label`，不得在页面组合时混用。
- **Text Overflow**: 页签标签保持单行展示并省略；中文建议控制在 `2-4` 字内，英文尽量为一个单词或一个短词组。
- **Safe Area Guard**: 组件总高包含底部安全区轨道；`content` 层与 `safe-area` 层必须分离，不能把可点击热区延伸到安全区轨道内。
- **Fill Icon Guard**: `bottomtab` 图标默认只能使用 `fill` 图标，不允许回退为线性 icon；这是组件级特例，优先级高于全局默认的线性图标规则。
- **Icon Color Guard**: 未激活态图标默认使用 `icon_secondary`，激活态图标默认使用 `icon_emphasize`；文案颜色需与图标态同步。
- **Solid Surface Guard**: 底部页签在页面组合态默认使用实色背景底板，禁止使用半透明叠底或模糊材质导致滚动内容透出到底栏下方。
- **No Top Stroke Guard**: 默认样式不使用顶部描边分割线；若页面确需分隔，必须在上层页面规范中单独声明，不能作为组件默认实现。
- **No Stretch Guard**: 图标固定为 `24x24` 几何基线，禁止通过容器挤压或拉伸改变图标比例。
- **Single Activation Guard**: 同一时刻仅允许一个激活页签；激活态文案色与图标色同步强调，不允许出现“文案激活但图标未激活”的不一致表现。

## 4. Template Injection (模版注入)
- `{{count}}`: `2|3|4|5`
- `{{land}}`: `off|on`
- `{{items}}`: 页签项插槽，插入后的子节点必须使用 `.harmony-bottomtab-item` 语义结构
- `{{safeArea}}`: 底部安全区/系统导航条占位插槽

### 4.1 Numeric Baseline (Pixso MCP + HarmonyOS Guide 归一值)
- 组件集：`BottomTab-Phone (66:20967)`。
- 容器宽度：`360`。
- 总高：
  - `land=off`: `73`
  - `land=on`: `68`
- 分层高度：
  - `content rail`: `45`（off） / `40`（on）
  - `safe-area rail`: `28`
- 页签项均分宽度：
  - `count=2`: `180`
  - `count=3`: `120`
  - `count=4`: `90`
  - `count=5`: `72`
- 单项几何：
  - `.Port / Activated=*`: `32x45` 语义内容盒，纵向布局，padding `4/4/4/4`，icon-label gap `2`
  - `.Land / Activated=*`: `65x40` 语义内容盒，横向布局，padding `8/8/8/8`，icon-label gap `8`
- 图标与文本：
  - 图标：`24x24` 容器，默认使用 fill glyph
  - 标签：`10 / 500`
  - 未激活态图标色：`var(--harmony-icon_secondary)`
  - 激活态图标色：`var(--harmony-icon_emphasize)`
  - 激活态文本色：`rgba(10, 89, 247, 1)`（对应 Harmony 强调色）
  - 未激活态文本色：`rgba(0, 0, 0, 0.6)`（对应 Harmony 次级文本色）
- 背板视觉：
  - 组件默认实现回归实色底板：`var(--harmony-comp_background_primary)`
  - 禁止默认透出滚动内容的半透明/模糊背板
  - 默认不保留顶部 `1px` 分割描边
- HarmonyOS 在线文档补充：
  - 默认高度参考 `48vp` 内容区
  - 图标默认 `24x24vp`
  - 常规数量建议 `3-5`
  - 需避让系统导航条，安全区热区独立

## 5. Audit Checklist
- [ ] 仅描述视觉表现，不包含业务逻辑。
- [ ] 状态命名与 Pixso 节点一致：`Activated` 归一到 `activated/default` 值态。
- [ ] 图标与按钮无拉伸（返回图标/箭头/switch 拇指/状态栏图标）。
- [ ] 与 `spec/4.template/bottomtab-tem.html` 的变量契约一致。
- [ ] `count=2/3/4/5` 的单项宽度按 360 内容轨道均分，不因标签长短漂移。
- [ ] `land=off/on` 的单项布局已区分为纵向/横向，且未混用。
- [ ] 安全区轨道独立存在，未把页签热区直接压到导航条区域。
- [ ] 所有 `bottomtab` 图标均为 fill 图标，而非线性图标。
- [ ] 未激活态图标使用 `icon_secondary`，激活态图标使用 `icon_emphasize`。
- [ ] 底栏默认使用实色背景，滚动内容不会透出或与底栏颜色叠影。
- [ ] 默认实现未包含顶部描边分割线。
