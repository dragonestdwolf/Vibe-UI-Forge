# 02 | Design System Skill 简介

> 这一篇先建立第一张心智地图：Design System Skill 是什么、它为什么要分层、一个需求进来时 AI 会怎样使用这些资源。

---

## 1. 先建立心智模型

### 1.1 一句话理解

Design System Skill 是一套让 AI 按设计系统生成页面的工作方式。

它不会让 AI 凭空写 UI，而是让 AI 先读取设计系统的资源说明，再回到真实 React 源码、CSS 和 token 里确认实现，最后生成可运行页面。

你可以先记住这句话：

```text
Resource Layer 是地图，Source Layer 是真值。
```

地图告诉 AI 去哪里找、怎么组合；真值告诉 AI 组件到底怎么写、样式到底是什么。

### 1.2 为什么需要它

普通的 AI 页面生成容易出现几个问题：

| 问题 | 例子 |
|---|---|
| 组件不稳定 | 同一个 Button 这次用 `div`，下次用 `button` |
| 样式不统一 | 直接写 `bg-blue-500`，没有使用设计系统 token |
| 页面结构漂移 | 同样是设置页，每次卡片顺序和层级都不一样 |
| 结果难追踪 | 生成后不知道参考了哪些组件和规则 |

Design System Skill 的目标，就是把生成过程从“AI 自由发挥”变成“AI 按设计系统工作”：

- 用真实组件生成
- 用真实 token 生成
- 用稳定 Block 和 Layout 生成
- 生成后能验证、能追踪

---

## 2. 认识三层架构

### 2.1 三层分别是什么

这套系统可以先理解成三层：

| 层 | 一句话理解 | 例子 |
|---|---|---|
| Skill Layer | AI 的工作规则 | 先匹配页面类型，再读 layout，再回到源码 grounding |
| Resource Layer | 设计系统地图 | `route-index.md`、`layout/*.md`、`blocks.json`、`components.json` |
| Source Layer | 真实代码真值 | React Component、Block、CSS、token、stories |

### 2.2 三层如何协作

它们的关系是：

```text
Skill Layer
  定义 AI 怎么工作
      ↓
Resource Layer
  告诉 AI 有哪些页面类型、组件、Block 和组合规则
      ↓
Source Layer
  提供真实可运行的组件源码、样式和 token
      ↓
生成页面
```

所以，Resource Layer 不是源码本身，而是设计系统和 AI 之间的契约；Source Layer 才是 AI 生成代码时必须对齐的真实依据。

---

## 3. 一个需求如何生成页面

### 3.1 设置页例子

假设设计师说：“帮我生成一个设置页。”

AI 不会马上写代码，而是会按下面的顺序工作：

| 阶段 | AI 在做什么 | 主要读取 |
|---|---|---|
| 1. 确认项目环境 | 确认 alias、Tailwind、token、验证命令 | 项目 `components.json`、`package.json`、`src/index.css` |
| 2. 判断页面类型 | 判断“设置页”属于哪个 `page_type` | `.resources/{active}/route-index.md` |
| 3. 读取页面骨架 | 找到这个页面类型的结构、Block、组件和约束 | `.resources/{active}/layout/{page_type}.md` |
| 4. 回到源码确认 | 确认组件 Props、变体、状态和 Block 组合方式 | `src/component/**`、`src/blocks/**`、stories、CSS、token |
| 5. 生成页面 | 按 layout 组合真实组件 | `src/render/{page-name}/` |
| 6. 验证和记录 | 跑类型检查、构建检查，并写生成日志 | `index.log.md` |

这个过程的重点不是“多读几个文件”，而是让 AI 在生成前先完成两件事：

- **理解意图**：这个需求属于哪类页面，应该遵守什么布局规则。
- **对齐真值**：组件和样式必须来自真实源码，不能自己发明。

### 3.2 完整工作流

当设计师给出一个需求（或 Figma 意图），AI 按以下链路处理：

```text
需求输入
    ↓
Step 1: Route Matching（路由匹配）
    ↓
Step 2: 获取风格（确认项目环境和设计系统）
    ↓
Step 3: 获取 Layout 模板
    ├─ layout/{page_type}.md（文档，how to use）
    └─ layout 指向的真实源码或运行实现（真值）
    ↓
Step 4: 获取组件真值（按需）
    ├─ components.json（索引，指向源码）
    └─ component/*.md（按需返回，markdown 使用说明）
    ↓
Step 5: 生成页面
    ↓
Step 6: 验证 + 写 Generation Log
```

### 3.3 Step 1：Route Matching

AI 读取 `route-index.md`，把需求映射为 `page_type`：

```markdown
| page_type | layout | hit_rules | exclusion_rules |
|---|---|---|---|
| mobile-settings | layout/mobile-settings.md | 设置 / 系统设置 | 健康 |
| health-dashboard | layout/health-dashboard.md | 健康 / 三叶草 / 仪表盘 | 设置 |
```

这一步决定后面读哪个 layout 文件。

### 3.4 Step 2：获取风格

AI 读取项目配置，确认当前设计系统和项目环境：

- `.resources/{active}/config.json`：激活哪套设计系统
- `harmony-ui-playground/components.json`：shadcn 组件配置
- `harmony-ui-playground/src/index.css`：全局样式和 token
- `harmony-ui-playground/package.json`：scripts 和依赖

