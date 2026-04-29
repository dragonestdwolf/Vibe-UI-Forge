import type { Meta, StoryObj } from "@storybook/react-vite"

import { DisplayAndBrightnessSettingsPageV2 } from "./index"

const meta = {
  title: "Render/DisplayAndBrightnessSettingsV2",
  component: DisplayAndBrightnessSettingsPageV2,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "鸿蒙「显示和亮度」二级页 v2，参照低保真稿生成。Layout：SettingsContextListLayout。ContextSlot = SubHeader「显示模式」+ 浅色/深色简化预览卡（圆形单选 + label）；ListGroupSlot 含「深色模式 / 定时开启」、亮度滑块（亮/暗 cap）+ 自动调节 Switch、护眼模式（全天开启）、字体大小和界面缩放。",
      },
    },
  },
} satisfies Meta<typeof DisplayAndBrightnessSettingsPageV2>

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
