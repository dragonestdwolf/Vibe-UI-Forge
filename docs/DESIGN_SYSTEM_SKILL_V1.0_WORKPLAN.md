# Design System Skill v1.0 Workplan

> 本文档定义 Design System Skill v1.0 的开发改造计划、能力目标、交付物与验收标准。  
> 架构原则见 `docs/DESIGN_SYSTEM_SKILL_V1.0.md`；本文只描述如何落地。

---

## 1. 目标摘要

Design System Skill v1.0 的目标是把现有页面生成链路从：

```text
prompt / Figma -> 直接读组件源码 -> 编写页面
```

改造为：

```text
prompt / Figma
-> route matching
-> layout resolution
-> reference blocks grounding
-> component source grounding
-> page generation
-> build / Storybook validation
```

v1.0 不追求复杂自动化，而是先建立稳定、可解释、低上下文成本的轻量工作流。

---

## 2. 能力目标

### 2.1 必须具备的能力

| 编号 | 能力 | 说明 |
|------|------|------|
| C1 | 设计系统资源选择 | 能通过 `.resources/config.json` 找到 active design system |
| C2 | 页面类型路由 | 能通过 `route-index.md` 将 prompt / Figma 意图映射到 `page_type` |
| C3 | 布局推理 | 能通过 `layout/{page_type}.md` 得到 layout skeleton、reference blocks、needed components |
| C4 | 参考区块 grounding | 能从 `blocks.json` 找到 reference blocks 对应的 TSX/stories 文件 |
| C5 | 组件源码 grounding | 能从 `components.json` 找到 needed components 对应的源码、export 和 stories |
| C6 | markdown 分层读取 | route/layout markdown 默认读取；component markdown 只按需读取 |
| C7 | 页面生成约束 | 生成页面时遵守 shadcn composition/styling 规则和本地 token 体系 |
| C8 | 可验收输出 | 生成结果能通过 build、Storybook 或人工视觉验收 |

### 2.2 明确不做的能力

| 编号 | 非目标 | 原因 |
|------|--------|------|
| N1 | 完整 shadcn registry schema 兼容 | 当前重点是本地页面生成，不让 schema 绑定资源层设计 |
| N2 | 自动从 Figma 生成 layout markdown | v1.0 先手写高频 layout，保证质量 |
| N3 | 自动视觉评分 | 先保留人工/Storybook 验收 |
| N4 | 复杂多级 fallback | v1.0 只保留简单 fallback，降低实现风险 |
| N5 | 全量迁移 `history/spec/**` | 历史规范仍作为参考，不进入默认工作流 |

---

## 3. 交付范围

### 3.1 新增资源层

新增目录：

```text
.resources/
├── config.json
└── harmony/
    ├── route-index.md
    ├── blocks.json
    ├── components.json
    ├── layout/
    │   ├── index.md
    │   ├── mobile-settings.md
    │   ├── health-dashboard.md
    │   └── mobile-sheet.md
    └── component/
        └── README.md
```

说明：

- `component/README.md` 先说明 component markdown 的按需角色。
- v1.0 不强制补齐所有 `component/{name}.md`。
- 后续只有组件规范无法从 TSX/stories 判断时，再补具体组件 markdown。

### 3.2 更新文档

需要更新：

```text
docs/EXPECTED_ARCHITECTURE_LIGHT.md
docs/component-maintenance.md
docs/DESIGN_SYSTEM_SKILL_V1.0.md
```

更新目的：

- 统一说明 route/layout markdown 是页面生成默认输入。
- 统一说明 component markdown 是按需参考。
- 说明 `harmony-ui-playground/registry.json` 在 v1.0 中为 legacy block 清单。
- 说明 `.resources/harmony/blocks.json` 是新的页面生成主索引。

### 3.3 不移动现有源码

v1.0 不移动：

```text
harmony-ui-playground/src/component/**
harmony-ui-playground/src/blocks/**
harmony-ui-playground/src/styles/devui-tokens.css
harmony-ui-playground/src/index.css
```

原因：

- TSX/CSS/tokens 是真实来源。
- `.resources` 只做索引和推理规则。
- 避免在工作流改造阶段引入源码路径迁移风险。

