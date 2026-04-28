/**
 * SettingsContextListLayout - Stories
 *
 * 演示 spec 中声明的能力：
 *  - HeaderSlot 中 status-bar 与 title-bar 之间 gap=0
 *  - ListGroupSlot 中 list 卡片之间 gap=12
 *  - ContextSlot 支持 centered / bleed 两种宽度
 *  - showContext / showFooter 控制 slot 显隐
 *  - slot 为 "none" 时不保留空容器
 */

import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"

import { StatusBar } from "@/component/StatusBar"
import { TitleBar } from "@/component/TitleBar"
import { List, ListItem } from "@/component/List"
import { Switch } from "@/component/Switch"
import { SliderBase } from "@/component/Slider"

import iconChevronBack from "@/blocks/assets/pixso-icons/icon-chevron-backward.png"
import iconArrowRightSmall from "@/blocks/assets/pixso-icons/icon-arrow-right-small.png"

import { SettingsContextListLayout } from "./SettingsContextListLayout"

const BRAND_BLUE = "#0a59f7"
const FONT_PRIMARY = "rgba(0, 0, 0, 0.9)"
const FONT_TERTIARY = "rgba(0, 0, 0, 0.55)"

const meta = {
  title: "Layouts/SettingsContextListLayout",
  component: SettingsContextListLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "设置二级页通用布局：固定顶部（StatusBar + TitleBar，gap=0）+ 灵活 ContextSlot + 固定 ListGroupSlot（卡片间 gap=12）+ 可选 FooterSlot。Spec：`.resources/harmony/layout/settings-context-list.md`。",
      },
    },
  },
  // meta-level 默认值：满足必填 props 类型，stories 通过 render() 覆写。
  args: {
    statusBar: <StatusBar time="09:41" backgroundColor="#ffffff" />,
    titleBar: (
      <TitleBar title="二级页" leftIcon={iconChevronBack} backgroundColor="#ffffff" />
    ),
    listGroup: <span />,
  },
} satisfies Meta<typeof SettingsContextListLayout>

export default meta

type Story = StoryObj<typeof meta>

/* ------------------------------ 通用样式片段 ------------------------------ */

function FootnoteText() {
  return (
    <p style={{ margin: 0 }}>
      开启后将根据条件自动进入对应模式；可在「智能推荐」中关闭自动建议。
    </p>
  )
}

function HeroPlaceholder({
  title = "免打扰",
  subtitle = "减少打扰，保持专注",
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <div
      style={{
        height: 196,
        borderRadius: 24,
        background: "linear-gradient(135deg, #2f50d8 0%, #0a59f7 100%)",
        color: "#fff",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div style={{ fontSize: 22, fontWeight: 600, lineHeight: "28px" }}>
          {title}
        </div>
        <div
          style={{
            fontSize: 12,
            lineHeight: "18px",
            opacity: 0.78,
            marginTop: 6,
          }}
        >
          {subtitle}
        </div>
      </div>
      <button
        type="button"
        style={{
          alignSelf: "flex-start",
          height: 32,
          padding: "0 14px",
          borderRadius: 999,
          background: "#fff",
          color: BRAND_BLUE,
          fontSize: 13,
          fontWeight: 500,
          border: "none",
          cursor: "pointer",
        }}
      >
        立即开启
      </button>
    </div>
  )
}

function CarouselContextPlaceholder() {
  const items = ["免打扰", "工作专注", "睡眠模式", "驾驶模式"]
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        overflowX: "auto",
        paddingInline: 16,
        paddingBlock: 4,
        scrollSnapType: "x mandatory",
      }}
    >
      {items.map((title) => (
        <div
          key={title}
          style={{
            flex: "0 0 272px",
            scrollSnapAlign: "start",
          }}
        >
          <HeroPlaceholder title={title} subtitle="点击立即启用此情景" />
        </div>
      ))}
    </div>
  )
}

/* -------------------------- 通用 list 卡片片段 -------------------------- */

function ConditionListCard({
  enabled,
  onChange,
}: {
  enabled: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <List className="rounded-[20px]">
      <ListItem
        title={
          <span style={{ color: FONT_PRIMARY, fontWeight: 500 }}>
            定时设置
          </span>
        }
        subtitle={
          <span style={{ color: FONT_TERTIARY, fontSize: 12 }}>
            每天 23:00 - 次日 07:00
          </span>
        }
        right={<Switch modelValue={enabled} onUpdateModelValue={onChange} />}
        showArrow={false}
      />
      <ListItem
        title={
          <span style={{ color: BRAND_BLUE, fontWeight: 500 }}>添加条件</span>
        }
        subtitle={
          <span style={{ color: FONT_TERTIARY, fontSize: 12 }}>
            如连接 Wi-Fi、进入特定地点时自动生效
          </span>
        }
        right={<img src={iconArrowRightSmall} alt="" className="w-3 h-6" />}
        showArrow={false}
        border={false}
      />
    </List>
  )
}

function SwitchListCard({
  title,
  subtitle,
  value,
  onChange,
}: {
  title: string
  subtitle: string
  value: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <List className="rounded-[20px]">
      <ListItem
        title={<span style={{ color: FONT_PRIMARY, fontWeight: 500 }}>{title}</span>}
        subtitle={<span style={{ color: FONT_TERTIARY, fontSize: 12 }}>{subtitle}</span>}
        right={<Switch modelValue={value} onUpdateModelValue={onChange} />}
        showArrow={false}
        border={false}
      />
    </List>
  )
}

