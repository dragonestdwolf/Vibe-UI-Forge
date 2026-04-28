import type { Meta, StoryObj } from "@storybook/react-vite"

import DisplayThemeBrightnessSettingsV3 from "./index"

const meta: Meta<typeof DisplayThemeBrightnessSettingsV3> = {
  title: "Render/Harmony/DisplayThemeBrightnessSettingsV3",
  component: DisplayThemeBrightnessSettingsV3,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof DisplayThemeBrightnessSettingsV3>

export const Default: Story = {}
