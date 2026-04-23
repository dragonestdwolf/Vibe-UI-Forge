"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import {
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Leaf,
  MoreHorizontal,
  Umbrella,
  Users,
} from "lucide-react"
import { StatusBar } from "@/component/StatusBar"
import { Switch } from "@/component/Switch"
import { Button } from "@/component/Button"
import { List, ListItem } from "@/component/List"

/* ─── design tokens ─────────────────────────────────────── */
const PRIMARY_BLUE = "#0a59f7"
const BTN_BG = "#f0f2f5"
const GREEN = "#34c060"
const BLUE_ICON = "#1677ff"
const BG = "#f2f4f8"
const CARD_SHADOW = "0_4px_18px_rgba(0,0,0,0.07)"

/* ─── shared helpers ──────────────────────────────────────── */
function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-2 px-1 text-[13px] leading-[18px] text-[#8a9099]">{children}</p>
  )
}

function CircleIcon({ bg, size = 44, children }: { bg: string; size?: number; children: ReactNode }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, backgroundColor: bg }}
    >
      {children}
    </div>
  )
}

function InfoButton({ children, block = false }: { children: ReactNode; block?: boolean }) {
  return (
    <Button color={BTN_BG} textColor={PRIMARY_BLUE} size="large" round block={block}>
      {children}
    </Button>
  )
}

function SmallInfoButton({ children }: { children: ReactNode }) {
  return (
    <Button color={BTN_BG} textColor={PRIMARY_BLUE} size="small" round block>
      {children}
    </Button>
  )
}

/* ─── floor 1: 使用统计和管理 ─────────────────────────────── */
function UsageCard() {
  return (
    <div className={`rounded-[20px] bg-white px-4 py-4 shadow-[${CARD_SHADOW}]`}>
      <div className="flex items-center gap-3">
        <CircleIcon bg={BLUE_ICON}>
          <BarChart2 size={22} strokeWidth={1.7} className="text-white" />
        </CircleIcon>
        <span className="text-[17px] font-semibold leading-[24px] text-[#191d24]">
          使用统计和管理
        </span>
      </div>
      <p className="mt-3 text-[14px] leading-[22px] text-[#737b87]">
        了解自己的屏幕使用情况，按需设置使用限制，合理规划设备使用时长
      </p>
      <div className="mt-4">
        <InfoButton block>开启</InfoButton>
      </div>
    </div>
  )
}

/* ─── floor 2: 守护卡片 ──────────────────────────────────── */
function GuardCard({
  icon,
  title,
  description,
  btnLabel,
}: {
  icon: ReactNode
  title: string
  description: string
  btnLabel: string
}) {
  return (
    <div className={`flex flex-1 flex-col rounded-[20px] bg-white px-4 py-4 shadow-[${CARD_SHADOW}]`}>
      <div className="flex items-center gap-2">
        <CircleIcon bg={GREEN} size={40}>
          {icon}
        </CircleIcon>
        <span className="text-[15px] font-semibold leading-[20px] text-[#191d24]">
          {title}
        </span>
      </div>
      <p className="mt-2 flex-1 text-[12px] leading-[18px] text-[#737b87]">
        {description}
      </p>
      <div className="mt-3">
        <SmallInfoButton>{btnLabel}</SmallInfoButton>
      </div>
    </div>
  )
}

/* ─── page ─────────────────────────────────────────────── */
export default function DeviceHealthV2() {
  const [passwordEnabled, setPasswordEnabled] = useState(false)

  return (
    <div className="mx-auto flex min-h-[792px] w-[360px] flex-col bg-[#f2f4f8] text-[#191d24]">
      <StatusBar time="09:41" backgroundColor={BG} />

      {/* ── TitleBar ── */}
      <header className="flex items-center gap-2 px-4 pb-1 pt-2">
        <button
          type="button"
          aria-label="返回"
          className="flex size-[40px] shrink-0 items-center justify-center rounded-full border-0 bg-white/90 p-0 shadow-[0_2px_8px_rgba(0,0,0,0.09)]"
        >
          <ChevronLeft size={22} strokeWidth={2} className="text-[#191d24]" />
        </button>

        <h1 className="min-w-0 flex-1 text-[20px] font-bold leading-[28px] text-[#191d24]">
          健康使用设备
        </h1>

        <button
          type="button"
          aria-label="更多"
          className="flex size-[40px] shrink-0 items-center justify-center rounded-full border-0 bg-white/90 p-0 shadow-[0_2px_8px_rgba(0,0,0,0.09)]"
        >
          <MoreHorizontal size={20} strokeWidth={2} className="text-[#191d24]" />
        </button>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 px-4 pt-3 pb-5">
        <div className="flex flex-col gap-5">

          {/* 一楼 */}
          <section>
            <SectionLabel>自己使用</SectionLabel>
            <UsageCard />
          </section>

          {/* 二楼 */}
          <section>
            <SectionLabel>远程守护</SectionLabel>
            <div className="flex gap-3">
              <GuardCard
                icon={<Users size={20} strokeWidth={1.7} className="text-white" />}
                title="守护家人"
                description="建立守护关系，管理家人设备使用情况"
                btnLabel="去守护"
              />
              <GuardCard
                icon={<Leaf size={20} strokeWidth={1.7} className="text-white" />}
                title="被家人守护"
                description="展示二维码，家人可以扫码守护我"
                btnLabel="二维码"
              />
            </div>
          </section>

          {/* 三楼 */}
          <section>
            <SectionLabel>临时给孩子使用</SectionLabel>
            <div className={`overflow-hidden rounded-[20px] bg-white shadow-[${CARD_SHADOW}]`}>
              <List>
                <ListItem
                  left={
                    <CircleIcon bg={GREEN} size={44}>
                      <Umbrella size={20} strokeWidth={1.7} className="text-white" />
                    </CircleIcon>
                  }
                  title={
                    <span className="text-[16px] font-medium text-[#191d24]">
                      未成年人模式
                    </span>
                  }
                  right={
                    <div className="flex items-center gap-0.5">
                      <span className="text-[13px] text-[#9ba4b0]">未开启</span>
                      <ChevronRight size={16} strokeWidth={2} className="text-[#c2c8d0]" />
                    </div>
                  }
                  showArrow={false}
                  border={false}
                  leftGap={12}
                />
              </List>
            </div>
          </section>

          {/* 四楼 */}
          <section>
            <SectionLabel>密码管理</SectionLabel>
            <div className={`overflow-hidden rounded-[20px] bg-white shadow-[${CARD_SHADOW}]`}>
              <List>
                <ListItem
                  title={
                    <span className="text-[16px] font-semibold text-[#191d24]">
                      健康使用设备密码
                    </span>
                  }
                  right={
                    <Switch
                      modelValue={passwordEnabled}
                      onUpdateModelValue={setPasswordEnabled}
                    />
                  }
                  showArrow={false}
                  border={false}
                />
              </List>
            </div>
            <p className="mt-2 px-1 text-[12px] leading-[18px] text-[#9ba4b0]">
              开启后，修改屏幕使用管理和远程守护的规则时，需验证密码
            </p>
          </section>

        </div>
      </main>

      {/* ── Home indicator ── */}
      <div className="flex h-7 shrink-0 items-center justify-center pb-2">
        <div className="h-[5px] w-28 rounded-full bg-[#b9bec7]" />
      </div>
    </div>
  )
}
