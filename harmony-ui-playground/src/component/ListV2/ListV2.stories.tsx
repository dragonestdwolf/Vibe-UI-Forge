import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { ListV2, ListV2Item } from "./ListV2"
import type { ListV2ItemState, ListV2ItemType } from "./ListV2"

const meta = {
  title: "Components/ListV2",
  component: ListV2Item,
  tags: ["autodocs"],
  args: {
    title: "Single list",
    subtitle: undefined,
    trailingText: "Right text",
    trailingExtra: "arrow",
    itemType: "single",
    disabled: false,
    selected: false,
  },
  argTypes: {
    itemType: {
      control: "select",
      options: [
        "single", "single-lg", "single-xl",
        "double", "double-lg",
        "triple",
        "avatar", "appicon",
      ] satisfies ListV2ItemType[],
      description: "行高规格 / leading 类型",
    },
    state: {
      control: "select",
      options: [
        undefined, "default", "hover", "pressed", "focus", "selected", "disabled",
      ] satisfies (ListV2ItemState | undefined)[],
      description: "覆盖视觉状态（不传则由 selected/disabled prop 自动计算）",
    },
    trailingExtra: {
      control: "select",
      options: ["arrow", "dot", "none"],
      description: "arrow = 右侧 › | dot = 圆点 | none = 无",
    },
  },
  decorators: [
    (Story) => (
      <ListV2>
        <Story />
      </ListV2>
    ),
  ],
} satisfies Meta<typeof ListV2Item>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================
// Playground
// ============================================================

/** 单行交互式演示，可通过 Controls 面板调整所有 props */
export const Playground: Story = {}

// ============================================================
// Section 1 — 尺寸矩阵（spec §4.1 高度矩阵）
// ============================================================

/**
 * 6 种行高规格完整对比
 * 对应 benchmark Section 1 + spec §4.1 Numeric Baseline
 */
export const SizeMatrix: Story = {
  name: "Size Matrix — 6 种行高规格",
  decorators: [],
  render: () => (
    <div className="flex flex-col gap-4">
      {(
        [
          ["Single-M  48px", "single", undefined, "Right text", "arrow"],
          ["Single-L  56px", "single-lg", undefined, "Right text", "arrow"],
          ["Single-XL 64px", "single-xl", undefined, "Right text", "arrow"],
          ["Double-M  64px", "double", "Auxiliary Text", "Right text", "arrow"],
          ["Double-L  72px", "double-lg", "Auxiliary Text", "Right text", "arrow"],
          ["Triple-M  96px", "triple", ["Auxiliary Text", "Second line"], "Right text", "arrow"],
        ] as [string, ListV2ItemType, string | string[] | undefined, string, "arrow" | "dot"][]
      ).map(([label, itemType, subtitle, trailingText]) => (
        <div key={itemType}>
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <ListV2>
            <ListV2Item
              itemType={itemType}
              title={itemType.startsWith("triple") ? "Three line list" : itemType.startsWith("double") ? "Two line list" : "Single list"}
              subtitle={subtitle}
              trailingText={trailingText}
              trailingExtra="arrow"
            />
          </ListV2>
        </div>
      ))}
    </div>
  ),
}

// ============================================================
// Section 2 — 状态矩阵（spec §2 + benchmark Section 2）
// ============================================================

/**
 * Single-M (48px) × 6 种交互状态
 * 对应 benchmark Section 2 状态矩阵
 */
export const StateMatrix: Story = {
  name: "State Matrix — 6 种交互状态",
  decorators: [],
  render: () => (
    <div className="flex flex-col gap-4">
      {(
        [
          ["Default", "default"],
          ["Hover（overlay rgba(0,0,0,0.047)）", "hover"],
          ["Pressed（overlay rgba(0,0,0,0.098)）", "pressed"],
          ["Focus（outline 2px brand-035）", "focus"],
          ["Selected（background brand-008）", "selected"],
          ["Disabled（opacity 0.4）", "disabled"],
        ] as [string, ListV2ItemState][]
      ).map(([label, state]) => (
        <div key={state}>
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <ListV2>
            <ListV2Item
              itemType="single"
              title="Single list"
              trailingText="Right text"
              trailingExtra="arrow"
              state={state}
            />
          </ListV2>
        </div>
      ))}
    </div>
  ),
}

