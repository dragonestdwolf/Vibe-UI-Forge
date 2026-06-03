---
name: page-verification
description: 对完整页面执行设计规范校验并输出页面级统一评分结果。支持 DOM 全量 CSS 扫描（颜色/字体/间距/描边/圆角/阴影）、registry 清单抽检、computed style 与规范库比对，生成 verification_result.md 与 verification_key_styles.xlsx（DOM全量扫描 / 问题明细）。
disable-model-invocation: true
---

# 页面设计规范校验方案

## 使用前必需输入

每次执行页面验证前，必须先确认并读取以下输入：

- **页面元素清单**：`page_element_registry.json`（由 Agent 或人工维护），声明页面 URL、`domScan` 配置、布局检查项、预置/自定义元素。
- **页面渲染入口**：可被 Playwright 打开的完整页面 URL（本地 dev server、预览地址或 `file://` 静态页）。
- **专项规范数据**：`../references/` 下的 `color.json`、`gap.json`、`font.json`、`rounded.json`、`outline.json`、`shade.json` 与 `icon/`。
- **输出目录**：`../output/{pageName}/`（小写 pageName）。

**无整页设计稿 DSL**：本方案不生成 `canonical_dsl.json`，不做 DSL 还原比对；样式与间距以 **references 允许值** 为唯一合规标准（`comparisonMode: spec-only`）。

**最小输入（推荐）**：只需 `pageName` + `render.pageUrl`；`domScan.enabled: true`（默认）即可自动扫描整页 DOM 并写入 Excel「DOM全量扫描」sheet。registry 中的 `customElements` / `layout` 为可选的加权计分项。

若缺少可访问的 `render.pageUrl`，只能产出 `static-registry-only` 降级结果（采集项标记为 `无法判定`）。

### Storybook 入口（强制知晓）

Storybook **Manager** URL（`?path=/story/...`）下，真实 Story 渲染在 `#storybook-preview-iframe` 内；仅扫顶层 `body` 会命中侧栏/工具栏，**扫不到业务组件**。

`render_page_verify.mjs` 默认行为（`render.useStorybookIframe !== false`）：

1. 将 Manager URL 自动改写为 **`iframe.html?id=<storyId>&viewMode=story`** 再导航（`navigationMode: storybook-iframe-direct`）。
2. 等待 `render.contentRootSelector` 挂载后再采集。
3. 报告与 `verification_manifest.json` 会同时记录 `pageUrl`（原始）与 `effectivePageUrl`（实际打开）。

registry 推荐配置：

```json
{
  "render": {
    "pageUrl": "http://localhost:6007/?path=/story/render-display-theme-brightness-settings-v1--default",
    "contentRootSelector": ".display-theme-settings",
    "useStorybookIframe": true
  },
  "domScan": {
    "enabled": true,
    "rootSelector": ".display-theme-settings",
    "maxElements": 800
  }
}
```

也可直接填写 iframe 直链（跳过改写）。若必须在 Manager 页内采集，设 `"useStorybookIframe": false, "useStorybookFrame": true`（在 preview iframe 内执行 DOM 查询）。

### 推荐用户提示词

```text
用 skills/shadcn-verification/page-verification/SKILL.md 做页面验证。

- 页面名称：settings-page
- 页面入口 URL：http://localhost:5173/settings
- 页面源码（可选）：src/pages/Settings.tsx

请执行完整流水线：init-registry（若无清单）→ build_page_verification_input → render_page_verify。
domScan 保持开启；dev server 已启动。
```

---

## 稳定验证流水线（强制）

1. **（可选）初始化清单模板**（在 `page-verification/` 目录下）  
   `node scripts/build_page_verification_input.mjs --init-registry --page <pageName> --out ../output/<pageName>/`

2. **构建固定验证输入**  
   `node scripts/build_page_verification_input.mjs --registry ../output/<pageName>/page_element_registry.json --out ../output/<pageName>/`  
   输出 `page_verification_input.json`（锁定 registry 分母 + `domScan` 配置）。

3. **评分输入锁定**：最终评分只读取 `page_verification_input.json`；不得临时增减 registry 检查项。

4. **执行渲染评分**（在 `page-verification/` 目录下）  
   `node scripts/render_page_verify.mjs --input ../output/<pageName>/page_verification_input.json --out ../output/<pageName>/`（可选 `--browser <path>`）  
   - 浏览器打开 `pageUrl`（Storybook Manager URL 会自动改写为 `iframe.html`），执行 **registry 清单采集** + **DOM 全量扫描**（若 `domScan.enabled !== false`）  
   - 生成 `verification_result.md`、`verification_key_styles.xlsx`、`verification_manifest.json`、`verification_run.json`  
   - 页面 URL 未启动时加 `--static-only`（秒级完成，采集项为 `无法判定`）  
   - 正常采集导航超时 **15s**；超时后自动降级为 `static-registry-only`

