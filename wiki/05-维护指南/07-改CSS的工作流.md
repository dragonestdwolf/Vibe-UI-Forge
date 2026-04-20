# 07 · 改 CSS 的工作流

> 当需求只是视觉变化时，不要急着改组件，更不要急着改页面。先试试 CSS / Token 层能不能解决。

---

## 这类改造解决什么问题

视觉层的改造需求 — 颜色、圆角、间距、字体、阴影等，只需要改变量或调整 className 就能达成，不需要触及组件结构或页面布局。

---

## 什么时候应该进入这一层

| 需求 | 属于 CSS 层？ |
|------|--------------|
| 把主色从灰蓝改成品牌蓝 | ✅ |
| 把圆角从 lg 调小到 md | ✅ |
| 调整页面局部间距 | ✅ |
| 改 dark mode 的背景色 | ✅ |
| 改某个页面宽度或对齐方式 | ✅ |
| 给按钮新增一个 brand variant | ❌ → Component 层 |
| 想让 Select 变成 Input + Button 组合 | ❌ → Component 层 |
| 登录页从单栏改成双栏 | ❌ → Page / Block 层 |

---

## 什么时候不该进入这一层

- 需求已经涉及组件结构变化（新增 slot、改变组合方式）
- 视觉变化超出了 CSS 变量的表达能力（比如需要不同的交互行为）
- 想改变页面布局结构（这已经进入 Page / Block 层）

---

## 标准工作流

```
① 判断：这是不是纯视觉变化？
    ↓ 是
② 尝试：先改 CSS 变量（全局颜色/圆角/风格）
    ↓ 变量不够或不适合
③ 再试：改 className 做布局微调（间距/宽度/对齐）
    ↓ className 不够
④ 升级：考虑改 variant 或封装业务组件（→ Component 层）
```

---

## CSS / Token 层改造的三个入口

shadcn 的视觉真值流向是单向的：

```
CSS 变量 → Tailwind utilities → 组件
```

所以从浅到深有三个入口：

### 入口 1：改 CSS 变量（最深，影响最广）

改 `globals.css` 里的 CSS 变量，所有引用这些变量的组件会自动同步变化。

```css
/* globals.css */
:root {
  --primary: oklch(0.205 0 0);       /* 改这里，全局 primary 按钮都会变 */
  --radius: 0.5rem;                   /* 改这里，所有组件圆角都会变 */
}
```

**适用场景**：全局颜色、全局圆角、全局风格基调。

### 入口 2：改 className 做局部布局（最浅，只影响当前元素）

用 Tailwind className 调整单个元素的位置、尺寸、间距，不动变量。

```tsx
<Card className="mx-auto max-w-md mt-8">
  {/* 只改当前卡片的布局，不影响其他 Card */}
</Card>
```

**适用场景**：局部间距调整、宽度限制、居中处理。

### 入口 3：改或新增 variant（影响特定组件类型）

通过 cva 在组件源码里新增或修改 variant 样式。

```tsx
// components/ui/button.tsx
warning: "bg-warning text-warning-foreground hover:bg-warning/90",
```

**适用场景**：已有组件需要新增一个预设样式组合。

---

## AI 默认修改范围

AI 在 CSS / Token 层的默认修改顺序：

1. `globals.css` 里的 CSS 变量定义
2. 当前页面或组件上的 `className`
3. 已有 variant 的样式参数

**默认禁区**：除非明确授权，否则不修改组件结构、不改 page 布局、不新增组件封装。

---

## 本地项目改造时如何与 Agent 协作

### 设计师怎么说

```
这是本地项目改造，不是做可分发组件。
请优先改我项目里的 globals.css 和当前页面样式，不要进入 registry 结构。
```

### Agent 应该怎么做

1. 读取 `components.json`，找到 `tailwindCssFile`（通常是 `globals.css`）
2. 优先改 CSS 变量 / Tailwind 语义颜色（`--primary`、`--background` 等）
3. 必要时改当前页面或当前组件上的 `className`
4. **不进入** registry 结构，不改组件源码

---

## 可分发资源改造时如何与 Agent 协作

### 设计师怎么说

```
这不是本地页面微调，而是要做成可分发的样式资源。
请改 registry/style 侧的真值来源，并说明构建后会影响哪些安装方。
```

### Agent 应该怎么做

1. 找到 registry 中的样式源定义
2. 修改样式真值来源（不是直接改演示页的 className）
3. 补齐 registry style 的构建产物链路
4. 说明改动会影响哪些下游项目

---

## 什么时候 AI 必须先确认

- 只改 CSS 变量无法达成目标，需要进入 component 层
- 改动会影响多个页面的全局主题
- 需要新增一套 variant 或样式变体
- 需要从局部视觉微调升级成布局重排

---

## 给 AI 的推荐指令模板

```text
我要改什么：把 [具体组件/页面] 的 [颜色/间距/圆角] 从 [现状] 改成 [目标]
这属于哪一层：CSS / Token 层
优先改哪里：globals.css 变量 / 当前组件 className
不要碰什么：不要改组件结构，不要改 page 布局
改完后怎么汇报：列出改了哪些变量/样式，影响了哪些地方
```

---

## 一个真实案例

**需求**：把 dashboard 的主色从灰蓝调成品牌蓝。

**AI 执行**：
1. 改 `globals.css` 里的 `--primary` 变量值
2. 不改任何组件源码（Button 等组件自动响应）
3. 确认影响范围：所有使用 `bg-primary`、`text-primary-foreground` 的组件都会被影响

**结果**：一行 CSS 变量改动，全局生效。

---

## 常见误区

| 误区 | 正确做法 |
|------|---------|
| 只是想换颜色，却去改组件结构 | 优先改 CSS 变量 |
| 只想让登录框宽一点，却去重写 block | 用 className 局部调整 |
| 用硬编码 Tailwind 值覆盖 token | 用语义变量，保持全局一致性 |
| dark mode 用 `dark:` 硬编码颜色 | 用语义变量（`bg-background` 等），CSS 变量自动处理 dark mode |
| 为了换颜色去新建重复组件 | 先尝试改 CSS 变量或新建 variant |

---

## 验收清单

- [ ] 视觉结果是否达到预期（颜色/间距/圆角）
- [ ] 影响范围是否符合预期（是否意外影响了其他页面）
- [ ] 是否误伤了其他组件（检查同色系的其他组件）
- [ ] AI 有没有偷偷把视觉问题升级成结构问题（新增组件、改变 DOM 结构）
- [ ] dark mode 是否也同步正确（如果涉及颜色改动）
- [ ] 是否保持了语义颜色原则（用了 `bg-primary` 而不是 `bg-blue-500`）
