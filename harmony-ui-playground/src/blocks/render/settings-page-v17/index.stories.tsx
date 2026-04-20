import type { Meta, StoryObj } from "@storybook/react-vite"
import SettingsPageV17 from "./settings-page-v17"

const meta: Meta<typeof SettingsPageV17> = {
  title: "Blocks/SettingsPageV17",
  component: SettingsPageV17,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SettingsPageV17>

export const Default: Story = {}
