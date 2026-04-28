import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ReactNode } from "react"

import { SceneModeCard } from "./SceneModeCard"

/* 与 `Card.stories.tsx` / `Slider.stories.tsx` 等保持同一画布背景，避免与项目其余 Story 不一致。 */
function centerInViewport(Story: () => ReactNode) {
  return (
    <div className="box-border flex min-h-screen w-full min-w-0 items-center justify-center bg-[#f3f4f6] p-8">
      <Story />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* DnD（免打扰）图标 — 紫色圆形 + 白色月牙                                          */
/* 来源：Pixso 节点 3368:122 sub vector，用纯 SVG 等价实现                           */
/* -------------------------------------------------------------------------- */
function DoNotDisturbIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="免打扰">
      <circle cx="32" cy="32" r="29" fill="#542BD7" />
      <path
        d="M40.4 41.2c-7.4 0-13.4-6-13.4-13.4 0-3 1-5.7 2.6-7.9-5.6 1.4-9.7 6.4-9.7 12.4 0 7.1 5.7 12.8 12.8 12.8 6 0 11-4.1 12.4-9.7-1.4 1-2.9 1.7-4.7 1.8z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

/* 工作模式 — 蓝色圆 + 简化的「文档/工作」抽象图形 */
function WorkModeIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="工作模式">
      <circle cx="32" cy="32" r="29" fill="#0A59F7" />
      <rect x="22" y="20" width="20" height="24" rx="3" fill="#FFFFFF" />
      <rect x="26" y="26" width="12" height="2" rx="1" fill="#0A59F7" />
      <rect x="26" y="31" width="12" height="2" rx="1" fill="#0A59F7" />
      <rect x="26" y="36" width="8" height="2" rx="1" fill="#0A59F7" />
    </svg>
  )
}

/* 睡眠模式 — 蓝紫圆 + 简化星月 */
function SleepModeIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="睡眠模式">
      <circle cx="32" cy="32" r="29" fill="#3B5BFF" />
      <path
        d="M40 41c-7.5 0-13.5-6-13.5-13.5 0-2.6.7-5 2-7-5.5 1.5-9.5 6.5-9.5 12.5 0 7.2 5.8 13 13 13 5.4 0 10-3.3 12-8-1.3.6-2.7 1-4 1z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
const meta = {
  title: "Components/SceneModeCard",
  component: SceneModeCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "兼容别名。`SceneModeCard` 旧实现已废弃，当前直接复用 `FeaturePromoCard` 的真值实现与 API。",
      },
    },
  },
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    actionLabel: { control: "text" },
    disabled: { control: "boolean" },
    actionDisabled: { control: "boolean" },
  },
  args: {
    title: "免打扰",
    subtitle: "减少打扰保持专注",
    actionLabel: "立即开启",
    icon: <DoNotDisturbIcon />,
  },
  decorators: [centerInViewport],
} satisfies Meta<typeof SceneModeCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Clickable: Story = {
  args: {
    onAction: () => window.alert("立即开启：免打扰"),
  },
}

export const Variations: Story = {
  render: () => (
    <div className="flex items-stretch gap-3">
      <SceneModeCard
        icon={<DoNotDisturbIcon />}
        title="免打扰"
        subtitle="减少打扰保持专注"
        actionLabel="立即开启"
      />
      <SceneModeCard
        icon={<WorkModeIcon />}
        title="专注模式"
        subtitle="屏蔽通知专心做事"
        actionLabel="开启专注"
      />
      <SceneModeCard
        icon={<SleepModeIcon />}
        title="睡眠模式"
        subtitle="夜间静音与暗色"
        actionLabel="立即开启"
      />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-black/60">default</span>
        <SceneModeCard
          title="免打扰"
          subtitle="减少打扰保持专注"
          icon={<DoNotDisturbIcon />}
          actionLabel="立即开启"
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-black/60">action disabled</span>
        <SceneModeCard
          title="免打扰"
          subtitle="减少打扰保持专注"
          icon={<DoNotDisturbIcon />}
          actionLabel="已开启"
          actionDisabled
          onAction={() => undefined}
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-black/60">card disabled</span>
        <SceneModeCard
          title="免打扰"
          subtitle="减少打扰保持专注"
          icon={<DoNotDisturbIcon />}
          actionLabel="立即开启"
          disabled
          onAction={() => undefined}
        />
      </div>
    </div>
  ),
}

export const TitleOnly: Story = {
  args: {
    subtitle: undefined,
    actionLabel: undefined,
  },
}

export const LongText: Story = {
  args: {
    title: "免打扰",
    subtitle: "屏蔽通知，让你保持专注且不被打扰",
    actionLabel: "立即开启免打扰",
  },
}