---

## 4. 开发计划

### Phase 0: 现状冻结与基线记录

目标：在开始改造前明确当前真实来源和已有区块。

任务：

1. 记录当前 `harmony-ui-playground/components.json` 配置。
2. 记录当前 `harmony-ui-playground/registry.json` block 清单。
3. 记录当前 `src/component/index.ts` 导出。
4. 记录当前核心 blocks：
   - `water-settings`
   - `settings-page`
   - `health-clover`
   - `medication`
5. 跑一次基线构建。

建议命令：

```bash
cd harmony-ui-playground
npm run build
npm run build-storybook
```

交付物：

- 基线状态记录。
- 构建结果记录。

验收标准：

- 能列出当前核心 blocks 和 components。
- 确认改造前构建状态。
- 如果构建失败，记录失败原因，但不在本 phase 修复无关问题。

---

### Phase 1: 建立 `.resources` 骨架

目标：建立 Design System Skill 的资源入口。

任务：

1. 新增 `.resources/config.json`。
2. 新增 `.resources/harmony/route-index.md`。
3. 新增 `.resources/harmony/layout/index.md`。
4. 新增 `.resources/harmony/blocks.json`。
5. 新增 `.resources/harmony/components.json`。
6. 新增 `.resources/harmony/component/README.md`。

交付物：

```text
.resources/config.json
.resources/harmony/route-index.md
.resources/harmony/layout/index.md
.resources/harmony/blocks.json
.resources/harmony/components.json
.resources/harmony/component/README.md
```

验收标准：

- `.resources/config.json` 能声明 active resource 为 `harmony`。
- `route-index.md` 至少覆盖 3 个 `page_type`。
- `blocks.json` 至少覆盖 `water-settings`、`health-clover`、`medication`。
- `components.json` 至少覆盖这些组件：
  - `status-bar`
  - `title-bar`
  - `list`
  - `list-item`
  - `switch`
  - `clover-week-panel`
  - `task-card`
  - `button`
  - `float-layer`
  - `service-card`
  - `service-card-item`
  - `service-card-status`
- 所有路径指向真实存在的源码或 stories 文件。

---

### Phase 2: 建立首批 layout markdown

目标：让页面生成可以通过 layout 推理得到稳定的结构和参考区块。

任务：

1. 新增 `.resources/harmony/layout/mobile-settings.md`。
2. 新增 `.resources/harmony/layout/health-dashboard.md`。
3. 新增 `.resources/harmony/layout/mobile-sheet.md`。
4. 每个 layout 声明 `reference_blocks`。
5. 每个 layout 声明 `needed_components`。
6. 每个 layout 声明 `composition_mapping`。

每个 layout 必须包含：

```text
hit_rules
exclusion_rules
reference_blocks
layout_skeleton
needed_components
composition_mapping
generation_constraints
validation_notes
```

交付物：

```text
.resources/harmony/layout/mobile-settings.md
.resources/harmony/layout/health-dashboard.md
.resources/harmony/layout/mobile-sheet.md
```

验收标准：

- `mobile-settings.md` 的 `reference_blocks` 包含 `water-settings` 和 `settings-page`。
- `health-dashboard.md` 的 `reference_blocks` 包含 `health-clover`。
- `mobile-sheet.md` 的 `reference_blocks` 包含 `medication`。
- 每个 `needed_components` id 都能在 `.resources/harmony/components.json` 找到。
- 每个 `reference_blocks` id 都能在 `.resources/harmony/blocks.json` 找到。

---

### Phase 3: 文档同步与旧 registry 定位

目标：消除文档中的角色冲突，明确 `registry.json` 与 `.resources` 的关系。

任务：

1. 更新 `docs/EXPECTED_ARCHITECTURE_LIGHT.md`。
2. 更新 `docs/component-maintenance.md`。
3. 更新 `docs/DESIGN_SYSTEM_SKILL_V1.0.md` 如有必要。
4. 明确以下规则：
   - route/layout markdown 是页面生成默认读取。
   - component markdown 是按需读取。
   - `harmony-ui-playground/registry.json` 是 legacy block 清单。
   - `.resources/harmony/blocks.json` 是页面生成主索引。

