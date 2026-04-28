import type { Meta, StoryObj } from "@storybook/react-vite"

import { AiBottomBar } from "@/component/AiBottomBar"

import { HarmonyPageShell } from "./HarmonyPageShell"

const meta = {
  title: "Components/HarmonyPageShell",
  component: HarmonyPageShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Harmony 页面壳层模板，只负责背景、StatusBar 和底部栏，不接管标题区和业务布局。",
      },
    },
  },
  args: {
    background: "#F1F3F5",
    statusBarProps: {
      time: "09:41",
    },
  },
} satisfies Meta<typeof HarmonyPageShell>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div
      style={{
        minHeight: "100vh",
        background: "#E9EDF2",
        display: "flex",
        justifyContent: "center",
        padding: "16px 0",
      }}
    >
      <HarmonyPageShell {...args}>
        <div style={{ width: 328, margin: "0 auto", padding: "12px 0 24px" }}>
          <div
            style={{
              borderRadius: 24,
              background: "#FFFFFF",
              padding: 24,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                lineHeight: "24px",
                color: "rgba(0,0,0,0.9)",
              }}
            >
              Shell Preview
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 14,
                lineHeight: "22px",
                color: "rgba(0,0,0,0.6)",
              }}
            >
              这里用于单独查看页面背景、状态栏和底部栏的默认壳层效果。
            </div>
          </div>
        </div>
      </HarmonyPageShell>
    </div>
  ),
}

export const WithAiBottomBar: Story = {
  args: {
    bottomBar: <AiBottomBar mode="light" showHandle />,
  },
  render: (args) => (
    <div
      style={{
        minHeight: "100vh",
        background: "#E9EDF2",
        display: "flex",
        justifyContent: "center",
        padding: "16px 0",
      }}
    >
      <HarmonyPageShell {...args}>
        <div style={{ width: 328, margin: "0 auto", paddingTop: 12 }}>
          <div
            style={{
              borderRadius: 24,
              background: "#FFFFFF",
              padding: 20,
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                lineHeight: "22px",
                color: "rgba(0,0,0,0.9)",
              }}
            >
              Custom Bottom Bar
            </div>
          </div>
        </div>
      </HarmonyPageShell>
    </div>
  ),
}
