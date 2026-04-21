# 06 | 配置 Page Type 与 Layout

> 这一篇说明如何定义页面类型（page_type）和布局模板（layout）。Page / Layout 是比 Block 更灵活的一层：它不是固定区块，而是由源码模板、Markdown 装配协议、资源索引共同支撑的页面模板。

---

## 1. 先理解 Page Type 与 Layout

这一组先回答：Page Type 是什么、Layout 是什么、为什么 Layout 要比 Block 更灵活。

### 1.1 Page Type 是什么

`page_type` 是一类页面的名字，告诉 AI 当前请求属于哪种页面结构。

当用户说“生成一个设置页”，AI 通过 `page_type` 知道：

- 应该读取哪个 layout markdown。
- 这个页面属于哪个页面族。
- 哪些 Block / Component 是默认组合。
- 哪些区域可以隐藏、替换或按需求变化。

Page Type 是 Resource Layer 的路由层。

```text
用户请求
  ↓
route-index.md
  ↓
page_type
  ↓
layout/{page_type}.md
```

---

### 1.2 Layout 是什么

Layout 是 `page_type` 对应的页面模板。它不只是 Markdown，也应该有源码或运行层支撑。

更准确地说，Layout 由三部分组成：

| 部分 | 作用 |
|---|---|
| Layout 源码 / runtime | 实现页面级装配能力，例如 slot、显隐、替换和布局容器 |
| Layout Markdown | 给 AI 看的装配协议，说明什么时候用、怎么组、哪些 slot 可替换 |
| route / resource index | 让 AI 从用户请求找到对应 layout 和资源 |

Layout 负责同时说明和支撑：

- 页面由哪些固定 Block / Component 组成。
- 哪些区域是必选的。
- 哪些区域可以隐藏或关闭。
- 哪些位置是 slot，可以替换为其他 Block。
- 每个 slot 允许替换成哪些候选 Block。
- 页面生成时必须遵守哪些约束。

一句话：

```text
Layout 不是“固定页面截图”，而是“源码装配能力 + Markdown 插槽规则”。
```

---

### 1.3 Layout 为什么比 Block 更灵活

Block 是一个稳定的区块组合，Layout 是整个页面的装配规则。

| 层级 | 稳定性 | 灵活性 | 例子 |
|---|---|---|---|
| Component | 最稳定 | 最小 | Button、SettingsRow、Switch |
| Block | 中等 | 局部可裁剪 | AccountCard、SettingsSection、HealthSummary |
| Layout | 更灵活 | 页面级组合、显隐和替换 | mobile-settings、health-dashboard |

一个 `mobile-settings` layout 可以规定：

- 顶部必须有 TitleBar。
- 主体默认使用 `settings-page` Block。
- `AccountCard` 可以隐藏。
- `quick-actions` slot 可以为空，也可以替换为 `device-actions` 或 `privacy-actions`。
- 底部导航可以根据场景关闭。

所以 Page / Layout 这一层不应该写死成一整块页面，而应该同时具备：

```text
源码里的装配能力
  +
Markdown 里的固定骨架、可显隐区域、可替换 slot、生成约束
```

---

### 1.4 Page Type、Layout、Block 的关系

```text
route-index.md
  ↓ 命中
page_type
  ↓ 读取
layout/{page_type}.md
  ↓ 指导
fixed_blocks / slots / needed_components
  ↓ 调用
layout source / runtime
  ↓ grounding
src/blocks/** + src/component/**
  ↓
生成页面
```

| 对象                      | 作用                     |
| ----------------------- | ---------------------- |
| `route-index.md`        | 判断用户请求命中哪个 `page_type` |
| `layout/{page_type}.md` | 定义页面模板、slot、显隐和替换规则    |
| Layout source / runtime | 实现页面级 slot、显隐和装配能力     |
| `block/*.md`            | 说明某个 Block 如何调用和裁剪     |
| `src/blocks/**`         | 提供真实 Block 组合源码        |
| `src/component/**`      | 提供最小组件真值               |

---

## 2. Page Type 与 Layout 配置流程

这一组说明如何从页面族归纳出 `page_type`，再落成 layout 源码能力和可被 AI 消费的 layout markdown。

