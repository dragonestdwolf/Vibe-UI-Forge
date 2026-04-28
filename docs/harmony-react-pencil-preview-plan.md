# Harmony React 资源 ↔ Pencil 路径预览开工计划

> 本文定义一条可执行的验证路径，用于评估当前仓库中 Harmony React 资源到 Pencil 路径预览，以及 Pencil 设计改动回写 React 真值的双向转换效果。目标不是一次性把整套设计系统迁完，而是先跑通一条稳定、可复用、可验收的最小闭环。

---

## 1. 背景与结论

当前仓库已经具备首轮验证所需的三类基础：

| 层级 | 当前资产 | 作用 |
|---|---|---|
| Resource Layer | `.resources/config.json`、`.resources/harmony/components.json`、`.resources/harmony/blocks.json`、`.resources/harmony/route-index.md`、`.resources/harmony/layout/*.md` | 给 AI 提供资源索引、页面类型和组合约束 |
| React 真值 | `harmony-ui-playground/src/component/**`、`harmony-ui-playground/src/blocks/**` | 组件与 Block 的稳定实现来源 |
| 预览入口 | 组件 / Block stories、`npm run storybook`、`npm run build-storybook` | 用于人工验收和回归验证 |

结合 [PENCIL_SHADCN_OFFICIAL_SOP.md](/Users/renyuqing/Desktop/2026/Design-system-2AI/Vibe-UI-Forge-main/docs/PENCIL_SHADCN_OFFICIAL_SOP.md:1) 可以得出本次验证的核心判断：

1. Pencil 不负责直接运行 Harmony React runtime。
2. 验证重点应放在“React 真值 -> Pencil 设计重建 -> Pencil 调整 -> React 回写”是否可回环。
3. `src/render/**` 属于历史/实验产物，本轮只可参考其经验，不作为稳定真值来源。

---

## 2. 本轮目标

### 2.1 要验证什么

验证以下四个问题是否成立：

1. Harmony 当前稳定 React 组件能否被 Pencil 读取并重建为结构合理的设计节点。
2. Pencil 中的页面组织能否映射回 `.resources/harmony` 已定义的 `page_type`、layout 和组件组合关系。
3. 设计修改回写代码后，是否仍能保持 Storybook 可预览、资源层可追溯、组件 API 不失真。
4. 整条链路是否能沉淀成后续可复制的 Harmony 工作流，而不是一次性实验。

### 2.2 不在本轮做什么

本轮明确排除：

1. 不做全量 Harmony 组件迁移。
2. 不把 Pencil 当作 React 渲染器使用。
3. 不以 `src/render/**` 页面作为新生成页面的模板真值。
4. 不在首轮处理复杂业务逻辑、异步状态机、Hook 驱动行为。
5. 不先做大规模 token 重命名或设计系统目录迁移。

---

## 3. 首轮试点范围

### 3.1 试点对象

优先选择资源层已登记、Storybook 已存在、组合关系清晰的对象：

| 类型 | ID / 名称 | 仓内来源 | 入选原因 |
|---|---|---|---|
| Component | `title-bar` / `TitleBar` | `harmony-ui-playground/src/component/TitleBar` | 结构稳定，顶部壳层语义清晰，适合验证布局与 slot |
| Component | `switch` / `Switch` | `harmony-ui-playground/src/component/Switch` | 交互简单，适合验证状态映射 |
| Component | `list` / `List` | `harmony-ui-playground/src/component/List` | 设置页核心容器，适合验证行级组合 |
| Component | `list-item` / `ListItem` | `harmony-ui-playground/src/component/List` | 连接 layout 与 setting row 的关键单元 |
| Block | `settings-page` | `harmony-ui-playground/src/blocks/settings-page.tsx` | 通用设置页结构稳定，便于形成最小页面闭环 |
| Block | `water-settings` | `harmony-ui-playground/src/blocks/water-settings.tsx` | 已在 `.resources/harmony/blocks.json` 中登记，依赖链完整 |
| Page Type | `mobile-settings` | `.resources/harmony/layout/mobile-settings.md` | 当前最适合做路径预览试点的页面族 |

