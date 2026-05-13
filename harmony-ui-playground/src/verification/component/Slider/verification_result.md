# Slider 组件验证报告

## 1. 验证范围

- 组件：`Slider` / `SliderSeekbar`
- 校验模块：布局（倒扣）、资源调用（20%）、样式 CSS 表比对（60%）、变体属性（20%）
- 规范来源：`src/verification/component/tools/reference_result.md`
- 设计稿数据：`src/verification/component/Slider/Slider.json`
- 规范配置：`src/verification/component/css_styles_specification/{color,outline,rounded,gap,font,shade}.json`
- 非关键 CSS 排除：`src/verification/component/tools/non_critical_css_properties_exclude_list.xlsx`

## 2. 结果结论

- 最终结论：partially_compliant
- 最终得分：**69.85 / 100**
- 计算公式：`最终得分 = 资源 + 样式 + 变体 - 布局扣分`
  - 资源得分 = (合规资源数 / 资源总数) × 20 = (0 / 4) × 20 = **0**
  - 样式得分 = (合规样式属性数 / 参与比对样式属性数) × 60 = (235 / 248) × 60 = **56.85**
  - 变体得分 = (type 变体覆盖数 / type 变体总数) × 20 = (9 / 9) × 20 = **20**
  - 布局倒扣 = **-7**（仅在排版对齐/换行错误时倒扣）

## 3. 分模块结果

| 模块 | 合规率 | 得分 |
| :--- | :---: | :---: |
| 布局（错误倒扣） | / | -7 |
| 资源调用（20%） | 0/4 | 0 |
| 样式 CSS 表比对（60%） | 235/248 | 56.85 |
| 变体属性（20%） | 9/9 | 20 |
| 合计 | — | **69.85** |

### 3.1 布局扣分明细（按变体）

> 口径：布局倒扣仅包含对齐（`alignDeduct`）与换行（`wrapDeduct`）；本次 `wrapDeduct` 全为 0。

| 序号 | 变体标识 | 对齐扣分（alignDeduct） | 换行扣分（wrapDeduct） | 小计 |
| :--- | :--- | :---: | :---: | :---: |
| 1 | type=value|state=default|scenario=light | 2 | 0 | 2 |
| 2 | type=iconWithTitle|state=default|scenario=light | 1 | 0 | 1 |
| 3 | type=title|state=default|scenario=light | 2 | 0 | 2 |
| 4 | type=textview|state=default|scenario=light | 2 | 0 | 2 |
| 合计 | — | 7 | 0 | **7** |

## 4. 关键不符合项摘要

1. [type=basic|state=default|scenario=light] 滑块阴影：期望「rgba(0, 0, 0, 0.2) 0px 0px 3px 0px」，实际「rgba(0, 0, 0, 0.12) 0px 1px 4px 0px」；类型：值不一致；来源 src/component/Slider/Slider.css（--pixso-thumb-shadow）
2. [type=scale|state=default|scenario=light] 滑块阴影：期望「rgba(0, 0, 0, 0.2) 0px 0px 3px 0px」，实际「rgba(0, 0, 0, 0.12) 0px 1px 4px 0px」；类型：值不一致；来源 src/component/Slider/Slider.css（--pixso-thumb-shadow）
3. [type=icon|state=default|scenario=light] 滑块阴影：期望「rgba(0, 0, 0, 0.2) 0px 0px 3px 0px」，实际「rgba(0, 0, 0, 0.12) 0px 1px 4px 0px」；类型：值不一致；来源 src/component/Slider/Slider.css（--pixso-thumb-shadow）
4. [type=icon|state=default|scenario=light] 图标颜色：期望「rgba(0, 0, 0, 0.6)」，实际「rgba(0, 0, 0, 0.898)」；类型：值不一致；来源 src/component/Slider/Slider.css（--pixso-icon）
5. [type=icon|state=default|scenario=light] 图标资源库：期望「HM Symbol」，实际「lucide-react」；类型：不在允许集合；来源 src/render/display-brightness-settings-v4/index.tsx（import { Sun, SunDim } from lucide-react）
6. [type=valueWithChange|state=default|scenario=light] 滑块阴影：期望「rgba(0, 0, 0, 0.2) 0px 0px 3px 0px」，实际「rgba(0, 0, 0, 0.12) 0px 1px 4px 0px」；类型：值不一致；来源 src/component/Slider/Slider.css（--pixso-thumb-shadow）
7. [type=value|state=default|scenario=light] 滑块阴影：期望「rgba(0, 0, 0, 0.2) 0px 0px 3px 0px」，实际「rgba(0, 0, 0, 0.12) 0px 1px 4px 0px」；类型：值不一致；来源 src/component/Slider/Slider.css（--pixso-thumb-shadow）
8. [type=value|state=default|scenario=light] 刻度行高：期望「12px」，实际「11px」；类型：值不一致；来源 src/component/Slider/Slider.css（.pixso-slider__value-row line-height）
9. [type=iconWithTitle|state=default|scenario=light] 滑块阴影：期望「rgba(0, 0, 0, 0.2) 0px 0px 3px 0px」，实际「rgba(0, 0, 0, 0.12) 0px 1px 4px 0px」；类型：值不一致；来源 src/component/Slider/Slider.css（--pixso-thumb-shadow）
10. [type=iconWithTitle|state=default|scenario=light] 图标颜色：期望「rgba(0, 0, 0, 0.6)」，实际「rgba(0, 0, 0, 0.898)」；类型：值不一致；来源 src/component/Slider/Slider.css（--pixso-icon）