必须在报告中输出 `registryChecksum`、`pageVerificationInputChecksum`。二者任一变化，两次 registry 加权得分不得直接比较。

---

## 输出目录约定（强制）

- 输出根目录：`../output/`（相对本 skill 文件）。
- 每次验证目录：`../output/{pageName}/`（pageName 小写归一化）。
- 固定产物：
  - `page_element_registry.json`
  - `page_verification_input.json`
  - `verification_result.md`
  - `verification_key_styles.xlsx`
  - `verification_manifest.json`
  - `verification_run.json`（含 `registryRows` + `domRows`）

---

## 脚本目录约定（强制）

| 路径 | 职责 |
| :--- | :--- |
| `scripts/build_page_verification_input.mjs` | 由 registry 生成 `page_verification_input.json` |
| `scripts/render_page_verify.mjs` | 浏览器渲染、DOM 扫描、规范比对、计分与报告 |
| `scripts/lib/page_dom_scan.mjs` | DOM 全量扫描与行级结果生成 |
| `scripts/lib/page_checks.mjs` | registry 样式 preset |
| `scripts/lib/page_spec_match.mjs` | spec-only 规范匹配 |
| `scripts/lib/page_score.mjs` | registry 加权计分 |
| `scripts/lib/page_render_context.mjs` | Storybook iframe 解析、有效 URL、渲染 scope |
| `scripts/lib/page_property_applicable.mjs` | 未生效 CSS 属性过滤（不采集） |
| `scripts/lib/page_report_scores.mjs` | 报告评分摘要（registry / DOM） |
| `scripts/lib/page_paths.mjs` | 输出目录（`../output/`） |
| `component-verification/scripts/lib/` | **复用**：`stable.mjs`、`spec_validate.mjs`、`icon_match.mjs` |

---

## DOM 全量扫描（强制默认开启）

### 行为

- 在浏览器中对 `domScan.rootSelector`（默认 `body`；Storybook 页面请设为**业务根节点**，如 `.display-theme-settings`）下所有**可见** DOM 子树执行扫描（跳过 `script/style/head` 等标签）。
- 每个元素**最多**覆盖六类规范（按 computed 是否生效决定，未生效项**不生成检查行**）：
  - **颜色**：填充、文本
  - **描边**：四边颜色 + 四边宽度
  - **圆角**：统一 + 四角
  - **文本**：字体、字号、字重、行高
  - **阴影**：颜色、X/Y 偏移、模糊、扩展
  - **间距**：padding 四边、gap、row-gap
- 每项与 `../references/*.json` 做 spec-only 比对。
- 不适用项由 `scripts/lib/page_property_applicable.mjs` 过滤（**不采集**，不占 Excel 行），例如：
  - `box-shadow: none` → 不采集阴影类
  - `background-color` 透明 → 不采集填充色
  - 某侧 `border-width: 0` → 不采集该侧描边颜色/宽度
  - `gap` / `row-gap` 为 `normal` / `auto`，或非 flex/grid 容器 → 不采集对应间距
  - `line-height: normal` → 不采集行高
- 扫描期间为元素临时写入 `data-pv-scan-id`（会话内标记，验证结束后清除；**不修改业务源码**）。
- 默认最多扫描 **800** 个元素（`domScan.maxElements`）；超出时截断并在报告中说明。

### registry 配置

```json
{
  "domScan": {
    "enabled": true,
    "maxElements": 800,
    "rootSelector": "body",
    "skipTags": ["script", "style", "noscript", "template", "head", "meta", "link"]
  }
}
```

### Excel 输出

- Sheet **`DOM全量扫描`**：仅含**已采集**的有效检查行（符合 + 不符合 + 无法判定）。
- 额外列：`DOM序号`、`DOM路径`、`元素描述`。
- **DOM 扫描结果不计入 registry 加权总分**；无清单项时报告以 **DOM 合规率** 为主评分。

### 判定补充

| 场景 | 处理 |
| :--- | :--- |
| 属性未生效（见上文「不采集」列表） | **不生成行** |
| 其它 | 同 spec-only 口径（符合 / 不符合 / 无法判定） |

---

## 规范与数据来源

| 校验类别 | 规范文件 | 用途 |
| :--- | :--- | :--- |
| 阴影 | `../references/shade.json` | 阴影分量允许值 |
| 描边 | `../references/outline.json` | 描边粗细、颜色 |
| 颜色 | `../references/color.json` | 色值与语义 |
| 圆角 | `../references/rounded.json` | 圆角允许值 |
| 间距 | `../references/gap.json` | 栅格/间距 allowedValues |
| 文本 | `../references/font.json` | 字体、字号、字重 |
| Icon | `../references/icon/` | SVG 指纹白名单 |

