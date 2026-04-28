"use client"

import { useState, type ReactNode } from "react"
import { StatusBar } from "@/component/StatusBar"
import { List, ListItem } from "@/component/List"
import { Switch } from "@/component/Switch"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Ellipsis,
  MoonStar,
  Plus,
} from "lucide-react"

function IconBubble({
  ariaLabel,
  children,
}: {
  ariaLabel: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="flex size-10 items-center justify-center rounded-full border-0 bg-black/[0.047] p-0 text-black/90"
    >
      {children}
    </button>
  )
}

function SceneHeader() {
  return (
    <header className="w-[328px] self-center pt-1">
      <div className="flex items-center gap-3">
        <IconBubble ariaLabel="返回">
          <ChevronLeft size={22} strokeWidth={2.1} />
        </IconBubble>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[20px] font-semibold leading-[24px] text-black/90">
            情景模式
          </h1>
          <p className="mt-1 truncate text-[13px] leading-[18px] text-black/55">
            自动调系统功能，更专注
          </p>
        </div>

        <div className="flex items-center gap-2">
          <IconBubble ariaLabel="添加">
            <Plus size={20} strokeWidth={2.2} />
          </IconBubble>
          <IconBubble ariaLabel="帮助">
            <CircleHelp size={20} strokeWidth={2} />
          </IconBubble>
          <IconBubble ariaLabel="更多操作">
            <Ellipsis size={20} strokeWidth={2.2} />
          </IconBubble>
        </div>
      </div>
    </header>
  )
}

function SectionTitle({
  title,
  action,
  className = "",
}: {
  title: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={`flex items-center justify-between gap-3 px-1 ${className}`}>
      <h2 className="text-[16px] font-semibold leading-[22px] text-black/90">
        {title}
      </h2>
      {action}
    </div>
  )
}

function CarouselCard({
  activeIndex,
  onDotSelect,
}: {
  activeIndex: number
  onDotSelect: (index: number) => void
}) {
  const slides = [
    {
      title: "免打扰",
      subtitle: "减少打扰保持专注",
      button: "立即开启",
    },
    {
      title: "睡眠",
      subtitle: "晚间自动降低干扰",
      button: "查看设置",
    },
    {
      title: "工作",
      subtitle: "上班时段保持高效节奏",
      button: "稍后设置",
    },
  ]

  const slide = slides[activeIndex] ?? slides[0]

  return (
    <section className="pt-2">
      <div className="rounded-[30px] bg-white px-6 pt-8 pb-5 shadow-[0_18px_40px_rgba(26,34,48,0.06)]">
        <div className="mx-auto flex size-[76px] items-center justify-center rounded-full bg-[#8d53ff] shadow-[0_10px_20px_rgba(141,83,255,0.28)]">
          <MoonStar size={34} strokeWidth={2.1} className="text-white" />
        </div>
        <div className="mt-5 text-center">
          <h3 className="text-[30px] font-semibold leading-[36px] tracking-[-0.02em] text-black/90">
            {slide.title}
          </h3>
          <p className="mt-2 text-[15px] font-medium leading-[20px] text-black/40">
            {slide.subtitle}
          </p>
        </div>
        <button
          type="button"
          className="mt-7 flex h-12 w-full items-center justify-center rounded-full border-0 bg-black/[0.047] text-[16px] font-medium leading-6 text-black/90"
        >
          {slide.button}
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {slides.map((item, index) => {
          const isActive = index === activeIndex

          return (
            <button
              key={item.title}
              type="button"
              aria-label={`切换到${item.title}`}
              aria-pressed={isActive}
              onClick={() => onDotSelect(index)}
              className={`rounded-full border-0 p-0 transition-all ${
                isActive
                  ? "h-2.5 w-5 bg-[#0a59f7]"
                  : "size-2.5 bg-black/[0.15]"
              }`}
            />
          )
        })}
      </div>
    </section>
  )
}

