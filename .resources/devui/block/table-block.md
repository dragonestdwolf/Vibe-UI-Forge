# TableBlock

> 表格页面区块，由 `ToolbarBlock` + `Table` + `Pagination` 组合而成，默认状态对齐 Figma 节点 `10743:20021`。

## 1. 适用场景

- 表格页（table-page）：需要工具栏、列表数据、分页和视图切换。
- 工单管理、任务列表、缺陷追踪、需求 Backlog 等业务场景。
- 页面需要稳定复用 `ToolbarBlock` 的筛选/页签/视图切换，并用 `Table` 承载主要数据。

不适用：

- 只有纯表格、没有工具栏和分页时，直接使用 `Table`。
- 页面级布局、侧边栏、详情抽屉不放进 `TableBlock`。

## 2. 源码支撑

```text
devui-playground/src/components/ui/table-block/table-block.tsx
devui-playground/src/components/ui/table-block/table-block.css
devui-playground/src/components/ui/table-block/table-block.stories.tsx
```

默认 props 已内置 Figma 标杆形态：顶部 toolbar、8 行任务数据、checkbox 列、标题标签、状态/处理人筛选列、优先级、操作列和分页。

## 3. 核心 Props

| Prop | 用途 |
|------|------|
| `toolbarProps` | 透传给 `ToolbarBlock`，控制范围选择、页签、主操作、筛选输入、文本操作和视图切换 |
| `tableProps` | 透传给 `Table`，控制尺寸、宽度、空状态、布局等表格行为 |
| `columns` | 表格列配置；不传时使用 Figma 默认任务列表列 |
| `data` | 表格行数据；不传时使用 Figma 默认 8 行任务数据 |
| `paginationProps` | 分页配置，默认 `pageSize: 15`、`totalItems: data.length`、`showJump: true` |
| `currentPage` | 当前页 |
| `totalPages` | 总页数；不传时按 `totalItems / pageSize` 推导 |
| `onPageChange` | 页码变化回调 |
| `onPageSizeChange` | 每页条数变化回调 |

## 4. 可选 / 可隐藏区域

| 区域 | 默认 | 何时隐藏 |
|------|------|----------|
| 工具栏主操作按钮 | 显示 `新建` | 通过 `toolbarProps.primaryAction = null` 隐藏 |
| 临时过滤 | 显示 | 通过 `toolbarProps.temporaryFilterOptions` / 自定义 toolbar 调整 |
| 筛选输入 | 显示 | 通过 `toolbarProps.filterTags`、`filterPlaceholder` 调整内容 |
| 文本操作 | 显示 `表格设置`、`更多` | 通过 `toolbarProps.actions` 隐藏或替换 |
| 视图切换 | 显示列表/树/卡片 | 通过 `toolbarProps.viewModes` 隐藏或替换 |
| 分页跳页输入 | 显示 | 通过 `paginationProps.showJump = false` 隐藏 |
| 默认列 | 显示 | 传入 `columns` 完整替换 |
| 默认数据 | 显示 | 传入 `data` 完整替换 |

## 5. 组合建议

- `TableBlock` 只负责组合，不复制 `ToolbarBlock`、`Table`、`Pagination` 内部 markup。
- 页面生成时优先调整 `toolbarProps`、`columns`、`data`、`paginationProps`，不要 fork 一份新的 table-block。
- 复杂单元格使用 `columns[].formatter`，例如标题标签、超期标签、优先级图标、行操作。
- 单独表格视觉验收使用 `Components/Table` story；完整区块验收使用 `Blocks/TableBlock` story。

## 6. 依赖组件

- `ToolbarBlock` - 工具栏
- `Table` / `Column` - 表格和列定义
- `Pagination` - 分页器
- `ButtonIcon` - 表头、优先级和行操作图标

## 7. Figma 来源

```text
fileKey: VBxWjuXDcxprCHcUFKNF81
nodeId: 10743:20021
nodeName: table-block
```

相关 Component 节点：

```text
Table nodeId: 497:2419
```

## 8. 旧 MiniDevUI 映射

旧 `table-block` 映射到当前 `TableBlock`。
