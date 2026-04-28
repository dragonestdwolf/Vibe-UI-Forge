import { type ReactNode, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Sparkles, Sun, TimerReset } from "lucide-react"

import GroupedListSection from "./grouped-list-section"
import { List, ListItem } from "@/component/List"
import { Switch } from "@/component/Switch"

const meta = {
  title: "Blocks/GroupedListSection",
  component: GroupedListSection,
  tags: ["autodocs"],
  args: {
    children: null,
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Harmony settings block。用于将 subtitle + list card + footnote 作为一个整体 section 组合，组内不吃父级 gap，subtitle 与 list 贴合，footnote 自带 8px 顶部间距；subtitle / footnote 都可选。",
      },
    },
  },
} satisfies Meta<typeof GroupedListSection>

export default meta

type Story = StoryObj<typeof meta>

function SettingIcon({
  children,
}: {
  children: ReactNode
}) {
  return (
    <span
      style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(10, 89, 247, 0.08)",
        color: "rgba(0, 0, 0, 0.9)",
      }}
      aria-hidden="true"
    >
      {children}
    </span>
  )
}

function DemoSection({
  showSubtitle = true,
  showFootnote = true,
}: {
  showSubtitle?: boolean
  showFootnote?: boolean
}) {
  const [enabled, setEnabled] = useState(true)

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F1F3F5",
        display: "flex",
        justifyContent: "center",
        padding: "24px 0",
      }}
    >
      <div style={{ width: 328 }}>
        <GroupedListSection
          subtitle={showSubtitle ? "亮度调节" : undefined}
          footnote={
            showFootnote
              ? "自动亮度会综合当前环境光、使用场景和电量状态做平衡。"
              : undefined
          }
        >
          <List className="rounded-[20px] overflow-hidden">
            <ListItem
              left={
                <SettingIcon>
                  <Sun size={18} strokeWidth={1.8} />
                </SettingIcon>
              }
              title="自动亮度"
              subtitle="根据环境光自动调整到更舒适的亮度"
              right={
                <Switch
                  modelValue={enabled}
                  onUpdateModelValue={setEnabled}
                />
              }
              showArrow={false}
            />
            <ListItem
              left={
                <SettingIcon>
                  <Sparkles size={18} strokeWidth={1.8} />
                </SettingIcon>
              }
              title="阳光下增强显示"
              subtitle="强光环境下提升可读性与对比度"
              rightText="已开启"
              showArrow={false}
            />
            <ListItem
              left={
                <SettingIcon>
                  <TimerReset size={18} strokeWidth={1.8} />
                </SettingIcon>
              }
              title="日落后自动开启"
              rightText="20:00"
              showArrow={false}
              border={false}
            />
          </List>
        </GroupedListSection>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <DemoSection />,
}

export const WithoutSubtitle: Story = {
  render: () => <DemoSection showSubtitle={false} />,
}

export const WithoutFootnote: Story = {
  render: () => <DemoSection showFootnote={false} />,
}

export const BareListCard: Story = {
  render: () => <DemoSection showSubtitle={false} showFootnote={false} />,
}
