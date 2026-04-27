import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { TableBlock } from "./index"

const meta = {
  title: "Blocks/TableBlock",
  component: TableBlock,
  tags: ["autodocs"],
  args: {
    currentPage: 1,
    paginationProps: {
      pageSize: 15,
      totalItems: 8,
      showJump: true,
    },
  },
  argTypes: {
    currentPage: { control: "number" },
  },
} satisfies Meta<typeof TableBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage)

    return (
      <div style={{ minWidth: 1584 }}>
        <TableBlock {...args} currentPage={page} onPageChange={setPage} />
      </div>
    )
  },
}
