---
name: pixso-to-shadcn-react
description: >-
  Converts a Pixso node link (with item-id) into pixel-perfect React components
  for this repository's shadcn-style component library. Enforces Pixso as the
  single visual source of truth via DSL + screenshot verification, then maps to
  harmony-ui-playground with existing Harmony conventions and Storybook outputs.
  Use when the user provides a pixso.cn node URL or asks for Pixso/Figma-to-code
  component implementation in this repo.
---

# Pixso 链接 → shadcn 风格 React 组件（本仓库工作流）

**执行身份（Role）：** 高级前端架构师 + UI 自动化专家。

用于将 **Pixso 节点链接** 转成本仓库可运行的 **shadcn 风格 React 组件**，并保持 1:1 视觉还原。

**最高原则（Priority #1）：** 还原度与样式 1:1 是第一优先级；组件抽象、代码风格与实现便捷性都不得牺牲设计还原精度。

## 核心目标（不可缺失）

1. 输入是带 `item-id` 的 Pixso 节点链接。
2. 以 Pixso 为唯一真值，用 **DSL + 截图** 双证据做 1:1 还原（重中之重）。
3. 在不降低还原度前提下，交付组件源码、类型、Storybook，且符合本仓库规范。

任一项缺失，不能宣称“完成还原”。

## 执行优先级（MUST / SHOULD / MAY）

- **MUST**
  - 任何实现决策都必须服从 1:1 视觉还原；若与工程实现习惯冲突，优先保证还原度并记录取舍。
  - 节点链接必须带 `item-id`（不要只给文件首页）。
  - 同一节点必须拉取 `get_node_dsl` + `get_image`（或等效）。
  - 对混合绝对定位/Flex 的节点，必须做父子 Bounding Box 相对坐标校验，按约束使用 `absolute` + `inset-*` 精确落位，禁止默认 `flex-1` 近似替代。
  - 文字样式必须提取并还原 `lineHeight` 与 `letterSpacing`；优先映射 Tailwind `leading-*` / `tracking-*`，无法精确映射时使用 arbitrary value（如 `leading-[22px]`、`tracking-[0.2px]`）。
  - 输出可运行组件与 `*.stories.tsx`，并遵守仓库目录/命名/Token 约束。
- **SHOULD**
  - 可用时运行 `design_to_code` 获取结构草案（仅作草案，不是最终真值）。
  - 优先复用 `src/component/**` 现有 Harmony 组件和样式变量。
  - 在 `.resources/{active}` 增补组件映射与简短规格。
- **MAY**
  - 无法写入 Pixso 导出 CSS 时，可基于 DSL + 截图 + 现有变量手写等价样式，并在交付中说明。

## 任务类型分流（小增强）

先判断当前需求属于哪一类，再走对应路径：

- **组件级任务（默认）**
  - 目标是单个组件或节点切片。
  - 直接走本文件“快速工作流”6 步。
  - 重点关注：组件复用、样式精确还原、stories 覆盖。
- **页面级任务**
  - 目标是整页或多模块组合页面。
  - 在执行“快速工作流”前，先补充读取并遵循 `.agent/skills/shadcn/SKILL.md` 中的页面生成路径（如 `route-index`、`layout`、资源契约）。
  - 页面级仍必须满足本文件的 1:1 还原与交付约束，不可跳过 DSL+截图双证据。

## 快速工作流（按顺序执行）

1. **读取上下文**：先读 `.agent/skills/shadcn/SKILL.md` 与 `.resources/config.json`（拿到 `active` / `projectRoot`）。
2. **拉取设计真值**：用 Pixso MCP 获取同一节点的 DSL 与截图；如可用再调 `design_to_code`。
3. **先规格后编码**：先整理关键量化参数（尺寸、间距、圆角、色值、字体、状态），再写 TSX/CSS。
4. **映射仓库模型**：优先复用 `src/component/**`；新组件按现有目录结构放置（同目录 `*.css`、`*.stories.tsx`，可选 `index.ts`）。
5. **实现与校验**：在 `projectRoot` 实现并运行 `node scripts/validate_design_system_resources.mjs`、`npm run build`（必要时 `npm run build-storybook`）。
   - 若环境允许，执行视觉回归：用 `.cursor/skills/pixso-to-shadcn-react/scripts/capture_storybook.js` 截取 Storybook 组件图，并与 `get_image` 真值图做像素级或 SSIM 对比。
   - 差异阈值默认 `<= 5%`；超过阈值必须继续调样式并复测，直到达标或明确记录阻塞原因。
