# Slider 组件设计规范符合度验证

## 1. 验证范围与输入

- 设计稿 DSL：`src/verification/Slider.json`
- 评分标准：`src/verification/reference.md`
- 执行方案：`src/verification/reference_result.md`
- 被验证组件实现：
  - `src/component/Slider/Slider.tsx`
  - `src/component/Slider/Slider.css`
  - `src/component/Slider/SliderSeekbar.tsx`
  - 业务调用样例：`src/render/display-brightness-settings-v4/index.tsx`

## 2. 评分结果（按 reference 权重）

- 布局（倒扣项）：未发现可直接从代码静态判定的对齐/换行错误，扣分 `0`
- 资源调用（20%）：`0 / 3`，得分 `0.00`
- 样式 CSS 比对（60%）：`17 / 27`，得分 `37.78`
- 变体属性（20%）：`13 / 14`，得分 `18.57`

**最终得分：`56.35 / 100`**

---

## 3. 分模块结论

### 3.1 布局（倒扣）

- 本轮为静态代码 + DSL 校验，未做 Playwright 截图像素比对。
- 从尺寸/间距定义看，主轨道、行高、常见 padding 与 DSL 主体结构基本一致（例如 336 轨宽、40 行高、12/24 左右内边距）。
- 因缺少运行时截图比对，不执行布局扣分。

### 3.2 资源调用（20%）

- DSL 中识别到规范 icon 资源（`HM Symbol`）共 `3` 个。
- 当前组件实现未内置规范 icon 资源库约束，且业务样例使用了 `lucide-react` 图标（`Sun`、`SunDim`）。
- 按“规范资源数 / 总资源数”计：`0 / 3`。

### 3.3 样式 CSS 比对（60%）

关键通过项（节选）：
- 轨道主色 `#0A59F7`、轨道高度 `20px`、圆角 `12px` 与 DSL 一致。
- thumb 尺寸 `12px`、颜色 `#FFF` 与 DSL 一致。
- focus 态 `2px` 蓝色描边与设计意图一致。
- seekbar 细轨 `4px` 与 `16px` thumb 尺寸一致。

关键不通过项（节选）：
- 多处透明度存在偏差：`0.05` 被实现为 `0.047`（track / hover）。
- thumb 阴影与 DSL 不一致（DSL 倾向 `0 0 3 rgba(0,0,0,0.2)`；实现为 `0 1px 4px rgba(...,0.12/0.18)`）。
- `title` 主字体色实现为 `rgba(0,0,0,0.898)`，与 DSL 的 `0.9` 有偏差。
- value 刻度文案行高实现为 `11px`，DSL 为 `12px`。
- bubble 圆角实现为 `4px`，DSL 对应气泡主体是大圆角（`18`）。

### 3.4 变体属性（20%）

- 类型变体：设计稿 9 类（basic/scale/icon/value/valueWithChange/iconWithTitle/bubble/title/textview）均已实现，`9 / 9`。
- 状态变体：5 态均可覆盖，但设计稿 `Enabled` 在实现中命名为 `default`（语义可映射，命名不完全一致），按严格属性表计 `4 / 5`。
- 汇总：`13 / 14`。

---

## 4. 全量不匹配清单（静态校验识别）

> 说明：以下为本次静态规则识别到的全部不匹配项，包含资源、样式和变体命名不一致。布局像素级差异需运行截图比对后才能补齐。

### 4.1 资源调用不匹配（3项）

1. **R-01（Icon）**
   - DSL 期望：使用规范符号字体图标 `HM Symbol`（节点 `3523:12774`）
   - 当前实现：组件/页面侧主要使用 `lucide-react`（`Sun`/`SunDim`）
   - 证据：`src/render/display-brightness-settings-v4/index.tsx`
2. **R-02（Icon）**
   - DSL 期望：使用规范符号字体图标 `HM Symbol`（节点 `3523:12781`）
   - 当前实现：组件未限制图标来源，业务调用未落到 `HM Symbol`
   - 证据：`src/component/Slider/Slider.tsx`、`src/render/display-brightness-settings-v4/index.tsx`
3. **R-03（Icon）**
   - DSL 期望：使用规范符号字体图标 `HM Symbol`（节点 `3523:12798`）
   - 当前实现：组件未提供规范资源白名单/映射
   - 证据：`src/component/Slider/Slider.tsx`

### 4.2 样式不匹配（7类，11个属性点）

1. **S-01（轨道背景透明度）**
   - DSL 期望：`rgba(0,0,0,0.05)`（`Light/comp_background_tertiary`）
   - 当前实现：`rgba(0,0,0,0.047)`
   - 证据：`src/component/Slider/Slider.css`
2. **S-02（Hover 覆层透明度）**
   - DSL 期望：`rgba(0,0,0,0.05)`（`Light/interactive_hover`）
   - 当前实现：`rgba(0,0,0,0.047)`
   - 证据：`src/component/Slider/Slider.css`
3. **S-03（主标题文字色透明度）**
   - DSL 期望：`rgba(0,0,0,0.9)`（`Light/font_primary`）
   - 当前实现：`rgba(0,0,0,0.898)`
   - 证据：`src/component/Slider/Slider.css`
4. **S-04（主滑块 thumb 阴影参数）**
   - DSL 期望：`x=0, y=0, blur=3, alpha=0.2`
   - 当前实现：`0 1px 4px rgba(0,0,0,0.12)`
   - 不匹配属性点：`y / blur / alpha`（3个）
   - 证据：`src/component/Slider/Slider.css`
5. **S-05（Seekbar thumb 阴影参数）**
   - DSL 期望：`x=0, y=0, blur=3, alpha=0.2`
   - 当前实现：`0 1px 4px rgba(0,0,0,0.18)`
   - 不匹配属性点：`y / blur / alpha`（3个）
   - 证据：`src/component/Slider/Slider.css`
6. **S-06（Value 刻度文案行高）**
   - DSL 期望：`line-height: 12px`（Caption 文本）
   - 当前实现：`line-height: 11px`
   - 证据：`src/component/Slider/Slider.css`
7. **S-07（Bubble 主体圆角）**
   - DSL 期望：气泡主体大圆角（对应 DSL `18`）
   - 当前实现：`border-radius: 4px`
   - 证据：`src/component/Slider/Slider.css`

### 4.3 变体属性不匹配（1项）

1. **V-01（状态命名）**
   - DSL 期望：`Enabled / Hover / Focus / Active / Disabled`
   - 当前实现：`default / hover / focus / active / disabled`
   - 结论：语义可映射，但严格拉表命名存在 `Enabled != default` 的差异
   - 证据：`src/component/Slider/Slider.tsx`、`src/component/Slider/SliderSeekbar.tsx`

## 5. 结论

当前 Slider 组件**部分符合**设计稿规范：结构与主要布局框架基本对齐，但资源规范、阴影与若干关键视觉参数仍有明显偏差。依据既定权重规则，本次符合度为 **56.35%**，结论为 **未达到高保真交付标准**。  
本报告已补充本轮静态校验识别到的**全量不匹配项**，后续若补充截图像素比对，可继续追加布局类不匹配明细。
