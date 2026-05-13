# 组件设计规范校验 SOP（通用版）

## 1. 目的与适用范围

- 目的：统一组件视觉规范校验流程，输出可评分、可追溯、可复核结果。
- 适用范围：`harmony-ui-playground` 内所有前端业务组件和基础组件。
- 核心原则：不强制 DOM 与设计稿图层一一映射，仅校验关键视觉节点的最终呈现结果。

## 2. 输入与前置条件

### 2.1 必需输入

- 设计稿 DSL（图层、样式、坐标、变体、规范约束）。
- 规范文件（`src/verification/component/css_styles_specification/*.json`）。
- 非关键属性排除表（`src/verification/component/tools/non_critical_css_properties_exclude_list.xlsx`）。

### 2.2 运行环境

- 使用 Playwright/Puppeteer 渲染目标组件。
- 可获取 `getComputedStyle()` 与 `getBoundingClientRect()`。

### 2.3 前置检查

- DSL 中存在当前组件的 type 变体清单。
- 颜色 token 命名可与 `color.json` 对齐。

## 3. 角色与职责

- 执行人（前端/工具开发）：实现采集、比对、计分、报表导出。
- 评审人（设计系统/质量负责人）：审核评分口径、命名一致性、输出可追溯性。
- 验收人（组件 Owner）：基于不符合项闭环整改并回归验证。

## 4. 评分口径（固定）

- 资源调用（20%）：
  - `score_resource = 合规资源数 / 总资源数 * 20`
- 样式比对（60%）：
  - `score_style = 合规样式属性数 / 总参与比对样式属性数 * 60`
- 变体覆盖（20%，强制按 `typeVariantCount`）：
  - `score_variant = type覆盖数 / type总数 * 20`
- 布局模块：错误倒扣（无固定占比）。
- 最终得分：
  - `final_score = score_resource + score_style + score_variant - layout_penalty`

## 5. 标准执行流程

### Step A：准备规范映射

1. 读取并缓存规范文件：
   - `shade.json`
   - `outline.json`
   - `color.json`
   - `rounded.json`
   - `gap.json`
   - `font.json`
2. 加载排除清单：`non_critical_css_properties_exclude_list.xlsx`。
3. 建立“属性 -> 规范来源 -> 比对规则”映射表。

### Step B：渲染与数据采集

1. 按组件 type 变体逐一渲染。
2. 采集布局数据：关键元素坐标、文本行数、对齐基线。
3. 采集资源数据：icon/img/插画资源标识、路径、来源。
4. 采集样式数据：关键节点 `getComputedStyle()` 全量属性。

### Step C：期望值构建（必须来自 DSL）

1. 从 DSL 解析当前场景关键视觉元素的期望样式。
2. 与规范 JSON 对齐允许值、命名与语义。
3. 若无 DSL（或等价黄金表），标记“无法判定”，不得强行判合规。

### Step D：生成参与比对集合

1. 初始集合：`期望键 ∪ 规范要求校验键`。
2. 与计算样式键对齐。
3. 按排除清单剔除非关键属性。
4. 得到最终参与计分的分母集合。

### Step E：逐项比对与差异分类

对每个保留属性执行比对，输出以下类型：

- 值不一致
- 命名不一致（尤其颜色 token）
- 不在允许集合
- 缺少期望映射
- 来源不可追溯

每条不符合项必须记录三类来源定位：

- 组件实现侧来源
- DSL 侧来源
- 规范 JSON 侧来源

### Step F：模块计分

1. 布局：对齐/换行/位移错误按规则扣分。
2. 资源：按白名单合规率计分。
3. 样式：仅按参与比对集合计分。
4. 变体：仅按 `typeVariantCount` 计分；state/seekbar 仅作诊断附录。

### Step G：固定输出产物（2 个文件）

1. `verification_result.md`（验证报告）：
   - 最终得分与公式说明。
   - 四模块合规率与得分。
   - 关键不符合项摘要（类型/范围/严重级别）。
   - 与 Excel 的统计对账值。
   - 明确字段：`变体合规条数（按 typeVariantCount）= x / y`。
2. `verification_key_styles.xlsx`（统计结果表）：
   - `统计结果` Sheet（必选主表，按“组件 + 变体”聚合）。
   - `问题明细` Sheet（建议，仅保留不符合/无法判定/来源不可追溯项）。

## 6. 关键质量门禁（Checklist）

- [ ] 颜色校验同时满足“验名 + 验值”。
- [ ] 主输出未使用“全量 computed style 明细”。
- [ ] 每个不符合项均可追溯到实现/DSL/规范来源。
- [ ] 报告包含“按变体关键样式清单”与“不符合统计”两个独立小节。

## 7. 异常处理规则

- DSL 缺失或映射不全：标记“无法判定”，不计为合规，进入问题明细。
- DSL 与规范 JSON 冲突：按规范优先并记录冲突来源。
- 节点无法定位：标记来源不可追溯，不得静默跳过。
- 出现 type/state 口径混用：判定报告无效，需重算重出。
