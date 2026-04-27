/**
 * ScenarioModePageV8 — Stories
 */

import type { Meta, StoryObj } from "@storybook/react-vite"
import ScenarioModePageV8 from "./index"

const meta = {
  title: "Render/ScenarioModePageV8",
  component: ScenarioModePageV8,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "情景模式设置二级页（V8）。标题栏：左侧返回，右侧新增/问号/更多三图标。ContextSlot：描述文字（scl-header-subtitle，14px/22px/rgba(0,0,0,0.6)）+ scl-carousel-track 横向轮播（免打扰/专注/睡眠，center snap，32px padding）+ 导航点。ListGroupSlot：条件开启（时间图标 list + Divider + 添加条件按钮 + footnote）+ 智能推荐（Switch + footnote）。V8 修正：描述文字 font_secondary/14px，轮播 center snap，footnote 颜色从 FONT_TERTIARY 0.45 修正为 font_secondary 0.6。",
      },
    },
  },
} satisfies Meta<typeof ScenarioModePageV8>

type Story = StoryObj<typeof meta>

export default meta

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
      <ScenarioModePageV8 />
    </div>
  ),
}