确认：import alias 写法、Tailwind 配置、icon library、验证命令。

### 3.5 Step 3：获取 Layout 模板

AI 读取 `layout/{page_type}.md`，获得页面骨架、参考 Block、所需组件和生成约束。

```markdown
## layout_skeleton

Page
├── Header
├── AccountCard
└── Section
    └── SettingsRow

## reference_blocks

- settings-page

## needed_components

- StatusBar
- ServiceCard
- SettingsRow

## generation_constraints

- 不包含底部导航栏
```

如果该 layout 有源码或运行实现，AI 会继续读取真实实现，确认 Block 组合方式、插槽能力和显隐规则。

### 3.6 Step 4：获取组件真值

AI 读取 `components.json`，找到所需组件指向的真实源码：

```json
{
  "components": [
    {
      "id": "StatusBar",
      "source": "harmony-ui-playground/src/component/StatusBar/index.tsx",
      "stories": "harmony-ui-playground/src/stories/StatusBar.stories.tsx"
    }
  ]
}
```

AI 读取源码来确认：

- 组件的 Props 和变体
- 状态管理方式
- 样式 token 的实际值

如果源码不足以表达语义，AI 会额外读取 `component/*.md`，确认组件的变体、适用场景和使用边界。

### 3.7 Step 5：生成页面

AI 综合以上所有信息后：

- 复用 `reference_blocks` 中的 Block
- 使用 `needed_components` 中的组件
- 遵守 `generation_constraints` 中的约束
- 使用真实 alias 路径和 token 值
- 输出到 `harmony-ui-playground/src/render/{page-name}/`

### 3.8 Step 6：验证 + Generation Log

生成后执行：

- `pnpm typecheck`：TypeScript 类型检查
- `pnpm build-storybook`：Storybook 构建验证

并写入 `index.log.md`，记录本次生成的路由命中、layout 来源、参考 Block 和组件。

---

## 4. Resource Layer 只做地图和说明书

### 4.1 最重要的文件

Resource Layer 是 AI 的地图，通常长这样：

```text
.resources/{system}/
├── route-index.md
├── layout/
├── blocks.json
├── components.json
├── block/
└── component/
```

入门阶段只需要先记住这几类文件的分工：

| 文件 | 作用 |
|---|---|
| `route-index.md` | 把用户请求或 Figma 意图匹配到 `page_type` |
| `layout/{page_type}.md` | 说明某类页面怎么组织、有哪些约束 |
| `blocks.json` / `components.json` | 注册可用 Block / Component，并指向真实源码 |
| `block/*.md` / `component/*.md` | 补充使用场景、变体、显隐、边界等语义说明 |

### 4.2 Markdown 和 JSON 的分工

Resource Layer 里有两类信息：

| 类型 | 回答的问题 |
|---|---|
| Markdown | 这个模板、Block 或组件应该怎么用 |
| JSON | 这份说明对应哪段真实源码 |

所以，markdown 是给 AI 看的 how to use 说明书，JSON 是寻路地图。它们都不替代源码，最终真值仍然在 Source Layer。

### 4.3 设计系统切换时替换什么

切换设计系统时，通常替换两部分：

- **Resource Layer**：新的页面类型、Layout、Block、Component 索引和使用说明
- **Source Layer**：新的 React 组件库、Block 源码、CSS 和 token

Skill Layer 的工作规则通常保持稳定。换句话说，AI 的工作方法不需要重写，但它读取的地图和源码真值会换成另一套设计系统。

详细字段、模板和审核点放在参考资料里：

- [资源层文件说明](../04-参考资料/01-资源层文件说明.md)
- [route-index 模板](../04-参考资料/02-route-index%20模板.md)
- [layout markdown 模板](../04-参考资料/03-layout%20markdown%20模板.md)
- [blocks.json 模板](../04-参考资料/04-blocks.json%20模板.md)
- [components.json 模板](../04-参考资料/05-components.json%20模板.md)
- [项目目录说明](../04-参考资料/07-项目目录说明.md)

---

## 5. 最重要的边界

### 5.1 哪些可以替换

这套架构的好处是：Skill 的工作规则可以保持稳定，不同设计系统只需要替换资源和源码。

| 层 | 是否随设计系统替换 | 说明 |
|---|---|---|
| Skill Layer | 通常不替换 | 它定义通用工作流和生成规则 |
| Resource Layer | 可以替换 | 换成另一套设计系统的页面类型、Block、组件索引 |
| Source Layer | 可以替换 | 换成另一套 React 组件库、样式和 token |

举个例子：从 Harmony 设计系统切到另一个设计系统时，通常替换的是 `.resources/{system}` 和对应的 `*-playground/src`。AI 的生成流程不用重新发明。

### 5.2 生成结果不能反过来污染真值

| 边界 | 说明 |
|---|---|
| `src/blocks/**` | 稳定模板源，可以作为新页面生成参考 |
| `src/render/**` | 生成结果预览，不能反过来当模板源 |
| Resource Layer | 是地图和使用说明，不是源码真值 |
| Source Layer | 是真实 React / CSS / token，AI 生成结果必须和这里一致 |
