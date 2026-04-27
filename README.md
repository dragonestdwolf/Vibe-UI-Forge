# Vibe UI Forge ｜ 符合特定设计规范的UI生成工具

本项目提供了一套基于 shadcn/ui 的 UI 开发工作流，让人可以使用 shadcn SKILL，结合项目中的设计规范资源，生成符合规范的 UI 界面。

## 项目概述

本项目包含 skill 内容和两个设计规范的 UI playground

### shadcn SKILL

项目集成了 shadcn SKILL，提供组件选择、代码生成、样式规范等能力。

详细 SKILL 说明请参考：[.agent/skills/shadcn/SKILL.md](./.agent/skills/shadcn/SKILL.md)

### 规范资源与生成物

| 项目 | 设计规范 | 说明 |
|------|----------|------|
| `devui-playground` | devui | devui风格组件的 playground  |
| `harmony-ui-playground` | Harmony | Harmony 风格组件的 playground |

其中 `harmony-ui-playground` 的运行时 token 命名空间统一为 `--harmony-*`。

设计资源&生成物的项目目录结构（harmony-ui-playground 为例）

```
harmony-ui-playground/
├── .storybook/           # Storybook 配置
├── src/
│   ├── component/        # 组件目录（统一维护）
│   ├── blocks/           # Block 页面模板
│   ├── styles/           # 设计 token（harmony-token.css）
│   ├── stories/          # 组件预览 stories
│   ├── lib/              # 工具函数
│   └── App.tsx           # 应用入口
├── components.json       # shadcn 配置
└── package.json
```

## 使用方式

在本项目中，你可以结合 shadcn SKILL 和项目中的设计规范资源，生成符合规范的 UI 界面。

### 使用示例

向 Agent 输入以下 prompt 即可生成 UI 页面：

```
在 harmony-ui-playground 生成一个鸿蒙风格的设置页到 app.tsx，使用 shadcn SKILL，根据 SKILL 参考并使用项目中的样式、component、blocks 资源。
```

或更详细的版本：

```
在 harmony-ui-playground 生成一个鸿蒙风格的设置页到 app.tsx，使用 .agent/skills/shadcn 这个 SKILL，根据 SKILL 参考并使用项目中的样式、component、blocks 资源。
```

### 生成流程

1. **分析需求** - SKILL 会分析你的需求，执行 workflow
2. **参考资源** - 使用项目中的 design token、组件、blocks 作为参考
3. **生成代码** - 生成符合规范的 UI 页面代码
4. **预览验证** - 启动 storybook 预览效果

## 页面渲染工作流

当用户描述页面需求时，系统通过以下步骤生成 UI 代码：

```
用户输入 (Prompt / Figma Design)
    │
    ▼
Step 0: 项目上下文
    ├── 读取 components.json          → aliases、组件路径
    ├── 读取 src/index.css            → Tailwind 主题映射
    └── 读取设计系统 token 文件（如 src/styles/harmony-token.css） → 设计 Token
    │
    ▼
Step 1: 路由匹配
    └── 读取 .resources/{ds}/route-index.md
        → 输出 page_type (table-page | form-page | card-workbench-page)
    │
    ▼
Step 2: 布局解析
    └── 读取 .resources/{ds}/layout/{page_type}.md
        → 输出 layout_skeleton、needed_components、reference_blocks
    │
    ▼
Step 3: 源码锚定
    ├── 读取 src/components/ui/*/*.tsx    → 组件源码
    ├── 读取 src/components/ui/*/*.css    → 组件样式
    └── 读取 src/**/*.stories.tsx         → Storybook 预览
    │
    ▼
Step 4: 页面生成
    ├── 按照 shadcn 规范生成 TSX
    └── 使用 design token 样式
    │
    ▼
Step 5: 验证
    ├── npm run build              → 构建验证
    └── npm run build-storybook    → Storybook 验证
```

## 关键文件索引

### 资源层 (.resources/)

| 文件路径 | 作用 |
|---|---|
| `.resources/{ds}/route-index.md` | 页面类型路由规则 |
| `.resources/{ds}/blocks.json` | Block 索引 (id → source/stories/dependencies) |
| `.resources/{ds}/layout/{page_type}.md` | 布局模板和 Slot 规则 |

### 组件层 (devui-playground/src/components/ui/)

| 组件 | 类型 | 说明 |
|---|---|---|
| `table-shell-frame/` | Layout Shell | 表格页容器框架 |
| `table-block/` | Block | ToolbarBlock + Table + Pagination 组合 |
| `toolbar-block/` | Block | 页面操作条 (搜索、筛选、导出) |
| `sidebar-nav/` | Block | 侧边导航 |
| `accordion-nav/` | Block | 可展开配置分组导航 |
| `tree-nav/` | Block | 树形导航 |
| `form-shell-frame/` | Layout Shell | 表单页容器框架 |
| `table/` / `pagination/` | Component | 表格、分页器 |

### Token 与配置

| 文件路径 | 作用 |
|---|---|
| `devui-playground/src/styles/devui-tokens.css` | 设计 Token (CSS Variables) |
| `devui-playground/src/index.css` | Tailwind v4 @theme inline 主题映射 |
| `devui-playground/components.json` | shadcn CLI 配置 (aliases、paths) |
| `.agent/skills/shadcn/SKILL.md` | AI 代码生成规范 |

## 快速开始

### 安装依赖

```bash
# devui-playground
cd devui-playground
npm install

# harmony-ui-playground
cd harmony-ui-playground
npm install
# 或使用 pnpm
cd harmony-ui-playground
pnpm install
```

### 运行项目

```bash
# devui-playground
cd devui-playground
npm run dev          # 启动应用页面
npm run storybook    # 启动组件预览（端口 6006）

# harmony-ui-playground
cd harmony-ui-playground
npm run dev          # 启动应用页面
npm run storybook    # 启动组件预览（端口 6006）
```

## 规范资源维护文档

详细的资源维护、预览环境等文档，请参考 `docs/`

## 相关资源

- shadcn/ui 官方文档：https://ui.shadcn.com
- shadcn SKILL：`.agent/skills/shadcn/SKILL.md`
