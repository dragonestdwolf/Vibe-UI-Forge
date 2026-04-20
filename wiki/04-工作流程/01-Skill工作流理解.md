# 01 | Skill 工作流理解

> 这一篇帮助你理解 Design System Skill 的完整工作流程。

---

## 什么时候走这个流程？

当你需要：
- 理解 Design System Skill 是如何工作的
- 知道 AI 在每一步做了什么

---

## 完整路径（5 步工作流）

```
用户输入 / Figma Design
    ↓
Step 0: Project Context
    读 components.json
    读 src/index.css / tokens.css
    ↓
Step 1: Route Matching
    读 route-index.md
    输出 page_type
    ↓
Step 2: Layout Resolution
    读 layout/{page_type}.md
    输出 layout_skeleton + needed_components
    ↓
Step 3: Source Grounding
    读 src/blocks/*.tsx
    读 src/component/*.tsx
    ↓
Step 4: Page Generation
    生成 TSX/CSS/stories
    ↓
Step 5: Validation
    npm run build
    npm run build-storybook
```

---

## 每一步谁做什么

🤖 = AI 独立完成
👤 = 设计师独立完成
🤝 = AI 和设计师协作

### Step 0: Project Context

🤖 AI 读取项目配置和设计 token

### Step 1: Route Matching

🤖 AI 识别页面类型

### Step 2: Layout Resolution

🤖 AI 推导布局骨架和所需组件

### Step 3: Source Grounding

🤖 AI 读取源码文件

### Step 4: Page Generation

🤖 AI 生成页面代码

### Step 5: Validation

🤖 AI 运行构建验证

---

## 核心工具

### route-match — 路由匹配

**做什么：** 读取 route-index.md，识别页面类型

**输出物：** page_type

### layout-resolve — 布局解析

**做什么：** 读取 layout/{page_type}.md，推导布局

**输出物：** layout_skeleton + needed_components

### source-ground — 源码 grounding

**做什么：** 读取源码文件，获取组件实现

**输出物：** 组件源码引用

---

## 待补充内容

- 每一步详细说明
- 各工具职责
- 真实源码来源说明
- markdown 默认读取规则