// ============================================================
// Section 3 — Leading Rail 变体（benchmark Section 3）
// ============================================================

/**
 * text-only / avatar-40 / appicon-48 三种 leading 类型
 * 对应 spec §1.2 Track Semantics + benchmark Section 3
 */
export const LeadingVariants: Story = {
  name: "Leading Variants — text / avatar / appicon",
  decorators: [],
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs text-gray-400 mb-1">
          Text only（无 leading，content rail 从 padding 起始）
        </p>
        <ListV2>
          <ListV2Item title="Single list" trailingText="Right text" trailingExtra="arrow" />
          <ListV2Item
            itemType="double"
            title="Two line list"
            subtitle="Auxiliary Text"
            trailingText="Right text"
            trailingExtra="arrow"
          />
          <ListV2Item
            itemType="triple"
            title="Three line list"
            subtitle={["Auxiliary Text", "Second line"]}
            trailingText="Right text"
            trailingExtra="arrow"
          />
        </ListV2>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-1">
          Avatar 40×40（borderRadius 10, gap 16, 行高 56px）
        </p>
        <ListV2>
          <ListV2Item
            itemType="avatar"
            title="Avatar list"
            subtitle="Auxiliary Text"
            leadingType="avatar"
            leadingContent="A"
            leadingGap="g16"
            trailingText="Right text"
            trailingExtra="dot"
          />
        </ListV2>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-1">
          AppIcon 48×48（borderRadius 12, gap 16, 行高 64px）
        </p>
        <ListV2>
          <ListV2Item
            itemType="appicon"
            title="App title"
            subtitle="Auxiliary Text"
            leadingType="appicon"
            leadingGap="g16"
            trailingText="Right text"
            trailingExtra="arrow"
          />
        </ListV2>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-1">
          Custom leading（自定义图标 32×32, gap 12）
        </p>
        <ListV2>
          <ListV2Item
            itemType="single"
            title="Custom icon"
            subtitle="Settings row"
            leadingGap="g8"
            leading={
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "rgba(10,89,247,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0a59f7",
                  fontSize: 16,
                }}
              >
                ⚙
              </span>
            }
            trailingText="On"
            trailingExtra="arrow"
          />
        </ListV2>
      </div>
    </div>
  ),
}

// ============================================================
// Section 4 — Trailing Rail 变体
// ============================================================

/**
 * arrow / dot / text-only / none / 自定义 trailing
 */
export const TrailingVariants: Story = {
  name: "Trailing Variants — arrow / dot / custom",
  decorators: [],
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs text-gray-400 mb-1">arrow（默认，右侧 › 箭头）</p>
        <ListV2>
          <ListV2Item title="Single list" trailingText="Right text" trailingExtra="arrow" />
        </ListV2>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">
          dot（蓝色圆点指示器，#46b1e3）
        </p>
        <ListV2>
          <ListV2Item
            itemType="avatar"
            title="Avatar list"
            subtitle="Auxiliary Text"
            leadingType="avatar"
            leadingContent="A"
            trailingText="Right text"
            trailingExtra="dot"
          />
        </ListV2>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">
          none（不渲染 extra，仅 trailing text）
        </p>
        <ListV2>
          <ListV2Item title="Single list" trailingText="Right text" trailingExtra="none" />
        </ListV2>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">
          自定义（Switch / Checkbox / Badge 等）
        </p>
        <ListV2>
          <ListV2Item
            title="Wi-Fi"
            subtitle="Connected"
            itemType="double"
            trailingExtra={
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  background: "#0a59f7",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#fff",
                    position: "absolute",
                    right: 2,
                  }}
                />
              </span>
            }
          />
        </ListV2>
      </div>
    </div>
  ),
}

// ============================================================
// Section 5 — 完整 List Group（多行组合）
// ============================================================

/**
 * 模拟设置页 list group card
 * 展示分隔线 content rail 对齐、多行混排
 */