---

## 判定口径（spec-only，强制）

| 场景 | 状态 | registry 计分 |
| :--- | :--- | :--- |
| 实际 computed 值 ∈ 规范允许集 | `符合` | 计入分子 |
| 实际值 ∉ 允许集 | `不符合` | 计入分母，不计分子 |
| selector 未找到 / 无法采集 | `无法判定` | 计入分母，不计分子 |
| 节点不适用（如无阴影、间距 normal） | `已排除` | 移出分母 |
| align/wrap 未设 `manualReview: true` | `无法判定` | 不计布局倒扣 |

**不存在**组件验证中的 `设计稿符合`（无 DSL 期望值）。

---

## 一、总分权重结构（registry 清单，页面级）

| 模块 | 权重 / 计分方式 | 说明 |
| :--- | :--- | :--- |
| 页面布局 | 20% | 栅格合规率；背景色错误倒扣 |
| 页面元素 | 80% | 预置组件调用 + 自定义元素样式/资源 |
| **DOM 全量扫描** | **不计分** | 独立合规率，写入 Excel |

### 1.1 页面布局（20%）

- **栅格**：`layout.gridChecks` 中每项 computed 间距值须在 `gap.json` `rules.allowedValues` 内。
- **背景**：`layout.backgroundChecks` 每项背景色须符合 `color.json`。每处 `不符合` **倒扣 1 分**（下限 0）。

### 1.2 预置组件（按占比 × 80%）

- 有调用证据（`invoked: true`）记合规；否则 0。

### 1.3 自定义元素（按占比 × 80%）

- 单元素内层：`资源 30% + 样式 70%`，再减布局倒扣。

---

## 二、页面元素清单（`page_element_registry.json`）

模板见 `templates/page_element_registry.example.json`。

**必填字段**

- `pageName`、`render.pageUrl`

**可选字段（加权计分 / 精细抽检）**

- `layout.gridChecks[]`、`layout.backgroundChecks[]`
- `presetComponents[]`：`componentId`、`invoked`、`evidence`
- `customElements[]`：`elementId`、`selector`、`stylePreset` / `styleChecks`

**样式 preset（registry 自定义元素）**

- `BASIC_STYLE`、`FULL_STYLE` 或单项 id（见 `scripts/lib/page_checks.mjs`）

---

## 三、执行流程（落地步骤）

1. 确认页面可访问；至少填写 `pageName` + `render.pageUrl`（`domScan` 默认开启）。
2. 执行 `build_page_verification_input.mjs` 生成 `page_verification_input.json`。
3. 执行 `render_page_verify.mjs` 渲染、DOM 扫描并采集。
4. 核对 `verification_result.md` 与 Excel：`DOM全量扫描` + `问题明细`。
5. 问题定位：看 Excel「问题明细」或 `verification_result.md` 不符合摘要。

---

## 四、输出要求

### 4.1 `verification_result.md`

必含：**评分摘要**（无 registry 时主评分为 DOM 合规率，避免误读布局基线 20 分）、registry 加权得分、DOM 扫描摘要、checksum、`effectivePageUrl` / `navigationMode`、不符合摘要。

### 4.2 `verification_key_styles.xlsx`

- Sheet **`DOM全量扫描`**：DOM 扫描全量行（含 DOM 路径/描述）；无 DOM 扫描时不生成该 sheet
- Sheet **`问题明细`**：registry + DOM 所有 `不符合` 行
- **不生成** `统计结果` sheet（registry 无行时该表为空，已移除）

---

## 五、复现与稳定性（强制）

1. 同一页面多次验证须复用同一份 `page_verification_input.json`（checksum 不变）。
2. 渲染环境写入 `verification_manifest.json`：URL、viewport、browserPath、renderMode、`domScan`。
3. 验证过程中**不得**自动执行 `npx playwright install`；优先本机 Chrome/Edge。
4. 无浏览器时 `renderMode=static-registry-only`：仍输出 md/xlsx/manifest，采集项为 `无法判定`。
5. `data-pv-scan-id` 仅为运行时临时标记，验证结束必须清除。

---

## 六、与组件验证的差异（速查）

| 项目 | 组件验证 | 页面验证 |
| :--- | :--- | :--- |
| 期望值 | 组件 DSL JSON | 无；仅 references |
| 全量 CSS 扫描 | 无 | **DOM 全量扫描（默认）** |
| 输入锁定文件 | `verification_input.json` | `page_verification_input.json` |
| 清单来源 | `node_mapping.json` + DSL | `page_element_registry.json`（可选） |
| 计分模型 | 20/60/20 + 变体 | 布局 20 + 元素 80（registry）；DOM 不计分 |
| 截图 | 变体级 | 无（页面验证不产出截图） |
