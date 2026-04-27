import type { Meta, StoryObj } from "@storybook/react-vite"
import { HuaweiCloudPipelineOverviewPage } from "./huawei-cloud-pipeline-overview-page"

const meta = {
  title: "Pages/HuaweiCloud/PipelineOverview",
  component: HuaweiCloudPipelineOverviewPage,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof HuaweiCloudPipelineOverviewPage>

export default meta

type Story = StoryObj<typeof meta>

export const EngineeringOverview: Story = {}
