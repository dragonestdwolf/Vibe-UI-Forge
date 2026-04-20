import type { Meta, StoryObj } from "@storybook/react-vite"
import SettingsPageV20 from "./index"

const meta: Meta<typeof SettingsPageV20> = {
  title: "Render/SettingsPageV20",
  component: SettingsPageV20,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SettingsPageV20>

export const Default: Story = {}
