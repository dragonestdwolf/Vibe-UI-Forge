import type { Meta, StoryObj } from "@storybook/react-vite"
import DisplayBrightnessV1 from "./index"

const meta: Meta<typeof DisplayBrightnessV1> = {
  title: "Render/DisplayBrightnessV1",
  component: DisplayBrightnessV1,
  tags: ["autodocs"],
}

type Story = StoryObj<typeof DisplayBrightnessV1>

export const Default: Story = {}

export default meta
