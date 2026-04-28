# Harmony-UI-Playground 改造后预期目录架构（轻量版）

> **版本**：轻量版（简化工作流）
> **核心理念**：tsx 源码是直接来源；route/layout markdown 是默认读取，component markdown 按需参考

---

## 一、核心工作流（3 步）

```
用户输入 (prompt / Figma Design)
    ↓
┌─────────────────────────────────────┐
│ Step 1: Route Matching               │
│     读 route-index.md                │
│     → 输出: page_type                │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Step 2: Layout Resolution            │
│     读 layout/{page_type}.md        │
│     → 输出: layout_skeleton          │
│     + needed_components[]            │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Step 3: Code Generation              │
│     读 harmony-ui-playground/src/    │
│     下的 tsx 源码 + tokens.css       │
│     → 输出: 生成的代码               │
└─────────────────────────────────────┘

[按需] 用户询问组件规范详情时
    → 读取 component/{name}.md
```

**关键原则**：
- route/index.md 和 layout/*.md 是页面生成**默认**读取
- component/*.md 是**按需**读取（用户询问组件细节时）
- tsx 源码是**唯一真实来源**
- 每步只读**当前决策必须的文件**

---

## 二、整体架构

```
Vibe-UI-Forge-main/
├── .agent/                          # Skill 层（保持通用）
│   └── skills/
│       ├── shadcn/                  # shadcn Skill
│       │   ├── SKILL.md             # 通用工作流，3步核心
│       │   └── rules/               # 规则模板（无业务属性）
│       │       ├── composition.md
│       │       ├── styling.md
│       │       ├── forms.md
│       │       ├── icons.md
│       │       └── base-vs-radix.md
│       └── (其他 Skill...)
│
├── .resources/                      # 资源层（轻量索引）
│   ├── config.json                  # 资源配置
│   ├── harmony/                     # Harmony 设计系统资源索引
│   │   ├── route-index.md          # ⭐ Step 1 读取
│   │   └── layout/                  # 布局索引
│   │       ├── index.md            # 布局清单
│   │       └── {page_type}.md      # ⭐ Step 2 读取
│   │
│   │   └── component/               # 组件规范（按需读取）
│   │       ├── button.md           # ⭐ 按需：用户询问时读取
│   │       ├── list.md
│   │       ├── switch.md
│   │       └── ...
│   │
│   └── devui/                       # DevUI 资源索引（未来扩展）
│       └── ...
│
├── harmony-ui-playground/           # ⭐ 真实来源（代码生成直接依据）
│   ├── src/
│   │   ├── component/               # 组件 tsx 源码
│   │   │   ├── Button/
│   │   │   ├── List/
│   │   │   ├── Switch/
│   │   │   ├── Divider/
│   │   │   └── ...
│   │   │
│   │   ├── blocks/                  # Block tsx 源码
│   │   │   ├── settings-page/
│   │   │   ├── health-clover/
│   │   │   └── ...
│   │   │
│   │   └── styles/
│   │       └── harmony-token.css   # ⭐ Step 3 读取（`--harmony-*`）
│   │
│   └── ...
│
├── history/spec/                    # 历史参考文档（可选阅读）
│   └── ...
│
└── docs/
    ├── REFACTOR_PLAN.md
    ├── EXPECTED_ARCHITECTURE.md     # 完整版
    ├── EXPECTED_ARCHITECTURE_LIGHT.md # 本文件（轻量版）
    └── ...
```

---

## 三、核心目录详解

### 3.1 `.resources/harmony/` 资源层结构

```
.resources/harmony/
├── route-index.md                  # ⭐ Step 1 读取
│   格式：
│   - 页面类型识别模式 → page_type
│   - page_type → layout/{type}.md 路径
│   - intent_type 识别规则
│
├── layout/                         # 布局索引
│   ├── index.md                   # 布局清单
│   └── {page_type}.md            # ⭐ Step 2 读取
│       内容：
│       - hit_rules（命中条件）
│       - exclusion_rules（排除条件）
│       - page_skeleton（骨架模板）
│       - needed_components[]（需要的组件列表）
│       - composition_mapping（组件映射）
│
└── component/                     # 组件规范（按需读取）
    ├── button.md                  # ⭐ 按需：用户询问时读取
    ├── list.md
    ├── switch.md
    └── ...
```

**关键点**：
- `.resources/` 只存储**轻量索引和元数据**
- **不复制** tsx 源码
- 组件规范是**按需读取**，不是工作流默认步骤

### 3.2 `harmony-ui-playground/src/` 真实来源

```
harmony-ui-playground/src/
├── component/                     # ⭐ 组件实现（Step 3 直接读取）
│   ├── Button/
│   │   ├── Button.tsx           # 代码生成依据
│   │   ├── Button.css
│   │   └── index.ts
│   ├── List/
│   ├── Switch/
│   └── ...
│
├── blocks/                        # ⭐ Block 实现（Step 3 直接读取）
│   ├── settings-page/
│   │   └── settings-page.tsx   # 代码生成依据
│   └── ...
│
└── styles/
    └── harmony-token.css        # ⭐ Token（Step 3 直接读取，命名空间为 `--harmony-*`）
```

---

## 四、工作流详解

### Step 1: Route Matching

```
输入: 用户 prompt / Figma Design
输出: page_type

读取文件：
- .resources/config.json（获取 active 资源路径）
- .resources/harmony/route-index.md（匹配 page_type）
```

**route-index.md 格式**：
```markdown
# Harmony 路由规则

## 页面类型识别

| 模式 | page_type | layout 路径 |
|------|-----------|-------------|
| 设置页 / 个人中心 / 偏好设置 | `mobile-settings` | layout/mobile-settings.md |
| 列表页 / 详情页 | `mobile-list` | layout/mobile-list.md |
| 半模态 | `mobile-sheet` | layout/mobile-sheet.md |

## Fallback

无法识别时默认路由到：`layout/mobile-settings.md`
```

### Step 2: Layout Resolution

```
输入: page_type
输出: layout_skeleton + needed_components[]

读取文件：
- .resources/harmony/layout/{page_type}.md（按需单个读取）
```

**{page_type}.md 格式**：
```markdown
# mobile-settings 布局规范

## hit_rules
- 画布为单屏移动端竖向比例
- 顶部存在 status bar + titlebar
- 主体内容以圆角卡片为核心容器

## exclusion_rules
- 顶部存在 tab 导航时排除
- 底部存在固定主 CTA 时排除

## page_skeleton
```html
<main class="layout-mobile-settings">
  <section class="layout-status-bar"></section>
  <header class="layout-titlebar"></header>
  <section class="layout-content">
    <section class="layout-card"></section>
  </section>
  <footer class="layout-home-indicator"></footer>
</main>
```

## needed_components
- StatusBar
- TitleBar
- Card
- List
- Switch
- Divider

## composition_mapping
- status bar → StatusBar
- titlebar → TitleBar
- card → Card
- card row → List
- switch → Switch
- divider → Divider
```

### Step 3: Code Generation

```
输入: layout_skeleton + needed_components[]
输出: 生成的代码

读取文件：
- harmony-ui-playground/src/blocks/{page}/ 下的 tsx 源码
- harmony-ui-playground/src/component/{name}/ 下的 tsx 源码
- harmony-ui-playground/src/styles/harmony-token.css
```

**核心原则**：
- 直接读取 tsx 源码，不是 markdown
- 按需读取需要的组件，不是全部加载
- 应用 tokens.css 中的 CSS 变量，Harmony 统一使用 `--harmony-*`

---

## 五、按需读取规则

### 什么时候读取 markdown？

| 场景 | 读取的 markdown | 原因 |
|------|----------------|------|
| 用户询问组件设计意图 | `component/{name}.md` | 了解尺寸、状态、行为约束 |
| 用户询问布局规范 | `layout/{page_type}.md` | 了解 hit rules、composition |
| 用户询问 token 详情 | `history/spec/2.theme/theme.md` | 了解颜色值含义 |

### 什么时候不读取 markdown？

| 场景 | 直接读取 |
|------|---------|
| 代码生成 | tsx 源码 |
| 样式生成 | tokens.css |
| 组件组合 | tsx 源码 |

---

## 六、与现有文件的对应关系

### 文件角色划分

| 目录 | 角色 | 说明 |
|------|------|------|
| `harmony-ui-playground/src/component/` | **真实来源** | tsx 源码，代码生成直接依据 |
| `harmony-ui-playground/src/blocks/` | **真实来源** | tsx 源码，页面模板直接依据 |
| `harmony-ui-playground/src/styles/harmony-token.css` | **真实来源** | CSS 变量，样式直接依据，命名空间统一为 `--harmony-*` |
| `.resources/harmony/layout/` | **默认读取** | route/layout markdown，页面生成工作流默认步骤 |
| `.resources/harmony/component/` | **按需参考** | 组件规范，用户询问组件细节时读取 |
| `.resources/harmony/blocks.json` | **主索引** | 页面生成主索引，v1.0 核心文件 |
| `.resources/harmony/components.json` | **组件映射** | component id -> 源码路径/stories |
| `harmony-ui-playground/registry.json` | **Legacy** | 保留但不再作为页面生成主索引 |
| `harmony-ui-playground/components.json` | **项目配置** | shadcn 风格配置，alias 定义 |
| `history/spec/` | **历史参考** | 可选阅读，不参与工作流 |

### 改造原则

1. **不移动** `harmony-ui-playground/src/` 下的任何文件
2. **不复制** tsx 源码到 `.resources/`
3. `.resources/` 只创建**索引文件**
4. route/layout markdown 是**默认工作流**，component markdown 是**按需参考**

---

## 七、扩展场景

### 7.1 新增 DevUI 资源集

```
.resources/
├── config.json                    # 注册 devui
├── harmony/                       # 现有 Harmony
└── devui/                        # 新增
    ├── route-index.md
    └── layout/
```

切换时修改 `config.json` 的 `active` 字段。

### 7.2 新增 Layout 类型

1. 在 `harmony-ui-playground/src/blocks/` 创建 tsx 实现
2. 在 `.resources/harmony/layout/index.md` 注册
3. 在 `route-index.md` 增加匹配规则

### 7.3 新增组件

1. 在 `harmony-ui-playground/src/component/` 创建 tsx 实现
2. 在 `.resources/harmony/component/` 下创建规范（可选）
3. 在对应 layout 的 `needed_components` 中声明

---

## 八、工作流对比

| 维度 | 完整版 | 轻量版（本方案） |
|------|--------|----------------|
| 核心步骤 | 6 步 | **3 步** |
| 每步文件数 | 1-5 个 | **1 个** |
| markdown 读取 | 默认步骤 | **route/layout 默认，component 按需** |
| 模型压力 | 高 | **低-中** |
| 降级逻辑 | 精确→模糊→fallback | **无（简化）** |
| 适用场景 | 复杂页面 | **标准页面** |

---

## 九、后续可扩展的能力

当前轻量版**保留扩展接口**，后续可按需加入：

| 能力 | 说明 | 触发条件 |
|------|------|---------|
| 组件降级 | 找不到组件时使用 fallback | 高级用户开启 |
| 组合校验 | 校验 layout + component 兼容性 | 高级用户开启 |
| 布局降级 | 精确匹配失败时模糊匹配 | 高级用户开启 |
