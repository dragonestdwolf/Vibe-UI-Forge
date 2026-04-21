# 03 | layout markdown 模板

> layout markdown 定义某个 `page_type` 的页面骨架、参考 Block、插槽规则和生成约束。它是 Page / Layout 的 how to use 说明，不是页面源码本身。

---

## 1. 文件位置

```text
.resources/{system}/layout/{page_type}.md
```

---

## 2. 模板

````markdown
# Layout: {page_type}

## purpose

这个 layout 适合什么页面、解决什么类型的需求。

## hit_rules

- 这个布局适合哪些页面或意图

## exclusion_rules

- 哪些页面不应该命中这个布局

## layout_source

| 类型 | 路径 | 说明 |
|---|---|---|
| runtime | src/layouts/{LayoutName}.tsx | layout 的真实运行实现，如项目存在 |
| story | src/layouts/{LayoutName}.stories.tsx | layout 的 Storybook 预览，如项目存在 |

## reference_blocks

- block-id-1
- block-id-2

## needed_components

- component-id-1
- component-id-2

## layout_skeleton

```html
<main>
  <header data-slot="header"></header>
  <section data-slot="hero"></section>
  <section data-slot="content"></section>
  <aside data-slot="side-panel"></aside>
</main>
```

## slots

| slot | 默认 Block | 可替换 Block | 是否必需 | 说明 |
|---|---|---|---|---|
| header | app-header | app-header / compact-header | 是 | 页面顶部导航或标题区域 |
| hero | dashboard-summary | dashboard-summary / metrics-overview | 否 | 首屏概览区域 |
| content | settings-list | settings-list / data-table / card-grid | 是 | 页面主体内容 |
| side-panel | help-panel | help-panel / activity-panel | 否 | 右侧辅助信息 |

## visibility_rules

| 区域 | 默认 | 何时隐藏 |
|---|---|---|
| header | 显示 | 嵌入式弹窗、局部容器预览时可隐藏 |
| hero | 显示 | 页面不需要概览信息时可隐藏 |
| side-panel | 隐藏 | 需要辅助说明、活动记录或筛选条件时显示 |

## composition_mapping

| Layout 区域 | Block / Component | 说明 |
|---|---|---|
| header | app-header | 页面标题、返回、操作入口 |
| content | settings-list | 主信息列表 |
| side-panel | help-panel | 辅助说明 |

## generation_constraints

- 优先复用 `reference_blocks` 中的 Block
- 不能把 `src/render/**` 注册为 reference block
- 必需 slot 不可删除；可选 slot 可以按 `visibility_rules` 隐藏
- 替换 Block 时只能使用 `slots` 中列出的候选项
````

---

## 3. 字段说明

| 字段 | 作用 |
|---|---|
| `purpose` | 说明这个 layout 的适用场景 |
| `hit_rules` | 说明哪些用户意图应该命中这个 layout |
| `exclusion_rules` | 说明哪些意图必须排除，避免误匹配 |
| `layout_source` | 指向 layout 背后的真实源码或 Storybook 预览，如项目存在 |
| `reference_blocks` | 推荐优先复用的稳定 Block |
| `needed_components` | 这个页面类型常用或必需的 Component |
| `layout_skeleton` | 页面结构骨架，只表达层级和区域 |
| `slots` | 页面可替换区域，以及每个区域允许使用哪些 Block |
| `visibility_rules` | 哪些区域可以隐藏、默认是否显示、隐藏条件是什么 |
| `composition_mapping` | layout 区域和具体 Block / Component 的对应关系 |
| `generation_constraints` | 页面生成时必须遵守的约束 |

---

## 4. 审核点

- `reference_blocks` 都存在于 `blocks.json`
- `needed_components` 都存在于 `components.json`
- `layout_skeleton` 只表达结构，不写成逐像素设计稿
- `slots` 里的默认 Block 和可替换 Block 都真实存在
- `visibility_rules` 能让 AI 知道哪些区域可以关闭或隐藏
- `layout_source` 指向的源码或 story 路径真实存在，如项目采用源码支撑 Layout
- `generation_constraints` 是生成必须遵守的规则，不写模糊偏好
