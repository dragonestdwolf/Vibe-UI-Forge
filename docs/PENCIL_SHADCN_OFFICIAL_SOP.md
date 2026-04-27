# Pencil 官方接入 shadcn 路径 SOP

本文将 Pencil 官方文档里关于 `Design ↔ Code`、`Variables`、`Design Libraries`、`.pen Format` 的能力，整理成一份可执行的 SOP，重点说明：

- Pencil 官方如何接入 `shadcn/ui`
- 如何把现有 `shadcn` 代码导入 Pencil
- 如何从 Pencil 生成 `shadcn` 风格代码
- 如何建立后续的双向同步工作流

相关官方文档：

- `Design ↔ Code`: <https://docs.pencil.dev/design-and-code/design-to-code>
- `Variables`: <https://docs.pencil.dev/core-concepts/variables>
- `Design Libraries`: <https://docs.pencil.dev/core-concepts/design-libraries>
- `.pen Format`: <https://docs.pencil.dev/for-developers/the-pen-format>
- `Components`: <https://docs.pencil.dev/core-concepts/components>

## 1. 核心结论

Pencil 官方接入 `shadcn/ui` 的路径，不是“安装一个 shadcn 渲染器”，而是通过 AI 驱动的 `Design ↔ Code` 工作流来完成：

1. 把 `.pen` 文件和代码放在同一个 workspace
2. 在 Pencil 中通过 AI 读取现有 React / shadcn 代码，并视觉重建到 `.pen`
3. 把沉淀下来的设计组件做成 Pencil reusable components 和 design libraries
4. 在导出代码时，通过 prompt 明确要求使用 `shadcn/ui`、Tailwind、Lucide 等技术栈
5. 通过 CSS variables 和 Pencil variables 做 token 同步

本质上是：

`shadcn code <-> AI understanding <-> Pencil native design nodes`

不是：

`Pencil 直接运行 React / shadcn runtime`

## 2. 前置准备

### 2.1 仓库组织

确保 `.pen` 文件与前端代码位于同一个项目 workspace 中。官方推荐类似结构：

```text
my-project/
├── src/
│   ├── components/
│   └── styles/
├── design.pen
└── package.json
```

这样做的好处：

- AI agent 能同时访问设计文件和代码
- Git 可以同时追踪 `.pen` 和源码
- 便于后续做双向同步

### 2.2 代码前提

建议项目中具备以下内容：

- `package.json`
- `src/components/**` 或业务组件目录
- `src/styles/**` 或 `globals.css`
- `components.json`（如果是 shadcn 项目）
- Tailwind 配置或 Tailwind CSS 入口
- CSS variables 或设计 token 文件

### 2.3 设计文件前提

最小准备：

- `design.pen`：页面或组件设计文件

推荐准备：

- `components.lib.pen`：设计系统组件库文件

## 3. 建立 Token 基线

在做组件导入前，先同步变量。官方文档明确支持：

- 从 CSS 导入 variables 到 Pencil
- 从 Pencil variables 回写 CSS variables

### 3.1 从代码导入变量到 Pencil

步骤：

1. 打开 `.pen` 文件
2. 按 `Cmd/Ctrl + K`
3. 输入 prompt

推荐 prompt：

```text
Create Pencil variables from my globals.css
Import design tokens from src/styles/tokens.css
Create Pencil variables from src/index.css
```

### 3.2 检查同步结果

确认以下设计 token 已进入 Pencil variables：

- colors
- spacing
- border radius
- font family
- font size

### 3.3 后续回写代码

当你在 Pencil 中调整变量后，可用：

```text
Update globals.css with these Pencil variables
Sync these design tokens to my CSS
```

## 4. 从现有 shadcn / React 代码导入 Pencil

这是官方接入现有组件最关键的一步。

官方文档对 `Code → Design` 的表述是：

- Pencil can recreate them visually
- 导入的是组件结构、层级、布局、样式

### 4.1 操作步骤

1. 打开目标 `.pen` 文件
2. 按 `Cmd/Ctrl + K`
3. 让 AI 读取现有组件源码并导入到设计

### 4.2 推荐 prompt

单个基础组件：

```text
Recreate the Button component from src/components/ui/button.tsx
Recreate the Card component from src/components/ui/card.tsx
Import the Dialog from src/components/ui/dialog.tsx into this design
```

业务组件：

```text
Import the LoginForm from my codebase into this design
Add the Header component from src/layouts/Header.tsx
Recreate this shadcn Card visually from src/components/ui/card.tsx
```

如果你要明确告诉 Pencil 你的技术栈：

```text
Import this component from my React codebase and preserve the shadcn/ui structure
Recreate this component visually using my existing shadcn/ui implementation as reference
```

### 4.3 导入后应重点检查

导入成功后，不要只看像不像，要重点检查：

- 组件层级是否合理
- 主体布局是否正确
- 间距和对齐是否接近代码实现
- 颜色、字体、圆角是否匹配
- 图标是否使用了合适的视觉替代

## 5. 把导入结果沉淀为 Pencil 组件

官方虽然没有把这一步专门命名为“shadcn library ingestion”，但根据 Pencil 组件与设计库机制，这就是标准后续动作。

### 5.1 转成 reusable component

步骤：

1. 在画布中选中一个已经稳定的设计组件
2. 使用快捷键 `Cmd/Ctrl + Option/Alt + K`
3. 确认其已经转为 reusable component

