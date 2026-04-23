import type { Meta, StoryObj } from "@storybook/react-vite"
import SceneModeV1 from "./index"

const meta: Meta<typeof SceneModeV1> = {
  title: "Render/SceneModeV1",
  component: SceneModeV1,
  tags: ["autodocs"],
}

type Story = StoryObj<typeof SceneModeV1>

export const Default: Story = {}

export default meta
