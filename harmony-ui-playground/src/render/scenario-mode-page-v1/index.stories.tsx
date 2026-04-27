/**
 * Scenario Mode Page V1 - Stories
 */

import type { Meta, StoryObj } from "@storybook/react-vite"
import ScenarioModePageV1 from "./index"

const meta = {
  title: "Render/ScenarioModePageV1",
  component: ScenarioModePageV1,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ScenarioModePageV1>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div style={{ width: "360px", minHeight: "800px", margin: "0 auto" }}>
      <ScenarioModePageV1 />
    </div>
  ),
}
