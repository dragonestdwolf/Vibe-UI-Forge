import type { Meta, StoryObj } from "@storybook/react-vite"
import DeviceHealthV2 from "./index"

const meta: Meta<typeof DeviceHealthV2> = {
  title: "Render/DeviceHealthV2",
  component: DeviceHealthV2,
  tags: ["autodocs"],
}

type Story = StoryObj<typeof DeviceHealthV2>

export const Default: Story = {}

export default meta
