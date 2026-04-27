# Table Component Usage

`Table` 是 DevUI 表格组件，配合 `Column` 定义列。

## Source

```text
devui-playground/src/components/ui/table/table.tsx
devui-playground/src/components/ui/table/column.tsx
devui-playground/src/components/ui/table/table.css
devui-playground/src/components/ui/table/table.stories.tsx
```

## Benchmark

[html/component/table-benchmark.html](file://html/component/table-benchmark.html)

**Figma Source**

```text
fileKey: VBxWjuXDcxprCHcUFKNF81
nodeId: 497:2419
nodeName: table
```

## Core Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | `Record<string, unknown>[]` | `[]` | 表格数据 |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"sm"` | 尺寸 |
| `striped` | `boolean` | `false` | 斑马纹 |
| `borderType` | `""` \| `"bordered"` \| `"borderless"` | `""` | 边框类型 |
| `checkable` | `boolean` | `false` | 表格级勾选 |
| `rowHoveredHighlight` | `boolean` | `true` | 行悬停高亮 |
| `fixHeader` | `boolean` | `false` | 固定表头 |
| `tableLayout` | `"fixed"` \| `"auto"` | `"fixed"` | 表布局 |
| `empty` | `ReactNode` | `"No Data"` | 空状态 |
| `rowKey` | `string \| function` | `"id"` | 行唯一标识 |

## Column Props

| Prop | 类型 | 说明 |
|------|------|------|
| `type` | `"checkable"` \| `"index"` \| `"expand"` \| `""` | 列类型 |
| `field` | `string` | 数据字段 |
| `header` | `ReactNode \| function` | 表头内容 |
| `width` | `number \| string` | 列宽 |
| `minWidth` | `number \| string` | 最小列宽 |
| `sortable` | `boolean` | 可排序 |
| `filterable` | `boolean` | 可筛选 |
| `filterList` | `FilterConfig[]` | 筛选选项 |
| `align` | `"left"` \| `"center"` \| `"right"` | 对齐 |
| `fixedLeft` | `string` | 左侧固定 |
| `fixedRight` | `string` | 右侧固定 |
| `childrenRenderer` | `function` | 自定义单元格渲染 |

## Cell Renderer

使用 `childrenRenderer` 渲染复杂单元格内容（如 Tag、图标）：

```tsx
<Column
  field="title"
  header="标题"
  childrenRenderer={({ row }) => (
    <div className="cell-content">
      <Tag size="md" tagStyle="fill" color="green">{row.type}</Tag>
      <span>{row.title}</span>
    </div>
  )}
/>
```

## Icons

项目使用 `ButtonIcon` 统一承载表格图标，不直接引入外部图标包。

### ButtonIcon 映射

| Figma Icon | ButtonIcon name | 用途 |
|------------|-------------|------|
| Sort3 | `arrow-up-down` | 排序指示器 |
| FilterO | `filter` | 筛选按钮 |
| TreeExpand | `chevron-right` | 树形展开 |
| PriorityFlag | `flag` | 优先级 (按颜色区分高/中/低) |
| CodehubOpEdit | `pencil` | 编辑 |
| CodehubCollection | `star` | 收藏 |
| More2 | `more-horizontal` | 更多 |

## 设计要素（来自 Benchmark）

| 要素 | 规格 |
|------|------|
| 表头行高 | 42px |
| 数据行高 | 42px |
| 表头字号 | 12px, Bold (700) |
| 数据行字号 | 14px, Regular (400) |
| 行高 | 22px |
| 边框色 | `var(--devui-dividing-line, #dfe1e6)` |
| 表头背景 | `var(--devui-base-bg, #ffffff)` |
| 行悬停背景 | `var(--devui-list-item-hover-bg, #f2f5fc)` |

## 实现状态

| 功能 | 状态 | 说明 |
|------|------|------|
| 基础表格 | ✅ | 已实现 |
| 排序 | ✅ | 使用 `ButtonIcon name=\"arrow-up-down\"` |
| 筛选 | ✅ | 使用 `ButtonIcon name=\"filter\"` |
| 勾选 | ✅ | 已实现 |
| 固定列 | ✅ | 支持 fixedLeft/fixedRight |
| 树形展开 | ✅ | 使用 `ButtonIcon name=\"chevron-right\"` |
| Tag 渲染 | ⚠️ | 需通过 childrenRenderer |
| Sort SVG | ✅ | 已替换为 ButtonIcon |
| Filter SVG | ✅ | 已替换为 ButtonIcon |
| TreeExpand SVG | ✅ | 已替换为 ButtonIcon |
| PriorityFlag | ✅ | 通过 `ButtonIcon name=\"flag\"` + formatter 实现 |
| Actions 按钮组 | ✅ | 通过 formatter + `ButtonIcon` 实现 |

## Generation Notes

- 表格应放在 `TableShellFrame` 的 `children` 中
- 查询条件和批量操作应放在 `ToolbarBlock` 或独立筛选区
- 复杂单元格内容（Tag、图标组）使用 `childrenRenderer`
- 样式优先使用 devui token
