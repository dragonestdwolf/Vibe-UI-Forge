# Design System Skill v1.0

> 目标：在现有 shadcn 组件/区块工作流之前，增加设计系统级的 route 与 layout 推理层，使页面生成从“组件拼装”升级为“意图识别 -> 布局决策 -> 源码 grounding -> 页面生成”。

---

## 1. 定位

Design System Skill v1.0 是一个轻量页面生成工作流。

它不替代 shadcn 的项目上下文、组件规则、registry/add/view 能力，而是补齐 shadcn 页面生成前缺少的两层：

1. Route Matching：从用户 prompt 或 Figma 画面识别页面类型。
2. Layout Resolution：从页面类型推导布局骨架、推荐参考区块和所需组件。

shadcn 继续负责：

- 读取 `components.json` 中的项目上下文。
- 使用已有组件和区块。
- 遵守 composition、styling、forms、icons 等通用规则。
- 以源码文件的方式生成和维护组件。

---

## 2. 核心原则

### 2.1 Markdown 的角色

页面生成时，markdown 分两类：

| 类型 | 是否默认读取 | 作用 |
|------|--------------|------|
| `route-index.md` | 是 | prompt / Figma -> `page_type` |
| `layout/{page_type}.md` | 是 | `page_type` -> layout skeleton / needed components / reference blocks |
| `component/{name}.md` | 否 | 仅在需要该组件细节、设计语义或行为约束时读取 |
| `history/spec/**` | 否 | 历史参考和人工审计，不作为默认生成输入 |

因此，v1.0 的准确原则是：

```text
layout 推理阶段默认读取 markdown；
component 规范 markdown 按需读取；
代码生成始终以 TSX/CSS/tokens 为真实来源。
```

### 2.2 真实来源

以下文件是代码生成的真实来源：

| 文件/目录 | 角色 |
|-----------|------|
| `harmony-ui-playground/src/component/` | 组件实现与组件 API |
| `harmony-ui-playground/src/blocks/` | 页面/区块实现参考 |
| `harmony-ui-playground/src/styles/harmony-token.css` | 设计 token |
| `harmony-ui-playground/src/index.css` | Tailwind v4 semantic token 映射 |
| `harmony-ui-playground/components.json` | alias、style、iconLibrary、Tailwind 配置 |

`.resources/` 只保存索引、映射和推理规则，不复制 TSX 源码。

---

## 3. v1.0 页面生成工作流

```text
用户输入 / Figma Design
    ↓
Step 0: Project Context
    读 components.json
    读 src/index.css / tokens.css
    读 .resources/{active}/assets.json（如存在）
    获取 alias、组件根目录、token 体系
    ↓
Step 1: Route Matching
    读 .resources/config.json
    读 .resources/{active}/route-index.md
    输出 page_type / intent_type / candidate_layouts
    ↓
Step 2: Layout Resolution
    读 .resources/{active}/layout/{page_type}.md
    输出 layout_skeleton / needed_components / reference_blocks / composition_mapping
    ↓
Step 3: Source Grounding
    读 reference_blocks 指向的 src/blocks/*.tsx
    读 needed_components 指向的 src/component/* 源码和 stories
    读 related_assets / asset_mapping 指向的已注册资产
    读 tokens.css
    ↓
Step 4: Page Generation
    生成页面 TSX/CSS/stories
    使用 components.json 中的 alias
    遵守 shadcn composition/styling 规则
    ↓
Step 5: Validation
    npm run build
    npm run build-storybook
    Storybook 人工或视觉验收
```

---

## 4. 目标目录结构

```text
Vibe-UI-Forge-main/
├── .resources/
│   ├── config.json
│   └── harmony/
│       ├── route-index.md
│       ├── blocks.json
│       ├── components.json
│       ├── layout/
│       │   ├── index.md
│       │   ├── mobile-settings.md
│       │   ├── health-dashboard.md
│       │   └── mobile-sheet.md
│       └── component/
│           ├── button.md
│           ├── list.md
│           └── switch.md
│
├── harmony-ui-playground/
│   ├── components.json
│   ├── src/
│   │   ├── component/
│   │   ├── blocks/
│   │   ├── styles/harmony-token.css
│   │   └── index.css
│   └── registry.json
│
└── docs/
    ├── EXPECTED_ARCHITECTURE_LIGHT.md
    └── DESIGN_SYSTEM_SKILL_V1.0.md
```

说明：

