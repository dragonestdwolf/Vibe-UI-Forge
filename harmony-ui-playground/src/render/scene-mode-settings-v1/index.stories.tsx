import type { Meta, StoryObj } from "@storybook/react-vite"
import SceneModeSettingsV1 from "./index"

const meta: Meta<typeof SceneModeSettingsV1> = {
  title: "Render/Scene Mode Settings-V1",
  component: SceneModeSettingsV1,
  tags: ["autodocs"],
}

type Story = StoryObj<typeof SceneModeSettingsV1>

export const Default: Story = {}

export default meta
