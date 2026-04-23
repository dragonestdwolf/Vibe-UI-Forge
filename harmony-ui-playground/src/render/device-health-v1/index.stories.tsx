import type { Meta, StoryObj } from "@storybook/react-vite"
import DeviceHealthPage from "./index"

const meta: Meta<typeof DeviceHealthPage> = {
  title: "Render/DeviceHealthV1",
  component: DeviceHealthPage,
  tags: ["autodocs"],
}

type Story = StoryObj<typeof DeviceHealthPage>

export const Default: Story = {}

export default meta
