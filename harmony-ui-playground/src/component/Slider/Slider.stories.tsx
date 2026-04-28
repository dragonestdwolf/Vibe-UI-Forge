import type { Meta, StoryObj } from "@storybook/react-vite"
import { Sun, SunDim } from "lucide-react"
import { useState, type ReactNode } from "react"

import { Slider, type SliderType } from "./Slider"
import { SliderSeekbar, type SliderSeekbarState } from "./SliderSeekbar"

/* -------------------------------------------------------------------------- */
/*                              通用 Decorator                                 */
/* -------------------------------------------------------------------------- */

function centerInViewport(Story: () => ReactNode) {
  return (
    <div className="box-border flex min-h-screen w-full min-w-0 items-start justify-center bg-[#f3f4f6] p-8">
      <div className="w-[360px] rounded-[20px] bg-white shadow-sm">
        <Story />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Meta                                      */
/* -------------------------------------------------------------------------- */

const meta = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  decorators: [centerInViewport],
  parameters: {
    docs: {
      description: {
        component:
          "鸿蒙 Light 主题滑动条，1:1 还原 Pixso 节点 `3286:12110「6.Slider - 滑动条」`。" +
          "通过 `type` 在 9 种排版变体之间切换；通过 `forceState` 强制视觉态用于文档展示。",
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: [
        "basic",
        "scale",
        "icon",
        "value",
        "valueWithChange",
        "iconWithTitle",
        "bubble",
        "title",
        "textview",
      ] satisfies SliderType[],
    },
    forceState: {
      control: "select",
      options: ["default", "hover", "focus", "active", "disabled"] as const,
    },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
  },
  args: {
    type: "basic",
    defaultValue: 42,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

/* -------------------------------------------------------------------------- */
/*                              Playground 故事                                */
/* -------------------------------------------------------------------------- */

export const Playground: Story = {
  render: (args) => {
    const [v, setV] = useState<number>(Number(args.defaultValue ?? 42))
    return (
      <Slider
        {...args}
        value={v}
        onChange={setV}
        leadingIcon={<SunDim size={20} strokeWidth={1.5} />}
        trailingIcon={<Sun size={20} strokeWidth={1.5} />}
        title="标题"
        subtitle={`${v}%`}
        valueText={v}
        leadingText="-"
        textviewLeft="开始时间"
        textviewRight="结束时间"
        bubbleFormatter={(value) => `${value}`}
      />
    )
  },
}

/* -------------------------------------------------------------------------- */
/*                              全部 9 种类型                                  */
/* -------------------------------------------------------------------------- */

export const AllTypes: Story = {
  parameters: {
    docs: { description: { story: "Pixso 设计稿中包含的全部 9 种类型布局。" } },
  },
  render: () => {
    const [v, setV] = useState(42)
    return (
      <div className="flex flex-col gap-6">
        <Demo title="01. Basic — 基础" value={v} onChange={setV}>
          <Slider type="basic" value={v} onChange={setV} block />
        </Demo>

        <Demo title="02. Scale — 带刻度点" value={v} onChange={setV}>
          <Slider type="scale" value={v} onChange={setV} ticks={8} block />
        </Demo>

        <Demo title="03. Icon — 双图标" value={v} onChange={setV}>
          <Slider
            type="icon"
            value={v}
            onChange={setV}
            block
            leadingIcon={<SunDim size={20} strokeWidth={1.5} />}
            trailingIcon={<Sun size={20} strokeWidth={1.5} />}
          />
        </Demo>

        <Demo title="04. Value with text change — 前置 + 数值" value={v} onChange={setV}>
          <Slider
            type="valueWithChange"
            value={v}
            onChange={setV}
            block
            leadingText="-"
            valueText={v}
          />
        </Demo>

        <Demo title="05. Value — 底部刻度文案" value={v} onChange={setV}>
          <Slider type="value" value={v} onChange={setV} block />
        </Demo>

        <Demo title="06. Icon with title — 标题 + 图标" value={v} onChange={setV}>
          <Slider
            type="iconWithTitle"
            value={v}
            onChange={setV}
            block
            title="亮度"
            leadingIcon={<Sun size={20} strokeWidth={1.5} />}
          />
        </Demo>

        <Demo title="07. Bubble — 浮窗气泡" value={v} onChange={setV}>
          <Slider
            type="bubble"
            value={v}
            onChange={setV}
            block
            bubbleFormatter={(value) => `${value}`}
          />
        </Demo>

        <Demo title="08. Title — 标题 + 数值" value={v} onChange={setV}>
          <Slider
            type="title"
            value={v}
            onChange={setV}
            block
            title="背景音量"
            subtitle={`${v} / 100`}
          />
        </Demo>

        <Demo title="09. Textview — 双侧文案" value={v} onChange={setV}>
          <Slider
            type="textview"
            value={v}
            onChange={setV}
            block
            textviewLeft="00:00"
            textviewRight="03:42"
          />
        </Demo>
      </div>
    )
  },
}

/* -------------------------------------------------------------------------- */
/*                                  全部状态                                  */
/* -------------------------------------------------------------------------- */

export const AllStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "通过 `forceState` 锁定 5 种视觉状态。运行时通常由组件根据用户行为自动切换。",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-5">
      {(
        ["default", "hover", "focus", "active", "disabled"] as const
      ).map((s) => (
        <div key={s} className="flex flex-col gap-2">
          <span className="px-3 text-xs uppercase tracking-wider text-black/60">
            state = {s}
          </span>
          <Slider
            type="basic"
            defaultValue={42}
            forceState={s}
            disabled={s === "disabled"}
            block
          />
        </div>
      ))}
    </div>
  ),
}

/* -------------------------------------------------------------------------- */
/*                              PixsoSeekbar 故事                              */
/* -------------------------------------------------------------------------- */

export const seekbarMeta = {
  title: "Components/Slider/SliderSeekbar", // 独立路径
  component: SliderSeekbar,
  tags: ["autodocs"],
  decorators: [centerInViewport],
} satisfies Meta<typeof SliderSeekbar>

type SeekbarStory = StoryObj<typeof seekbarMeta>
export const Seekbar: SeekbarStory = {
  name: "SliderSeekbar / Playground",
  parameters: {
    docs: {
      description: {
        story:
          "节点 3286:12185「Slider-Seekbar-Phone」。细轨道（4px）+ 16px 圆点 thumb，常用于音视频进度条。",
      },
    },
  },
  render: () => {
    const [v, setV] = useState(40)
    return (
      <div className="flex flex-col gap-5">
        <SliderSeekbar value={v} onChange={setV} block aria-label="进度" />
        <p className="px-3 text-sm text-black/60">当前值：{v}</p>
      </div>
    )
  },
}

export const SeekbarStates: SeekbarStory= {
  name: "SliderSeekbar / All States",
  render: () => (
    <div className="flex flex-col gap-5">
      {(
        ["default", "hover", "focus", "active", "disabled"] as SliderSeekbarState[]
      ).map((s) => (
        <div key={s} className="flex flex-col gap-2">
          <span className="px-3 text-xs uppercase tracking-wider text-black/60">
            state = {s}
          </span>
          <SliderSeekbar
            defaultValue={32}
            forceState={s}
            disabled={s === "disabled"}
            block
          />
        </div>
      ))}
    </div>
  ),
}

/* -------------------------------------------------------------------------- */
/*                            内部辅助：标题 + 当前值                           */
/* -------------------------------------------------------------------------- */

function Demo({
  title,
  value,
  children,
}: {
  title: string
  value: number
  onChange: (v: number) => void
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-3">
        <span className="text-xs font-medium text-black/70">{title}</span>
        <span className="text-xs text-black/40">{value}</span>
      </div>
      {children}
    </div>
  )
}
