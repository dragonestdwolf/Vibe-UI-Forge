import type { Meta, StoryObj } from "@storybook/react-vite"
import SettingsPageV22 from "./index"

const meta: Meta<typeof SettingsPageV22> = {
  title: "Render/SettingsPageV22",
  component: SettingsPageV22,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SettingsPageV22>

export const Default: Story = {}
