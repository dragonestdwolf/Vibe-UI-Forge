# 按设计系统分离的架构

> **核心理念**：每个设计系统独立维护自己的 Skill（通用层）+ 资源层

---

## 一、整体架构

```
Vibe-UI-Forge-main/
│
├── .agent/skills/                    # Skill 层（按设计系统分离）
│   ├── harmony/                      # Harmony Design System
│   │   ├── SKILL.md                # 通用工作流（3步）
│   │   ├── rules/                   # 规则模板（通用）
│   │   │   ├── composition.md
│   │   │   ├── styling.md
│   │   │   ├── forms.md
│   │   │   └── icons.md
│   │   └── .resources/             # ⭐ Harmony 资源（内嵌）
│   │       ├── route-index.md
│   │       ├── layout/
│   │       └── component/
│   │
│   └── devui/                       # DevUI Design System
│       ├── SKILL.md
│       ├── rules/
│       └── .resources/             # ⭐ DevUI 资源（内嵌）
│           ├── route-index.md
│           ├── layout/
│           └── component/
│
├── harmony-ui-playground/            # Harmony 实现层（真实来源）
│   └── src/
│       ├── component/               # Harmony 组件实现
│       ├── blocks/                 # Harmony Block 实现
│       └── styles/
│           └── devui-tokens.css
│
├── devui-playground/                 # DevUI 实现层（真实来源）
│   └── src/
│       ├── component/               # DevUI 组件实现
│       ├── blocks/
│       └── styles/
│           └── devui-tokens.css
│
├── history/spec/                    # 历史参考文档
│   ├── harmony/                    # Harmony 历史规范
│   │   ├── layout/
│   │   ├── component/
│   │   └── theme/
│   └── devui/                      # DevUI 历史规范
│       └── ...
│
└── docs/
```

---

## 二、每个 Design System 的自包含结构

### Harmony Design System

```
.agent/skills/harmony/
├── SKILL.md                    # 通用工作流（3步）
│                               # 不包含 Harmony 特定信息
│
├── rules/                      # 规则模板（通用）
│   ├── composition.md         # 组合规则模板
│   ├── styling.md            # 样式规则模板
│   ├── forms.md              # 表单规则模板
│   └── icons.md              # 图标规则模板
│
└── .resources/                 # ⭐ Harmony 资源（业务属性）
    ├── route-index.md         # 路由规则
    ├── layout/
    │   ├── index.md
    │   └── mobile-settings.md
    └── component/
        ├── index.md
        ├── button.md
        ├── list.md
        └── switch.md
```

### DevUI Design System

```
.agent/skills/devui/
├── SKILL.md
├── rules/
└── .resources/
    ├── route-index.md
    ├── layout/
    └── component/
```

---

## 三、工作流

### Harmony 工作流

```
用户: "在 harmony-ui-playground 生成一个设置页"
    ↓
读取 .agent/skills/harmony/SKILL.md
    ↓
Step 1: Route Matching
    - 读 .agent/skills/harmony/.resources/route-index.md
    ↓
Step 2: Layout Resolution
    - 读 .agent/skills/harmony/.resources/layout/mobile-settings.md
    ↓
Step 3: Code Generation
    - 读 harmony-ui-playground/src/ 下的 tsx 源码
    ↓
生成代码
```

### DevUI 工作流

```
用户: "在 devui-playground 生成一个设置页"
    ↓
读取 .agent/skills/devui/SKILL.md
    ↓
Step 1: Route Matching
    - 读 .agent/skills/devui/.resources/route-index.md
    ↓
Step 2: Layout Resolution
    - 读 .agent/skills/devui/.resources/layout/mobile-settings.md
    ↓
Step 3: Code Generation
    - 读 devui-playground/src/ 下的 tsx 源码
    ↓
生成代码
```

---

## 四、SKILL.md 通用工作流（示例）

```markdown
# {DesignSystem} UI Forge

A workflow for generating UI based on {DesignSystem} design system.

## Workflow (3 Steps)

### Step 1: Route Matching
- Read `.resources/route-index.md`
- Match page_type from user prompt

### Step 2: Layout Resolution
- Read `.resources/layout/{page_type}.md`
- Get needed_components[]

### Step 3: Code Generation
- Read `../{playground}/src/` for actual tsx implementations
- Apply tokens from `../{playground}/src/styles/devui-tokens.css`

## Resource Path

- Resources: `.resources/`
- Implementation: `../{playground}/src/`

## Key Principles

- tsx source is the single source of truth
- markdown is optional reference
- Each step only reads files needed for current decision
```

---

## 五、关键设计原则

### 1. Skill 层完全通用

`SKILL.md` 和 `rules/` **不包含任何业务特定信息**：

| 应该包含 | 不应该包含 |
|---------|-----------|
| 通用工作流（3步） | Harmony 特定的 Token 名称 |
| 规则模板格式 | DevUI 特定的组件名 |
| 按需读取协议 | 任何设计系统的颜色值 |

### 2. 资源层完全自包含

每个设计系统的资源只在自己的 `.resources/` 下：

| Harmony | DevUI |
|---------|-------|
| `.resources/` | `.resources/` |
| `route-index.md` | `route-index.md` |
| `layout/mobile-settings.md` | `layout/mobile-settings.md` |

### 3. 实现层独立

`harmony-ui-playground/src/` 和 `devui-playground/src/` 是**真实来源**，Skill 不复制它们的内容。

---

## 六、与之前设计的对比

| 维度 | 之前设计 | 当前设计 |
|------|---------|---------|
| Skill 位置 | 共享 `.agent/skills/shadcn/` | 每个 Design System 独立 |
| 资源位置 | 共享 `.resources/` | 内嵌在每个 Skill 下 |
| 切换机制 | `config.json` 切换 active | 直接用对应 Design System 的 Skill |
| 维护方式 | 集中维护 | **每个 Design System 独立维护** |

---

## 七、维护职责划分

| 目录 | 维护者 | 说明 |
|------|--------|------|
| `.agent/skills/harmony/` | Harmony 团队 | Skill + 资源 |
| `.agent/skills/devui/` | DevUI 团队 | Skill + 资源 |
| `harmony-ui-playground/src/` | Harmony 团队 | 组件实现 |
| `devui-playground/src/` | DevUI 团队 | 组件实现 |
| `history/spec/harmony/` | Harmony 团队 | 历史参考 |
| `history/spec/devui/` | DevUI 团队 | 历史参考 |

---

## 八、扩展新的 Design System

1. 创建 `.agent/skills/{new-system}/`
2. 复制 `SKILL.md` 和 `rules/` 模板
3. 在 `.resources/` 下填充资源文件
4. 在 `docs/` 下创建对应 playground

```
.agent/skills/
└── {new-system}/           # 新 Design System
    ├── SKILL.md
    ├── rules/
    └── .resources/
```
