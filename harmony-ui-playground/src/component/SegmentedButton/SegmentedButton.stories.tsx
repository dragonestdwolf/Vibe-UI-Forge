import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState, useId } from "react"
import { SegmentedButton } from "./SegmentedButton"
import type { SegmentedButtonOption } from "./SegmentedButton"

// ============================================================
// HMSymbol 图标 — mask knockout 技术
//
// 原理（与 benchmark 完全一致）：
//   1. SVG mask：白色矩形 + 黑色图形路径 → 图形区域镂空
//   2. 圆/形状填充 currentColor，被 mask 裁剪后只露出轮廓区域
//   3. color 变化时（灰/深灰/#ffffff）效果自动跟随
//   4. 每个实例用 React.useId() 生成唯一 mask ID，避免冲突
// ============================================================

/** star-circle：实心圆 + 镂空五角星（benchmark #ico-star 完全还原） */
function IcoStar() {
  const uid = useId().replace(/:/g, "")
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <mask id={`star-${uid}`}>
          <rect width="24" height="24" fill="white" />
          <path
            d="M12 6.2l1.6 3.24 3.57.52-2.58 2.51.61 3.55L12 14.3l-3.2 1.68.61-3.55L6.83 9.96l3.57-.52Z"
            fill="black"
          />
        </mask>
      </defs>
      <circle cx="12" cy="12" r="11" fill="currentColor" mask={`url(#star-${uid})`} />
    </svg>
  )
}

/** home：实心圆角矩形 + 镂空房屋轮廓 */
function IcoHome() {
  const uid = useId().replace(/:/g, "")
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <mask id={`home-${uid}`}>
          <rect width="24" height="24" fill="white" />
          {/* 房屋轮廓镂空 */}
          <path d="M12 4L3 10.5V20h6v-5h6v5h6V10.5L12 4Z" fill="black" />
        </mask>
      </defs>
      <rect x="1" y="1" width="22" height="22" rx="6" fill="currentColor" mask={`url(#home-${uid})`} />
    </svg>
  )
}

/** search：实心圆 + 镂空放大镜 */
function IcoSearch() {
  const uid = useId().replace(/:/g, "")
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <mask id={`search-${uid}`}>
          <rect width="24" height="24" fill="white" />
          {/* 放大镜镂空：圆环 + 手柄 */}
          <circle cx="10.5" cy="10.5" r="5" fill="black" />
          <circle cx="10.5" cy="10.5" r="3.2" fill="white" />
          <rect x="14.2" y="13.5" width="1.6" height="5" rx="0.8"
                transform="rotate(-45 14.2 13.5)" fill="black" />
        </mask>
      </defs>
      <circle cx="12" cy="12" r="11" fill="currentColor" mask={`url(#search-${uid})`} />
    </svg>
  )
}

/** heart：实心圆 + 镂空爱心 */
function IcoHeart() {
  const uid = useId().replace(/:/g, "")
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <mask id={`heart-${uid}`}>
          <rect width="24" height="24" fill="white" />
          <path
            d="M12 19.5C12 19.5 3.5 14 3.5 8.5a4.5 4.5 0 0 1 8.5-2 4.5 4.5 0 0 1 8.5 2C20.5 14 12 19.5 12 19.5Z"
            fill="black"
          />
        </mask>
      </defs>
      <circle cx="12" cy="12" r="11" fill="currentColor" mask={`url(#heart-${uid})`} />
    </svg>
  )
}

/** settings：实心圆 + 镂空齿轮 */
function IcoSettings() {
  const uid = useId().replace(/:/g, "")
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <mask id={`set-${uid}`}>
          <rect width="24" height="24" fill="white" />
          {/* 外齿轮轮廓 */}
          <path
            d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-1.5-3.5h3l.5 2a6 6 0 0 1 1.4.8l1.9-.8 1.5 2.6-1.6 1.3a6 6 0 0 1 0 1.6l1.6 1.3-1.5 2.6-1.9-.8a6 6 0 0 1-1.4.8l-.5 2h-3l-.5-2a6 6 0 0 1-1.4-.8l-1.9.8-1.5-2.6 1.6-1.3a6 6 0 0 1 0-1.6L5.2 9.1l1.5-2.6 1.9.8a6 6 0 0 1 1.4-.8l.5-2Z"
            fill="black"
          />
          {/* 中心圆镂空 → 露出圆孔 */}
          <circle cx="12" cy="12" r="2" fill="white" />
        </mask>
      </defs>
      <circle cx="12" cy="12" r="11" fill="currentColor" mask={`url(#set-${uid})`} />
    </svg>
  )
}

