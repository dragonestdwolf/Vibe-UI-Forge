import type { Meta, StoryObj } from "@storybook/react-vite"
import SettingsPageV18 from "./settings-page-v18"

const meta: Meta<typeof SettingsPageV18> = {
  title: "Blocks/SettingsPageV18",
  component: SettingsPageV18,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SettingsPageV18>

export const Default: Story = {}
