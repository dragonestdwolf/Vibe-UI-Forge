import type { Meta, StoryObj } from "@storybook/react-vite"

import DisplayThemeBrightnessSettingsV2 from "./index"

const meta = {
  title: "Render/DisplayThemeBrightnessSettingsV2",
  component: DisplayThemeBrightnessSettingsV2,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof DisplayThemeBrightnessSettingsV2>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
