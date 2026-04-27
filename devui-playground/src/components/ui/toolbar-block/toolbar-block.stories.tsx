import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@/components/ui/button"
import { ToolbarBlock } from "./index"

const meta = {
  title: "Blocks/ToolbarBlock",
  component: ToolbarBlock,
  tags: ["autodocs"],
} satisfies Meta<typeof ToolbarBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <div style={{ background: "#ffffff", minWidth: 1600 }}>
      <ToolbarBlock />
    </div>
  ),
}

export const CustomContent: Story = {
  render: () => (
    <ToolbarBlock>
      <Button size="sm">保存</Button>
      <Button size="sm" variant="outline">
        重置
      </Button>
      <Button size="sm" variant="text">
        更多操作
      </Button>
    </ToolbarBlock>
  ),
}
