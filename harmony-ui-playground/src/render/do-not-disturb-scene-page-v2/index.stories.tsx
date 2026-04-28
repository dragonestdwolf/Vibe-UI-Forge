import type { Meta, StoryObj } from "@storybook/react-vite"

import DoNotDisturbScenePageV2 from "./index"

const meta = {
  title: "Render/DoNotDisturbScenePageV2",
  component: DoNotDisturbScenePageV2,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "HarmonyOS 情景模式中的免打扰设置页，顶部为可横滑切换的沉浸焦点卡，底部为分组式条件、允许打扰、重要信息提醒与系统联动设置。",
      },
    },
  },
} satisfies Meta<typeof DoNotDisturbScenePageV2>

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
      <DoNotDisturbScenePageV2 />
    </div>
  ),
}
