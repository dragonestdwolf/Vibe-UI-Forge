# 04 | 抽取 Component 资源

> 这一篇说明如何把设计输入中的组件，转成真实可运行的 React Component，并登记进 Resource Layer。Component 是整个设计系统最重要的真值来源，质量不达标的组件不能进入资源层。

---

## 1. 先理解 Component

### 1.1 先记住一句话

**Component 不是普通素材，它是设计系统的唯一真值来源。**

Figma、截图、设计文档和 benchmark HTML 都只是输入或参考。真正会被页面生成复用的，是项目里的 React Component：

```text
设计输入
  ↓
benchmark HTML 预览
  ↓
React Component 真值
  ↓
Storybook 验收
  ↓
components.json 注册
  ↓
页面 / Block 生成时复用
```

所以，抽取 Component 的目标不是“看起来像设计稿”，而是形成稳定、可复用、可验证的组件真值。

---

### 1.2 为什么 Component 质量最重要

页面生成的稳定性，最终取决于 Component 的质量。

如果 Component 质量不稳定，后面的 Block、Layout、Page Type 都会被污染：

| Component 问题 | 后果 |
|---|---|
| Props 不清晰 | AI 不知道该怎么调用组件，只能猜参数 |
| 变体缺失 | 页面生成时会临时手写相似结构 |
| 状态不完整 | hover、disabled、loading 等交互表现不一致 |
| 样式没用 token | 不同页面颜色、间距、圆角会漂移 |
| Storybook 缺失 | 设计师无法检视组件是否真的可用 |
| 组件语义不清 | Block 和 Page 组合时容易用错组件 |

因此，这一章的质量标准要比普通文档更严格：**没有通过 Storybook 视觉验收的组件，不应该注册进 components.json。**

---

### 1.3 Component 资源是什么

这里要区分两个东西：

| 对象 | 作用 |
|---|---|
| React Component | 组件真值，包含结构、Props、状态、样式和交互 |
| `.resources/{system}/components.json` | 组件索引，告诉 AI 这个真值在哪里 |

Component 资源不是把 Figma 图层照搬成 JSON，而是把真实 React 组件登记到资源层。

```text
harmony-ui-playground/src/component/{ComponentName}/
  ├── index.tsx
  ├── {ComponentName}.stories.tsx
  └── styles.css 或组件内样式

.resources/{system}/components.json
  └── 记录组件 ID、源码路径、export、stories、可选说明文档
```

---

## 2. Component 导入流程

### 2.1 组件导入工作流

抽取 Component 通常按这条链路走：

```text
设计师提供组件 MCP / Node ID / 截图
  ↓
Agent 生成 benchmark HTML 预览
  ↓
设计师检查 benchmark 是否还原设计稿
  ↓
Agent 转成 React TSX 组件源码
  ↓
Agent 补 Storybook story
  ↓
设计师在 Storybook 验收样式和状态
  ↓
Agent 注册 components.json
  ↓
复杂组件补 component usage markdown
```

这条链路里，Agent 应该尽量自动完成组件分析、源码生成、story 补齐、样式修正和资源注册。设计师主要做两件事：

- 确保输入链接或节点范围正确。
- 在 benchmark HTML 和 Storybook 阶段检查视觉、状态和交互是否符合设计稿。

---

### 2.2 步骤 1：提供组件输入

设计师在 Figma / Pixso 中选中要抽取的组件，复制组件 MCP 链接、节点 ID 或提供截图。

尽量给 Agent 这些信息：

| 信息 | 用途 |
|---|---|
| 组件名称 | 对齐 React export、Storybook 名称和资源层 ID |
| 组件链接或 Node ID | 让 Agent 读取结构、变量、尺寸和截图 |
| 组件用途 | 判断组件语义，不按图层硬翻译 |
| 变体说明 | 形成 Props、variant 或 story case |
| 状态说明 | 覆盖 default、hover、active、disabled、loading、selected 等 |
| 禁止组合 | 防止 AI 在页面生成时误用组件 |

话术示例：

```text
请抽取这个 SettingsRow 组件。
MCP 链接是：[粘贴链接]
它用于设置页列表项，需要支持 chevron、switch、value 三种形态。
先生成 benchmark HTML 预览，不要直接写 React 组件。
```

---