## 5. 统计对账

- 已渲染变体数：9（主表为 9 个 type 变体）
- 参与样式比对总条数：248
- 样式合规条数：235
- 样式不合规条数：13
- 资源合规条数：0 / 4
- 变体合规条数（按 typeVariantCount）：9 / 9
- 非关键 CSS 排除条数：依据 `non_critical_css_properties_exclude_list.xlsx`（已剔除，不计入上方分母）
- 不符合项总条数：13
- Excel 主表结构：逐变体、逐关键属性行展开（每个变体空行分隔）

## 6. 按 9 个变体输出关键 CSS 样式（描边/颜色/圆角/文本/间距）

| 序号 | 变体标识 | 描边 | 颜色 | 圆角 | 文本 | 间距 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | type=basic|state=default|scenario=light | / | #0A59F7; #000000 5%; #FFFFFF; #000000 20%(阴影色) | 2个矩形*4=8 | 字体:/; 字号:/; 字重:/ | padding:8 8 8; gap:0 |
| 2 | type=scale|state=default|scenario=light | / | #0A59F7; #000000 5%; #FFFFFF; #000000 20%(阴影色); #000000 10% | 2个矩形*4=8 | 字体:/; 字号:/; 字重:/ | padding:8 8 8; gap:8 |
| 3 | type=icon|state=default|scenario=light | / | #000000 60%; #000000 5%; #000000 20%(阴影色); #0A59F7; #FFFFFF | 2个矩形*4=8 | 字体:/; 字号:/; 字重:/ | padding:8 8 8; gap:8 icon-track |
| 4 | type=valueWithChange|state=default|scenario=light | / | #000000 60%; #000000 5%; #000000 20%(阴影色); #0A59F7; #FFFFFF | 2个矩形*4=8 | 字体:鸿蒙黑体*2; 字号:14px*2; 字重:regular*2 | padding:8 8 8; gap:8 value |
| 5 | type=value|state=default|scenario=light | / | #000000 60%; #000000 5%; #000000 20%(阴影色); #0A59F7; #FFFFFF | 2个矩形*4=8 | 字体:鸿蒙黑体*6; 字号:10px*6; 字重:regular*6 | padding:8 8 8; gap:8 labels |
| 6 | type=iconWithTitle|state=default|scenario=light | / | #000000 60%; #000000 90%; #000000 5%; #000000 20%(阴影色); #0A59F7; #FFFFFF | 2个矩形*4=8 | 字体:鸿蒙黑体*1; 字号:16px*1; 字重:regular*1 | padding:8 8 8; gap title-row |
| 7 | type=bubble|state=default|scenario=light | / | #4D4D4D; #FFFFFF; #000000 5%; #000000 20%(阴影色); #0A59F7; #FFFFFF | 2个矩形*4 + 1个三角形*3=15 | 字体:鸿蒙黑体*1; 字号:14px*1; 字重:regular*1 | padding:8 8 8; gap bubble |
| 8 | type=title|state=default|scenario=light | / | #000000 60%; #000000 90%; #000000 5%; #000000 20%(阴影色); #0A59F7; #FFFFFF | 2个矩形*4=8 | 字体:鸿蒙黑体*2; 字号:16px*1; 14px*1; 字重:regular*2 | padding:8 8 8; gap title |
| 9 | type=textview|state=default|scenario=light | / | #000000 60%; #000000 5%; #000000 20%(阴影色); #0A59F7; #FFFFFF | 2个矩形*4=8 | 字体:鸿蒙黑体*2; 字号:14px*2; 字重:regular*2 | padding:8 8 8; gap textview |

## 7. 不符合项统计（对齐规范 DSL + 组件 DSL）

### 7.1 按变体统计

| 序号 | 变体标识 | 参与校验条数 | 合规条数 | 不合规条数 | 合规率 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| 1 | type=basic|state=default|scenario=light | 19 | 17 | 1 | 89.47% |
| 2 | type=scale|state=default|scenario=light | 22 | 20 | 1 | 90.91% |
| 3 | type=icon|state=default|scenario=light | 22 | 19 | 2 | 86.36% |
| 4 | type=valueWithChange|state=default|scenario=light | 28 | 26 | 1 | 92.86% |
| 5 | type=value|state=default|scenario=light | 40 | 37 | 2 | 92.50% |
| 6 | type=iconWithTitle|state=default|scenario=light | 26 | 23 | 2 | 88.46% |
| 7 | type=bubble|state=default|scenario=light | 36 | 30 | 2 | 83.33% |
| 8 | type=title|state=default|scenario=light | 28 | 26 | 1 | 92.86% |
| 9 | type=textview|state=default|scenario=light | 27 | 25 | 1 | 92.59% |

