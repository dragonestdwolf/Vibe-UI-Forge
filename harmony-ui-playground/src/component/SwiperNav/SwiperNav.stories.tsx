import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ReactNode } from "react"

import { SwiperNav } from "./SwiperNav"

function centerInViewport(Story: () => ReactNode) {
  return (
    <div className="box-border flex min-h-screen w-full min-w-0 items-center justify-center bg-[#f3f4f6] p-8">
      <Story />
    </div>
  )
}

const meta = {
  title: "Components/SwiperNav",
  component: SwiperNav,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Swiper 导航组件，来自 Pixso 节点 `3288:4526`。覆盖 Multi Dot ON/OFF、数字页码和进度条三种样式。",
      },
    },
  },
  decorators: [centerInViewport],
  argTypes: {
    variant: {
      control: "radio",
      options: ["dots", "number", "progress"],
    },
    total: { control: "number" },
    current: { control: "number" },
    dotsCount: { control: "number" },
    showEdgeDots: { control: "boolean" },
  },
  args: {
    variant: "dots",
    total: 22,
    current: 12,
    showEdgeDots: false,
  },
} satisfies Meta<typeof SwiperNav>

export default meta

type Story = StoryObj<typeof meta>

export const DotsOn: Story = {
  args: {
    variant: "dots",
    showEdgeDots: true,
  },
}

export const DotsOff: Story = {
  args: {
    variant: "dots",
    showEdgeDots: false,
  },
}

export const Number: Story = {
  args: {
    variant: "number",
    current: 12,
    total: 22,
  },
}

export const Progress: Story = {
  args: {
    variant: "progress",
    current: 1,
    total: 5,
  },
}

export const PixsoOverview: Story = {
  render: () => (
    <div className="flex w-[520px] flex-col items-center gap-[27px] rounded-sm border border-dashed border-[#8A3FFC] bg-white/20 px-10 py-8">
      <div className="flex flex-col items-center gap-[30px]">
        <SwiperNav variant="dots" showEdgeDots />
        <SwiperNav variant="dots" />
      </div>
      <SwiperNav variant="number" current={12} total={22} />
      <SwiperNav variant="progress" current={1} total={5} />
    </div>
  ),
}
