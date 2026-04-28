import type { Meta, StoryObj } from "@storybook/react-vite"
import DoNotDisturbScenePageV1 from "./index"

const meta = {
  title: "Render/DoNotDisturbScenePageV1",
  component: DoNotDisturbScenePageV1,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "手机系统设置中的“免打扰”情景模式详情页。包含主开关、定时触发、地点/车载触发、允许打扰对象，以及通知与显示行为设置。",
      },
    },
  },
} satisfies Meta<typeof DoNotDisturbScenePageV1>

type Story = StoryObj<typeof meta>

export default meta

export const Default: Story = {
  render: () => (
    <div
      style={{
        minHeight: "100vh",
        background: "#E9EDF2",
        display: "flex",
        justifyContent: "center",
        padding: "16px 0",
      }}
    >
      <DoNotDisturbScenePageV1 />
    </div>
  ),
}
