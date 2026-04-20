# Harmony-UI-Playground 改造后预期目录架构

> 基于 REFACTOR_PLAN.md 的插件化架构设计

---

## 一、整体架构

```
Vibe-UI-Forge-main/
├── .agent/                          # Skill 层（保持通用）
│   └── skills/
│       ├── shadcn/                  # shadcn Skill
│       │   ├── SKILL.md             # 改造：通用工作流，配置驱动
│       │   └── rules/               # 改造：规则模板（无业务属性）
│       │       ├── composition.md
│       │       ├── styling.md
│       │       ├── forms.md
│       │       ├── icons.md
│       │       └── base-vs-radix.md
│       └── (其他 Skill...)
│
├── .resources/                      # 资源层（轻量索引）⭐ 新增
│   ├── config.json                  # 资源配置：active + 多资源注册
│   ├── harmony/                     # Harmony 设计系统资源索引
│   │   ├── route-index.md           # 路由规则索引
│   │   ├── global-rules.md          # 全局规则索引（指向实际文件）
│   │   │
│   │   ├── layout/                  # 布局索引（轻量指针）
│   │   │   ├── index.md             # 布局清单（指向 blocks/）
│   │   │   ├── fallback.md          # 布局降级规则
│   │   │   └── mobile-settings.md   # 设置页元数据（引用而非复制）
│   │   │
│   │   ├── component/               # 组件索引（轻量指针）
│   │   │   ├── index.md             # 组件清单（指向 component/）
│   │   │   ├── fallback.md          # 组件降级规则
│   │   │   ├── button.md            # 按钮元数据（引用而非复制）
│   │   │   ├── list.md              # 列表元数据
│   │   │   ├── switch.md            # 开关元数据
│   │   │   └── ...
│   │   │
│   │   └── composition/             # 组合规则
│   │       └── check.md             # 组合校验规则
│   │
│   └── devui/                       # DevUI 设计系统资源索引（未来扩展）
│       └── ...
│
├── harmony-ui-playground/           # 组件实现层（真实来源）⭐ 代码生成依据
│   ├── src/
│   │   ├── component/               # 组件实现（真实来源，代码生成直接依据）
│   │   │   ├── Button/
│   │   │   ├── List/
│   │   │   ├── Switch/
│   │   │   ├── Divider/
│   │   │   ├── TitleBar/
│   │   │   ├── StatusBar/
│   │   │   ├── Card/
│   │   │   └── index.ts
│   │   │
│   │   ├── blocks/                  # Block 实现（真实来源）
│   │   │   ├── settings-page/
│   │   │   ├── health-clover/
│   │   │   └── ...
│   │   │
│   │   ├── styles/                 # 样式实现（真实来源）
│   │   │   ├── devui-tokens.css    # Token 变量（代码生成直接依据）
│   │   │   └── index.css
│   │   │
│   │   ├── stories/                # Storybook stories
│   │   ├── lib/                    # 工具函数
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── .storybook/
│   ├── components.json
│   └── package.json
│
├── history/                        # 历史规范存档（参考文档，非来源）
│   └── spec/
│       ├── 0.governance/
│       ├── 1.layout/
│       ├── 2.theme/
│       ├── 3.component/
│       └── 4.template/
│
└── docs/
    ├── REFACTOR_PLAN.md
    ├── EXPECTED_ARCHITECTURE.md
    ├── preview-environment.md
    └── component-maintenance.md
```

---

## 二、核心目录详解

### 2.1 `.resources/harmony/` 资源层结构

> **核心原则**：资源层只做**索引和指针**，不复制实现代码

```
.resources/harmony/
├── route-index.md                  # 路由规则索引
│   格式：
│   - 页面类型识别模式 → page_type
│   - page_type → blocks/ 路径映射
│   - intent_type 识别规则
│
├── global-rules.md                # 全局规则索引
│   格式：
│   - font: ../harmony-ui-playground/src/styles/devui-tokens.css
│   - theme: ../harmony-ui-playground/src/styles/devui-tokens.css
│   - icon: ../harmony-ui-playground/src/component/ (图标组件路径)
│
├── layout/                         # 布局索引（轻量指针）
│   ├── index.md                   # 布局清单（id, name, blocks_path, hit_rules）
│   ├── fallback.md                # 布局降级规则
│   └── mobile-settings.md         # 设置页布局元数据（引用而非复制）
│
├── component/                      # 组件索引（轻量指针）
│   ├── index.md                   # 组件清单（id, name, implementation_path）
│   ├── fallback.md                # 组件降级规则
│   └── button.md                  # 按钮组件元数据（引用而非复制）
│
└── composition/                    # 组合规则
    └── check.md                   # 组合校验规则
```

