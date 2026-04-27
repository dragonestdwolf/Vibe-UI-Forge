import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ReactNode } from "react"

import { ScrollBar } from "./ScrollBar"

function centerInViewport(Story: () => ReactNode) {
  return (
    <div className="box-border flex min-h-screen w-full min-w-0 items-center justify-center bg-[#f3f4f6] p-8">
      <Story />
    </div>
  )
}

const meta = {
  title: "Components/ScrollBar",
  component: ScrollBar,
  tags: ["autodocs"],
  decorators: [centerInViewport],
  args: {
    state: "normal",
  },
  argTypes: {
    state: {
      control: "select",
      options: ["normal", "press"],
    },
  },
} satisfies Meta<typeof ScrollBar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const States: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      <div className="flex flex-col items-center gap-2">
        <ScrollBar state="normal" />
        <span className="text-xs text-muted-foreground">normal</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ScrollBar state="press" />
        <span className="text-xs text-muted-foreground">press</span>
      </div>
    </div>
  ),
}

export const CustomHeight: Story = {
  render: () => <ScrollBar state="normal" style={{ height: 120 }} />,
}
