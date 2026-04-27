import type { Meta, StoryObj } from "@storybook/react-vite"
import DisplayBrightnessSettingsV1 from "./index"

const meta: Meta<typeof DisplayBrightnessSettingsV1> = {
  title: "Render/Display Brightness Settings-V1",
  component: DisplayBrightnessSettingsV1,
  tags: ["autodocs"],
}

type Story = StoryObj<typeof DisplayBrightnessSettingsV1>

export const Default: Story = {}

export default meta
