import type { Meta, StoryObj } from "@storybook/react-vite"
import SettingsPageV15 from "./index"

const meta: Meta<typeof SettingsPageV15> = {
  title: "Render/SettingsPageV15",
  component: SettingsPageV15,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SettingsPageV15>

export const Default: Story = {}
