# Spec: list

[Metadata]
- **Component**: `harmony-list`
- **中文名称**: 列表
- **Template Source**: `spec/4.template/list-tem.html`
- **Benchmark Source**: `HistoryRender/Component/list/benchmark.html`
- **MCP Source**: component `62:35191` / target `62:35190`


## 1. Content Presentation (内容呈现格式)
- 左槽：图标/头像 + 主副文案。
- 右槽：值文本 + 箭头/状态点。
- 列表项高度根据形态锁定（48/56/64/72）。

### 1.1 Base Structure
```html
<div class="harmony-list harmony-list-{{state}}">
  <div class="harmony-list-item harmony-list-item-{{itemType}} harmony-list-item-{{state}}">
    <div class="harmony-list-leading">{{icon}}</div>
    <div class="harmony-list-copy">
      <span>{{title}}</span>
      <span>{{subtitle}}</span>
    </div>
    <span class="harmony-list-trailing">{{extra}}</span>
  </div>
</div>
```

### 1.2 Icon/Text/Action Snippet
```html
<div class="harmony-list-slot">{{icon}}<span>{{title}}</span></div>
```

## 2. Interaction States (交互状态)
- 项目形态：`single / double / triple / avatar`。
- 状态维度：`default / hover / selected / disabled`。
- `interactive-preview`：点击选中 + 全局状态覆盖。

## 3. Dynamic Response (动态响应)
- **Text Overflow**: 标题、副标题、附加文本需按 item type 的行数预算裁切；最后一条可见文本使用省略号。
- **Value Rail Constraint**: 右侧值文本、箭头或状态点必须保持最小宽度并右对齐，禁止被左侧文案挤压换行。
- **No Stretch Guard**: 图标、头像、箭头、状态点保持源比例，禁止容器硬拉伸。
- **Empty/Placeholder**: 缺省数据时展示占位文本或空壳结构，不改变组件外部几何。
- **Variant Selection Guard**: `itemType` 必须先由内容行数决定，再映射到固定高度档；不得因为页面上下文是“设置页”就把所有行统一压成 `single`。
- **Container Accumulation Guard**: 当 `list` 被用于设置页的组卡片时，外层容器高度应由多个 `list item` 与 `divider` 累计得到；`list` 行高命中后，父容器不得再收缩破坏该几何。
- **State Layer Guard**: 若页面需要交互预览或可点击设置项，`hover / pressed / focus / selected / disabled` 至少应保证与状态维度契约一致，不能只落默认态。

## 4. Template Injection (模版注入)
- `{{itemType}}`: `single|double|triple|avatar`
- `{{state}}`: `default|hover|selected|disabled`
- `{{title}}`, `{{subtitle}}`, `{{extra}}`, `{{icon}}`

### 4.1 Numeric Baseline (Pixso MCP 归一值)
- 容器宽度：`328`（target `62:35190`）。
- 高度矩阵（行数/尺寸）：
  - `1 line / Medium`: `48`
  - `2 line / Medium`: `64`
  - `3 line / Medium`: `96`
  - `1 line / Large`: `56`
  - `2 line / Large`: `72`
  - `1 line / XL`: `64`
- 通用水平内边距：`12 / 12`。
- 子槽几何：
  - 左槽宽 `192`（icon + copy），右槽宽 `112`（value rail）。
  - `2 line / Medium`：左槽纵向内边距 `10 / 10`，gap `2`。
  - `1 line / Medium`：左槽纵向内边距 `13 / 13`。
  - `1 line / Large`：左槽纵向内边距 `17 / 17`，icon 与文案 gap `12`。
  - `1 line / XL`：左槽纵向内边距 `8 / 8`，icon 与文案 gap `16`。
- 字体三元组（行级）：
  - 主文案：`16 / 500 / 21`
  - 次文案：`14 / 400 / 19`
  - 右值：`14 / 400 / 19`

## 5. Audit Checklist
- [ ] 仅描述视觉表现，不包含业务逻辑。
- [ ] 状态命名与 benchmark 一致。
- [ ] 图标与按钮无拉伸（返回图标/箭头/switch 拇指/状态栏图标）。
- [ ] 与 `spec/4.template/list-tem.html` 的变量契约一致。
- [ ] `itemType` 的选择与实际文案行数一致：单行项不误用双行，高副文案项不误压为单行。
- [ ] 若组件被组合进设置分组卡片，外层卡片高度已按行高累计校验，而非只校验单个 item。
- [ ] 若页面中该行可交互，已补齐至少 `hover / pressed / focus` 状态层。
