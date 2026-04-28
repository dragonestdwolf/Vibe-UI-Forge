/**
 * Scenario Mode Page V2 - Stories
 */

import type { Meta, StoryObj } from "@storybook/react-vite"
import ScenarioModePageV2 from "./index"

const meta = {
  title: "Render/ScenarioModePageV2",
  component: ScenarioModePageV2,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "HarmonyOS 设置 / 情景模式 - 免打扰页面（V2）。顶部为可横向滚动的沉浸焦点卡片，激活模式带呼吸光晕；下方依次为条件开启、智能推荐、允许打扰、重要信息提醒、关联系统功能等卡片化分组。白色背景 + 品牌蓝点缀。",
      },
    },
  },
} satisfies Meta<typeof ScenarioModePageV2>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div style={{ width: "360px", minHeight: "800px", margin: "0 auto" }}>
      <ScenarioModePageV2 />
    </div>
  ),
}
