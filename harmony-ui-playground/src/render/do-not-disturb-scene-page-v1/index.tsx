"use client"

import type { ReactNode } from "react"
import { useMemo, useState } from "react"
import { StatusBar } from "@/component/StatusBar"
import { TitleBar } from "@/component/TitleBar"
import { List, ListItem } from "@/component/List"
import { Switch } from "@/component/Switch"
import {
  AppWindow,
  BellOff,
  Car,
  ChevronRight,
  Clock3,
  EyeOff,
  MapPin,
  MessageCircle,
  MoonStar,
  Phone,
  Sparkles,
  Users,
} from "lucide-react"

import iconChevronBack from "../../blocks/assets/pixso-icons/icon-chevron-backward.png"

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-1 py-2">
      <span className="text-[13px] leading-[18px] font-medium text-black/45">
        {children}
      </span>
    </div>
  )
}

function SurfaceIcon({
  children,
  tint = "rgba(124, 92, 255, 0.12)",
}: {
  children: ReactNode
  tint?: string
}) {
  return (
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: tint }}
    >
      {children}
    </div>
  )
}

function RightValue({
  value,
  emphasize = false,
}: {
  value: string
  emphasize?: boolean
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`text-[14px] leading-5 ${
          emphasize ? "font-medium text-black/85" : "text-black/45"
        }`}
      >
        {value}
      </span>
      <ChevronRight size={16} strokeWidth={1.9} className="text-black/28" />
    </div>
  )
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) {
  return (
    <div className="rounded-[22px] bg-[#F6F7FA] px-4 py-3.5">
      <div className="text-[12px] leading-4 font-medium text-black/38">
        {label}
      </div>
      <div className="mt-2 text-[23px] leading-[28px] font-semibold tracking-[-0.03em] text-black/90">
        {value}
      </div>
      <div className="mt-1 text-[13px] leading-[18px] text-black/45">
        {hint}
      </div>
    </div>
  )
}