export const ListGroupCard: Story = {
  name: "List Group Card — 完整分组示例",
  decorators: [],
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium text-gray-400 mb-2">
          设置页分组（text-only items）
        </p>
        <ListV2>
          <ListV2Item
            itemType="single"
            title="Bluetooth"
            trailingText="Off"
            trailingExtra="arrow"
          />
          <ListV2Item
            itemType="single"
            title="Wi-Fi"
            trailingText="Home Network"
            trailingExtra="arrow"
          />
          <ListV2Item
            itemType="single"
            title="Mobile Data"
            trailingText="4G"
            trailingExtra="arrow"
          />
        </ListV2>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 mb-2">
          联系人列表（avatar leading + dot indicator）
        </p>
        <ListV2>
          {["Alice", "Bob", "Carol"].map((name, i) => (
            <ListV2Item
              key={name}
              itemType="avatar"
              title={name}
              subtitle="Last seen recently"
              leadingType="avatar"
              leadingContent={name[0]}
              leadingGap="g16"
              trailingText="10:32 AM"
              trailingExtra={i === 0 ? "dot" : "none"}
            />
          ))}
        </ListV2>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-400 mb-2">
          应用列表（appicon + triple）
        </p>
        <ListV2>
          <ListV2Item
            itemType="appicon"
            title="Maps"
            subtitle="Navigation & Explore"
            leadingType="appicon"
            leadingGap="g16"
            trailingText="4.8 ★"
            trailingExtra="arrow"
          />
          <ListV2Item
            itemType="appicon"
            title="Music"
            subtitle="Stream your favorites"
            leadingType="appicon"
            leadingGap="g16"
            trailingText="Free"
            trailingExtra="arrow"
          />
        </ListV2>
      </div>
    </div>
  ),
}

// ============================================================
// Section 6 — 交互演示（benchmark Section 4）
// ============================================================

/**
 * 点击选中行，顶部状态按钮切换全局状态
 * 对应 benchmark Section 4 interactive-preview
 */
export const Interactive: Story = {
  name: "Interactive — 点击选中 + 状态切换",
  decorators: [],
  render: () => {
    const [selected, setSelected] = useState<number | null>(null)
    const [globalState, setGlobalState] = useState<ListV2ItemState | undefined>(undefined)

    const items = [
      { type: "single" as ListV2ItemType, title: "Single list", subtitle: undefined },
      { type: "double" as ListV2ItemType, title: "Two line list", subtitle: "Auxiliary Text" },
      { type: "avatar" as ListV2ItemType, title: "Avatar list", subtitle: "Auxiliary Text" },
      { type: "triple" as ListV2ItemType, title: "Three line list", subtitle: ["Auxiliary Text", "Second line"] },
    ]

    const states: { label: string; value: ListV2ItemState | undefined }[] = [
      { label: "Default", value: undefined },
      { label: "Hover", value: "hover" },
      { label: "Pressed", value: "pressed" },
      { label: "Focus", value: "focus" },
      { label: "Disabled", value: "disabled" },
    ]

    return (
      <div className="flex flex-col gap-4">
        {/* State switch buttons */}
        <div className="flex flex-wrap gap-2">
          {states.map(({ label, value }) => (
            <button
              key={label}
              type="button"
              onClick={() => setGlobalState(value)}
              style={{
                height: 32,
                borderRadius: 16,
                padding: "0 14px",
                border: `1px solid ${globalState === value ? "#0a59f7" : "#d0d3dc"}`,
                background: "#fff",
                color: globalState === value ? "#0a59f7" : "#1a1a1a",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <ListV2>
          {items.map((item, i) => (
            <ListV2Item
              key={i}
              itemType={item.type}
              title={item.title}
              subtitle={item.subtitle}
              leadingType={item.type === "avatar" ? "avatar" : undefined}
              leadingContent={item.type === "avatar" ? "A" : undefined}
              leadingGap="g16"
              trailingText="Right text"
              trailingExtra={item.type === "avatar" ? "dot" : "arrow"}
              state={globalState}
              selected={globalState == null && selected === i}
              interactive
              onClick={() => {
                if (!globalState) setSelected(i)
              }}
            />
          ))}
        </ListV2>

        {selected !== null && !globalState && (
          <p className="text-sm text-gray-500">
            已选中：<span className="font-mono" style={{ color: "#0a59f7" }}>第 {selected + 1} 行</span>
          </p>
        )}
      </div>
    )
  },
}
