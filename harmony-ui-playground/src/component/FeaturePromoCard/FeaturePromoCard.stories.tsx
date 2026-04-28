import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ReactNode } from "react"

import { FeaturePromoCard } from "./FeaturePromoCard"
import {
  CloudBackupIcon,
  DoNotDisturbIcon,
  FocusModeIcon,
} from "./mode-icons"

/* 与 SceneModeCard / Slider 等保持同一画布背景，整体风格一致 */
function centerInViewport(Story: () => ReactNode) {
  return (
    <div className="box-border flex min-h-screen w-full min-w-0 items-center justify-center bg-[#f3f4f6] p-8">
      <Story />
    </div>
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
