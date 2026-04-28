import type { Meta, StoryObj } from "@storybook/react-vite"

import DisplayBrightnessSettingsV4 from "./index"

const meta = {
  title: "Render/DisplayBrightnessSettingsV4",
  component: DisplayBrightnessSettingsV4,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "鸿蒙设计语言的“显示和亮度”设置页，包含显示模式双预览、亮度调节、自动亮度开关，以及护眼模式和字体缩放入口。",
      },
    },
  },
} satisfies Meta<typeof DisplayBrightnessSettingsV4>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div
      style={{
        minHeight: "100vh",
        background: "#F1F3F5",
        display: "flex",
        justifyContent: "center",
        padding: "16px 0",
      }}
    >
      <DisplayBrightnessSettingsV4 />
    </div>
  ),
}