### 2.1 配置工作流

```text
设计师归纳页面族
  ↓
定义 page_type 和 route 命中规则
  ↓
梳理页面固定骨架
  ↓
列出 fixed_blocks / needed_components
  ↓
定义可显隐区域
  ↓
定义 slot 和可替换 Block 清单
  ↓
Agent 生成 / 更新 layout source 和 layout markdown
  ↓
Agent 更新 route-index.md
  ↓
用真实 prompt 试跑并验收
```

设计师主要确认：

- 这个 page_type 是否代表一类页面，而不是单个页面。
- layout 的固定骨架是否稳定。
- 哪些区域可以隐藏。
- 每个 slot 可以替换成哪些 Block。
- 哪些组合不允许出现。
- layout 源码是否真的支持这些 slot 和显隐能力。

---

### 2.2 步骤 1：判断 page_type

判断 `page_type` 的依据：

| 判断维度 | 例子 |
|---|---|
| 页面意图相同 | 都是设置页、账号设置页、网络设置页 |
| 布局结构相似 | 都有顶部标题 + 主体分组 + 列表项 |
| Block 组合相似 | 都会用 AccountCard、SettingsSection、SettingsRow |
| 可变化区域类似 | 都允许隐藏账号卡、替换快捷操作区 |

命名建议：

| 命名方式 | 例子 | 适用场景 |
|---|---|---|
| `{device}-{function}` | `mobile-settings` | 移动端特定页面 |
| `{domain}-dashboard` | `health-dashboard` | 仪表盘类页面 |
| `{domain}-form` | `profile-form` | 表单类页面 |

---

### 2.3 步骤 2：定义固定骨架

固定骨架是这个页面类型的基本结构。

例如 `mobile-settings`：

```text
Page
├── AppShell
├── HeaderSlot
├── AccountSlot
├── ContentSections
├── ActionSlot
└── FooterSlot
```

固定骨架只表达页面层级，不要写成逐像素设计稿。

---

### 2.4 步骤 3：定义可显隐区域

Layout 需要说明哪些区域默认显示，哪些场景可以隐藏。

```markdown
## visibility_rules

| 区域 | 默认 | 何时隐藏 |
|---|---|---|
| AccountSlot | 显示 | 纯系统设置页、无账号信息时隐藏 |
| SearchSlot | 隐藏 | 用户明确需要搜索设置项时显示 |
| FooterSlot | 隐藏 | 需要底部说明或底部操作时显示 |
| BottomNav | 隐藏 | 独立设置页默认不显示 |
```

注意：Layout 只负责说明页面级显隐规则；具体 Block 内部元素的显隐，应该写在对应 Block Markdown 和 Block TSX props 里。

---

### 2.5 步骤 4：定义 slot 替换机制

Slot 是 Layout 中可以替换的页面位置。

比如设置页中的 `AccountSlot`，默认可以放账号卡，但某些页面也可以替换成设备摘要卡、会员卡或空状态。

```markdown
## slots

| Slot | 默认 Block | 可替换 Block 清单 | 是否必选 | 说明 |
|---|---|---|---|---|
| HeaderSlot | title-bar | title-bar / search-header | 是 | 页面顶部标题区 |
| AccountSlot | account-card | account-card / device-summary-card / none | 否 | 账号或设备摘要信息 |
| ContentSections | settings-section | settings-section / grouped-list-section | 是 | 主体设置分组 |
| ActionSlot | none | quick-actions / privacy-actions / device-actions / none | 否 | 页面快捷操作区 |
| FooterSlot | none | footer-note / bottom-actions / none | 否 | 底部说明或操作 |
```

Slot 机制的重点是：**不是让 AI 自由发挥，而是给 AI 一个可替换清单。**

这样 AI 在生成页面时会做选择题，而不是即兴发明：

```text
AccountSlot 可以是：
  - account-card
  - device-summary-card
  - none

不能临时手写一个“差不多的账号区域”。
```

---

### 2.6 步骤 5：同步实现 Layout 源码能力

Layout Markdown 写了 slot 和显隐规则，源码层也要能执行这些能力。

