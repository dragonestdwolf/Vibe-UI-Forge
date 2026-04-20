import type { Meta, StoryObj } from "@storybook/react-vite"
import SettingsPageV20 from "./settings-page-v20"

const meta: Meta<typeof SettingsPageV20> = {
  title: "Blocks/SettingsPageV20",
  component: SettingsPageV20,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SettingsPageV20>

export const Default: Story = {}
