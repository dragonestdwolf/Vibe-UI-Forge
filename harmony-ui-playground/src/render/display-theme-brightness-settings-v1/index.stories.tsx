import type { Meta, StoryObj } from "@storybook/react-vite"

import DisplayThemeBrightnessSettingsV1 from "./index"

const meta: Meta<typeof DisplayThemeBrightnessSettingsV1> = {
  title: "Render/Display Theme Brightness Settings-V1",
  component: DisplayThemeBrightnessSettingsV1,
  tags: ["autodocs"],
}

type Story = StoryObj<typeof DisplayThemeBrightnessSettingsV1>

export const Default: Story = {}

export default meta