```text
Layout Markdown 负责解释“有哪些 slot、什么时候替换”
Layout source / runtime 负责实现“slot 如何装配、如何隐藏”
真实生成页面负责调用这些能力
```

Layout 源码可以落在项目约定的位置，例如：

```text
src/layouts/{page_type}/index.tsx
src/forge/layouts/{page_type}.tsx
src/blocks/{page_type}-layout/index.tsx
```

具体目录以项目实际约定为准，但它必须提供页面级装配能力。

示例：

```tsx
type MobileSettingsLayoutProps = {
  header?: React.ReactNode
  account?: React.ReactNode
  content: React.ReactNode
  actions?: React.ReactNode
  footer?: React.ReactNode
  showAccount?: boolean
  showFooter?: boolean
}

export function MobileSettingsLayout({
  header,
  account,
  content,
  actions,
  footer,
  showAccount = true,
  showFooter = false,
}: MobileSettingsLayoutProps) {
  return (
    <main>
      {header}
      {showAccount && account}
      {content}
      {actions}
      {showFooter && footer}
    </main>
  )
}
```

注意：

- Markdown 里声明的 slot，源码中要有对应装配位置。
- Markdown 里声明可隐藏的区域，源码中要有对应 prop、配置或数据控制。
- Markdown 里允许 `none` 的 slot，源码中要能不渲染该区域，不能留下空白壳。
- Storybook 或试跑页面要能验证主要 slot 组合。

---

### 2.7 步骤 6：生成 route-index 和 layout markdown

话术示例：

```text
请配置 page_type：mobile-settings。
它适用于移动端设置类页面。
请生成 route-index.md 条目、layout/mobile-settings.md，并同步检查 layout 源码能力。

layout 需要包含：
- 固定页面骨架
- fixed_blocks
- needed_components
- visibility_rules
- slots 和每个 slot 的可替换 Block 清单
- generation_constraints
```

Agent 会输出：

| 文件 | 位置 |
|---|---|
| route-index 更新 | `.resources/{system}/route-index.md` |
| layout 模板 | `.resources/{system}/layout/{page_type}.md` |
| layout 源码 / runtime | 按项目约定放在 `src/layouts/**`、`src/forge/**` 或其他约定目录 |

---

### 2.8 步骤 7：用真实 prompt 试跑

配置完成后，需要用真实 prompt 检查它能不能被正确命中和组合。

示例：

```text
请生成一个移动端网络设置页，不需要账号卡，需要搜索入口，主体包含 WLAN、蓝牙和移动网络分组。
```

检查点：

- 是否命中 `mobile-settings`。
- 是否读取了正确 layout。
- 是否隐藏了 `AccountSlot`。
- 是否显示了 `SearchSlot`。
- 是否使用了 settings-section / settings-row 等真实 Block / Component。
- layout 源码是否正确装配 slot，没有留下异常空壳。
- 是否没有临时手写未注册结构。

---

## 3. Layout Markdown 模板

这一组给出推荐模板。实际项目可以增减字段，但不要丢掉 slot、显隐、替换清单和源码能力说明。

### 3.1 推荐模板

````markdown
# Layout: {page_type}

## overview

一句话说明这个 page_type 适合哪类页面。

## hit_rules

- 设置页
- 账号设置
- 网络设置

## exclusion_rules

- 健康仪表盘
- 服药提醒
- 表单编辑页

## layout_skeleton

```text
Page
├── AppShell
├── HeaderSlot
├── AccountSlot
├── ContentSections
├── ActionSlot
└── FooterSlot
```

## layout_runtime

| 能力 | 源码支撑 | 说明 |
|---|---|---|
| Slot 装配 | `MobileSettingsLayout` | 负责 HeaderSlot / AccountSlot / ContentSections 等区域组合 |
| 显隐控制 | `showAccount` / `showFooter` | 控制页面级区域是否渲染 |
| 空 slot | `none` | slot 为 none 时不保留空容器 |

## fixed_blocks

| Block | 位置 | 是否必选 | 说明 |
|---|---|---|---|
| title-bar | HeaderSlot | 是 | 页面标题区 |
| settings-section | ContentSections | 是 | 主体设置分组 |

## slots

