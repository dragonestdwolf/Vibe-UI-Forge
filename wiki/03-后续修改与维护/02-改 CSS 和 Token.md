# 02 | 改 CSS 和 Token

> 当需求只是视觉变化时，优先从 CSS / Token 层解决。
> 这一层改的是样式真值，影响的是全局视觉一致性。

---

## 开头三问

**什么时候改这一层？**

当需求只涉及视觉值变化，不涉及组件 API 或页面结构时：改颜色、改圆角、改间距、改字体字号、调整暗色模式。

**设计师只需要做什么？**

修改前说明修改范围（哪个组件、什么视觉变化）。修改后在 Storybook 中检查视觉是否符合预期。

**Agent 会自动做什么？**

定位 token 文件、执行修改、跑质量门禁、说明影响范围。

---

## 1. 适合这一层的需求

| 需求 | 是否适合 CSS / Token 层 |
|---|---|
| 改主色、背景色、文字色 | 是 |
| 改圆角、阴影、分隔线 | 是 |
| 调整全局间距、字号、字体 | 是 |
| 调整暗色模式 token | 是 |
| 新增 Button 结构 | 否，进入 Component 层 |
| 页面从单栏变双栏 | 否，进入 Page / Block 层 |
| 组件需要新增 variant 或状态 | 否，进入 Component 层 |

---

## 2. 两个文件的关系：真值层 + 消费层

CSS / Token 层涉及两个文件，它们是**真值**和**消费分发**的关系：

```
src/styles/{theme}-tokens.css     ← 真值层（token 定义）
src/index.css                   ← 消费层（引入 token，映射给 Tailwind）
```

| 文件 | 职责 | 什么时候改 |
|---|---|---|
| `src/styles/{theme}-tokens.css` | 真值层 — 所有 design token 的原始定义 | 改颜色、间距、圆角、阴影、字号等 token 值，**优先改这里** |
| `src/index.css` | 消费层 — 引入 token 并映射给 Tailwind | 只有在新增 token 映射规则、调整 `@theme inline` 映射、修改 `@layer base` 全局样式时才改 |

关系链路：

```
{theme}-tokens.css（真值）
    ↓ @import
index.css（消费分发）
    ↓ @theme inline
Tailwind 组件（消费 --devui-* token）
```

---

## 3. 判断示例

| 需求 | 判断结果 | 原因 |
|---|---|---|
| 把主色从蓝色改成绿色 | CSS / Token | 只是 token 值变化 |
| 所有按钮的圆角统一改成 8px | CSS / Token | 全局 token 调整 |
| 标题字号从 16px 改成 18px | CSS / Token | 只是字号 token 变化 |
| 暗色模式下背景色不对 | CSS / Token | 需要调整 dark mode token |
| 需要新增一个 danger variant 的 Button | Component | 改变组件 API，进入 Component 层 |
| 设置页改成三栏布局 | Page / Block | 改变页面结构，进入 Page / Block 层 |

---

## 4. 完整工作流

```
👤 设计师 提出视觉修改需求
    ↓
🤝 双方对齐：确认只改 token，不改组件结构和页面布局
    ↓
🤖 AI 定位 token 文件和变量
    ↓
🤖 AI 执行修改（优先改 {theme}-tokens.css；仅在必要时才改 index.css）
    ↓
🤖 AI 一并处理暗色模式（如涉及）
    ↓
🤖 AI 跑质量门禁验证
    ↓
👤 设计师 在 Storybook 检查视觉结果
    ↓
🤖 AI 说明影响范围（改了哪个 token、影响哪些地方）
```

---

## 5. 执行步骤

### Step 1：定位 token 文件

AI 读取当前主题的 token 文件：

```
src/styles/{theme}-tokens.css
```

找到对应的 CSS 变量，例如 `--color-primary`、`--radius-md`。

如果不确定是哪个 token，先在 `src/index.css` 中确认 layer 顺序和 token 引用方式。

### Step 2：执行修改

只改 token 值，不要在组件里硬编码颜色（如 `style={{ color: '#fff' }}`）或新增不通过 token 的 CSS class。

好做法：

```css
/* 改的是 token，不是组件结构 */
:root {
  --color-primary: #10b981;
}
```

坏做法：

```tsx
/* 不要在组件里硬编码颜色覆盖 token */
<Button style={{ backgroundColor: '#10b981' }}>Save</Button>
```

### Step 3：处理暗色模式

如果涉及暗色模式，一并调整 dark mode 下的 token：

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0f172a;
    --color-foreground: #f8fafc;
  }
}
```

### Step 4：验证

质量门禁三个命令（详见 [05-质量审核与回归验证](./05-质量审核与回归验证.md)）：

```bash
node scripts/validate_design_system_resources.mjs
npm run build
npm run build-storybook
```

---

## 6. 设计师给 AI 的推荐开头

```text
我要调整 [页面/组件] 的 [颜色/间距/圆角/字体/暗色模式]。
这应该优先在 CSS / Token 层解决。
请不要改组件结构，也不要重排页面。
改完后说明影响范围。
```

---

## 7. 验收标准

| 验收项 | 通过标准 |
|---|---|
| 视觉结果 | 颜色、间距、字号、圆角符合设计师预期 |
| token 体系 | 没有用硬编码颜色或间距破坏 token 体系 |
| 暗色模式（如涉及） | 暗色模式下视觉正确 |
| 质量门禁 | 三个验证命令全部通过（详见 [05-质量审核与回归验证](./05-质量审核与回归验证.md)） |

---

## 8. 相关文档

| 想了解 | 去读 |
|---|---|
| 如何判断需求属于哪一层 | [01-先判断应该改哪一层](./01-先判断应该改哪一层.md) |
| 改 Component 的具体做法 | [03-改 Component](./03-改%20Component.md) |
| 改 Page 与 Block 的具体做法 | [04-改 Page 与 Block](./04-改%20Page%20与%20Block.md) |
| 如何验收修改结果 | [05-质量审核与回归验证](./05-质量审核与回归验证.md) |