### 7.2 按类别统计

| 检查类别 | 不合规条数 | 总条数 | 不合规占比 |
| :--- | :---: | :---: | :---: |
| 描边 | 0 | 0 | 0.00% |
| 颜色 | 2 | 47 | 4.26% |
| 圆角 | 1 | 79 | 1.27% |
| 文本 | 1 | 42 | 2.38% |
| 间距 | 0 | 44 | 0.00% |
| 阴影 | 9 | 36 | 25.00% |

### 7.3 按来源统计

- 不符合规范 DSL（`css_styles_specification`）条数：13
- 不符合组件 DSL（`Slider.json`）条数：13

### 7.4 不符合属性清单（节选，完整见 JSON）

| 序号 | 变体标识 | 类别 | 属性 | 期望值 | 实际值 | 不符合类型 | 规范来源 | 组件DSL来源 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | type=basic|state=default|scenario=light | 阴影 | 滑块阴影 | rgba(0, 0, 0, 0.2) 0px 0px 3px 0px | rgba(0, 0, 0, 0.12) 0px 1px 4px 0px | 值不一致 | src/verification/component/Slider/Slider.json | Slider.json visual nodes |
| 2 | type=scale|state=default|scenario=light | 阴影 | 滑块阴影 | rgba(0, 0, 0, 0.2) 0px 0px 3px 0px | rgba(0, 0, 0, 0.12) 0px 1px 4px 0px | 值不一致 | src/verification/component/Slider/Slider.json | Slider.json visual nodes |
| 3 | type=icon|state=default|scenario=light | 阴影 | 滑块阴影 | rgba(0, 0, 0, 0.2) 0px 0px 3px 0px | rgba(0, 0, 0, 0.12) 0px 1px 4px 0px | 值不一致 | src/verification/component/Slider/Slider.json | Slider.json visual nodes |
| 4 | type=icon|state=default|scenario=light | 颜色 | 图标颜色 | rgba(0, 0, 0, 0.6) | rgba(0, 0, 0, 0.898) | 值不一致 | src/verification/component/Slider/Slider.json | Slider.json visual nodes |
| 5 | type=valueWithChange|state=default|scenario=light | 阴影 | 滑块阴影 | rgba(0, 0, 0, 0.2) 0px 0px 3px 0px | rgba(0, 0, 0, 0.12) 0px 1px 4px 0px | 值不一致 | src/verification/component/Slider/Slider.json | Slider.json visual nodes |
| 6 | type=value|state=default|scenario=light | 阴影 | 滑块阴影 | rgba(0, 0, 0, 0.2) 0px 0px 3px 0px | rgba(0, 0, 0, 0.12) 0px 1px 4px 0px | 值不一致 | src/verification/component/Slider/Slider.json | Slider.json visual nodes |
| 7 | type=value|state=default|scenario=light | 文本 | 刻度行高 | 12px | 11px | 值不一致 | src/verification/component/Slider/Slider.json | Slider.json visual nodes |
| 8 | type=iconWithTitle|state=default|scenario=light | 阴影 | 滑块阴影 | rgba(0, 0, 0, 0.2) 0px 0px 3px 0px | rgba(0, 0, 0, 0.12) 0px 1px 4px 0px | 值不一致 | src/verification/component/Slider/Slider.json | Slider.json visual nodes |
| 9 | type=iconWithTitle|state=default|scenario=light | 颜色 | 图标颜色 | rgba(0, 0, 0, 0.6) | rgba(0, 0, 0, 0.898) | 值不一致 | src/verification/component/Slider/Slider.json | Slider.json visual nodes |
| 10 | type=bubble|state=default|scenario=light | 阴影 | 滑块阴影 | rgba(0, 0, 0, 0.2) 0px 0px 3px 0px | rgba(0, 0, 0, 0.12) 0px 1px 4px 0px | 值不一致 | src/verification/component/Slider/Slider.json | Slider.json visual nodes |
| 11 | type=bubble|state=default|scenario=light | 圆角 | 气泡圆角 | 18px | 4px | 值不一致 | src/verification/component/Slider/Slider.json | Slider.json visual nodes |
| 12 | type=title|state=default|scenario=light | 阴影 | 滑块阴影 | rgba(0, 0, 0, 0.2) 0px 0px 3px 0px | rgba(0, 0, 0, 0.12) 0px 1px 4px 0px | 值不一致 | src/verification/component/Slider/Slider.json | Slider.json visual nodes |
| 13 | type=textview|state=default|scenario=light | 阴影 | 滑块阴影 | rgba(0, 0, 0, 0.2) 0px 0px 3px 0px | rgba(0, 0, 0, 0.12) 0px 1px 4px 0px | 值不一致 | src/verification/component/Slider/Slider.json | Slider.json visual nodes |

## 8. 明细文件

- Excel：`src/verification/component/Slider/verification_key_styles.xlsx`（含 `统计结果` 与 `问题明细` 两个 Sheet）
- JSON：`src/verification/component/Slider/verification_result.json`
- 设计稿 DSL：`src/verification/component/Slider/Slider.json`
