import type { Meta, StoryObj } from "@storybook/react-vite"

import { DisplayAndBrightnessSettingsPage } from "./index"

const meta = {
  title: "Render/DisplayAndBrightnessSettings",
  component: DisplayAndBrightnessSettingsPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "鸿蒙「显示和亮度」二级页。Layout：SettingsContextListLayout。ContextSlot 为浅色 / 深色显示模式选择卡（左右并排手机预览图，可切换）；ListGroupSlot 含亮度滑块、自动调节开关、护眼模式入口、字体大小、显示尺寸等设置项。",
      },
    },
  },
} satisfies Meta<typeof DisplayAndBrightnessSettingsPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultMode: "light",
  },
}

export const DarkSelected: Story = {
  args: {
    defaultMode: "dark",
  },
}
