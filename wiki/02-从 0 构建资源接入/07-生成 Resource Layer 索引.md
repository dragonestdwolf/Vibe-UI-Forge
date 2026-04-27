# 07 | 生成 Resource Layer 索引

> 这一篇说明如何把 Component、Block、Page Type、Layout 串成完整 Resource Layer。Resource Layer 索引不是源码真值，它的职责是把“用户意图 → page_type → layout → Block / Component → Source Layer 真值”这条链路连起来。

---

## 1. 先理解 Resource Layer 索引

这一组先回答：索引层是什么、为什么重要、它和源码真值是什么关系。

### 1.1 Resource Layer 索引是什么

Resource Layer 索引是一组给 AI 读取的资源地图。

它负责告诉 AI：

- 当前激活哪套设计系统。
- 用户请求应该命中哪个 `page_type`。
- 每个 `page_type` 应该读取哪个 layout。
- layout 可以使用哪些 Block、Component 和 slot。
- Block / Component 的真实源码在哪里。
- 哪些复杂资源有额外 Markdown 使用说明。

一条完整链路是：

```text
用户请求
  ↓
.resources/config.json
  ↓
.resources/{system}/route-index.md
  ↓
.resources/{system}/layout/{page_type}.md
  ↓
.resources/{system}/blocks.json + components.json
  ↓
harmony-ui-playground/src/blocks/** + src/component/**
```

---

### 1.2 索引不是源码真值

Resource Layer 是地图，不是源码本身。

| 对象 | 角色 |
|---|---|
| `.resources/**` | 索引、路由、how to use、约束 |
| `src/component/**` | Component 真值 |
| `src/blocks/**` | Block 组合真值 |
| layout source / runtime | 页面级装配能力 |
| CSS / token | 样式真值 |

所以生成 Resource Layer 索引时，最重要的不是“文件都写出来”，而是保证每个索引都能指向真实可运行的源码。

---

### 1.3 为什么索引质量很重要

索引一旦错了，AI 后面的每一步都会偏：

| 索引问题 | 后果 |
|---|---|
| `active` 指错资源集 | AI 读取错误设计系统 |
| `projectRoot` 指错 | 源码路径全部失效 |
| route rules 太泛 | 用户请求命中错误 page_type |
| layout 缺少 slot / visibility | 页面生成时无法正确裁剪和替换 |
| components.json path 错 | AI 找不到组件真值 |
| blocks.json 注册了 `src/render/**` | AI 把生成结果误当模板源 |
| block markdown 缺失 | AI 不知道什么时候调用或如何裁剪 Block |

因此，Resource Layer 索引的质量标准是：**每个索引条目都必须能追溯到真实源码、真实 layout、真实使用说明。**

---

## 2. Resource Layer 结构

这一组说明资源层最终应该长什么样。

### 2.1 目录结构

```text
.resources/
├── config.json
└── {system}/
    ├── route-index.md
    ├── layout/
    │   ├── index.md
    │   └── {page_type}.md
    ├── components.json
    ├── component/
    │   └── {component-id}.md
    ├── blocks.json
    └── block/
        └── {block-id}.md
```

---

### 2.2 文件职责

| 文件 | 职责 |
|---|---|
| `.resources/config.json` | 指定当前激活资源集和源码项目根目录 |
| `route-index.md` | 把用户请求 / Figma 意图映射到 `page_type` |
| `layout/{page_type}.md` | 定义页面模板、slot、显隐、Block / Component 需求 |
| `components.json` | 注册 Component ID 到源码路径、export、stories 的索引 |
| `component/*.md` | 复杂组件的按需使用说明 |
| `blocks.json` | 注册 Block ID 到源码路径、stories、dependencies 的索引 |
| `block/*.md` | Block 的适用意图、结构、可隐藏区域、裁剪规则 |

---

### 2.3 和 Source Layer 的关系

索引文件必须指向 Source Layer：

```text
components.json
  → src/component/{ComponentName}

blocks.json
  → src/blocks/{block-id}

layout markdown
  → layout source / runtime
  → blocks.json / components.json
```

如果 `.resources/**` 中的任何路径无法在 `projectRoot` 下找到，这个资源层就不能算完成。

---

## 3. 生成索引流程

这一组说明应该按什么顺序生成 Resource Layer。

### 3.1 推荐生成顺序

```text
确认 Source Layer
  ↓
生成 config.json
  ↓
注册 components.json
  ↓
注册 blocks.json
  ↓
编写 block/*.md / component/*.md
  ↓
编写 route-index.md
  ↓
编写 layout/{page_type}.md
  ↓
交叉校验路径、依赖和 slot
  ↓
用真实 prompt 试跑
```

