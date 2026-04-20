import type { Meta, StoryObj } from "@storybook/react-vite"
import SettingsPageV15 from "./settings-page-v15"

const meta: Meta<typeof SettingsPageV15> = {
  title: "Blocks/SettingsPageV15",
  component: SettingsPageV15,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SettingsPageV15>

export const Default: Story = {}
