import type { Meta, StoryObj } from "@storybook/react-vite"
import SettingsPageV21 from "./index"

const meta: Meta<typeof SettingsPageV21> = {
  title: "Render/SettingsPageV21",
  component: SettingsPageV21,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SettingsPageV21>

export const Default: Story = {}