为什么是这个顺序：

- Component 是最小真值，先确认。
- Block 依赖 Component，第二步确认。
- Layout 依赖 Block / Component 和 layout runtime，后面再写。
- route-index 负责把用户请求导到 layout。
- 最后用真实 prompt 检查整条链路是否能跑通。

---

### 3.2 步骤 1：确认 Source Layer

先确认源码项目是否真实存在。

需要确认：

| 检查项 | 说明 |
|---|---|
| `projectRoot` | 例如 `harmony-ui-playground` |
| Component 目录 | 例如 `src/component/**` |
| Block 目录 | 例如 `src/blocks/**` |
| Layout runtime | 例如 `src/layouts/**`、`src/forge/**` 或项目约定目录 |
| token / CSS | 例如 `src/index.css`、`src/styles/**` |
| Storybook | 组件和 Block 是否能被 story 检视 |

---

### 3.3 步骤 2：生成 config.json

`config.json` 决定当前激活哪套资源。

```json
{
  "active": "harmony",
  "resources": {
    "harmony": {
      "path": ".resources/harmony",
      "projectRoot": "harmony-ui-playground"
    }
  }
}
```

字段说明：

| 字段 | 说明 |
|---|---|
| `active` | 当前默认资源集 |
| `resources.{name}.path` | 资源层目录 |
| `resources.{name}.projectRoot` | 对应 Source Layer 项目根目录 |

---

### 3.4 步骤 3：注册 components.json

`components.json` 注册组件真值的位置。

要求：

- `id` 使用稳定 kebab-case。
- `path` 指向真实 `src/component/**`。
- `export` 对应真实导出。
- `stories` 尽量填写，方便验收。
- 复杂组件填写 `spec`，指向 `component/*.md`。

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

---

### 3.5 步骤 4：注册 blocks.json

`blocks.json` 注册稳定 Block 模板。

要求：

- `files` 指向真实 `src/blocks/**`。
- `stories` 指向可预览 story。
- `spec` 指向 `block/*.md`。
- `dependencies` 使用已注册 Component ID。
- 禁止把 `src/render/**` 注册成 Block。

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

---

### 3.6 步骤 5：补充 Markdown 使用说明

复杂 Component 和 Block 需要补 Markdown。

| 文档 | 什么时候需要 |
|---|---|
| `component/*.md` | Props 多、变体复杂、状态有业务含义、有禁止组合 |
| `block/*.md` | Block 有适用意图、可隐藏区域、可替换元素、裁剪规则 |

Markdown 的作用不是替代源码，而是让 AI 按需理解 how to use。

---

### 3.7 步骤 6：编写 route-index.md

`route-index.md` 把用户请求映射到 `page_type`。

示例：

```markdown
| page_type | layout | hit_rules | exclusion_rules |
|---|---|---|---|
| mobile-settings | layout/mobile-settings.md | 设置页 / 账号设置 / 网络设置 | 健康 / 服药 / dashboard |
| health-dashboard | layout/health-dashboard.md | 健康 / 三叶草 / 仪表盘 | 设置 / 网络 |
```

要求：

- `page_type` 命名稳定。
- `layout` 指向真实 layout markdown。
- `hit_rules` 覆盖常见用户表达。
- `exclusion_rules` 避免误命中。

---

### 3.8 步骤 7：编写 layout markdown

layout markdown 要串起 Page Type、Layout runtime、Block、Component。

必须包含：

- `layout_skeleton`
- `layout_runtime`
- `fixed_blocks`
- `slots`
- `visibility_rules`
- `reference_blocks`
- `needed_components`
- `generation_constraints`

注意：如果 layout markdown 中写了 slot 或显隐规则，Source Layer 中要有对应 runtime 能力。

---

### 3.9 步骤 8：交叉校验

生成完索引后，Agent 要做交叉校验：

| 校验项 | 说明 |
|---|---|
| config → resources | `active` 指向的资源集存在 |
| config → projectRoot | `projectRoot` 目录存在 |
| route → layout | 每个 route 指向的 layout 文件存在 |
| layout → blocks | `reference_blocks` / `slots` 里的 Block 都存在于 `blocks.json` |
| layout → components | `needed_components` 都存在于 `components.json` |
| blocks → source | `files` 都能在 `projectRoot` 下找到 |
| blocks → components | `dependencies` 都能在 `components.json` 找到 |
| components → source | `path` 和 `export` 对应真实源码 |
| markdown → source | `component/*.md` / `block/*.md` 不和源码能力冲突 |
| no render source | 没有把 `src/render/**` 注册为模板源 |