**关键区别**：
- ❌ 不再在 `.resources/` 下复制 `.tsx` 组件源码
- ✅ 只在 `.resources/` 下存储**索引、元数据、降级规则**
- ✅ 实际组件实现在 `harmony-ui-playground/src/component/` 中

### 2.2 `harmony-ui-playground/src/component/` 组件实现结构（真实来源）

```
harmony-ui-playground/src/component/
├── Button/
│   ├── Button.tsx                 # 组件实现
│   ├── Button.css                 # 组件样式
│   ├── Button.stories.tsx         # Storybook story
│   └── index.ts                   # 导出
├── List/
│   ├── List.tsx
│   ├── ListItem.tsx
│   ├── List.css
│   ├── List.stories.tsx
│   └── index.ts
├── Switch/
│   └── ...
├── Divider/
│   └── ...
├── TitleBar/
│   └── ...
├── StatusBar/
│   └── ...
├── Card/
│   └── ...
└── index.ts                        # 统一导出
```

### 2.3 `harmony-ui-playground/src/blocks/` Block 结构

```
harmony-ui-playground/src/blocks/
├── settings-page/
│   ├── settings-page.tsx          # 页面实现
│   ├── settings-page.css
│   └── settings-page.stories.tsx
├── health-clover/
│   └── ...
├── medication/
│   └── ...
└── water-settings/
    └── ...
```

---

## 三、数据流向

```
用户输入 (prompt / Figma)
    ↓
┌─────────────────────────────────────┐
│ 1. 读取 .resources/config.json      │
│    确定 active = "harmony"          │
│    获取资源根路径                    │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 2. Route Matching                    │
│    读取 .resources/harmony/route-index.md
│    匹配 page_type                   │
│    → 输出: page_type + intent      │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 3. Layout Resolution                │
│    读取 .resources/harmony/layout/  │
│    ├── index.md                    │  (轻量索引)
│    └── mobile-settings.md          │  (元数据，引用而非复制)
│    定位到 harmony-ui-playground/src/blocks/
│    读取实际 blocks/*.tsx 源码       │
│    → 输出: layout_skeleton (来自tsx) │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 4. Component Resolution             │
│    读取 .resources/harmony/component/
│    ├── index.md                    │  (轻量索引)
│    └── button.md                   │  (元数据，引用而非复制)
│    定位到 harmony-ui-playground/src/component/
│    读取实际 component/*.tsx 源码     │
│    → 输出: component_list (来自tsx) │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 5. Composition Check               │
│    读取 .resources/harmony/composition/check.md
│    基于 tsx 源码进行几何兼容性校验    │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 6. Code Generation                 │
│    基于 harmony-ui-playground/src/  │
│    中实际的 .tsx 组件源码生成代码    │
│    应用 harmony-ui-playground/src/   │
│    └── styles/devui-tokens.css     │
└─────────────────────────────────────┘
```

**核心原则**：
- `.tsx` 源码是**唯一真实来源**
- `.resources/` 下的 markdown 是**轻量索引/元数据**，不含实现代码
- 代码生成基于 `.tsx` 源码，而非 markdown 文档

---

## 四、关键文件映射关系

### 资源索引 ↔ 实际实现

| 资源索引 (.resources/harmony/) | 实际实现 (harmony-ui-playground/src/) |
|-------------------------------|-------------------------------------|
| `component/index.md` | `component/index.ts` |
| `component/button.md` (元数据) | `component/Button/Button.tsx` |
| `component/list.md` (元数据) | `component/List/List.tsx` |
| `component/switch.md` (元数据) | `component/Switch/Switch.tsx` |
| `layout/index.md` | `blocks/settings-page/settings-page.tsx` |
| `global-rules.md` | `styles/devui-tokens.css` |