/** music：实心圆 + 镂空音符 */
function IcoMusic() {
  const uid = useId().replace(/:/g, "")
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <mask id={`music-${uid}`}>
          <rect width="24" height="24" fill="white" />
          <path
            d="M9 17V7l10-2v10M9 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm10-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
            stroke="black"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </mask>
      </defs>
      <circle cx="12" cy="12" r="11" fill="currentColor" mask={`url(#music-${uid})`} />
    </svg>
  )
}

// ── 固定选项集合（与 benchmark 完全一致，全部使用 IcoStar）────

const items2: SegmentedButtonOption[] = [
  { value: "a", label: "Tabs", icon: <IcoStar /> },
  { value: "b", label: "Tabs", icon: <IcoStar /> },
]

const items3: SegmentedButtonOption[] = [
  { value: "a", label: "Tabs", icon: <IcoStar /> },
  { value: "b", label: "Tabs", icon: <IcoStar /> },
  { value: "c", label: "Tabs", icon: <IcoStar /> },
]

const items4: SegmentedButtonOption[] = [
  { value: "a", label: "Tabs", icon: <IcoStar /> },
  { value: "b", label: "Tabs", icon: <IcoStar /> },
  { value: "c", label: "Tabs", icon: <IcoStar /> },
  { value: "d", label: "Tabs", icon: <IcoStar /> },
]

const items5: SegmentedButtonOption[] = [
  { value: "a", label: "Tabs", icon: <IcoStar /> },
  { value: "b", label: "Tabs", icon: <IcoStar /> },
  { value: "c", label: "Tabs", icon: <IcoStar /> },
  { value: "d", label: "Tabs", icon: <IcoStar /> },
  { value: "e", label: "Tabs", icon: <IcoStar /> },
]

// ── Meta ────────────────────────────────────────────────────

const meta = {
  title: "Components/SegmentedButton",
  component: SegmentedButton,
  tags: ["autodocs"],
  args: {
    variant: "outline",
    disabled: false,
    defaultValue: "a",
    items: items3,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["outline", "primary"],
      description:
        "outline = pill 容器白底选中；primary = 品牌蓝填充选中，无外层容器",
    },
    disabled: {
      control: "boolean",
      description: "整组禁用（opacity 0.4）",
    },
  },
} satisfies Meta<typeof SegmentedButton>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================
// Playground
// ============================================================

export const Playground: Story = {}

// ============================================================
// Outline — 不同项数（benchmark Section 1）
// ============================================================

export const Outline_ItemCount: Story = {
  name: "Outline — 2 / 3 / 4 / 5 项",
  render: () => (
    <div className="flex flex-col gap-4">
      {([items2, items3, items4, items5] as SegmentedButtonOption[][]).map((items, i) => (
        <div key={i}>
          <p className="text-xs text-gray-400 mb-1">{items.length} 项</p>
          <SegmentedButton variant="outline" items={items} defaultValue={items[0].value} />
        </div>
      ))}
    </div>
  ),
}

// ============================================================
// Primary — 不同项数（benchmark Section 2）
// ============================================================

export const Primary_ItemCount: Story = {
  name: "Primary — 2 / 3 / 4 / 5 项",
  render: () => (
    <div className="flex flex-col gap-4">
      {([items2, items3, items4, items5] as SegmentedButtonOption[][]).map((items, i) => (
        <div key={i}>
          <p className="text-xs text-gray-400 mb-1">{items.length} 项</p>
          <SegmentedButton variant="primary" items={items} defaultValue={items[0].value} />
        </div>
      ))}
    </div>
  ),
}

