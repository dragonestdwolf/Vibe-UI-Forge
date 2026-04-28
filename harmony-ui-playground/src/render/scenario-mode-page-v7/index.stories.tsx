/**
 * ScenarioModePageV7 — Stories
 */

import type { Meta, StoryObj } from "@storybook/react-vite"
import ScenarioModePageV7 from "./index"

const meta = {
  title: "Render/ScenarioModePageV7",
  component: ScenarioModePageV7,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "情景模式设置二级页（V7）。标题栏：左侧返回，右侧新增/问号/更多三图标。ContextSlot：描述文字 + 可横滑 FeaturePromoCard 轮播（免打扰/专注/睡眠）+ 导航点。ListGroupSlot：条件开启（时间图标 list + Divider + 添加条件按钮，footnote：位置权限说明）+ 智能推荐（推荐开启与关闭 Switch，footnote：推荐体验说明）。V7 改进：SubHeader 使用 --text-none / --above-dots 工具类，SubHeader+card+footnote 以 flex-col wrapper 分组保证 0 内部间距，修复导航点 inactive 宽度缺失。",
      },
    },
  },
} satisfies Meta<typeof ScenarioModePageV7>

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
      <ScenarioModePageV7 />
    </div>
  ),
}
