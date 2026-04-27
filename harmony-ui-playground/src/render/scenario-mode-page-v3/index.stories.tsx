/**
 * ScenarioModePageV3 — Stories
 *
 * page_type: settings-context-list
 * layout:    SettingsContextListLayout
 */

import type { Meta, StoryObj } from "@storybook/react-vite"
import ScenarioModePageV3 from "./index"

const meta = {
  title: "Render/ScenarioModePageV3",
  component: ScenarioModePageV3,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "情景模式设置二级页。使用 `SettingsContextListLayout`（页面 `360px` 居中于视口、HeaderSlot gap=0、ContextSlot 横向卡片轮播、ListGroupSlot gap=12）。Light 模式背景 `#F1F3F5`，list 卡片使用 `comp_background_primary`。标题「情景模式」，左侧返回，右侧新增/问号/更多图标。主体为三张 FeaturePromoCard（免打扰/专注/睡眠）横向轮播 + 导航点，下方为条件开启 list、推荐开启与关闭 list。",
      },
    },
  },
} satisfies Meta<typeof ScenarioModePageV3>

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
      <ScenarioModePageV3 />
    </div>
  ),
}
