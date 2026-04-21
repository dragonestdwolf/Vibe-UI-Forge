# 05 | 抽取 Block

> 这一篇说明如何从页面样例中抽取稳定 Block。Block 是多个 Component 的组合模板，Block Markdown 非常重要：它帮助大模型在 route / layout 阶段意识到“此时应该调用这个 Block”，并理解这个 Block 哪些元素可以隐藏、关闭或替换。

---

## 1. 先理解 Block

这一组先回答三个问题：Block 是什么、它和 Component 有什么区别、为什么 Block Markdown 会影响页面生成。

### 1.1 Block 是什么

Block 是稳定的页面区块模板，是多个 Component 的组合单位。

它不是最小组件，也不是完整生成页面，而是介于 Component 和 Page 之间的一层：

```text
Component
  ↓ 组合
Block
  ↓ 按 layout 编排
Page
```

例如：

| Block | 可能包含 |
|---|---|
| settings-page | StatusBar、TitleBar、AccountCard、SettingsSection、SettingsRow |
| account-card | Avatar、Username、StatusBadge、StorageProgress |
| health-summary | MetricCard、ProgressRing、TrendText、ActionButton |

Block 的价值是让 AI 生成页面时不用每次重新发明组合结构，而是复用稳定的页面片段。

---

### 1.2 Block 由两部分组成

Block 通常由源码和说明文档两部分组成：

| 部分 | 作用 |
|---|---|
| `src/blocks/{block-id}/index.tsx` | Block 源码，提供真实可运行的组合结构 |
| `.resources/{system}/block/{block-id}.md` | Block 说明文档，告诉 AI 什么时候用、怎么用、哪些地方可变 |

还会在资源层登记：

```text
.resources/{system}/blocks.json
```

这里要记住一个边界：

```text
Block TSX 是组合真值。
Block Markdown 是调用和变体说明。
blocks.json 是索引。
```

---

### 1.3 为什么 Block Markdown 很重要

Block Markdown 不只是“说明文档”，它会影响 AI 在生成页面时能不能选对 Block。

当用户说“生成一个移动端设置页”时，AI 通常会经历：

```text
用户需求
  ↓
route-index.md 命中 page_type
  ↓
layout/{page_type}.md 找到 reference_blocks
  ↓
block/{block-id}.md 理解这个 Block 是否适用、怎么裁剪
  ↓
读取 src/blocks/** 源码做 grounding
  ↓
生成页面
```

如果 Block Markdown 写得太薄，AI 只知道有一个 `settings-page`，但不知道：

- 这个 Block 适合哪些页面意图。
- 它和其他 Block 的区别是什么。
- 哪些区域是必选，哪些区域可隐藏。
- 哪些组件可以替换，哪些组合不能改。
- 什么情况下应该调用它，什么情况下不应该调用。

结果就是：AI 可能不调用该 Block，或者调用后不知道怎么裁剪。

所以 Block Markdown 要承担两个任务：

| 任务 | 说明 |
|---|---|
| 帮助命中 | 让 AI 意识到当前页面应该参考这个 Block |
| 帮助裁剪 | 让 AI 知道这个 Block 哪些元素可开关、可隐藏、可替换 |

---

### 1.4 Block 和 Component 的区别

| 对象 | 作用 | 真值来源 |
|---|---|---|
| Component | 最小可复用 UI 单元 | `src/component/**` |
| Block | 多个 Component 的稳定组合 | `src/blocks/**` |
| Block Markdown | Block 的调用、裁剪和语义说明 | `.resources/{system}/block/*.md` |

Component 追求 API 稳定，Block 追求组合结构稳定。

Block 不能替代 Component。Block 里应该复用真实 Component，而不是临时手写相似 UI。

---

## 2. Block 抽取流程

这一组说明从页面样例到可复用 Block 的完整路径。重点不是“生成一个区块”，而是让这个区块能被 layout 命中、能被裁剪、能在页面生成时稳定复用。

### 2.1 Block 抽取工作流

抽取 Block 通常按这条链路走：

```text
设计师提供页面样例 / Figma MCP / 截图
  ↓
Agent 判断是否适合抽成 Block
  ↓
Agent 生成 Block TSX 和 Storybook story
  ↓
Agent 编写 Block Markdown
  ↓
设计师在 Storybook 验收结构和视觉
  ↓
Agent 注册 blocks.json
  ↓
在 layout markdown 中作为 reference_blocks 使用
```

这条链路里，Agent 应该尽量自动完成结构分析、源码生成、文档编写、story 补齐和资源注册。设计师主要确认：

- 这个区块是否值得作为稳定 Block 复用。
- Block 的视觉和结构是否和代表页面一致。
- Block Markdown 里写的可选元素、隐藏规则、适用场景是否正确。

---

### 2.2 步骤 1：判断是否适合抽为 Block

