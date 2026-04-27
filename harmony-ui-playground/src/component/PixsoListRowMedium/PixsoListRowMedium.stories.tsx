import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ReactNode } from "react"
import { useState } from "react"

import { PixsoListRowMedium } from "./PixsoListRowMedium"

function centerInViewport(Story: () => ReactNode) {
  return (
    <div className="box-border flex min-h-screen w-full min-w-0 items-center justify-center bg-[#f3f4f6] p-8">
      <Story />
    </div>
  )
}

const meta = {
  title: "Components/PixsoListRowMedium",
  component: PixsoListRowMedium,
  tags: ["autodocs"],
  decorators: [centerInViewport],
  parameters: {
    docs: {
      description: {
        component:
          "Pixso `3252:489` — 列表单行 Medium（左主文案 + 右辅文案 + chevron）。设计稿：https://pixso.cn/app/design/OPXcaxT2Rj_9QE_M8xckbw?item-id=3252:489",
      },
    },
  },
} satisfies Meta<typeof PixsoListRowMedium>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-[360px] max-w-full overflow-hidden rounded-[12px] bg-white shadow-sm">
      <PixsoListRowMedium {...args} />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [n, setN] = useState(0)
    return (
      <div className="w-[360px] max-w-full overflow-hidden rounded-[12px] bg-white shadow-sm">
        <PixsoListRowMedium
          title="Single list"
          rightText={`Right text · ${n}`}
          onClick={() => setN((v) => v + 1)}
        />
      </div>
    )
  },
}

export const NoChevron: Story = {
  args: {
    showChevron: false,
    title: "仅左右文案",
    rightText: "无箭头",
  },
  render: (args) => (
    <div className="w-[360px] max-w-full overflow-hidden rounded-[12px] bg-white shadow-sm">
      <PixsoListRowMedium {...args} />
    </div>
  ),
}
