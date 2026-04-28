/**
 * ScenarioModePageV5 — Stories
 */

import type { Meta, StoryObj } from "@storybook/react-vite"
import ScenarioModePageV5 from "./index"

const meta = {
  title: "Render/ScenarioModePageV5",
  component: ScenarioModePageV5,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "情景模式设置二级页（V5）。移动端设置页面下的二级页面，标题「情景模式」，左侧返回按钮，右侧三个图标按钮（新增、问号详情、更多）。可滑动情景卡片（免打扰/专注模式/睡眠模式）+ 导航点，条件开启 list，智能推荐 switch。",
      },
    },
  },
} satisfies Meta<typeof ScenarioModePageV5>

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
      <ScenarioModePageV5 />
    </div>
  ),
}