6. **交付说明**：给出 Pixso 链接与 `item-id`、MCP 调用清单、1:1 对照结论、fallback 依据、改动文件和 Storybook 入口。

## 1:1 还原硬约束

- 凡可量化项（布局、间距、圆角、尺寸、色值、字号/字重/行高、层级）必须落地到 px 或已映射 Token。
- 当 DSL 同时出现绝对定位与 Flex 语义时，先计算子元素相对父容器的包围盒（Bounding Box）与约束，再决定布局方案。
- 涉及可动部件（滑块/旋钮/游标/页签/选中态）必须核对：几何中心、轨道边距、激活层与把手覆盖关系，禁止只靠百分比估算。
- DSL 与截图或标注冲突时，优先可复现稿面与约束语义，并在交付中记录取舍。
- 有多子类型/多状态时，逐类型对齐，不得“还原一种推全局”。

## Typography 深度校准

- 必须从 DSL 提取：`fontSize`、`fontWeight`、`lineHeight`、`letterSpacing`，并逐项落地实现。
- `lineHeight` 优先映射 `leading-*`，无法精确对应时使用 `leading-[value]`。
- `letterSpacing` 优先映射 `tracking-*`，无法精确对应时使用 `tracking-[value]`。
- 默认 shadcn 文本样式不能直接视为设计真值，必须经过字体参数校准后再交付。

## Storybook 约束

- 每个组件必须提供 `*.stories.tsx`，覆盖基础用法 + 多变体 + 多状态。
- 画布预览尽量复用现有 Story 包层风格（如 `Card` / `Slider`）。
- 整页背景保持仓库一致（`bg-[#f3f4f6]`），不要随意改成渐变或其他底色。

## 失败与降级处理

1. 无 `item-id`：停止实现，先向用户索要节点链接。
2. 无权限或 Token 失效：先修复权限，不用猜测样式替代。
3. `design_to_code` 或导出 CSS 失败：不阻塞，按 DSL + 截图 + 现有组件变量手工还原并注明 fallback。
4. 视觉回归脚本或依赖不可用：改为手工对照截图并在交付中注明“未执行自动 SSIM，对照方式为人工复核 + 关键尺寸复算”。

## MCP 故障矩阵与降级顺序

架构前提：Cursor 连的是 **Pixso 桌面端** 暴露的 `http://127.0.0.1:3667/mcp`；工具失败往往是 **Pixso 插件侧解析/渲染/批次缓存** 问题，不一定是 MCP 配置错误。

### 故障矩阵（现象 → 可能原因 → 处理）

| 现象 | 可能原因 | 处理 |
|------|----------|------|
| `get_node_dsl`：`Cannot read properties of undefined (reading 'length')` | 当前文档图里解析不到该节点；**组件集根/占位**；插件内部字段为空 | 改选**画布上的实例**或**具体变体帧**；换同组兄弟 `node_id`（可用 `get_all_components` 反查） |
| `get_node_dsl`：`Index out of bounds`（传完整 URL 时多见） | URL 解析或索引越界；id 指向集合/非叶子 | 改用纯 `item-id`；或从画布复制**实例**链接再试 |
| `get_image` / `get_export_image`：`fetch failed` | 渲染超时、节点过大、Pixso 短暂无响应 | 缩小导出范围、重选节点、重启 Pixso 后重连 MCP；可改用 `get_export_image` 与 `get_image` 互换试 |
| `design_to_code` 成功，但 `localhost:3667/code/*.css`：`Invalid batch timestamp` | 设计端**批次缓存过期**（有缓存上限） | **同一轮对话内立刻**拉取 manifest 资源；拉不到则按 DSL/截图 + 仓库变量手写 CSS，交付注明 |
| `get_all_components` 能列出 id，但 `get_node_dsl` 仍失败 | 该 id 对 **DSL 导出路径** 不稳定（类型或内部结构） | 走 `design_to_code` + `get_image`；或用 `.resources` 已落地的量化规格作辅证 |