| Slot | 默认 Block | 可替换 Block 清单 | 是否必选 | 说明 |
|---|---|---|---|---|
| HeaderSlot | title-bar | title-bar / search-header | 是 | 顶部标题区 |
| AccountSlot | account-card | account-card / device-summary-card / none | 否 | 账号或设备摘要信息 |
| ContentSections | settings-section | settings-section / grouped-list-section | 是 | 主体内容分组 |
| ActionSlot | none | quick-actions / privacy-actions / device-actions / none | 否 | 快捷操作区 |
| FooterSlot | none | footer-note / bottom-actions / none | 否 | 底部说明或操作 |

## visibility_rules

| 区域 | 默认 | 何时隐藏 |
|---|---|---|
| AccountSlot | 显示 | 纯系统设置页、无账号信息时隐藏 |
| SearchSlot | 隐藏 | 用户明确需要搜索设置项时显示 |
| FooterSlot | 隐藏 | 需要底部说明或底部操作时显示 |

## needed_components

- title-bar
- settings-row
- switch
- icon-tile

## reference_blocks

- settings-page
- settings-section
- account-card

## composition_mapping

| 页面区域 | 优先使用 | 可替换为 | 说明 |
|---|---|---|---|
| HeaderSlot | title-bar | search-header | 根据是否需要搜索选择 |
| AccountSlot | account-card | device-summary-card / none | 根据是否有账号信息选择 |
| ContentSections | settings-section | grouped-list-section | 主体分组 |

## generation_constraints

- 只能从 slots 的可替换 Block 清单中选择，不要临时发明新 Block。
- 如果 slot 选择 `none`，对应区域不要保留空白容器。
- Markdown 中声明的 slot 和显隐规则，layout 源码必须有对应能力。
- 页面中的 Component 必须来自 `components.json`。
- 页面中的 Block 必须来自 `blocks.json` 或 layout 明确允许的 reference_blocks。
- 如果需要裁剪 Block 内部区域，先参考对应 `block/*.md` 的可隐藏规则。
````

---

### 3.2 字段说明

| 字段 | 必须 | 说明 |
|---|---|---|
| `overview` | 是 | 页面类型用途 |
| `hit_rules` | 是 | 哪些请求应该命中这个 page_type |
| `exclusion_rules` | 是 | 哪些请求不应该命中 |
| `layout_skeleton` | 是 | 页面骨架，不写逐像素细节 |
| `layout_runtime` | 推荐 | 对应的源码装配能力和显隐能力 |
| `fixed_blocks` | 推荐 | 稳定必选 Block |
| `slots` | 是 | 页面插槽，以及可替换 Block 清单 |
| `visibility_rules` | 是 | 页面级区域显隐规则 |
| `needed_components` | 推荐 | 页面级必要 Component |
| `reference_blocks` | 是 | 生成时优先参考的 Block |
| `composition_mapping` | 推荐 | 页面区域和 Block/Component 的映射 |
| `generation_constraints` | 是 | AI 生成页面时必须遵守的规则 |

---

## 4. 质量标准

这一组用于判断 Page Type 和 Layout 是否真的可被 Skill 消费。

### 4.1 route-index 质量标准

| 维度 | 必须满足 |
|---|---|
| 命名清晰 | `page_type` 能表达页面族 |
| 命中准确 | `hit_rules` 覆盖常见用户说法 |
| 排除明确 | `exclusion_rules` 能避免误匹配 |
| layout 存在 | 每个 page_type 指向真实 layout markdown |
| runtime 存在 | 对应 layout 有源码或运行层装配能力 |
| fallback 合理 | 未命中时不会落到明显错误页面 |

---

### 4.2 layout 质量标准

| 维度 | 必须满足 |
|---|---|
| 骨架稳定 | layout_skeleton 能代表一类页面 |
| Slot 清晰 | 每个可替换区域都有 slot 名称 |
| 替换受控 | 每个 slot 都有可替换 Block 清单 |
| 显隐明确 | 页面级可隐藏区域和隐藏条件清楚 |
| 源码支撑 | layout 源码支持 slot、显隐和 none |
| Block 对齐 | reference_blocks 都存在于 blocks.json |
| Component 对齐 | needed_components 都存在于 components.json |
| 约束清楚 | generation_constraints 能限制 AI 不乱发明 |

