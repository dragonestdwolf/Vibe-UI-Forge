import type { Meta, StoryObj } from "@storybook/react-vite"
import SettingsPageV27 from "./index"

const meta: Meta<typeof SettingsPageV27> = {
  title: "Render/Setting Page-V27",
  component: SettingsPageV27,
  tags: ["autodocs"],
}

type Story = StoryObj<typeof SettingsPageV27>

export const Default: Story = {}

export default meta
