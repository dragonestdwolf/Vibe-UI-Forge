import * as React from "react"
import { ButtonIcon } from "@/components/ui/button/button-icon"
import { Pagination } from "@/components/ui/pagination"
import { Table } from "@/components/ui/table"
import { Column } from "@/components/ui/table"
import { ToolbarBlock } from "@/components/ui/toolbar-block"
import type { PaginationProps } from "@/components/ui/pagination"
import type { TableProps } from "@/components/ui/table"
import type { ColumnFormatterColumn } from "@/components/ui/table/types"
import type { ToolbarBlockProps } from "@/components/ui/toolbar-block"
import "./table-block.css"

export type TableBlockToolbarProps = Pick<
  ToolbarBlockProps,
  | "scopeLabel"
  | "scopeOptions"
  | "scopeValue"
  | "tabs"
  | "activeTabId"
  | "primaryAction"
  | "temporaryFilterLabel"
  | "temporaryFilterOptions"
  | "temporaryFilterValue"
  | "filterTags"
  | "filterPlaceholder"
  | "actions"
  | "viewModes"
  | "activeViewModeId"
  | "onTabChange"
  | "onScopeChange"
  | "onTemporaryFilterChange"
  | "onFilterClear"
  | "onFilterSave"
  | "onFilterDirectory"
  | "onViewModeChange"
>

export type TableBlockPaginationProps = Pick<
  PaginationProps,
  "pageSize" | "pageSizeOptions" | "totalItems" | "showJump"
>

export type TableBlockTableProps = Omit<
  TableProps,
  "data" | "children" | "rowKey"
> & {
  rowKey?: TableProps["rowKey"]
}

export interface TableBlockRow {
  id: string
  [key: string]: unknown
}

export interface TableBlockColumn {
  field: string
  header: React.ReactNode
  width?: number | string
  minWidth?: number | string
  sortable?: boolean
  filterable?: boolean
  align?: "left" | "center" | "right"
  formatter?: (
    row: Record<string, unknown>,
    column: ColumnFormatterColumn,
    cellValue: unknown,
    rowIndex: number
  ) => React.ReactNode
}

