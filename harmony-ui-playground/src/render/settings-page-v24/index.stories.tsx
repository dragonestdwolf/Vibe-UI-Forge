import type { Meta, StoryObj } from "@storybook/react-vite"
import SettingsPageV24 from "./index"

const meta: Meta<typeof SettingsPageV24> = {
  title: "Render/SettingsPageV24",
  component: SettingsPageV24,
  tags: ["autodocs"],
}

type Story = StoryObj<typeof SettingsPageV24>

export const Default: Story = {}

export default meta