function StatusPill({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center rounded-full bg-[#F2EEFF] px-3 py-1 text-[12px] leading-4 font-medium text-[#6548DC]">
      {children}
    </div>
  )
}

export default function DoNotDisturbScenePageV1() {
  const [enabled, setEnabled] = useState(true)
  const [carBluetooth, setCarBluetooth] = useState(false)
  const [repeatCaller, setRepeatCaller] = useState(true)
  const [silenceNotifications, setSilenceNotifications] = useState(true)
  const [hideLockscreen, setHideLockscreen] = useState(true)
  const [statusBarOnly, setStatusBarOnly] = useState(false)
  const [dimScreen, setDimScreen] = useState(true)

  const nextRunText = useMemo(() => {
    return enabled ? "今晚 22:30 自动开启" : "当前未启用"
  }, [enabled])

  return (
    <div className="mx-auto flex min-h-[792px] w-[360px] flex-col bg-[#F1F3F6]">
      <StatusBar time="09:41" backgroundColor="#F1F3F6" />

      <div className="mx-auto w-[328px]">
        <TitleBar
          title="免打扰"
          leftIcon={iconChevronBack}
          rightIcons={[]}
          backgroundColor="#F1F3F6"
        />
      </div>

      <main className="flex flex-1 flex-col gap-4 px-4 pb-8">
        <section className="rounded-[28px] bg-white px-5 pt-6 pb-5 shadow-[0_10px_30px_rgba(22,34,58,0.06)]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8E6CFF_0%,#6D4DFF_100%)] shadow-[0_14px_28px_rgba(109,77,255,0.24)]">
                <MoonStar size={32} strokeWidth={2.1} className="text-white" />
              </div>

              <div className="min-w-0">
                <StatusPill>情景模式</StatusPill>
                <h1 className="mt-3 text-[30px] leading-[34px] font-semibold tracking-[-0.04em] text-black/92">
                  免打扰
                </h1>
                <p className="mt-2 text-[14px] leading-[22px] text-black/55">
                  夜间自动静音，仅保留重要联系人与紧急来电提醒。
                </p>
              </div>
            </div>

            <Switch
              modelValue={enabled}
              onUpdateModelValue={setEnabled}
              border
              borderWidth={1.5}
              borderGap={1.5}
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <MetricCard label="开始时间" value="22:30" hint="工作日夜间" />
            <MetricCard label="结束时间" value="07:00" hint="次日自动恢复" />
          </div>

          <div className="mt-4 rounded-[24px] bg-[#F6F7FB] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[14px] leading-5 font-medium text-black/88">
                  {nextRunText}
                </div>
                <div className="mt-1 text-[12px] leading-4 text-black/42">
                  已同步静音、锁屏隐藏详情与屏幕微降亮度
                </div>
              </div>
              <div className="rounded-full bg-white px-3 py-1.5 text-[12px] leading-4 font-medium text-[#6548DC] shadow-[0_4px_10px_rgba(32,24,72,0.04)]">
                工作日
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <div className="rounded-full bg-white px-3 py-1.5 text-[12px] leading-4 text-black/55">
                收藏联系人可来电
              </div>
              <div className="rounded-full bg-white px-3 py-1.5 text-[12px] leading-4 text-black/55">
                重复来电可穿透
              </div>
              <div className="rounded-full bg-white px-3 py-1.5 text-[12px] leading-4 text-black/55">
                锁屏隐藏内容
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionLabel>自动开启</SectionLabel>
          <List className="overflow-hidden rounded-[24px]">
            <ListItem
              left={
                <SurfaceIcon>
                  <Clock3
                    size={18}
                    strokeWidth={1.9}
                    className="text-[#6D4DFF]"
                  />
                </SurfaceIcon>
              }
              title="定时开启"
              subtitle="周一至周五 22:30 - 次日 07:00"
              right={<RightValue value="已启用" emphasize />}
              showArrow={false}
            />
            <ListItem
              left={
                <SurfaceIcon tint="rgba(10, 89, 247, 0.10)">
                  <MapPin
                    size={18}
                    strokeWidth={1.9}
                    className="text-[#0A59F7]"
                  />
                </SurfaceIcon>
              }
              title="到达地点时开启"
              subtitle="公司"
              right={<RightValue value="1 个地点" />}
              showArrow={false}
            />
            <ListItem
              left={
                <SurfaceIcon tint="rgba(27, 163, 98, 0.12)">
                  <Car size={18} strokeWidth={1.9} className="text-[#12995A]" />
                </SurfaceIcon>
              }
              title="连接车载蓝牙时开启"
              subtitle="开车时减少来电打扰"
              right={
                <Switch
                  modelValue={carBluetooth}
                  onUpdateModelValue={setCarBluetooth}
                />
              }
              showArrow={false}
              border={false}
            />
          </List>
        </section>

        <section>
          <SectionLabel>允许打扰</SectionLabel>
          <List className="overflow-hidden rounded-[24px]">
            <ListItem
              left={
                <SurfaceIcon tint="rgba(255, 169, 45, 0.14)">
                  <Phone
                    size={18}
                    strokeWidth={1.9}
                    className="text-[#F08A00]"
                  />
                </SurfaceIcon>
              }
              title="来电"
              subtitle="收藏联系人可响铃"
              right={<RightValue value="收藏联系人" emphasize />}
              showArrow={false}
            />
            <ListItem
              left={
                <SurfaceIcon tint="rgba(10, 89, 247, 0.10)">
                  <MessageCircle
                    size={18}
                    strokeWidth={1.9}
                    className="text-[#0A59F7]"
                  />
                </SurfaceIcon>
              }
              title="消息"
              subtitle="仅显示重点联系人提醒"
              right={<RightValue value="重要联系人" />}
              showArrow={false}
            />
            <ListItem
              left={
                <SurfaceIcon tint="rgba(124, 92, 255, 0.12)">
                  <Users
                    size={18}
                    strokeWidth={1.9}
                    className="text-[#6D4DFF]"
                  />
                </SurfaceIcon>
              }
              title="重复来电"
              subtitle="同一号码 3 分钟内再次来电时响铃"
              right={
                <Switch
                  modelValue={repeatCaller}
                  onUpdateModelValue={setRepeatCaller}
                />
              }
              showArrow={false}
            />
            <ListItem
              left={
                <SurfaceIcon tint="rgba(33, 189, 152, 0.12)">
                  <AppWindow
                    size={18}
                    strokeWidth={1.9}
                    className="text-[#18A783]"
                  />
                </SurfaceIcon>
              }
              title="应用例外"
              subtitle="工作台、门禁码"
              right={<RightValue value="2 个应用" />}
              showArrow={false}
              border={false}
            />
          </List>
        </section>

        <section>
          <SectionLabel>通知与显示</SectionLabel>
          <List className="overflow-hidden rounded-[24px]">
            <ListItem
              left={
                <SurfaceIcon tint="rgba(255, 111, 93, 0.14)">
                  <BellOff
                    size={18}
                    strokeWidth={1.9}
                    className="text-[#E05E4A]"
                  />
                </SurfaceIcon>
              }
              title="通知静音"
              subtitle="来电与消息不播放提示音"
              right={
                <Switch
                  modelValue={silenceNotifications}
                  onUpdateModelValue={setSilenceNotifications}
                />
              }
              showArrow={false}
            />
            <ListItem
              left={
                <SurfaceIcon tint="rgba(31, 41, 55, 0.10)">
                  <EyeOff
                    size={18}
                    strokeWidth={1.9}
                    className="text-black/70"
                  />
                </SurfaceIcon>
              }
              title="隐藏锁屏通知内容"
              subtitle="仅显示通知来源，不显示正文"
              right={
                <Switch
                  modelValue={hideLockscreen}
                  onUpdateModelValue={setHideLockscreen}
                />
              }
              showArrow={false}
            />
            <ListItem
              left={
                <SurfaceIcon tint="rgba(10, 89, 247, 0.10)">
                  <MoonStar
                    size={18}
                    strokeWidth={1.9}
                    className="text-[#0A59F7]"
                  />
                </SurfaceIcon>
              }
              title="状态栏仅显示图标"
              subtitle="不显示横幅和浮层"
              right={
                <Switch
                  modelValue={statusBarOnly}
                  onUpdateModelValue={setStatusBarOnly}
                />
              }
              showArrow={false}
            />
            <ListItem
              left={
                <SurfaceIcon tint="rgba(255, 210, 122, 0.22)">
                  <Sparkles
                    size={18}
                    strokeWidth={1.9}
                    className="text-[#D18A1A]"
                  />
                </SurfaceIcon>
              }
              title="微降屏幕亮度"
              subtitle="夜间场景下减轻视觉刺激"
              right={
                <Switch
                  modelValue={dimScreen}
                  onUpdateModelValue={setDimScreen}
                />
              }
              showArrow={false}
              border={false}
            />
          </List>
        </section>

        <section className="rounded-[24px] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(22,34,58,0.04)]">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F2EEFF]">
              <MoonStar size={18} strokeWidth={2} className="text-[#6D4DFF]" />
            </div>
            <div className="min-w-0">
              <div className="text-[15px] leading-5 font-medium text-black/88">
                当前模式会保留紧急联系通道
              </div>
              <p className="mt-1 text-[13px] leading-[20px] text-black/48">
                你仍会收到重复来电、收藏联系人与应用例外的关键提醒。
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