function SliderListCard() {
  const [brightness, setBrightness] = useState(60)
  return (
    <List className="rounded-[20px]">
      <ListItem
        title={<span style={{ color: FONT_PRIMARY, fontWeight: 500 }}>亮度</span>}
        right={
          <div style={{ minWidth: 160, paddingInlineStart: 8 }}>
            <SliderBase
              modelValue={brightness}
              onUpdateModelValue={setBrightness}
              min={0}
              max={100}
            />
          </div>
        }
        showArrow={false}
        border={false}
      />
    </List>
  )
}

/* ===================== 1. Default：免打扰二级页 ====================== */

export const Default: Story = {
  args: {
    statusBar: <StatusBar time="09:41" backgroundColor="#F1F3F5" />,
    titleBar: <TitleBar title="免打扰" leftIcon={iconChevronBack} backgroundColor="#F1F3F5" />,
    background: "#F1F3F5",
    theme: "light",
    contextWidth: "bleed",
    showFooter: true,
    listGroup: <span />, // 占位，render 中覆写
    context: <span />,
    footer: <FootnoteText />,
  },
  render: (args) => {
    const Demo = () => {
      const [scheduleEnabled, setScheduleEnabled] = useState(true)
      const [smartRecommendation, setSmartRecommendation] = useState(true)
      const [importantReminder, setImportantReminder] = useState(true)

      return (
        <SettingsContextListLayout
          {...args}
          context={<CarouselContextPlaceholder />}
          listGroup={
            <>
              <ConditionListCard enabled={scheduleEnabled} onChange={setScheduleEnabled} />
              <SwitchListCard
                title="推荐开启与关闭"
                subtitle="根据日程、地点等智能识别后建议切换"
                value={smartRecommendation}
                onChange={setSmartRecommendation}
              />
              <SwitchListCard
                title="重要信息提醒"
                subtitle="验证码、出行行程等仍按重要级别提醒"
                value={importantReminder}
                onChange={setImportantReminder}
              />
            </>
          }
        />
      )
    }
    return <Demo />
  },
}

/* ===================== 2. 显示与亮度：含 Slider 卡片 ====================== */

export const DisplayBrightness: Story = {
  name: "DisplayBrightness（含 Slider）",
  render: () => {
    const Demo = () => {
      const [auto, setAuto] = useState(true)
      return (
        <SettingsContextListLayout
          statusBar={<StatusBar time="14:35" backgroundColor="#F1F3F5" />}
          titleBar={
            <TitleBar
              title="显示和亮度"
              leftIcon={iconChevronBack}
              backgroundColor="#F1F3F5"
            />
          }
          background="#F1F3F5"
          theme="light"
          contextWidth="centered"
          context={
            <div
              style={{
                height: 280,
                borderRadius: 24,
                background:
                  "linear-gradient(180deg,#f3f5fa 0%, #e8edf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: FONT_TERTIARY,
                fontSize: 13,
              }}
            >
              [显示模式预览：浅色 / 深色 对比图]
            </div>
          }
          listGroup={
            <>
              <SliderListCard />
              <SwitchListCard
                title="自动调节"
                subtitle="环境光自动调整屏幕亮度"
                value={auto}
                onChange={setAuto}
              />
              <List className="rounded-[20px]">
                <ListItem
                  title={
                    <span style={{ color: FONT_PRIMARY, fontWeight: 500 }}>
                      护眼模式
                    </span>
                  }
                  right={
                    <div className="flex items-center gap-1">
                      <span style={{ fontSize: 14, color: FONT_TERTIARY }}>
                        全天开启
                      </span>
                      <img
                        src={iconArrowRightSmall}
                        alt=""
                        className="w-3 h-6"
                      />
                    </div>
                  }
                  showArrow={false}
                  border={false}
                />
              </List>
            </>
          }
        />
      )
    }
    return <Demo />
  },
}

/* ===================== 3. 无 Context（slot=none） ====================== */

export const WithoutContext: Story = {
  name: "showContext=false / context=none",
  render: () => {
    const Demo = () => {
      const [v, setV] = useState(true)
      return (
        <SettingsContextListLayout
          statusBar={<StatusBar time="09:41" backgroundColor="#F1F3F5" />}
          titleBar={
            <TitleBar
              title="云空间"
              leftIcon={iconChevronBack}
              backgroundColor="#F1F3F5"
            />
          }
          background="#F1F3F5"
          theme="light"
          context="none"
          listGroup={
            <>
              <SwitchListCard
                title="自动备份"
                subtitle="仅在 Wi-Fi 下自动备份照片与视频"
                value={v}
                onChange={setV}
              />
              <SwitchListCard
                title="备份联系人"
                subtitle="登录账号后自动同步至云端"
                value={v}
                onChange={setV}
              />
            </>
          }
          showFooter={false}
        />
      )
    }
    return <Demo />
  },
}

/* ===================== 4. 仅一张 list 卡片：验证 gap 不影响首张 ====================== */

export const SingleListCard: Story = {
  args: {
    statusBar: <StatusBar time="09:41" backgroundColor="#F1F3F5" />,
    titleBar: (
      <TitleBar
        title="智慧多窗"
        leftIcon={iconChevronBack}
        backgroundColor="#F1F3F5"
      />
    ),
    background: "#F1F3F5",
    theme: "light",
    contextWidth: "centered",
    context: (
      <div
        style={{
          height: 160,
          borderRadius: 24,
          background:
            "linear-gradient(135deg,#eaf1ff 0%, #d9e6ff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: BRAND_BLUE,
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        [多窗预览图]
      </div>
    ),
    listGroup: (
      <List className="rounded-[20px]">
        <ListItem
          title={
            <span style={{ color: FONT_PRIMARY, fontWeight: 500 }}>
              悬浮窗
            </span>
          }
          right={<img src={iconArrowRightSmall} alt="" className="w-3 h-6" />}
          showArrow={false}
          border={false}
        />
      </List>
    ),
  },
}