### 2.3 步骤 2：生成 benchmark HTML 预览

Agent 先根据组件输入生成 benchmark HTML，用来对齐设计稿。

benchmark HTML 的作用是：

- 快速验证结构、视觉、状态和变体是否理解正确。
- 让设计师在写正式 React 组件前先看一版可视化结果。
- 降低直接生成 TSX 后反复返工的成本。

设计师检查：

| 检查项 | 通过标准 |
|---|---|
| 视觉还原 | 颜色、间距、圆角、字号、阴影接近设计稿 |
| 结构正确 | 标题、副标题、图标、右侧操作区位置正确 |
| 变体齐全 | 设计稿里的变体都有对应预览 |
| 状态齐全 | hover、active、disabled、loading 等状态没有漏掉 |
| 语义合理 | 组件边界正确，没有把外层页面或 Section 逻辑混进来 |

如果 benchmark HTML 不通过，Agent 先修 benchmark，不进入 React 组件生成。

---

### 2.4 步骤 3：转换为 React Component

benchmark HTML 通过后，Agent 才把它转换成真实 React 组件源码。

落地位置：

```text
harmony-ui-playground/src/component/{ComponentName}/
├── index.tsx
├── {ComponentName}.stories.tsx
└── styles.css
```

React 组件必须具备：

| 标准 | 说明 |
|---|---|
| 清晰 Props | Props 命名表达组件语义，而不是 Figma 图层名 |
| 稳定 variant | 变体可通过 `variant`、`size`、`state` 等字段表达 |
| token 对齐 | 颜色、间距、圆角、字体优先来自项目 token 或统一 CSS 规则 |
| 可复用边界 | 只封装这个组件本身，不吞掉页面或 Block 职责 |
| 可读源码 | 结构清晰，后续 AI 能读取并理解怎么调用 |
| 可验证 story | Storybook 覆盖主要状态和变体 |

Agent 写代码时应该优先参考项目已有组件结构，而不是凭空创造新风格。

---

### 2.5 步骤 4：Storybook 验收

组件源码生成后，Agent 应该补齐 story，并拉起 Storybook 或告诉设计师访问地址。

在当前示例项目里：

```bash
cd harmony-ui-playground
pnpm storybook
```

设计师验收时重点看：

| 检查维度 | 通过标准 |
|---|---|
| 默认态 | 默认显示与设计稿一致 |
| 变体 | 所有设计稿变体都能在 story 中看到 |
| 状态 | disabled、hover、active、loading、selected 等状态表现正确 |
| Controls | 关键 Props 可以在 Storybook Controls 中切换 |
| 响应约束 | 宽度变化、长文本、图标缺失等场景不破版 |
| 视觉一致 | 颜色、间距、圆角、字号、阴影符合设计系统 |

如果不通过，设计师只需要描述问题，Agent 修改源码和 story 后重新给 Storybook 检视。

---

### 2.6 步骤 5：注册 components.json

只有通过 Storybook 验收的组件，才应该写入 `.resources/{system}/components.json`。

示例：

```json
{
  "id": "settings-row",
  "name": "SettingsRow",
  "path": "src/component/SettingsRow",
  "export": "SettingsRow",
  "stories": "src/component/SettingsRow/SettingsRow.stories.tsx",
  "spec": ".resources/harmony/component/settings-row.md"
}
```

字段说明：

| 字段 | 必填 | 说明 |
|---|---|---|
| `id` | 是 | 稳定组件 ID，建议 kebab-case |
| `path` | 是 | 组件源码路径，相对于 `projectRoot` |
| `export` | 是 | 组件导出名称 |
| `name` | 否 | 人类可读名称 |
| `stories` | 推荐 | Storybook 文件路径 |
| `spec` | 复杂组件推荐 | 组件使用说明 Markdown |

---

### 2.7 步骤 6：复杂组件补 usage markdown

简单组件可以只注册源码和 story。复杂组件建议额外补充：

```text
.resources/{system}/component/{component-id}.md
```

这份 Markdown 不是源码真值，而是给 AI 按需读取的使用指导。

适合补 usage markdown 的情况：

| 情况 | 为什么需要 |
|---|---|
| Props 多 | 避免 AI 调用时猜参数 |
| 变体复杂 | 说明哪些 variant 可以组合，哪些不能组合 |
| 状态有业务含义 | 说明 selected、danger、warning、loading 等状态语义 |
| 依赖 slot | 说明 left icon、right action、header、footer 怎么传 |
| 有禁止用法 | 防止页面生成时滥用组件 |