交付物：

```text
docs/EXPECTED_ARCHITECTURE_LIGHT.md
docs/component-maintenance.md
docs/DESIGN_SYSTEM_SKILL_V1.0.md
```

验收标准：

- 文档中不再出现“所有 markdown 都不是默认步骤”的表述。
- 文档中明确区分 route/layout markdown 和 component markdown。
- 文档中明确 `registry.json` 不作为 v1.0 页面生成主索引。
- 文档中明确不复制 TSX 源码到 `.resources`。

---

### Phase 4: 资源一致性校验脚本

目标：用轻量脚本避免资源层和真实源码脱节。

任务：

1. 新增资源校验脚本。
2. 校验 `blocks.json` 中的 files/stories 是否存在。
3. 校验 `components.json` 中的 path/stories 是否存在。
4. 校验 layout 中的 `reference_blocks` 是否存在于 `blocks.json`。
5. 校验 layout 中的 `needed_components` 是否存在于 `components.json`。

推荐脚本路径：

```text
scripts/validate_design_system_resources.mjs
```

推荐命令：

```bash
node scripts/validate_design_system_resources.mjs
```

交付物：

```text
scripts/validate_design_system_resources.mjs
```

验收标准：

- 校验通过时退出码为 `0`。
- 任一引用路径不存在时退出码非 `0`。
- 任一 layout 引用了不存在的 block/component 时退出码非 `0`。
- 输出能定位到具体文件和字段。

---

### Phase 5: 页面生成试跑

目标：验证 route/layout/resources 能支撑真实页面生成。

试跑用例：

1. Prompt: 生成一个喝水设置页。
2. Prompt: 生成一个健康任务进度页。
3. Prompt: 生成一个服药提醒半模态页面。

每次试跑必须记录：

```text
input
matched page_type
matched layout file
reference_blocks
needed_components
source files read
generated files
validation commands
validation result
```

推荐记录路径：

```text
docs/design-system-skill-v1.0-trial-log.md
```

交付物：

- 3 个试跑记录。
- 至少 1 个生成页面或生成页面草案。

验收标准：

- 每个 prompt 都能命中合理 `page_type`。
- 每个 `page_type` 都能解析出 reference blocks 和 needed components。
- 生成页面使用本地组件，而不是自由拼装陌生组件。
- 生成页面 import 使用 `@/component` 或项目实际 alias。
- 构建或 Storybook 验收结果被记录。

---

### Phase 6: 维护流程固化

目标：把新增 layout、block、component 的维护规则固定下来。

任务：

1. 在 `docs/component-maintenance.md` 增加资源层维护规则。
2. 定义新增 layout 的 checklist。
3. 定义新增 block 的 checklist。
4. 定义新增 component 的 checklist。
5. 定义每次变更后的最小验收命令。

交付物：

```text
docs/component-maintenance.md
```

验收标准：

- 新增 layout 时知道要改哪些文件。
- 新增 block 时知道要改哪些文件。
- 新增 component 时知道要改哪些文件。
- 维护文档和 `.resources` 结构一致。

---

## 5. 资源文件验收细则

### 5.1 `.resources/config.json`

必须满足：

- 有 `active` 字段。
- `active` 指向 `resources` 中存在的 key。
- 每个 resource 有 `path`。
- 每个 resource 有 `projectRoot`。
- `path` 和 `projectRoot` 都指向存在的目录。

### 5.2 `route-index.md`

必须满足：

- 至少定义 3 个页面类型。
- 每个页面类型都有 layout 路径。
- 有 fallback 规则。
- 页面类型命名使用 kebab-case。

### 5.3 `layout/*.md`

必须满足：

- 有 `hit_rules`。
- 有 `exclusion_rules`。
- 有 `reference_blocks`。
- 有 `layout_skeleton`。
- 有 `needed_components`。
- 有 `composition_mapping`。
- 有 `generation_constraints`。
- `reference_blocks` 中的 id 全部存在于 `blocks.json`。
- `needed_components` 中的 id 全部存在于 `components.json`。

### 5.4 `blocks.json`

必须满足：

