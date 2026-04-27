/**
 * Generated Scene Mode Page - Stories
 */

import type { Meta, StoryObj } from "@storybook/react-vite"
import SceneModePage from "./index"

const meta = {
  title: "Render/SceneMode",
  component: SceneModePage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SceneModePage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div style={{ width: "360px", minHeight: "800px", margin: "0 auto" }}>
      <SceneModePage />
    </div>
  ),
}