---

## 4. 质量标准

这一组用于判断资源层索引是否真的可被 Skill 消费。

### 4.1 索引完整性标准

| 维度 | 必须满足 |
|---|---|
| 资源集可激活 | `config.json` 能找到 active resource |
| 路由可命中 | 常见 prompt 能命中正确 page_type |
| layout 可读取 | 每个 page_type 有对应 layout markdown |
| runtime 可执行 | layout 有源码或运行层装配能力 |
| Component 可追溯 | components.json 指向真实源码和 export |
| Block 可追溯 | blocks.json 指向真实 Block 源码和 story |
| Markdown 可按需读取 | 复杂 Component / Block 有 how to use |
| 无生成污染 | `src/render/**` 不进入 blocks.json |

---

### 4.2 设计师审核点

设计师不需要逐行检查 JSON，主要确认语义是否正确。

| 审核项 | 看什么 |
|---|---|
| 资源集名称 | 是否对应真实设计系统 |
| 页面类型 | page_type 是否覆盖主要页面族 |
| 路由规则 | 用户常见说法是否能命中正确页面 |
| Layout | 固定骨架、slot、显隐规则是否符合设计 |
| Component | 是否都是通过 Storybook 验收的真组件 |
| Block | 是否都是稳定模板，不是生成预览 |
| 试跑页面 | 生成结果是否使用了正确资源 |

---

### 4.3 Agent 自动检查点

Agent 交付前应该自查：

| 检查项 | 说明 |
|---|---|
| 文件存在 | config、route-index、layout、components、blocks 都存在 |
| 路径有效 | 所有 path / files / stories 指向真实文件 |
| ID 一致 | layout、blocks、components 中引用的 ID 能互相对上 |
| 依赖有效 | blocks dependencies 都在 components.json 中存在 |
| slot 有清单 | layout slots 都有可替换 Block 清单 |
| 显隐有支撑 | layout / block 中的显隐规则有源码能力支撑 |
| prompt 试跑 | 至少一个真实 prompt 能跑完整链路 |

---

## 5. 边界和话术

这一组放容易混淆的边界和可以直接复制给 Agent 的话术。

### 5.1 注意边界

| 边界 | 说明 |
|---|---|
| Resource Layer vs Source Layer | Resource 是地图，Source 是真值 |
| components.json vs Component 源码 | components.json 是索引，不替代组件实现 |
| blocks.json vs Block 源码 | blocks.json 是索引，不替代 Block 实现 |
| layout markdown vs layout runtime | markdown 是装配协议，runtime 是装配能力 |
| `src/blocks/**` vs `src/render/**` | blocks 是稳定模板源，render 是生成结果预览 |

还要注意：

- 不要为了让索引完整而注册未验收组件。
- 不要把不存在的源码路径写进索引。
- 不要把复杂组件的使用规则只写在 prompt 里，应该落到 `component/*.md`。
- 不要把 Block 的裁剪规则只写在 layout 里，应该落到 `block/*.md` 和 Block TSX 能力里。

---

### 5.2 完整话术模板

**生成完整资源层索引：**

```text
请根据当前 React Component、Block、Layout runtime，生成一套 Resource Layer 索引。

资源集名称：[design-system-name]
源码项目：[projectRoot]
页面类型：[列出 page_type]
组件范围：[列出组件或目录]
Block 范围：[列出 Block 或目录]

要求：
- 生成 / 更新 config.json
- 生成 / 更新 route-index.md
- 生成 / 更新 layout/{page_type}.md
- 生成 / 更新 components.json
- 生成 / 更新 blocks.json
- 按需补 component/*.md 和 block/*.md
- 不要把 src/render/** 注册为 reference block
- 完成后做路径、依赖、slot、显隐能力的交叉校验
```

**校验资源层：**

```text
请校验当前 Resource Layer。
重点检查：
1. route-index 的 page_type 是否都有 layout
2. layout 的 reference_blocks / slots 是否都存在于 blocks.json
3. layout 的 needed_components 是否都存在于 components.json
4. blocks.json 的 files / stories / spec 是否真实存在
5. components.json 的 path / export / stories 是否真实存在
6. 有没有把 src/render/** 注册为模板源
7. layout / block 的显隐规则是否有源码能力支撑
```

**修复索引问题：**

```text
当前资源层校验失败：[贴出问题]
请修复对应索引，不要改动无关资源。
修复后重新输出校验结果。
```