- `.resources/harmony/blocks.json` 承接当前 `harmony-ui-playground/registry.json` 的 block 清单职责。
- `.resources/harmony/components.json` 负责 component id 到源码路径、export、stories、spec markdown 的映射。
- `harmony-ui-playground/registry.json` 在 v1.0 中作为 legacy 文件保留，不作为页面生成主索引。

---

## 5. 文件职责

### 5.1 `.resources/config.json`

负责注册可用设计系统，并指定当前默认资源集。

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

### 5.2 `.resources/harmony/route-index.md`

负责从用户输入或 Figma 画面识别页面类型。

推荐内容：

```markdown
# Harmony Route Index

## 页面类型识别

| 模式 | page_type | layout |
|------|-----------|--------|
| 设置页 / 偏好设置 / 个人中心 / 开关列表 | `mobile-settings` | `layout/mobile-settings.md` |
| 健康任务 / 进度面板 / 每日目标 | `health-dashboard` | `layout/health-dashboard.md` |
| 服药提醒 / 底部浮层 / 半模态 | `mobile-sheet` | `layout/mobile-sheet.md` |

## Fallback

无法识别时默认使用 `mobile-settings`。
```

### 5.3 `.resources/harmony/layout/{page_type}.md`

负责布局推理。每个 layout markdown 必须推荐 reference blocks。

推荐结构：

````markdown
# mobile-settings

## hit_rules
- 设置页、偏好设置、个人中心、开关配置页。
- 移动端单列布局。
- 主体由一组或多组列表卡片组成。

## exclusion_rules
- 以图表或任务进度为主要内容时排除。
- 以底部半模态浮层为主体时排除。

## reference_blocks
- water-settings
- settings-page

## layout_skeleton
```html
<main class="mobile-settings">
  <StatusBar />
  <TitleBar />
  <section data-slot="content">
    <List />
  </section>
  <footer data-slot="home-indicator" />
</main>
```

## needed_components
- status-bar
- title-bar
- list
- list-item
- switch

## composition_mapping
- status bar -> StatusBar
- page title -> TitleBar
- setting group -> List
- setting row -> ListItem
- boolean option -> Switch

## generation_constraints
- 优先复用 reference_blocks 中的布局节奏。
- 组件 API 以 TSX 源码为准。
- 样式优先使用 token 或现有组件 CSS 习惯。
````

### 5.4 `.resources/harmony/blocks.json`

负责 block id 到源码、stories、依赖组件和 layout 类型的机器可读映射。

它是当前 `harmony-ui-playground/registry.json` 的升级版。

```json
{
  "name": "harmony",
  "sourceRoot": "harmony-ui-playground/src",
  "blocks": [
    {
      "id": "water-settings",
      "pageType": "mobile-settings",
      "description": "喝水设置页面 - 设置项列表与开关控制",
      "files": [
        "harmony-ui-playground/src/blocks/water-settings.tsx"
      ],
      "stories": [
        "harmony-ui-playground/src/blocks/water-settings.stories.tsx"
      ],
      "dependencies": [
        "status-bar",
        "title-bar",
        "list",
        "list-item",
        "switch"
      ],
      "tags": [
        "settings",
        "mobile",
        "list-form"
      ]
    }
  ]
}
```

### 5.5 `.resources/harmony/components.json`

负责 component id 到源码路径、export、stories 和可选 spec markdown 的映射。

```json
{
  "components": [
    {
      "id": "status-bar",
      "name": "StatusBar",
      "path": "harmony-ui-playground/src/component/StatusBar",
      "export": "StatusBar",
      "stories": "harmony-ui-playground/src/component/StatusBar/StatusBar.stories.tsx",
      "spec": ".resources/harmony/component/status-bar.md"
    },
    {
      "id": "list-item",
      "name": "ListItem",
      "path": "harmony-ui-playground/src/component/List",
      "export": "ListItem",
      "stories": "harmony-ui-playground/src/component/List/List.stories.tsx",
      "spec": ".resources/harmony/component/list.md"
    }
  ]
}
```

### 5.6 `.resources/harmony/component/{name}.md`

负责组件语义说明和人工可读规范。不是页面生成默认输入。

触发读取的场景：

- 用户询问组件设计意图。
- layout 的 `needed_components` 中出现该组件，且 TSX/stories 无法判断关键行为。
- 需要确认尺寸、状态、禁用态、交互态或可访问性约束。

---

## 6. `registry.json` 统一策略

当前 `harmony-ui-playground/registry.json` 的实际角色是本地 block 清单：

```text
block name
+ description
+ files
+ dependencies
```