### 3.2 暂缓对象

以下对象建议放到第二阶段：

1. `health-clover`，因为视觉复杂度和插图资源较高。
2. `medication`，因为浮层结构和卡片状态组合更复杂。
3. 历史 `settings-page-v**` 产物，只作为经验对照，不进入首轮真值链路。

---

## 4. 路径定义

本轮要验证的不是单点导入，而是一条完整路径：

```text
.resources/harmony 语义索引
-> harmony-ui-playground 稳定 React 组件 / Block
-> Storybook 预览与人工验收
-> Pencil 读取并重建设计节点
-> Pencil 中做结构 / 视觉调整
-> 回写 React 组件 / Block / 样式
-> 再次通过 Storybook 与资源层追溯验证
```

### 4.1 三个真值层

| 真值层 | 当前定义 | 本轮要求 |
|---|---|---|
| 语义真值 | `.resources/harmony/**` | 页面类型、组件依赖、layout 约束必须可追溯 |
| 实现真值 | `harmony-ui-playground/src/component/**`、`src/blocks/**` | 回写必须落到稳定源码，不落到 `src/render/**` |
| 预览真值 | `*.stories.tsx` + Storybook | 每次导入或回写后都要可视化验证 |

### 4.2 Pencil 在链路中的角色

Pencil 在本项目中的角色应定义为：

1. 视觉重建器：把现有 Harmony React 结构重建为 Pencil 节点。
2. 设计中间层：承接局部视觉改版和布局微调。
3. 回写触发器：把明确的视觉变化同步回 React 真值。

而不是：

1. 直接消费 `tsx` runtime。
2. 直接替代资源层。
3. 直接替代 Storybook 验收。

---

## 5. 输入真值与准备清单

### 5.1 必备输入

| 类别 | 文件 / 目录 | 用途 |
|---|---|---|
| Resource Config | `.resources/config.json` | 确认当前 `active` 为 `harmony`，且 `projectRoot` 为 `harmony-ui-playground` |
| Components Index | `.resources/harmony/components.json` | 组件 ID 到源码、stories 的映射 |
| Blocks Index | `.resources/harmony/blocks.json` | Block 级组合与依赖映射 |
| Route/Layout | `.resources/harmony/route-index.md`、`.resources/harmony/layout/mobile-settings.md` | 页面类型与结构约束 |
| React Source | `harmony-ui-playground/src/component/**`、`src/blocks/**` | Pencil 导入与回写目标 |
| Preview | 对应 `*.stories.tsx` | 验收入口 |
| Tokens / Styles | `harmony-ui-playground/src/index.css`、`harmony-ui-playground/src/settings-app.css`、`harmony-ui-playground/src/styles/harmony-token.css` | 首轮 token 与视觉变量基线 |

### 5.2 开工前要先确认的事实

1. Storybook 能正常拉起，并能打开试点组件与 Block。
2. `TitleBar`、`Switch`、`List`、`settings-page`、`water-settings` 的 stories 均可见。
3. Pencil 与代码位于同一 workspace，能访问上述源码与 markdown 资源。
4. 团队接受“先从稳定源码导入，不从历史 render 页面导入”的边界。

### 5.3 当前已知风险

1. Harmony token 文件已统一为 `harmony-ui-playground/src/styles/harmony-token.css`；本轮仍保留既有 CSS 变量前缀，暂不额外展开 token 语义字段重命名。
2. 一些 Harmony 页面历史上存在 `src/render/settings-page-v**` 分支产物，容易让实验回流到错误真值层，需要显式规避。
3. Pencil 对复杂交互的理解主要是视觉级而非行为级，首轮必须选低逻辑复杂度对象。

---

## 6. 分阶段开工方案

### Phase 0：基线盘点