不是所有页面片段都应该抽成 Block。

| 适合抽为 Block | 不宜抽为 Block |
|---|---|
| 多个页面复用同一结构 | 只有单一页面使用 |
| 组件组合边界清晰 | 组件嵌套关系混乱 |
| 结构稳定，但局部可裁剪 | 每次页面结构都完全不同 |
| 由 3-10 个左右 Component 组成 | 只是一两个基础组件 |
| 有明确页面语义 | 只是一次性视觉拼贴 |

设计师可以这样判断：

```text
这个区块以后还会不会反复出现？
它是不是有稳定结构？
它能不能通过隐藏、关闭、替换局部元素适配不同页面？
```

如果答案是“是”，就适合抽成 Block。

---

### 2.3 步骤 2：生成 Block 源码和 story

设计师提供页面样例、Figma MCP 链接、截图或说明后，Agent 生成 Block 源码。

话术示例：

```text
请从这个设置页样例中抽取 settings-page Block。
它应该复用已有 Component，不要临时手写相似结构。
请生成 Block TSX、Storybook story，并说明哪些区域是可选的。
```

Agent 会产出：

| 文件 | 位置 |
|---|---|
| Block 源码 | `harmony-ui-playground/src/blocks/{block-id}/index.tsx` |
| Block story | `harmony-ui-playground/src/blocks/{block-id}/{block-id}.stories.tsx` |
| Block Markdown | `.resources/{system}/block/{block-id}.md` |
| Block 索引 | `.resources/{system}/blocks.json` |

Block 源码要尽量复用 `src/component/**` 中的真实组件。

---

### 2.4 步骤 3：编写 Block Markdown

Block Markdown 是这章最关键的产物。它要让 AI 看到这个文档后，知道：

- 这个 Block 什么时候应该被调用。
- 它的整体结构是什么。
- 哪些元素是必选，哪些元素可以隐藏。
- 哪些组件可以替换，哪些组件不能替换。
- 生成页面时应该遵守哪些约束。

建议模板：

````markdown
# Block: {block-id}

## 概述

一句话说明这个 Block 是什么，适合什么页面。

## 适用意图

- 用户请求包含：设置页 / 账号设置 / 网络设置
- Figma 页面属于：移动端设置类页面
- layout 中命中：mobile-settings

## 不适用意图

- 健康数据页
- 仪表盘首页
- 表单编辑页

## 结构树

```text
SettingsPageBlock
├── StatusBar
├── TitleBar
├── AccountCard
│   ├── Avatar
│   ├── UserName
│   └── StorageProgress
├── SettingsSection
│   └── SettingsRow
└── OptionalFooter
```

## 必选区域

| 区域 | 说明 |
|---|---|
| TitleBar | 页面标题区域 |
| SettingsSection | 至少一个设置分组 |

## 可选 / 可隐藏区域

| 区域 | 对应 prop | 默认 | 何时隐藏 |
|---|---|---|---|
| StatusBar | `showStatusBar` | `true` | Web 容器或非移动端预览时可隐藏 |
| AccountCard | `showAccountCard` | `true` | 纯系统设置页、无账号信息时可隐藏 |
| StorageProgress | `showStorageProgress` | `true` | 无云空间信息时可隐藏 |
| OptionalFooter | `showFooter` | `false` | 需要底部说明或操作时显示 |

## 可替换元素

| 位置 | 默认组件 | 可替换为 | 约束 |
|---|---|---|---|
| TitleBar.left | BackButton | CloseButton | 只能出现一个 |
| SettingsRow.trailing | Chevron | Switch / ValueText | 根据 row 类型选择 |

## 组件依赖

| 组件 | 用途 | 变体 / 状态 |
|---|---|---|
| StatusBar | 顶部状态栏 | default |
| TitleBar | 页面标题 | back / close |
| AccountCard | 账号信息卡片 | with-progress / simple |
| SettingsRow | 设置列表项 | chevron / switch / value |

## 生成约束

- 不要把 `src/render/**` 当作模板源。
- 只能复用已注册 Component，不要临时手写相似组件。
- 如果用户请求不需要账号信息，可以隐藏 AccountCard。
- 如果生成的是非移动端页面，可以隐藏 StatusBar。
- Markdown 里声明可隐藏的区域，Block TSX 需要提供对应 prop 或配置能力。
````

---

### 2.5 步骤 4：同步实现 TSX 显隐能力

可选 / 可隐藏区域不能只写在 Markdown 里。Markdown 负责解释规则，TSX 源码必须实现能力，Storybook 负责验收。

```text
Markdown 负责解释“什么时候隐藏”
TSX 负责实现“如何隐藏”
Storybook 负责验证“隐藏后是否正常”
```

例如 Block Markdown 里写了：

