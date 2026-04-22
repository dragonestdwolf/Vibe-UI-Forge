import type { Meta, StoryObj } from "@storybook/react-vite"
import { ButtonIcon } from "@/components/ui/button/button-icon"
import { Column, Table } from "./index"

type DemoRow = {
  id: string
  code: string
  title: string
  titleTag: "Bug" | "Story"
  endDate: string
  status: "新建" | "进行中"
  assignee: string
  estimatedStartDate: string
  estimatedEndDate: string
  overdueTag?: string
  priority: "高" | "中" | "低"
}

const rows: DemoRow[] = Array.from({ length: 8 }, (_, index) => ({
  id: String(index + 1),
  code: "12345678",
  title: "作为用户应该可以查看产品列表",
  titleTag: index === 1 ? "Story" : "Bug",
  endDate: "--",
  status: index === 2 || index === 3 ? "进行中" : "新建",
  assignee: "hw12345678",
  estimatedStartDate: index === 0 ? "2025-03-09" : "--",
  estimatedEndDate: index === 0 ? "2026-02-09" : "--",
  overdueTag: index === 0 ? "超期9天" : undefined,
  priority: index === 0 ? "中" : index === 1 ? "高" : "低",
}))

const meta = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  args: {
    rowHoveredHighlight: true,
    size: "md",
    tableWidth: "1584px",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    borderType: {
      control: "select",
      options: ["", "bordered", "borderless"],
    },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

function HeaderLabel({
  children,
  leadingIcon,
}: {
  children: string
  leadingIcon?: string
}) {
  return (
    <span className="devui-table__story-header">
      {leadingIcon ? <ButtonIcon className="icon-sm" name={leadingIcon} /> : null}
      <span>{children}</span>
    </span>
  )
}

function TitleCell({ row }: { row: Record<string, unknown> }) {
  const tag = String(row.titleTag)
  return (
    <span className="devui-table__story-title">
      <span
        className={`devui-table__story-tag devui-table__story-tag--${tag.toLowerCase()}`}
      >
        {tag}
      </span>
      <span className="devui-table__story-title-text">
        {String(row.title)}
      </span>
    </span>
  )
}

function DateCell({ row }: { row: Record<string, unknown> }) {
  const overdueTag = String(row.overdueTag || "")

  return (
    <span className="devui-table__story-date">
      <span>{String(row.estimatedEndDate)}</span>
      {overdueTag ? (
        <span className="devui-table__story-overdue">{overdueTag}</span>
      ) : null}
    </span>
  )
}

function PriorityCell({ value }: { value: unknown }) {
  const priority = String(value)
  const tone = priority === "高" ? "high" : priority === "中" ? "medium" : "low"

  return (
    <span className="devui-table__story-priority">
      <ButtonIcon
        className={`devui-table__story-priority-icon devui-table__story-priority-icon--${tone}`}
        name="flag"
      />
      <span>{priority}</span>
    </span>
  )
}

function ActionCell() {
  return (
    <span className="devui-table__actions">
      <button aria-label="编辑" className="devui-table__action-btn" type="button">
        <ButtonIcon name="pencil" />
      </button>
      <button aria-label="收藏" className="devui-table__action-btn" type="button">
        <ButtonIcon name="star" />
      </button>
      <button aria-label="更多" className="devui-table__action-btn" type="button">
        <ButtonIcon name="more-horizontal" />
      </button>
    </span>
  )
}

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 1584 }}>
      <Table {...args} data={rows} rowKey="id">
        <Column type="checkable" width={48} />
        <Column field="code" header="编号" sortable width={119} />
        <Column
          field="title"
          header={<HeaderLabel leadingIcon="chevron-right">标题</HeaderLabel>}
          formatter={(row) => <TitleCell row={row} />}
          sortable
          width={380}
        />
        <Column field="endDate" header="结束时间" sortable width={105} />
        <Column field="status" header="状态" filterable sortable width={169} />
        <Column field="assignee" header="处理人" filterable sortable width={118} />
        <Column
          field="estimatedStartDate"
          header="预计开始时间"
          sortable
          width={215}
        />
        <Column
          field="estimatedEndDate"
          formatter={(row) => <DateCell row={row} />}
          header="预计结束时间"
          sortable
          width={199}
        />
        <Column
          field="priority"
          filterable
          formatter={(_row, _column, cellValue) => (
            <PriorityCell value={cellValue} />
          )}
          header="优先级"
          sortable
          width={116}
        />
        <Column
          field="__actions"
          formatter={() => <ActionCell />}
          header={<HeaderLabel leadingIcon="chevron-right">操作</HeaderLabel>}
          width={115}
        />
      </Table>
    </div>
  ),
}

export const EmptyState: Story = {
  render: () => (
    <div style={{ width: 920 }}>
      <Table data={[]} tableWidth="100%" empty="No projects found">
        <Column field="title" header="标题" />
        <Column field="assignee" header="处理人" />
      </Table>
    </div>
  ),
}