目标：确认首轮试点对象都具备“资源层可追溯 + React 真值存在 + Storybook 可预览”。

输出：

1. 试点对象清单最终版。
2. 每个对象的源码路径、stories 路径、资源层条目路径。
3. 首轮不纳入范围的对象清单。

通过标准：

1. 每个试点对象都能在 `.resources/harmony` 中找到。
2. 每个试点对象都能在 `harmony-ui-playground` 中找到稳定源码。
3. 每个试点对象都有对应 Storybook 预览入口。

### Phase 1：组件级 Code -> Pencil 验证

目标：先验证单组件导入 Pencil 的可行性和保真度。

建议顺序：

1. `TitleBar`
2. `Switch`
3. `List`
4. `ListItem`

输出：

1. 一个组件试验用 `.pen` 文件。
2. 组件导入 prompt 模板。
3. 每个组件的“导入保真度记录”。

重点检查：

1. 结构层级是否合理。
2. 主轴布局、slot 宽度、圆角、间距是否接近源码。
3. 是否错误丢失交互态占位结构。
4. 是否能沉淀为 Pencil reusable component。

### Phase 2：Block / Page Type 级路径预览验证

目标：验证 `mobile-settings` 页面族在 Pencil 中是否能形成与资源层一致的路径预览。

建议对象：

1. `settings-page`
2. `water-settings`

输出：

1. 一个 `mobile-settings` 试验页 `.pen` 文件。
2. 一个 `components.lib.pen` 或等价组件库文件。
3. Block 到 layout 的映射记录。

重点检查：

1. `status-bar -> title-bar -> content cards -> note -> home indicator` 的结构是否成立。
2. `list + list-item + switch` 的组合是否和 `.resources/harmony/layout/mobile-settings.md` 一致。
3. 页面不是由匿名 frame 堆砌，而是能映射回组件和 Block 语义。

### Phase 3：Pencil -> React 回写验证

目标：验证 Pencil 中的小范围视觉修改能否正确回写到稳定源码。

建议只做局部改动：

1. `TitleBar` 标题对齐与按钮槽位微调。
2. `Switch` 颜色或尺寸微调。
3. `settings-page` 卡片间距、页边距、注释文案层级微调。

输出：

1. 回写后的 TSX / CSS 改动。
2. stories 回归结果。
3. 改动前后截图对照。

重点检查：

1. 回写代码仍保持原有组件 API。
2. 回写没有写入 `src/render/**`。
3. Storybook build、typecheck 至少通过试点范围。

### Phase 4：沉淀标准工作流

目标：把实验结果整理成后续可复制 SOP。

输出：

1. Harmony 专用 Pencil prompt 模板。
2. 试点组件 / Block 的导入规范。
3. 回写约束和验收清单。
4. 后续是否扩到 `health-dashboard`、`mobile-sheet` 的决策建议。

---

## 7. 产物规划

### 7.1 文档产物

| 产物 | 建议位置 | 说明 |
|---|---|---|
| 开工计划 | `docs/harmony-react-pencil-preview-kickoff-plan.md` | 当前文档 |
| 实验记录 | `docs/harmony-react-pencil-preview-log.md` | 按轮次记录导入、回写、问题 |
| Prompt 清单 | `docs/harmony-react-pencil-preview-prompts.md` | 沉淀稳定提示词 |

### 7.2 设计产物

| 产物 | 建议位置 | 说明 |
|---|---|---|
| 组件试验文件 | `pencil/harmony/components-lab.pen` | 单组件导入和比对 |
| 页面试验文件 | `pencil/harmony/mobile-settings-lab.pen` | 页面路径预览试验 |
| 设计库文件 | `pencil/harmony/components.lib.pen` | 沉淀稳定 reusable components |

> 说明：若团队已有 Pencil 文件存放规范，以团队规范优先；上表只提供建议落点。

---

## 8. 验收标准

### 8.1 资源追溯验收