- 每个 block 有唯一 `id`。
- 每个 block 有 `pageType`。
- 每个 block 至少有一个 `files` 路径。
- 每个 block 至少有一个 `stories` 路径，除非明确声明 `stories: []` 和原因。
- 每个 block 的 `dependencies` 使用 kebab-case component id。
- 每个 dependency 都存在于 `components.json`。

### 5.5 `components.json`

必须满足：

- 每个 component 有唯一 `id`。
- `id` 使用 kebab-case。
- 每个 component 有 `name`。
- 每个 component 有 `path`。
- 每个 component 有 `export`。
- 每个 component 的 `path` 指向真实目录。
- 有 stories 的组件必须写入 `stories` 字段。
- `spec` 字段可选，但如果存在必须指向真实 markdown。

---

## 6. 页面生成验收标准

单个页面生成结果必须满足：

| 类别 | 标准 |
|------|------|
| 路由 | 能说明命中的 `page_type` 和依据 |
| 布局 | 能说明读取的 layout markdown 和 reference blocks |
| 组件 | 所用组件都来自 `needed_components` 或明确说明新增原因 |
| 源码 | 已读取 reference block TSX 和组件 TSX/stories |
| import | 使用项目 `components.json` 中定义的 alias |
| 样式 | 优先使用 token、现有组件 CSS 习惯或 layout 约束 |
| 结构 | 页面结构符合 `layout_skeleton` 和 `composition_mapping` |
| 运行 | `npm run build` 通过，或记录明确失败原因 |
| 预览 | `npm run build-storybook` 通过，或记录明确失败原因 |

---

## 7. 项目级完成定义

Design System Skill v1.0 视为完成，当且仅当：

1. `.resources` 资源层已建立。
2. 3 个首批 layout markdown 已建立。
3. `blocks.json` 覆盖当前核心 blocks。
4. `components.json` 覆盖首批 layout 需要的核心 components。
5. 资源一致性校验脚本存在并通过。
6. 3 个试跑 prompt 均有记录。
7. 至少 1 个试跑页面完成生成并通过构建，或构建失败原因明确且与资源层无关。
8. `EXPECTED_ARCHITECTURE_LIGHT.md` 与 v1.0 原则一致。
9. `component-maintenance.md` 包含资源层维护规则。

---

## 8. 风险与处理策略

| 风险 | 表现 | 处理 |
|------|------|------|
| markdown 与源码脱节 | layout/component 引用不存在文件 | Phase 4 校验脚本强制检查 |
| registry 命名混淆 | 误以为 `registry.json` 可被 shadcn CLI 使用 | 文档中标记 legacy，主索引用 `blocks.json` |
| component markdown 膨胀 | 每次生成读取太多规范 | v1.0 只默认读 route/layout，component markdown 按需 |
| layout 过细 | 每种页面都新建 layout | 先覆盖高频页面，后续再扩展 |
| 生成过度自由发挥 | 页面不像本地设计系统 | 每个 layout 必须声明 reference blocks |
| 验收成本过高 | 每次都跑完整 Storybook 太慢 | 最小先跑 resource validator + build，重要变更再跑 build-storybook |

---

## 9. 推荐实施顺序

```text
1. 新建 .resources 骨架
2. 迁移 registry.json 内容到 blocks.json
3. 建立 components.json 映射
4. 编写 route-index.md
5. 编写 3 个 layout markdown
6. 新增资源一致性校验脚本
7. 更新架构与维护文档
8. 执行 3 个页面生成试跑
9. 根据试跑结果微调 layout markdown
```

---

## 10. v1.0 后续演进

v1.1 可以考虑：

- 从 `blocks.json` 自动生成 layout 的 reference block 候选。
- 增加 layout fallback 评分。
- 增加 component coverage 报告。
- 增加 Storybook URL 或截图验收记录。
- 从 Figma 节点特征自动辅助 route matching。

v2.0 可以考虑：

- 标准化为可复用 Skill 包。
- 同时支持 Harmony、DevUI 等多个资源集。
- 根据 `.resources` 自动生成符合 shadcn registry schema 的兼容 registry。
- 接入视觉回归和设计差异评分。