适合先沉淀的组件类型：

- Button
- Card
- Input
- Label
- Dialog Header
- Form Row
- List Item
- Title Bar

### 5.2 命名规范

建议在 Pencil 中统一命名：

- 组件名
- 内部 slot 名
- 可覆盖文本层
- 变体实例名

命名清晰后，后续实例覆盖和双向同步会稳定很多。

## 6. 建立 Pencil 设计库

官方支持将一份 `.pen` 文件变为 Design Library。

### 6.1 创建设计库

步骤：

1. 新建一个 `.pen` 文件
2. 放入已经沉淀好的 reusable components
3. 在左侧 Layers 面板中点击 `Libraries`
4. 点击 `Turn this file into a library`

设计库文件建议使用：

```text
components.lib.pen
```

### 6.2 在其他设计文件中复用

步骤：

1. 打开目标 `.pen`
2. 在 Libraries 面板中导入该设计库
3. 在 Assets 面板中使用组件实例

这样后续更新组件库时，实例可同步受益。

## 7. 从 Pencil 导出 shadcn 风格代码

这是官方 `Design → Code` 的标准路径。

### 7.1 操作步骤

1. 打开 `.pen` 文件
2. 选中目标 frame / component
3. 按 `Cmd/Ctrl + K`
4. 明确要求输出为 React + Tailwind + shadcn

### 7.2 推荐 prompt

组件导出：

```text
Generate code using Shadcn UI components
Create a React component for this button using shadcn/ui
Export this card as a reusable component with Tailwind CSS and shadcn/ui
```

页面导出：

```text
Generate a Next.js page from this design using shadcn/ui
Create this layout with React, Tailwind CSS, and shadcn/ui
Export this dashboard as a React component using Lucide icons
```

### 7.3 官方建议的技术栈显式声明

如果你不说清楚，AI 可能不会自动按你的栈输出。建议在 prompt 里始终明确：

- framework
- styling
- component library
- icon library

例如：

```text
Generate Next.js 14 code with Tailwind CSS
Use shadcn/ui components for this layout
Generate this design using Lucide icons
```

## 8. 建立双向同步工作流

官方文档给出的双向同步思路是：

1. Start with code
2. Import existing components into Pencil
3. Make design changes in Pencil
4. Apply changes back to code
5. Iterate

### 8.1 推荐工作模式

#### 模式 A：新功能

1. 在 Pencil 中先设计
2. 生成初始 shadcn 代码
3. 在代码中做工程化细化
4. 如有视觉调整，再回 Pencil 更新

#### 模式 B：已有功能改版

1. 从现有 React/shadcn 代码导入 Pencil
2. 在 Pencil 中做视觉优化
3. 让 AI 把改动应用回代码

### 8.2 推荐回写 prompt

```text
Apply these visual changes back to src/components/ui/button.tsx
Update my shadcn Card component to match this Pencil design
Sync these design changes back to the React code using shadcn/ui
Update globals.css with these Pencil variables
```

## 9. 针对 shadcn 的实际理解

这里需要非常明确：

### 9.1 Pencil 支持 shadcn 的方式

Pencil 对 `shadcn/ui` 的支持，官方路径是：

- 在导出代码时，把 shadcn 作为目标组件库
- 在导入代码时，把你现有的 shadcn 组件视觉重建为 Pencil 设计

### 9.2 它不是什么

它不是：

- 在 Pencil 内部直接运行 React 组件
- 让 `.pen` 原生调用 `shadcn` runtime
- 原样执行 hooks、状态机、交互逻辑

### 9.3 它是什么

它是：

- 从 React / shadcn 中提取视觉结构
- 在 Pencil 中重建对应设计节点
- 再从 Pencil 生成符合你技术栈的代码

## 10. 推荐落地顺序

如果你要把这条官方路径落到自己的项目里，建议按下面顺序执行：

1. 建立 `design.pen`
2. 导入 CSS variables
3. 从代码导入一批基础 shadcn 组件
4. 把稳定组件转成 Pencil reusable components
5. 建立 `components.lib.pen`
6. 以后页面都从设计库拖实例
7. 页面完成后再导出 `shadcn/ui` 代码
8. 视觉调整时使用 `Code → Design -> tweak -> Design → Code` 循环

## 11. 最小可执行模板

### 11.1 准备

```text
my-project/
├── src/
│   ├── components/
│   └── styles/
├── design.pen
├── components.lib.pen
└── package.json
```

### 11.2 初始化 prompt

```text
Create Pencil variables from src/styles/globals.css
Recreate the Button component from src/components/ui/button.tsx
Recreate the Card component from src/components/ui/card.tsx
Use shadcn/ui components for this layout
Generate this design using Lucide icons
```

### 11.3 回写 prompt

```text
Update the React code to match this design using shadcn/ui
Sync these design tokens back to globals.css
```

## 12. 一句话总结

Pencil 官方接入 shadcn 的 SOP 可以概括为：

**同仓放置 `.pen` 与代码 -> 导入 CSS variables -> 用 AI 把现有 shadcn 组件视觉重建到 Pencil -> 把稳定设计沉淀为 reusable components 和 `.lib.pen` 设计库 -> 再通过 prompt 指定 `shadcn/ui` 做代码导出与回写。**
