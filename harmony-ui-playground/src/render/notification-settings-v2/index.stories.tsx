import type { Meta, StoryObj } from "@storybook/react-vite"
import NotificationSettingsV2 from "./index"

const meta: Meta<typeof NotificationSettingsV2> = {
  title: "Render/NotificationSettingsV2",
  component: NotificationSettingsV2,
  tags: ["autodocs"],
}

type Story = StoryObj<typeof NotificationSettingsV2>

export const Default: Story = {}

export default meta