它被 `harmony-ui-playground/components.json` 通过 `registries["@harmony"]` 引用，但该写法不满足 shadcn CLI 对 registry URL 模板的校验要求。

v1.0 不直接把 `.resources` 统一成当前 `registry.json`，而是迁移为：

```text
harmony-ui-playground/registry.json
    ↓
.resources/harmony/blocks.json
```

迁移原则：

1. `registry.json` 短期保留，作为 legacy 文件。
2. 页面生成主索引改用 `.resources/harmony/blocks.json`。
3. `blocks.json` 增加 `pageType`、`stories`、`tags` 等生成所需字段。
4. 如未来要兼容 shadcn CLI，再单独生成符合 shadcn schema 的 registry，不让页面生成资源索引被 shadcn registry schema 绑定。

---

## 7. v1.0 落地计划

### Phase 1: 建立资源层骨架

新增：

```text
.resources/config.json
.resources/harmony/route-index.md
.resources/harmony/layout/index.md
.resources/harmony/blocks.json
.resources/harmony/components.json
```

验收：

- 能从 `config.json` 找到 active resource。
- 能从 `route-index.md` 匹配至少 3 类页面。
- `blocks.json` 覆盖当前已有核心 blocks。
- `components.json` 覆盖当前已有核心 components。

### Phase 2: 建立首批 layout markdown

新增：

```text
.resources/harmony/layout/mobile-settings.md
.resources/harmony/layout/health-dashboard.md
.resources/harmony/layout/mobile-sheet.md
```

每个 layout 必须包含：

- `hit_rules`
- `exclusion_rules`
- `reference_blocks`
- `layout_skeleton`
- `needed_components`
- `composition_mapping`
- `generation_constraints`

验收：

- `mobile-settings` 能覆盖 `water-settings` 和 `settings-page`。
- `health-dashboard` 能覆盖 `health-clover`。
- `mobile-sheet` 能覆盖 `medication`。

### Phase 3: 调整 light 架构文档表述

更新 `docs/EXPECTED_ARCHITECTURE_LIGHT.md`：

```text
旧：markdown 只在用户需要时读取，不是工作流默认步骤
新：route/layout markdown 是页面生成默认读取；component markdown 按需读取
```

验收：

- 文档中的核心原则与 v1.0 workflow 一致。
- 不再把所有 markdown 混为“按需参考”。

### Phase 4: 生成流程试跑

用 3 个 prompt 试跑：

1. 生成一个喝水设置页。
2. 生成一个健康任务进度页。
3. 生成一个服药提醒半模态页面。

每次试跑记录：

- 命中的 `page_type`
- 读取的 layout markdown
- 使用的 `reference_blocks`
- 使用的 `needed_components`
- 生成文件路径
- 构建结果

### Phase 5: 验收与维护规则

每次新增 layout：

1. 在 `layout/index.md` 注册。
2. 在 `route-index.md` 增加命中规则。
3. 在 layout markdown 中声明 `reference_blocks`。
4. 如新增 block，同步更新 `blocks.json`。
5. 如新增 component，同步更新 `components.json`。

每次新增 component：

1. 在 `harmony-ui-playground/src/component/` 创建源码。
2. 在 `src/component/index.ts` 增加导出。
3. 在 `.resources/harmony/components.json` 增加映射。
4. 需要人工规范时再补 `component/{name}.md`。
5. 运行 `npm run build` 与 `npm run build-storybook`。

---

## 8. 成功标准

v1.0 完成后应满足：

1. 页面生成不再直接从 prompt 跳到 TSX 编写，而是先经过 route/layout 推理。
2. 每个 layout 都能推荐 reference blocks，减少模型自由发挥。
3. component markdown 不进入默认上下文，降低读取成本。
4. TSX/CSS/tokens 仍是唯一真实代码来源。
5. 当前 `registry.json` 的 block 清单能力被 `.resources/harmony/blocks.json` 接管。
6. 页面生成流程可以稳定回答：

```text
这是哪类页面？
使用哪个 layout？
参考哪些 blocks？
需要哪些 components？
组件源码在哪里？
生成后如何验收？
```

---

## 9. v1.0 非目标

v1.0 暂不处理：

- 完整 shadcn CLI registry schema 兼容。
- 自动从 Figma 生成 layout markdown。
- 自动视觉回归评分。
- 复杂 fallback 和多 layout 模糊匹配。
- 把历史 `history/spec/**` 全量迁移到 `.resources`。

这些能力可以在 v1.1 或 v2.0 中扩展。
