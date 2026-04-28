/**
 * ScenarioModePageV4 — Stories
 *
 * page_type: settings-context-list
 * layout:    SettingsContextListLayout（居中已修复）
 */

import type { Meta, StoryObj } from "@storybook/react-vite"
import ScenarioModePageV4 from "./index"

const meta = {
  title: "Render/ScenarioModePageV4",
  component: ScenarioModePageV4,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "情景模式设置二级页（V4）。使用已修复的 `SettingsContextListLayout`（HeaderSlot `align-items:center` 居中）。Light 模式 `#F1F3F5`，TitleBar 正确居中于 360px 壳层。标题「情景模式」，左侧返回，右侧新增/问号/更多图标。三张 FeaturePromoCard 横向轮播 + 导航点，下方条件开启 list、推荐开关 list。",
      },
    },
  },
} satisfies Meta<typeof ScenarioModePageV4>

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
      <ScenarioModePageV4 />
    </div>
  ),
}
