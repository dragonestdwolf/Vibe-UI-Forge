import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ReactNode } from "react"

import { FeaturePromoCard } from "./FeaturePromoCard"

/* 与 SceneModeCard / Slider 等保持同一画布背景，整体风格一致 */
function centerInViewport(Story: () => ReactNode) {
  return (
    <div className="box-border flex min-h-screen w-full min-w-0 items-center justify-center bg-[#f3f4f6] p-8">
      <Story />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* DnD（免打扰）图标 — Pixso 节点 3368:122 sub vector                              */
/* 与 SceneModeCard.stories.tsx 保持一致，避免重复设计真值                            */
/* -------------------------------------------------------------------------- */
function DoNotDisturbIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="免打扰"
    >
      <circle cx="32" cy="32" r="29" fill="#542BD7" />
      <path
        d="M40.4 41.2c-7.4 0-13.4-6-13.4-13.4 0-3 1-5.7 2.6-7.9-5.6 1.4-9.7 6.4-9.7 12.4 0 7.1 5.7 12.8 12.8 12.8 6 0 11-4.1 12.4-9.7-1.4 1-2.9 1.7-4.7 1.8z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

function FocusModeIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="专注模式"
    >
      <circle cx="32" cy="32" r="29" fill="#0A59F7" />
      <circle cx="32" cy="32" r="14" fill="none" stroke="#FFFFFF" strokeWidth="3" />
      <circle cx="32" cy="32" r="5" fill="#FFFFFF" />
    </svg>
  )
}

function CloudBackupIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="云备份"
    >
      <circle cx="32" cy="32" r="29" fill="#11B981" />
      <path
        d="M22 38c-3.3 0-6-2.7-6-6 0-3 2.2-5.5 5.1-5.9C22 22.5 25.6 20 30 20c4.5 0 8.3 3 9.5 7.1.5-.1 1-.2 1.5-.2 3.3 0 6 2.7 6 6s-2.7 6-6 6H22z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
const meta = {
  title: "Components/FeaturePromoCard",
  component: FeaturePromoCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "功能营销卡片（Pixso 节点 `3368:152`）。244×220 / r=24 玻璃面板，居中 64×64 图标 + 24px 主标题 + 14px 加粗副标题 + 底部 212×40 / r=20 CTA 胶囊按钮（`MediumNormalEnabled`）。常用于「立即开启」类的场景模式引导。",
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
} satisfies Meta<typeof FeaturePromoCard>

export default meta

type Story = StoryObj<typeof meta>

/* -------------------------------------------------------------------------- */
/* 1. 基础用法 — 与 Pixso 节点 3368:152 1:1 还原                                    */
/* -------------------------------------------------------------------------- */
export const Default: Story = {}

/* -------------------------------------------------------------------------- */
/* 2. 可点击 — onAction 回调                                                       */
/* -------------------------------------------------------------------------- */
export const Clickable: Story = {
  args: {
    onAction: () => window.alert("立即开启：免打扰"),
  },
}

/* -------------------------------------------------------------------------- */
/* 3. 多业务场景 — 复用版式承载不同图标/文案                                            */
/* -------------------------------------------------------------------------- */
export const Variations: Story = {
  render: () => (
    <div className="flex items-stretch gap-3">
      <FeaturePromoCard
        icon={<DoNotDisturbIcon />}
        title="免打扰"
        subtitle="减少打扰保持专注"
        actionLabel="立即开启"
      />
      <FeaturePromoCard
        icon={<FocusModeIcon />}
        title="专注模式"
        subtitle="屏蔽通知专心做事"
        actionLabel="开启专注"
      />
      <FeaturePromoCard
        icon={<CloudBackupIcon />}
        title="云备份"
        subtitle="自动同步数据更安心"
        actionLabel="立即开启"
      />
    </div>
  ),
}

/* -------------------------------------------------------------------------- */
/* 4. 状态对照 — default / actionDisabled / disabled                              */
/* -------------------------------------------------------------------------- */
export const States: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-black/60">default</span>
        <FeaturePromoCard
          icon={<DoNotDisturbIcon />}
          title="免打扰"
          subtitle="减少打扰保持专注"
          actionLabel="立即开启"
          onAction={() => undefined}
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-black/60">action disabled</span>
        <FeaturePromoCard
          icon={<DoNotDisturbIcon />}
          title="免打扰"
          subtitle="减少打扰保持专注"
          actionLabel="已开启"
          actionDisabled
          onAction={() => undefined}
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-black/60">card disabled</span>
        <FeaturePromoCard
          icon={<DoNotDisturbIcon />}
          title="免打扰"
          subtitle="减少打扰保持专注"
          actionLabel="立即开启"
          disabled
          onAction={() => undefined}
        />
      </div>
    </div>
  ),
}

/* -------------------------------------------------------------------------- */
/* 5. 仅图标+标题 — 副标题/按钮均可省略                                                */
/* -------------------------------------------------------------------------- */
export const TitleOnly: Story = {
  args: {
    subtitle: undefined,
    actionLabel: undefined,
  },
}

/* -------------------------------------------------------------------------- */
/* 6. 长文案 — 验证排版不被破坏（按 Pixso 设计取整宽 + 截断）                              */
/* -------------------------------------------------------------------------- */
export const LongText: Story = {
  args: {
    title: "免打扰",
    subtitle: "屏蔽通知，让你保持专注且不被打扰",
    actionLabel: "立即开启免打扰",
  },
}
