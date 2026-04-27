"use client"

import { useState } from "react"
import {
  Divider,
  FeaturePromoCard,
  List,
  ListItem,
  SceneModeCard,
  StatusBar,
  Switch,
} from "@/component"
import {
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react"

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
      <circle
        cx="32"
        cy="32"
        r="14"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
      />
      <circle cx="32" cy="32" r="5" fill="#FFFFFF" />
    </svg>
  )
}

function SleepModeIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="睡眠模式"
    >
      <circle cx="32" cy="32" r="29" fill="#11B981" />
      <path
        d="M39.2 40.8c-7.1 0-12.8-5.7-12.8-12.8 0-2.5.7-4.8 1.9-6.9-5.2 1.6-8.9 6.4-8.9 12.1 0 7 5.7 12.7 12.7 12.7 5.3 0 9.9-3.2 11.9-7.8-1.3.5-2.8.7-4.8.7z"
        fill="#FFFFFF"
      />
      <circle cx="45" cy="19" r="2.3" fill="#FFFFFF" />
      <circle cx="40.5" cy="14.5" r="1.4" fill="#FFFFFF" fillOpacity="0.86" />
    </svg>
  )
}

function SectionDivider() {
  return (
    <Divider
      margin="0"
      color="rgba(0, 0, 0, 0.14)"
      hairline
    />
  )
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-medium leading-[18px] tracking-[0.01em] text-black/38">
      {children}
    </p>
  )
}

function RightArrowValue({
  value,
  icon = "right",
}: {
  value: string
  icon?: "right" | "down"
}) {
  return (
    <div className="flex items-center gap-2 text-black/66">
      <span className="text-[16px] leading-6 tracking-[-0.01em]">{value}</span>
      {icon === "down" ? (
        <ChevronDown size={18} strokeWidth={1.9} className="text-black/34" />
      ) : (
        <ChevronRight size={18} strokeWidth={1.9} className="text-black/34" />
      )}
    </div>
  )
}

