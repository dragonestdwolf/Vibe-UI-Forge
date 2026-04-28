import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ReactNode } from "react"

import DisplayBrightnessSettingsV6 from "./index"

function withPreviewFrame(Story: () => ReactNode) {
  return (
    <div className="flex min-h-screen w-full justify-center bg-[#f2f3f5] py-6">
      <Story />
    </div>
  )
}

const meta = {
  title: "Render/DisplayBrightnessSettingsV6",
  component: DisplayBrightnessSettingsV6,
  decorators: [withPreviewFrame],
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DisplayBrightnessSettingsV6>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