export type TableBlockProps = {
  className?: string
  toolbarProps?: TableBlockToolbarProps
  tableProps?: TableBlockTableProps
  columns?: TableBlockColumn[]
  data?: TableBlockRow[]
  paginationProps?: TableBlockPaginationProps
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

const defaultTableRows: TableBlockRow[] = [
  {
    id: "1",
    code: "12345678",
    title: "用户唯一无法宁设置会员级别",
    titleTag: "Bug",
    endDate: "--",
    status: "新建",
    assignee: "hw12345678",
    estimatedStartDate: "2025-03-09",
    estimatedEndDate: "2026-02-09",
    overdueTag: "超期9天",
    priority: "中",
  },
  {
    id: "2",
    code: "12345678",
    title: "开发唯一无法显示积分规则界面",
    titleTag: "Bug",
    endDate: "--",
    status: "新建",
    assignee: "hw12345678",
    estimatedStartDate: "--",
    estimatedEndDate: "--",
    priority: "高",
  },
  {
    id: "3",
    code: "12345678",
    title: "作为用户应该可以查看产品列表",
    titleTag: "Story",
    endDate: "--",
    status: "新建",
    assignee: "hw12345678",
    estimatedStartDate: "--",
    estimatedEndDate: "--",
    priority: "低",
  },
  {
    id: "4",
    code: "12345678",
    title: "作为管理员应该可以设置会员级别",
    titleTag: "Story",
    endDate: "--",
    status: "新建",
    assignee: "hw12345678",
    estimatedStartDate: "--",
    estimatedEndDate: "--",
    priority: "低",
  },
  {
    id: "5",
    code: "12345678",
    title: "作为管理员应该可以添加优惠活动",
    titleTag: "Story",
    endDate: "--",
    status: "新建",
    assignee: "hw12345678",
    estimatedStartDate: "--",
    estimatedEndDate: "--",
    priority: "低",
  },
  {
    id: "6",
    code: "12345678",
    title: "作为管理员应该可以添加团购活动",
    titleTag: "Story",
    endDate: "--",
    status: "新建",
    assignee: "hw12345678",
    estimatedStartDate: "--",
    estimatedEndDate: "--",
    priority: "低",
  },
  {
    id: "7",
    code: "12345678",
    title: "作为管理员应该可以添加限时折扣",
    titleTag: "Story",
    endDate: "--",
    status: "新建",
    assignee: "hw12345678",
    estimatedStartDate: "--",
    estimatedEndDate: "--",
    priority: "低",
  },
  {
    id: "8",
    code: "12345678",
    title: "门店网络界面没有显示省份筛选",
    titleTag: "Bug",
    endDate: "--",
    status: "新建",
    assignee: "hw12345678",
    estimatedStartDate: "--",
    estimatedEndDate: "--",
    priority: "低",
  },
]

function HeaderLabel({
  children,
  leadingIcon,
}: {
  children: React.ReactNode
  leadingIcon?: string
}) {
  return (
    <span className="table-block__header-label">
      {leadingIcon ? (
        <ButtonIcon className="table-block__header-icon" name={leadingIcon} />
      ) : null}
      <span>{children}</span>
    </span>
  )
}

function WorkItemTitle({ row }: { row: Record<string, unknown> }) {
  const tag = String(row.titleTag || "")
  const title = String(row.title || "")

  return (
    <span className="table-block__title-cell">
      {tag ? (
        <span
          className={`table-block__type-tag table-block__type-tag--${tag.toLowerCase()}`}
        >
          {tag}
        </span>
      ) : null}
      <span className="table-block__title-text">{title}</span>
    </span>
  )
}

function DateWithState({ row }: { row: Record<string, unknown> }) {
  const date = String(row.estimatedEndDate || "--")
  const overdueTag = String(row.overdueTag || "")

  return (
    <span className="table-block__date-cell">
      <span>{date}</span>
      {overdueTag ? (
        <span className="table-block__overdue-tag">{overdueTag}</span>
      ) : null}
    </span>
  )
}

function PriorityCell({ value }: { value: unknown }) {
  const priority = String(value || "低")
  const priorityClass =
    priority === "高" ? "high" : priority === "中" ? "medium" : "low"

  return (
    <span className="table-block__priority-cell">
      <ButtonIcon
        className={`table-block__priority-icon table-block__priority-icon--${priorityClass}`}
        name="flag"
      />
      <span>{priority}</span>
    </span>
  )
}

function RowActions() {
  return (
    <span className="table-block__row-actions">
      <button aria-label="编辑" className="table-block__row-action" type="button">
        <ButtonIcon name="pencil" />
      </button>
      <button aria-label="收藏" className="table-block__row-action" type="button">
        <ButtonIcon name="star" />
      </button>
      <button aria-label="更多" className="table-block__row-action" type="button">
        <ButtonIcon name="more-horizontal" />
      </button>
    </span>
  )
}

const defaultColumns: TableBlockColumn[] = [
  { field: "code", header: "编号", sortable: true, width: 119 },
  {
    field: "title",
    header: <HeaderLabel leadingIcon="chevron-right">标题</HeaderLabel>,
    sortable: true,
    width: 380,
    formatter: (row) => <WorkItemTitle row={row} />,
  },
  { field: "endDate", header: "结束时间", sortable: true, width: 105 },
  {
    field: "status",
    header: "状态",
    sortable: true,
    filterable: true,
    width: 169,
  },
  {
    field: "assignee",
    header: "处理人",
    sortable: true,
    filterable: true,
    width: 118,
  },
  {
    field: "estimatedStartDate",
    header: "预计开始时间",
    sortable: true,
    width: 215,
  },
  {
    field: "estimatedEndDate",
    header: "预计结束时间",
    sortable: true,
    width: 199,
    formatter: (row) => <DateWithState row={row} />,
  },
  {
    field: "priority",
    header: "优先级",
    sortable: true,
    filterable: true,
    width: 116,
    formatter: (_row, _column, cellValue) => <PriorityCell value={cellValue} />,
  },
  {
    field: "__actions",
    header: <HeaderLabel leadingIcon="chevron-right">操作</HeaderLabel>,
    width: 115,
    formatter: () => <RowActions />,
  },
]

export function TableBlock({
  className,
  toolbarProps,
  tableProps,
  columns = defaultColumns,
  data = defaultTableRows,
  paginationProps,
  currentPage = 1,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: TableBlockProps) {
  const pageSize = paginationProps?.pageSize || 15
  const totalItems = paginationProps?.totalItems ?? data.length
  const resolvedTotalPages =
    totalPages ?? Math.max(1, Math.ceil(totalItems / pageSize))

  return (
    <div
      className={`table-block ${className || ""}`}
      data-figma-node-id="10743:20021"
      data-runtime-component="TableBlock"
    >
      <ToolbarBlock {...toolbarProps} />

      <div className="table-block__container">
        <Table
          {...tableProps}
          data={data}
          rowKey={tableProps?.rowKey ?? "id"}
          size={tableProps?.size ?? "md"}
          tableLayout={tableProps?.tableLayout ?? "fixed"}
          tableWidth={tableProps?.tableWidth ?? "100%"}
        >
          <Column type="checkable" width={48} />
          {columns.map((col) => (
            <Column
              align={col.align}
              field={col.field}
              filterable={col.filterable}
              formatter={col.formatter}
              header={col.header}
              key={col.field}
              minWidth={col.minWidth}
              sortable={col.sortable}
              width={col.width}
            />
          ))}
        </Table>
      </div>

      <div className="table-block__pagination">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          pageSizeOptions={paginationProps?.pageSizeOptions || [15, 30, 50, 100]}
          showJump={paginationProps?.showJump ?? true}
          total={resolvedTotalPages}
          totalItems={totalItems}
          onChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  )
}

export default TableBlock