function TrailingLink({
  value,
}: {
  value: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[14px] leading-5 text-black/40">{value}</span>
      <ChevronRight size={17} strokeWidth={1.8} className="text-black/25" />
    </div>
  )
}

function TrailingSelect({
  value,
}: {
  value: string
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-[#f5f6f8] px-3 py-1.5">
      <span className="text-[13px] leading-[18px] text-black/50">{value}</span>
      <ChevronDown size={15} strokeWidth={1.9} className="text-black/35" />
    </div>
  )
}

export default function SettingsPageV26() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [recommendEnabled, setRecommendEnabled] = useState(true)
  const [importantReminderEnabled, setImportantReminderEnabled] = useState(true)

  return (
    <div className="mx-auto flex min-h-[792px] w-[360px] flex-col bg-comp-background-gray text-black/90">
      <StatusBar time="09:41" backgroundColor="#F1F3F5" />
      <SceneHeader />

      <main className="flex-1 px-4 pb-4">
        <CarouselCard activeIndex={activeSlide} onDotSelect={setActiveSlide} />

        <section className="mt-6">
          <SectionTitle
            title="条件开启"
            action={
              <button
                type="button"
                aria-label="添加条件"
                className="flex size-8 items-center justify-center rounded-full border-0 bg-black/[0.047] p-0 text-black/60"
              >
                <Plus size={18} strokeWidth={2.2} />
              </button>
            }
          />

          <List className="mt-2 overflow-hidden rounded-[24px]">
            <ListItem
              title="周日 周六"
              subtitle="22:00 到次日 07:00"
              right={
                <div className="flex items-center gap-2">
                  <span className="text-[14px] leading-5 text-black/40">已关闭</span>
                  <ChevronRight size={17} strokeWidth={1.8} className="text-black/25" />
                </div>
              }
              showArrow={false}
              border={false}
            />
          </List>

          <p className="mt-2 px-1 text-[12px] leading-[18px] text-black/40">
            此功能需获取位置权限才能使用
          </p>
        </section>

        <section className="mt-4">
          <List className="overflow-hidden rounded-[24px]">
            <ListItem
              title="推荐开启与关闭"
              subtitle="根据偏好与位置自动推荐"
              right={
                <Switch
                  modelValue={recommendEnabled}
                  onUpdateModelValue={setRecommendEnabled}
                />
              }
              showArrow={false}
              border={false}
            />
          </List>
        </section>

        <section className="mt-4">
          <SectionTitle title="允许打扰" />
          <List className="mt-2 overflow-hidden rounded-[24px]">
            <ListItem
              title="应用和元服务"
              right={<TrailingLink value="未选择" />}
              showArrow={false}
            />
            <ListItem
              title="联系人"
              right={<TrailingLink value="仅限收藏" />}
              showArrow={false}
              border={false}
            />
          </List>
        </section>

        <section className="mt-4">
          <SectionTitle title="重要信息提醒" />
          <List className="mt-2 overflow-hidden rounded-[24px]">
            <ListItem
              title="重要信息提醒"
              subtitle="验证码、实况消息继续提醒"
              right={
                <Switch
                  modelValue={importantReminderEnabled}
                  onUpdateModelValue={setImportantReminderEnabled}
                />
              }
              showArrow={false}
              border={false}
            />
          </List>
        </section>

        <section className="mt-4">
          <SectionTitle title="关联系统功能" />
          <List className="mt-2 overflow-hidden rounded-[24px]">
            <ListItem
              title="深色模式"
              right={<TrailingSelect value="不关联" />}
              showArrow={false}
            />
            <ListItem
              title="护眼模式"
              right={<TrailingSelect value="不关联" />}
              showArrow={false}
              border={false}
            />
          </List>
        </section>
      </main>

      <div className="flex h-8 items-center justify-center">
        <div className="h-1.5 w-28 rounded-full bg-black/[0.16]" />
      </div>
    </div>
  )
}
