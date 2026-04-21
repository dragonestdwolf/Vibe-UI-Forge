# Wiki 改进计划 v1：面向平台设计师的 Figma 资源层接入手册

## Summary

将现有 wiki 从“工程索引骨架”补强为“平台设计师可理解、可照着交付资源层”的文档体系。写法采用设计师手册语气：先讲概念流程，再给可照抄模板；设计师负责定义语义和验收，AI/工程负责落文件、读源码、跑验证。

本次只改 wiki 文档，不改 `.resources`、React 源码、token 或 shadcn skill 逻辑。当前已有的 `wiki/01-架构总览/02-shadcn.md` 改动要保留，并在其基础上补强。

## Key Changes

- 补强总览与导航：
  - 更新 `wiki/00-快速入口.md`，修正现有指向不存在的“新增 Layout/Block/Component 指南”的链接，改为指向现有 `07/08/09` 维护流程和资源层接入流程。
  - 补强 `wiki/01-架构总览/01-架构总览.md`，用“Figma 意图 -> Resource Layer -> React 真值源码 -> Render 输出”的链路解释项目。
  - 保留并润色 `wiki/01-架构总览/02-shadcn.md` 的核心论点：不是 shadcn 本身神奇，而是完整 React 组件库 + Markdown 资源契约共同支撑 AI 生成。

- 补强资源层接入文档：
  - 在 `wiki/03-设计系统资源/01-设计系统资源概览.md` 中补齐资源层全景：`config.json`、`route-index.md`、`layout/*.md`、`blocks.json`、`components.json`、`component/*.md` 分别解决什么问题。
  - 在 `wiki/03-设计系统资源/02-资源层配置指南.md` 中加入可照抄模板：新增资源集、切换 active、projectRoot、path、资源目录命名规则。
  - 在 `wiki/03-设计系统资源/03-资源层替换指南.md` 中扩写“主要从 Figma 开始”的接入流程：设计师如何整理页面类型、布局语义、组件清单、Block 候选、验收标准，再交给 AI 落 `.resources`。

- 补强工作流和设计师实操：
  - 在 `wiki/04-工作流程/01-Skill工作流理解.md` 中解释 AI 读取顺序：project context -> route matching -> layout resolution -> source grounding -> generation -> validation。
  - 在 `wiki/04-工作流程/02-页面生成流程.md` 中修正产出位置：稳定模板在 `src/blocks/**`，生成预览在 `src/render/**`，并强调 `src/render/**` 不能作为新页面模板参考。
  - 在 `wiki/04-工作流程/03-质量审核.md` 中补充设计师验收清单：语义匹配、布局层级、组件选择、状态覆盖、token 一致性、生成日志是否完整。
  - 在 `wiki/06-设计师实操/01-设计师实操手册.md` 中加入完整话术模板，例如“我要从 Figma 接入一个新资源层”“请根据这个页面族整理 page_type”“请生成 layout markdown 模板”。

- 补充术语和模板：
  - 更新 `wiki/99-术语表.md`，补充 Figma intent、Resource Contract、Source Grounding、Render Preview、Generation Log、reference_blocks、needed_components。
  - 在资源层相关文档中加入四类可复制模板：`route-index.md` 表格模板、`layout/{page_type}.md` 模板、`blocks.json` 条目模板、`components.json` 条目模板。
  - 明确模板约束：`blocks.json` 只能指向稳定 `src/blocks/**`，不能把历史 `src/render/**` 当作 reference block。

## Implementation Notes

- 文档主线采用“设计师定义语义，AI/工程落地”的分工：
  - 设计师定义：页面族、页面类型、命中/排除规则、布局意图、组件语义、验收标准。
  - AI/工程执行：读取 React 源码、创建/更新 `.resources` 文件、生成页面、跑验证、写 generation log。
- Figma 接入流程默认输入包括：页面截图或 Figma 节点、页面用途、关键区块、组件清单、状态说明、哪些页面属于同一 page_type。
- 文档中避免要求设计师手写复杂 JSON；JSON 以“可审阅模板”呈现，强调设计师重点审语义是否正确。
- 不引入新 schema，不改变现有 resource contract；只把现有契约讲清楚。

## Test Plan

- 文档一致性检查：
  - 检查 wiki 内链接是否指向真实存在的文件。
  - 检查路径描述与当前仓库一致：`.resources/harmony/**`、`harmony-ui-playground/src/component/**`、`src/blocks/**`、`src/render/**`。
  - 检查所有“待补充内容”是否被替换为真实说明或明确后续 TODO。
- 内容验收场景：
  - 设计师读完后能回答：什么是资源层、为什么需要 React 源码真值、如何从 Figma 整理 page_type、如何验收 AI 生成页面。
  - AI 根据 wiki 能执行：新增资源集、补 layout、注册 block/component、生成页面并写 log。
- Git 检查：
  - `git diff --check`
  - `git status --short`
  - 如仅改 Markdown，不要求跑 Storybook；如文档中同步改到示例代码或配置，再跑相关验证。

## Assumptions

- 这次不重组 wiki 目录，只补强现有目录。
- 主要读者是平台设计师，不是纯工程维护者。
- 资源层接入的主要起点是 Figma；React 组件源码仍是最终生成真值。
- 设计师不需要手动维护所有 JSON 细节，但需要能审阅模板字段是否表达了正确设计语义。