### 工作流读取路径

| 工作流步骤 | 读取的配置文件 | 指向 |
|-----------|---------------|------|
| 路由匹配 | `config.json` → `route-index.md` | 匹配 page_type |
| 全局规则 | `route-index.md` → `global-rules.md` | 获取 Token/CSS 路径 |
| 布局加载 | `layout/index.md` → `layout/{page_type}.md` | 获取 blocks 路径 |
| 组件加载 | `component/index.md` → `component/{name}.md` | 获取组件路径 |
| 代码生成 | `layout/index.md` / `component/index.md` | 读取 `harmony-ui-playground/src/` 下的 `.tsx` 源码 |

### history/spec/*.md 的定位

> **历史文档，作为参考而非来源**

| 文件 (history/spec/) | 作用 |
|---------------------|------|
| `3.component/*.md` | 组件规范的**人类可读文档**，用于理解设计意图 |
| `1.layout/layout.md` | 布局规范的**人类可读文档** |
| `4.template/*-tem.html` | HTML 模板参考 |
| `2.theme/theme.md` | Token 值的**参考文档** |

**重要**：`history/spec/` 下的 markdown 是从实现中提取的文档，不是代码生成的直接来源。代码生成应基于 `harmony-ui-playground/src/` 下的 `.tsx` 源码。

---

## 五、与现有文件的对应关系

### 现有文件角色划分

| 目录 | 角色 | 说明 |
|------|------|------|
| `harmony-ui-playground/src/component/` | **组件实现（真实来源）** | `.tsx` 源码，代码生成的直接依据 |
| `harmony-ui-playground/src/blocks/` | **Block 实现（真实来源）** | `.tsx` 源码，页面模板的直接依据 |
| `harmony-ui-playground/src/styles/devui-tokens.css` | **Token 实现（真实来源）** | CSS 变量，样式生成的直接依据 |
| `history/spec/` | **参考文档（派生品）** | 从实现中提取的人类可读文档 |
| `.resources/harmony/` | **轻量索引（指针）** | 指向真实来源的路径映射和元数据 |

### 改造原则

1. **不移动** `harmony-ui-playground/src/component/` 和 `harmony-ui-playground/src/blocks/` 中的任何文件
2. **不复制** `.tsx` 源码到 `.resources/`
3. `.resources/harmony/` 只创建**索引文件**，引用 `harmony-ui-playground/src/` 下的实际实现
4. `history/spec/` 作为历史参考保留，不参与代码生成流程

### 迁移到新架构

| 原计划 | 修正后的做法 |
|--------|-------------|
| 复制 `component/*.tsx` 到 `.resources/harmony/component/` | ❌ 不复制，只在 `component/index.md` 中引用路径 |
| 复制 `blocks/*.tsx` 到 `.resources/harmony/layout/` | ❌ 不复制，只在 `layout/index.md` 中引用路径 |
| 将 `history/spec/*.md` 作为生成依据 | ❌ 作为人类可读参考，不作为代码生成来源 |

---

## 六、扩展场景

### 6.1 新增 DevUI 资源集

```
.resources/
├── config.json                    # 注册 devui
├── harmony/                       # 现有 Harmony（轻量索引）
└── devui/                         # 新增 DevUI
    ├── route-index.md
    ├── global-rules.md
    ├── layout/ (轻量索引)
    ├── component/ (轻量索引)
    └── composition/
```

切换时修改 `config.json`：
```json
{
  "active": "devui",
  "resources": { ... }
}
```

### 6.2 新增 Layout 类型

1. 在 `harmony-ui-playground/src/blocks/` 创建新组件实现
2. 在 `.resources/harmony/layout/index.md` 注册（路径指向 blocks/）
3. 在 `route-index.md` 增加匹配规则

### 6.3 新增组件

1. 在 `harmony-ui-playground/src/component/` 创建组件实现
2. 在 `.resources/harmony/component/index.md` 注册（路径指向 component/）
3. 在 `component/{name}.md` 创建元数据（引用实现而非复制）