### 降级顺序（拉取设计真值，严格按序尝试）

1. **前置**：目标文件在 Pixso 中已打开；尽量选中 **Frame / INSTANCE / 某一变体主件**，避免只依赖「组件集根」id。  
2. **`get_node_dsl`**（`itemId` 用 `3252:489` 这类纯 id，必要时再试完整 URL）。  
3. **失败** → 调 **`get_all_components`**，在同一 `file_key` 下找相邻变体 id，回到步骤 2。  
4. **仍失败** → **`design_to_code`**；若返回 manifest，**立即**下载 CSS/资源（同会话）；若 `Invalid batch timestamp`，跳过导出 CSS，不阻塞。  
5. **并行必做**：**`get_image` 或 `get_export_image`** 取真值图，用于 1:1 对照（与 DSL 或 codegen 结构交叉验证）。  
6. **仍缺结构化数据** → 使用 **`.resources/{active}` 规格** + **仓库内同类组件**（几何/Token）+ 截图手工量化表；交付中写明 **fallback 依据**，不得宣称“仅有主观对齐”。

> Pixso 官方 workflow 建议：目标框架在支持列表内时 **优先 `design_to_code`**，并**立即**拉取清单资源；`get_node_dsl` 作为降级路径（见 MCP 资源 `pixso://guides/design-to-code-workflow`）。本仓库仍以 **1:1 还原** 为准：`design_to_code` 仅作结构草案，最终以 DSL+截图与稿面一致为准。

## Definition of Done

- [ ] 输入链接包含 `item-id`。
- [ ] 已使用同一节点 DSL 与截图做实现和复核；若 `get_node_dsl` 不可用，已按「MCP 故障矩阵与降级顺序」完成等价真值采集并在交付中写明依据。
- [ ] 关键视觉参数可追溯到设计真值。
- [ ] 混合定位节点已完成 Bounding Box 相对坐标校验，未用 `flex-1` 粗略替代精确落位。
- [ ] Typography 已校准（至少覆盖 `lineHeight` 与 `letterSpacing`）。
- [ ] 交付含源码、类型、`*.stories.tsx`，可在项目运行。
- [ ] 已完成资源校验与构建检查。
- [ ] 若环境允许，已完成 Storybook vs Pixso 真值图的视觉回归（阈值 `<= 5%`）；否则已记录降级原因与人工复核依据。
- [ ] 交付说明完整（链接、工具、对照结论、取舍、fallback）。

## 反模式（禁止）

- 不做 DSL 或不做截图对照就宣称 1:1。
- 把 `design_to_code` 结果直接当最终实现。
- 忽略 `.resources` 与现有 Harmony 组件体系，另起一套硬编码样式。
- Storybook 不加预览包层，或随意更改整页背景风格。

## 参考资料

- Pixso MCP 配置：`wiki/02-从 0 构建资源接入/01-MCP准备.md`
- 设计输入到资源层：`wiki/02-从 0 构建资源接入/03-从设计输入到资源层的完整路径.md`
- shadcn 与资源契约：`.agent/skills/shadcn/SKILL.md`、`references/page-generation.md`、`references/resource-contract.md`
- 资源校验脚本：`scripts/validate_design_system_resources.mjs`

## 附录：给用户的精简需求模板

```text
请基于这个 Pixso 节点链接（必须含 item-id）实现本仓库的 shadcn 风格 React 组件，要求 1:1 还原。

必须：
1) 用 MCP 拉取同一节点的 DSL 和截图（get_node_dsl + get_image 或等效）；
2) 先输出关键量化规格（尺寸/间距/圆角/色值/字体/状态），再编码；
3) 交付可运行源码 + TypeScript 类型 + stories；
4) Storybook 画布风格与仓库一致（含 bg-[#f3f4f6]）；
5) 回复里写明链接与 item-id、MCP 调用、对照结论、fallback 依据。

Pixso 链接：<替换为带 item-id 的完整 URL>
```