建议包含：

- 组件用途
- Props 表
- 变体和状态
- 可组合 slot
- 使用场景
- 禁止事项
- 简短调用示例

---

## 3. 质量标准

### 3.1 Component 真值质量标准

一个组件要进入资源层，至少满足这些标准：

| 维度 | 必须满足 |
|---|---|
| 真值唯一 | 页面生成只能复用该组件，不应该再临时拼相似结构 |
| API 稳定 | Props、variant、size、state 等命名清晰稳定 |
| 视觉一致 | 与设计稿的颜色、间距、圆角、字号、阴影一致 |
| token 对齐 | 不随意写死颜色和尺寸，优先使用 token 或统一样式规则 |
| 状态完整 | 关键状态和变体都有 story 可查 |
| 语义清楚 | 组件职责明确，不混入 Block 或 Page 职责 |
| 可运行 | TypeScript、Storybook 或 build 能通过验证 |
| 可被 AI 读取 | 源码结构清晰，必要时有 usage markdown |

如果任一核心维度不满足，应该先修组件，不要急着注册资源层。

---

### 3.2 设计师审核点

设计师不需要读 TSX 源码，主要在 benchmark HTML 和 Storybook 中做验收。

| 阶段 | 设计师看什么 |
|---|---|
| benchmark HTML | 是否理解了设计稿结构、视觉、状态和变体 |
| Storybook | 真实 React 组件是否和设计稿一致 |
| 注册前 | 组件名称、用途、状态和变体是否可以正式进入系统 |

Storybook 检查时，可以按这个顺序：

1. 先看默认态是否对。
2. 再看所有变体是否齐。
3. 再看 disabled、hover、active、loading 等状态。
4. 最后看长文本、缺图标、窄宽度等边界情况。

---

### 3.3 Agent 自动检查点

Agent 在交给设计师验收前，应该先自查：

| 检查项 | 说明 |
|---|---|
| 源码路径正确 | 组件在 `src/component/{ComponentName}/` |
| export 正确 | `components.json` 的 `export` 能对应真实导出 |
| story 可渲染 | Storybook 能看到组件 |
| variants 覆盖 | 主要变体都有 story |
| types 可读 | Props 类型清晰 |
| 样式来源清楚 | 使用 token / Tailwind / CSS 规则有依据 |
| 没有模板污染 | 不把 `src/render/**` 当作组件来源 |

---

## 4. 边界和话术

### 4.1 注意边界

`.resources/{system}/components.json` 和项目根的 `components.json` 不是一回事。

| 文件 | 作用 |
|---|---|
| 项目 `components.json` | shadcn 配置：alias、Tailwind、icon library |
| `.resources/{system}/components.json` | 资源层组件索引：组件 ID 到源码的映射 |

还要注意：

- Figma 是设计意图，不是组件真值。
- benchmark HTML 是预览基准，不是最终组件真值。
- React Component 才是页面生成时复用的真值。
- `components.json` 是索引，不替代源码。
- 复杂组件的 markdown 是使用指导，不替代源码。

---

### 4.2 完整话术模板

**抽取新组件：**

```text
请抽取这个组件：[粘贴 MCP 链接或 Node ID]。
组件名称是 [X]，用途是 [Y]。
请先生成 benchmark HTML 预览，不要直接写 React 组件。
```

**benchmark 验收通过：**

```text
benchmark HTML 方向正确。
请转换为 React TSX 组件源码，放到 src/component/{ComponentName}/，
并补齐 Storybook story，覆盖主要状态和变体。
```

**Storybook 验收不通过：**

```text
Storybook 里 [组件名] 的 [问题描述] 不对。
期望是 [X]。
请修正组件源码和 story 后重新给我预览。
```

**追加组件变体：**

```text
请为 [组件名] 追加 [变体名称] 变体。
需要同步更新 Props 类型、Storybook story 和 components.json 说明。
```

**复杂组件补充使用说明：**

```text
这个组件状态和变体较复杂。
请补充 .resources/{system}/component/{component-id}.md，
说明 Props、变体、状态、slot、使用场景和禁止组合。
```