```markdown
| 区域 | 对应 prop | 默认 | 何时隐藏 |
|---|---|---|---|
| StatusBar | `showStatusBar` | `true` | Web 容器或非移动端预览时可隐藏 |
| AccountCard | `showAccountCard` | `true` | 纯系统设置页、无账号信息时可隐藏 |
```

那么 Block TSX 里也应该有对应能力：

```tsx
type SettingsPageBlockProps = {
  showStatusBar?: boolean
  showAccountCard?: boolean
  showStorageProgress?: boolean
  showFooter?: boolean
}

export function SettingsPageBlock({
  showStatusBar = true,
  showAccountCard = true,
  showStorageProgress = true,
  showFooter = false,
}: SettingsPageBlockProps) {
  return (
    <main>
      {showStatusBar && <StatusBar />}

      {showAccountCard && (
        <AccountCard showStorageProgress={showStorageProgress} />
      )}

      <SettingsSection />

      {showFooter && <OptionalFooter />}
    </main>
  )
}
```

Agent 实现 Block TSX 时要注意：

- Markdown 里写了可隐藏区域，TSX 就要有对应 prop、配置或数据控制。
- 默认值要和 Markdown 表格一致。
- 可隐藏区域关闭后，布局不能塌陷或留下异常空隙。
- Storybook 里要有对应 story 或 controls，方便设计师验证开关效果。

---

### 2.6 步骤 5：Storybook 验收

Block 生成完成后，Agent 应该补齐 story，并拉起 Storybook 或告诉设计师访问地址。

在当前示例项目里：

```bash
cd harmony-ui-playground
pnpm storybook
```

设计师验收时重点看：

| 检查维度 | 通过标准 |
|---|---|
| 结构一致 | Block 的主要区域和嵌套关系与设计稿一致 |
| 组件真实 | 使用已注册 Component，不是临时手写相似结构 |
| 可选项有效 | 可隐藏区域在 story 中能关闭或切换 |
| 变体覆盖 | 关键裁剪形态有 story，例如有账号卡 / 无账号卡 |
| 布局稳定 | 长文本、缺图标、空数据时不破版 |
| 视觉一致 | 间距、分组、圆角、背景符合设计系统 |

如果不通过，设计师只需要描述问题，Agent 修改 Block 源码、story 或 Block Markdown 后重新给 Storybook 检视。

---

### 2.7 步骤 6：注册 blocks.json

只有通过 Storybook 验收、且 Block Markdown 写清楚的 Block，才应该写入 `.resources/{system}/blocks.json`。

示例：

```json
{
  "id": "settings-page",
  "name": "Settings Page",
  "pageType": "mobile-settings",
  "description": "通用移动端设置页模板",
  "files": ["src/blocks/settings-page/index.tsx"],
  "stories": ["src/blocks/settings-page/settings-page.stories.tsx"],
  "spec": ".resources/harmony/block/settings-page.md",
  "dependencies": ["status-bar", "title-bar", "account-card", "settings-row"]
}
```

字段说明：

| 字段 | 必填 | 说明 |
|---|---|---|
| `id` | 是 | Block 稳定 ID，建议 kebab-case |
| `name` | 是 | 人类可读名称 |
| `pageType` | 推荐 | 对应的 `page_type` |
| `description` | 推荐 | Block 用途描述 |
| `files` | 是 | Block 源码路径，相对于 `projectRoot` |
| `stories` | 推荐 | Block stories 路径 |
| `spec` | 是 | Block Markdown 说明文档路径 |
| `dependencies` | 推荐 | 依赖的 Component ID |

---

### 2.8 步骤 7：写入 layout reference_blocks

Block 不是注册进 `blocks.json` 就结束了。它还需要被 layout 引用，AI 才会在页面生成时优先考虑它。

在对应 layout markdown 中写入：

```markdown
## reference_blocks

- settings-page
```

同时在 layout 的说明里写清楚：

- 这个 page_type 为什么适合调用该 Block。
- 什么时候只参考 Block 的一部分。
- 哪些区域可以隐藏。
- 哪些区域必须保留。

这一步能让 route / layout / block 三层连起来：

```text
route-index.md 命中 page_type
  ↓
layout markdown 找到 reference_blocks
  ↓
block markdown 说明如何调用和裁剪
  ↓
src/blocks/** 提供真实组合结构
```

---

## 3. 质量标准

这一组用于判断一个 Block 是否真的可以进入资源层。Block 不只要“看起来像”，还要能被 AI 正确调用、正确裁剪、正确复用。

### 3.1 Block Markdown 质量标准

一个 Block Markdown 至少要写清楚这些内容：

