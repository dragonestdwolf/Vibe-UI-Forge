import type { Meta, StoryObj } from "@storybook/react-vite"
import SettingsPageV19 from "./index"

const meta: Meta<typeof SettingsPageV19> = {
  title: "Render/SettingsPageV19",
  component: SettingsPageV19,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SettingsPageV19>

export const Default: Story = {}