// ============================================================
// Outline vs Primary 对比
// ============================================================

export const VariantComparison: Story = {
  name: "Variant Comparison — outline vs primary",
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium text-gray-400 mb-2">
          outline — pill 容器，白底 + shadow 选中
        </p>
        <SegmentedButton variant="outline" items={items3} defaultValue="b" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 mb-2">
          primary — 无容器，#0A59F7 填充选中，首尾圆角
        </p>
        <SegmentedButton variant="primary" items={items3} defaultValue="b" />
      </div>
    </div>
  ),
}

// ============================================================
// 内容组合（benchmark Section 3 — Item States）
// icon only / label only / icon+label
// ============================================================

export const ContentVariants: Story = {
  name: "Content — label only / icon+label",
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs text-gray-400 mb-1">icon + label — outline</p>
        <SegmentedButton
          variant="outline"
          items={[
            { value: "a", label: "Tabs", icon: <IcoStar /> },
            { value: "b", label: "Tabs", icon: <IcoStar /> },
            { value: "c", label: "Tabs", icon: <IcoStar /> },
          ]}
          defaultValue="a"
        />
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">icon + label — primary</p>
        <SegmentedButton
          variant="primary"
          items={[
            { value: "a", label: "Tabs", icon: <IcoStar /> },
            { value: "b", label: "Tabs", icon: <IcoStar /> },
            { value: "c", label: "Tabs", icon: <IcoStar /> },
          ]}
          defaultValue="a"
        />
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">label only — outline</p>
        <SegmentedButton
          variant="outline"
          items={[
            { value: "a", label: "Daily" },
            { value: "b", label: "Weekly" },
            { value: "c", label: "Monthly" },
          ]}
          defaultValue="b"
        />
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">label only — primary</p>
        <SegmentedButton
          variant="primary"
          items={[
            { value: "a", label: "Daily" },
            { value: "b", label: "Weekly" },
            { value: "c", label: "Monthly" },
          ]}
          defaultValue="b"
        />
      </div>
    </div>
  ),
}

// ============================================================
// Disabled（benchmark Section 5）
// ============================================================

export const Disabled: Story = {
  name: "Disabled — outline & primary",
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs text-gray-400 mb-1">outline — 整组禁用</p>
        <SegmentedButton variant="outline" items={items3} defaultValue="a" disabled />
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">primary — 整组禁用</p>
        <SegmentedButton variant="primary" items={items3} defaultValue="a" disabled />
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">单项禁用（item.disabled）</p>
        <SegmentedButton
          variant="outline"
          items={[
            { value: "a", label: "Tabs", icon: <IcoStar /> },
            { value: "b", label: "Tabs", icon: <IcoStar />, disabled: true },
            { value: "c", label: "Tabs", icon: <IcoStar /> },
          ]}
          defaultValue="a"
        />
      </div>
    </div>
  ),
}

// ============================================================
// 受控模式
// ============================================================

export const Controlled: Story = {
  name: "Controlled — 受控模式",
  render: () => {
    const [outline, setOutline] = useState("a")
    const [primary, setPrimary] = useState("a")

    return (
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">
            outline — 当前：<span className="font-mono">{outline}</span>
          </p>
          <SegmentedButton
            variant="outline"
            items={items3}
            value={outline}
            onChange={setOutline}
          />
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">
            primary — 当前：<span className="font-mono">{primary}</span>
          </p>
          <SegmentedButton
            variant="primary"
            items={items3}
            value={primary}
            onChange={setPrimary}
          />
        </div>
        <p className="text-xs text-gray-500">联动（两组同步）：</p>
        <SegmentedButton
          variant="primary"
          items={[
            { value: "a", label: "Tabs", icon: <IcoStar /> },
            { value: "b", label: "Tabs", icon: <IcoStar /> },
            { value: "c", label: "Tabs", icon: <IcoStar /> },
          ]}
          value={outline}
          onChange={(v) => { setOutline(v); setPrimary(v) }}
        />
      </div>
    )
  },
}
