import type { Meta, StoryObj } from "@storybook/react-vite"
import SettingsPageV17 from "./index"

const meta: Meta<typeof SettingsPageV17> = {
  title: "Render/SettingsPageV17",
  component: SettingsPageV17,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SettingsPageV17>

export const Default: Story = {}