| 维度 | 必须说明 |
|---|---|
| 适用意图 | 什么请求、页面族或 page_type 应该调用它 |
| 不适用意图 | 哪些页面不应该调用它 |
| 结构树 | Block 的区域层级和组件嵌套 |
| 必选区域 | 哪些区域不能删除 |
| 可选区域 | 哪些区域可以隐藏、关闭或不生成 |
| 可替换元素 | 哪些组件位置允许替换，替换边界是什么 |
| 组件依赖 | 使用了哪些 Component |
| 生成约束 | AI 生成页面时必须遵守什么 |

如果缺少“可选 / 可隐藏区域”，Block 会变得太硬，AI 只能整块照搬；如果缺少“适用 / 不适用意图”，AI 又可能不知道什么时候应该调用它。

---

### 3.2 Block 源码质量标准

Block 源码要满足：

| 维度 | 必须满足 |
|---|---|
| 组件真实 | 复用 `src/component/**` 中的真实组件 |
| 结构稳定 | 主体布局和组件嵌套稳定 |
| 弹性开关 | 可选区域能通过 props、配置或数据控制 |
| 默认一致 | 显隐 props 默认值和 Block Markdown 一致 |
| 状态可演示 | Storybook 展示关键形态 |
| 不污染组件层 | 不在 Block 内重新实现基础组件 |
| 不污染生成层 | 不从 `src/render/**` 复制生成结果 |

---

### 3.3 设计师审核点

设计师验收时，重点不只是看像不像，还要看这个 Block 是否“可复用、可裁剪”。

| 检查维度 | 通过标准 |
|---|---|
| 结构还原 | Block 的嵌套关系与设计稿一致 |
| 组件组合 | 用到的组件种类和数量合理 |
| 可选区域 | 可关闭 / 可隐藏元素说明清楚，story 中可验证 |
| 适用场景 | 文档说清楚哪些页面应该用它 |
| 排除场景 | 文档说清楚哪些页面不应该用它 |
| 视觉一致 | 间距、分组、圆角、背景符合设计系统 |

---

### 3.4 Agent 自动检查点

Agent 交付前应该自查：

| 检查项 | 说明 |
|---|---|
| blocks.json 可索引 | `id`、`files`、`spec` 路径真实存在 |
| dependencies 对齐 | 依赖组件都存在于 `components.json` |
| spec 可读 | Block Markdown 包含适用意图、结构树、可选区域、生成约束 |
| 显隐能力对齐 | Markdown 里声明的可隐藏区域，在 TSX 中有对应 prop / 配置 |
| story 可渲染 | Storybook 能看到主要形态 |
| story 覆盖裁剪 | Storybook 能验证至少一种隐藏 / 裁剪形态 |
| layout 可引用 | 对应 layout 的 `reference_blocks` 能引用该 Block |
| 没有 render 污染 | 没有把 `src/render/**` 当作模板源 |

---

## 4. 边界和话术

这一组放容易混淆的边界和可以直接复制给 Agent 的话术。

### 4.1 注意边界

| 边界 | 说明 |
|---|---|
| Block vs Component | Block 是组件的组合，Component 是最小真值单元 |
| Block TSX vs Block Markdown | TSX 是组合真值，Markdown 是调用、裁剪和语义说明 |
| `blocks.json` vs `block/*.md` | `blocks.json` 是索引，`block/*.md` 是详细使用说明 |
| `src/blocks/**` vs `src/render/**` | blocks 是稳定模板源，render 是生成结果，不能反向当模板 |

还要注意：

- Block 应该有弹性，但不能变成万能页面。
- 可隐藏区域要写清楚，也要在 TSX 中实现，不要让 AI 自己猜。
- Block Markdown 要服务 route / layout 阶段，不只是给人看的说明。
- Block 不能绕过 Component 真值，应该复用已注册组件。

---

### 4.2 完整话术模板

**抽取新 Block：**

```text
请从这个页面样例中抽取 Block。
Block 名称是 [BlockName]，用途是 [描述]。
请生成 Block TSX、Storybook story 和 Block Markdown。
Block Markdown 需要说明适用意图、不适用意图、结构树、必选区域、可隐藏区域、可替换元素和生成约束。
如果 Markdown 中声明了可隐藏区域，请在 TSX 中同步实现对应 props，并在 Storybook 中提供可验证的裁剪形态。
```

**补充 Block 弹性说明：**

```text
请补充 [BlockName] 的可选 / 可隐藏区域说明。
说明哪些元素默认显示，哪些场景可以隐藏，哪些元素可以替换。
同时检查 TSX 是否已经支持对应显隐 props；如果没有，请补上并更新 Storybook。
```

**Block 验收不通过：**

```text
Storybook 里 [BlockName] 的 [问题描述] 不对。
期望是 [X]。
请同步修正 Block 源码、story 和 block markdown。
```

**把 Block 接入 layout：**

```text
请把 [BlockName] 加入 [page_type] 的 layout reference_blocks。
同时说明什么情况下使用完整 Block，什么情况下只参考其中一部分。
```
