import type { Meta, StoryObj } from "@storybook/react-vite"
import { TitleBar, type TitleBarIconAction } from "./title-bar"

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width={24} height={24} aria-hidden="true">
    <circle cx="6" cy="12" r="1.8" fill="currentColor" />
    <circle cx="12" cy="12" r="1.8" fill="currentColor" />
    <circle cx="18" cy="12" r="1.8" fill="currentColor" />
  </svg>
)

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width={24} height={24} aria-hidden="true">
    <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
    <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width={24} height={24} aria-hidden="true">
    <circle cx="18" cy="5" r="2" stroke="currentColor" strokeWidth="2" />
    <circle cx="6" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
    <circle cx="18" cy="19" r="2" stroke="currentColor" strokeWidth="2" />
    <path d="M8 10.5L16 6.5" stroke="currentColor" strokeWidth="2" />
    <path d="M8 13.5L16 17.5" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const sampleActions: TitleBarIconAction[] = [
  { icon: <SearchIcon />, label: "搜索" },
  { icon: <ShareIcon />, label: "分享" },
  { icon: <MoreIcon />, label: "更多" },
]

const DemoAvatar = () => (
  <div
    style={{
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: "#e5e6ea",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
      fontWeight: 600,
      color: "rgba(0,0,0,0.6)",
    }}
  >
    G
  </div>
)

const meta = {
  title: "Components/TitleBar",
  component: TitleBar,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["normal", "secondary", "drawer", "large"],
      description: "布局变体：驱动标题字号与整体方向",
    },
    title: { control: "text" },
    subtitle: { control: "text" },
    actionText: { control: "text" },
  },
  args: {
    variant: "normal",
    title: "页面标题",
    subtitle: "副标题内容",
    actions: sampleActions,
  },
} satisfies Meta<typeof TitleBar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Normal: Story = {
  name: "Normal — 仅标题 + 3 图标",
  args: {
    variant: "normal",
    subtitle: undefined,
  },
}

export const NormalWithSubtitle: Story = {
  name: "Normal — 标题 + 副标题",
  args: {
    variant: "normal",
  },
}

export const Secondary: Story = {
  name: "Secondary — 返回 + 标题 + 副标题",
  args: {
    variant: "secondary",
  },
}

export const SecondaryTextAction: Story = {
  name: "Secondary — 文字操作",
  args: {
    variant: "secondary",
    actions: undefined,
    actionText: "编辑",
  },
}

export const SecondaryAvatar: Story = {
  name: "Secondary — Avatar 中心",
  args: {
    variant: "secondary",
    title: undefined,
    subtitle: undefined,
    actions: [sampleActions[2]],
    avatar: <DemoAvatar />,
  },
}

export const Drawer: Story = {
  name: "Drawer — 汉堡菜单 + 标题",
  args: {
    variant: "drawer",
    subtitle: undefined,
  },
}

export const Large: Story = {
  name: "Large — 大标题纵向",
  args: {
    variant: "large",
  },
}

export const LargeNoSubtitle: Story = {
  name: "Large — 无副标题",
  args: {
    variant: "large",
    subtitle: undefined,
  },
}
