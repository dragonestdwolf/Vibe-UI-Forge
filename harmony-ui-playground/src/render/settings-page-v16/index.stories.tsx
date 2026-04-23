import type { Meta, StoryObj } from "@storybook/react-vite"
import SettingsPageV16 from "./index"

const meta: Meta<typeof SettingsPageV16> = {
  title: "Render/SettingsPageV16",
  component: SettingsPageV16,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SettingsPageV16>

export const Default: Story = {}
