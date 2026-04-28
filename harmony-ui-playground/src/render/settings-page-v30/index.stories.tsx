import type { Meta, StoryObj } from "@storybook/react-vite"
import DisplayBrightnessPage from "./index"

const meta: Meta<typeof DisplayBrightnessPage> = {
  title: "Render/Setting Page-V30",
  component: DisplayBrightnessPage,
  tags: ["autodocs"],
}

type Story = StoryObj<typeof DisplayBrightnessPage>

export const Default: Story = {}

export default meta