---

### 4.3 设计师审核点

设计师审核时，不只看 layout 是否“像某个页面”，还要看它能否覆盖一类页面。

| 检查维度 | 通过标准 |
|---|---|
| 页面族准确 | 这个 page_type 覆盖的是一类页面，不是单个页面 |
| 固定骨架合理 | 主要区域顺序稳定 |
| 显隐规则合理 | 可隐藏区域符合真实设计场景 |
| slot 替换合理 | 可替换 Block 清单完整但不过度泛化 |
| 源码能力一致 | Markdown 里的 slot 和显隐规则在源码中真实可执行 |
| 排除场景明确 | 不应该命中的页面写清楚 |
| 试跑可用 | 真实 prompt 能生成符合预期的页面 |

---

### 4.4 Agent 自动检查点

Agent 交付前应该自查：

| 检查项 | 说明 |
|---|---|
| route 可命中 | prompt 能匹配到正确 page_type |
| layout 可读取 | `layout/{page_type}.md` 存在 |
| runtime 可执行 | layout 源码或运行层能装配 slot |
| blocks 可索引 | slot 和 reference_blocks 中的 Block 都存在 |
| components 可索引 | needed_components 都存在 |
| slot 不发散 | 可替换清单明确，不让模型自由发明 |
| none 不留空 | slot 选择 `none` 后不会保留异常空容器 |
| block 裁剪有依据 | 裁剪 Block 内部区域时参考对应 Block Markdown |

---

## 5. 边界和话术

这一组放容易混淆的边界和可以直接复制给 Agent 的话术。

### 5.1 注意边界

| 边界 | 说明 |
|---|---|
| Page Type vs Layout | Page Type 是路由命名，Layout 是页面模板 |
| Layout Markdown vs Layout Source | Markdown 说明装配规则，Source / runtime 实现装配能力 |
| Layout vs Block | Layout 负责页面级组合和 slot，Block 负责区块级组合 |
| Layout Slot vs Block 可隐藏区域 | Slot 控制页面级替换，Block 可隐藏区域控制 Block 内部裁剪 |
| `route-index.md` vs `layout/*.md` | route-index 决定读哪个 layout，layout 决定如何组装页面 |

还要注意：

- Layout 应该比 Block 更灵活，但不能变成无限自由组合。
- Slot 必须有可替换清单，不能只写“这里可变”。
- Layout Markdown 不能脱离源码能力，写了 slot 和显隐就要有 runtime 支撑。
- 如果 slot 可以为空，用 `none` 明确表达。
- 如果要裁剪 Block 内部元素，先看对应 Block Markdown。
- Layout 不直接替代 Block 源码，最终仍要回到 `src/blocks/**` 和 `src/component/**` 做 grounding。

---

### 5.2 完整话术模板

**配置新 page_type：**

```text
请配置 page_type：[page_type]。
它适用于：[页面族说明]。
请生成 route-index.md 条目和 layout/{page_type}.md，并检查或补充对应 layout 源码装配能力。

layout 需要包含：
- hit_rules / exclusion_rules
- layout_skeleton
- layout_runtime
- fixed_blocks
- slots，以及每个 slot 的可替换 Block 清单
- visibility_rules
- needed_components
- reference_blocks
- generation_constraints
```

**补充 slot 机制：**

```text
请为 [page_type] 的 layout 补充 slots。
每个 slot 需要写清楚默认 Block、可替换 Block 清单、是否必选、什么时候可以选择 none。
同时检查 layout 源码是否支持这些 slot；如果不支持，请补充对应装配能力。
```

**补充显隐规则：**

```text
请为 [page_type] 的 layout 补充 visibility_rules。
说明哪些页面级区域默认显示，哪些情况下隐藏。
同时检查 layout 源码是否有对应显隐 props 或配置。
如果隐藏涉及 Block 内部元素，请同步检查对应 block markdown 和 Block TSX 是否有可隐藏能力。
```

**配置验收不通过：**

```text
[page_type] 的 [问题描述] 不对。
期望是 [X]。
请同步修正 route-index.md、layout markdown，以及必要的 block reference。
```