| 编号 | 验收项 | 通过标准 |
|---|---|---|
| A-01 | 组件可追溯 | Pencil 中每个试点组件都能对应到 `.resources/harmony/components.json` 条目 |
| A-02 | Block 可追溯 | 页面试验结果能映射到 `.resources/harmony/blocks.json` 的 `settings-page` 或 `water-settings` |
| A-03 | Layout 可追溯 | 页面结构符合 `mobile-settings` layout 约束 |
| A-04 | 真值边界正确 | 没有把 `src/render/**` 当作稳定回写目标 |

### 8.2 视觉保真验收

| 编号 | 验收项 | 通过标准 |
|---|---|---|
| V-01 | 组件结构 | slot、层级、主轴方向与源码一致或可解释 |
| V-02 | 关键样式 | 间距、圆角、字体层级、卡片结构基本对齐 |
| V-03 | 页面骨架 | 顶部壳层、内容区、底部系统区关系成立 |
| V-04 | 组合稳定 | `list/list-item/switch` 组合后不失衡、不破坏布局语义 |

### 8.3 回写验收

| 编号 | 验收项 | 通过标准 |
|---|---|---|
| C-01 | 回写位置正确 | 改动落在 `src/component/**`、`src/blocks/**`、对应 CSS 或 stories |
| C-02 | 预览通过 | Storybook 中试点 stories 可正常预览 |
| C-03 | 构建通过 | `typecheck`、试点范围 lint 或 build 通过 |
| C-04 | 资源层未漂移 | 改动后 `.resources/harmony` 中路径和依赖仍然成立 |

推荐验证命令：

```bash
pnpm --dir harmony-ui-playground storybook
pnpm --dir harmony-ui-playground build-storybook
pnpm --dir harmony-ui-playground typecheck
```

---

## 9. 推荐执行顺序

建议按下面顺序开工：

1. 确认试点对象与 stories 可用。
2. 从 `TitleBar` 开始做首个 Code -> Pencil 导入。
3. 扩到 `Switch`、`List`、`ListItem`，形成首批 reusable components。
4. 组装 `mobile-settings` 页面试验稿。
5. 用 Pencil 做一次局部视觉微调，并只回写一个组件和一个 Block。
6. 用 Storybook 和资源层追溯做回归验收。
7. 根据结果决定是否扩大到第二批页面族。

---

## 10. 首轮 Prompt 建议

### 10.1 组件导入

```text
Recreate the TitleBar component from harmony-ui-playground/src/component/TitleBar/title-bar.tsx.
Preserve the slot structure, button areas, title centering, and Harmony mobile header feel.
Use the related story and CSS as reference when needed.
```

```text
Recreate the Switch component from harmony-ui-playground/src/component/Switch/Switch.tsx.
Keep the interactive states visually distinguishable, but focus on structure and styling instead of runtime logic.
```

### 10.2 页面导入

```text
Build a Pencil page for the mobile-settings pattern using:
- .resources/harmony/layout/mobile-settings.md
- harmony-ui-playground/src/blocks/settings-page.tsx
- harmony-ui-playground/src/blocks/water-settings.tsx
- harmony-ui-playground/src/component/TitleBar
- harmony-ui-playground/src/component/List
- harmony-ui-playground/src/component/Switch

The result should preserve Harmony resource semantics rather than creating anonymous frames.
```

### 10.3 回写

```text
Apply these visual changes back to harmony-ui-playground/src/component/TitleBar/title-bar.tsx and its related CSS.
Do not write to src/render/**.
Keep the current public API and story compatibility.
```

---

## 11. 决策口径

首轮验证结束后，只回答三个问题：

1. Harmony React -> Pencil 的结构重建是否足够稳定，值得继续投入。
2. Pencil -> React 回写是否能保持资源层和 Storybook 双重可追溯。
3. 这条链路更适合用于“新页面探索”还是“已有页面视觉改版”。

如果三个问题里有两个以上答案为“是”，则进入第二阶段扩面；否则回到最小试点对象继续缩小问题面。