export default function SceneModeSettingsV1() {
  const [promoEnabled, setPromoEnabled] = useState(false)
  const [smartRecommendationEnabled, setSmartRecommendationEnabled] = useState(true)
  const [importantReminderEnabled, setImportantReminderEnabled] = useState(false)

  return (
    <div className="mx-auto min-h-[792px] w-[360px] overflow-hidden bg-[linear-gradient(180deg,#FCFCFD_0%,#F6F8FB_18%,#FFFFFF_40%,#FFFFFF_100%)] text-black">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-[-52px] top-[88px] size-[180px] rounded-full bg-[#D8E4FF]/65 blur-3xl" />
        <div className="pointer-events-none absolute right-[-80px] top-[188px] size-[220px] rounded-full bg-[#EFE8FF]/80 blur-3xl" />

        <StatusBar time="08:08" backgroundColor="transparent" />

        <header className="relative z-10 px-6 pt-5">
          <h1 className="text-[34px] font-semibold leading-[1.12] tracking-[-0.045em] text-black/95">
            情景模式
          </h1>
          <p className="mt-5 text-[16px] leading-[1.7] tracking-[-0.01em] text-black/76">
            开启后会自动调整系统功能，让您能全身心投入情景。
          </p>
        </header>

        <section className="relative z-10 mt-6">
          <div
            className="overflow-x-auto pb-3"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="flex w-max gap-4 pl-6 pr-6">
              <FeaturePromoCard
                className="shrink-0 shadow-[0_22px_36px_rgba(32,42,74,0.08)] backdrop-blur-[20px]"
                icon={<DoNotDisturbIcon />}
                title="免打扰"
                subtitle="减少打扰保持专注"
                actionLabel={promoEnabled ? "已开启" : "立即开启"}
                actionDisabled={promoEnabled}
                onAction={() => setPromoEnabled(true)}
              />

              <SceneModeCard
                className="shrink-0 shadow-[0_22px_36px_rgba(32,42,74,0.06)] backdrop-blur-[18px]"
                icon={<FocusModeIcon />}
                title="专注模式"
                subtitle="屏蔽通知专心做事"
              />

              <SceneModeCard
                className="shrink-0 shadow-[0_22px_36px_rgba(32,42,74,0.06)] backdrop-blur-[18px]"
                icon={<SleepModeIcon />}
                title="睡眠"
                subtitle="夜间静音放松休息"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex h-5 w-[132px] items-center justify-center rounded-full bg-black/[0.04]">
              <div className="flex h-[8px] w-[66px] items-center rounded-full bg-black/[0.08] px-[2px]">
                <div className="h-[8px] w-[22px] rounded-full bg-black/[0.18]" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <main className="px-6 pb-10">
        <section className="mt-6">
          <SectionDivider />
          <div className="flex items-start justify-between gap-4 py-10">
            <div className="min-w-0 flex-1">
              <SectionEyebrow>条件开启</SectionEyebrow>

              <p className="mt-5 text-[22px] font-semibold leading-[1.2] tracking-[-0.03em] text-black/93">
                周日 周六
              </p>
              <p className="mt-3 text-[18px] leading-[1.35] tracking-[-0.02em] text-black/88">
                22:00-次日 07:00
              </p>

              <button
                type="button"
                className="mt-2 inline-flex items-center gap-1 text-[15px] font-medium leading-6 text-[#1677FF]"
              >
                <Plus size={15} strokeWidth={2.2} />
                添加条件
              </button>

              <p className="mt-4 max-w-[214px] text-[13px] leading-[1.6] text-black/30">
                本功能需调用位置权限，读取位置信息
              </p>
            </div>

            <div className="pt-[38px] text-[18px] font-medium leading-7 tracking-[-0.02em] text-black/90">
              已关闭
            </div>
          </div>
        </section>

        <section>
          <SectionDivider />
          <div className="flex items-start justify-between gap-4 py-10">
            <div className="min-w-0 flex-1">
              <h2 className="text-[22px] font-semibold leading-[1.18] tracking-[-0.035em] text-black/95">
                推荐开启与关闭
              </h2>
              <p className="mt-4 text-[14px] leading-[1.55] text-black/32">
                基于个人偏好，以及位置、时间等数据信息，智能推荐开启或关闭相应的情景模式，关闭后将影响情景模式的推荐体验。
                <br />
                查看使用个性化智能服务的应用
              </p>
            </div>

            <div className="shrink-0 pt-1">
              <Switch
                modelValue={smartRecommendationEnabled}
                onUpdateModelValue={setSmartRecommendationEnabled}
                activeColor="rgba(0, 0, 0, 0.46)"
                inactiveColor="rgba(0, 0, 0, 0.16)"
                nodeColor="#FFFFFF"
                className="scale-[1.18]"
              />
            </div>
          </div>
        </section>

        <section>
          <SectionDivider />
          <div className="py-7">
            <SectionEyebrow>允许打扰</SectionEyebrow>

            <List className="mt-2 bg-transparent">
              <ListItem
                title={
                  <span className="text-[22px] font-semibold leading-[1.2] tracking-[-0.03em] text-black/95">
                    应用和元服务
                  </span>
                }
                right={<RightArrowValue value="未选择" />}
                showArrow={false}
                leftGap={0}
              />
              <ListItem
                title={
                  <span className="text-[22px] font-semibold leading-[1.2] tracking-[-0.03em] text-black/95">
                    联系人
                  </span>
                }
                right={<RightArrowValue value="仅允许收藏联系人" />}
                showArrow={false}
                leftGap={0}
                border={false}
              />
            </List>
          </div>
        </section>

        <section>
          <SectionDivider />
          <div className="flex items-start justify-between gap-4 py-8">
            <div className="min-w-0 flex-1">
              <h2 className="text-[22px] font-semibold leading-[1.18] tracking-[-0.035em] text-black/95">
                重要信息提醒
              </h2>
              <p className="mt-4 text-[14px] leading-[1.55] text-black/32">
                开启后，模式开启期间会提醒重要信息(短信验证码和实况)。
              </p>
            </div>

            <div className="shrink-0 pt-1">
              <Switch
                modelValue={importantReminderEnabled}
                onUpdateModelValue={setImportantReminderEnabled}
                inactiveColor="rgba(0, 0, 0, 0.18)"
                nodeColor="#FFFFFF"
                className="scale-[1.18]"
              />
            </div>
          </div>
        </section>

        <section>
          <SectionDivider />
          <div className="py-7">
            <SectionEyebrow>联系系统功能</SectionEyebrow>

            <List className="mt-2 bg-transparent">
              <ListItem
                title={
                  <span className="text-[22px] font-semibold leading-[1.2] tracking-[-0.03em] text-black/95">
                    深色模式
                  </span>
                }
                right={<RightArrowValue value="不关联" icon="down" />}
                showArrow={false}
                leftGap={0}
              />
              <ListItem
                title={
                  <span className="text-[22px] font-semibold leading-[1.2] tracking-[-0.03em] text-black/95">
                    护眼模式
                  </span>
                }
                right={<RightArrowValue value="不关联" icon="down" />}
                showArrow={false}
                leftGap={0}
                border={false}
              />
            </List>
          </div>
        </section>

        <div className="mt-6 flex justify-center">
          <div className="h-[5px] w-[124px] rounded-full bg-black/[0.08]" />
        </div>
      </main>
    </div>
  )
}
