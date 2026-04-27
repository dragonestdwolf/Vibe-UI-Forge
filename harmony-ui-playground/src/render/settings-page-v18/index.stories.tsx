import type { Meta, StoryObj } from "@storybook/react-vite"
import SettingsPageV18 from "./index"

const meta: Meta<typeof SettingsPageV18> = {
  title: "Render/SettingsPageV18",
  component: SettingsPageV18,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SettingsPageV18>

export const Default: Story = {}
