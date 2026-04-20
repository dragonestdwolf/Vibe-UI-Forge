import type { Meta, StoryObj } from "@storybook/react-vite"
import SettingsPageV23 from "./index"

const meta: Meta<typeof SettingsPageV23> = {
  title: "Render/SettingsPageV23",
  component: SettingsPageV23,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SettingsPageV23>

export const Default: Story = {}
