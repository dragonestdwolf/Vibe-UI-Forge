import type { Meta, StoryObj } from "@storybook/react-vite"
import NotificationSettingsV1 from "./index"

const meta: Meta<typeof NotificationSettingsV1> = {
  title: "Render/NotificationSettingsV1",
  component: NotificationSettingsV1,
  tags: ["autodocs"],
}

type Story = StoryObj<typeof NotificationSettingsV1>

export const Default: Story = {}

export default meta
