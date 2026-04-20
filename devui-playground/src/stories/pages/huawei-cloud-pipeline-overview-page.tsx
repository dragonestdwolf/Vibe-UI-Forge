import { useEffect, useMemo, useState, type ReactNode } from "react"
import {
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Code2,
  Copy,
  FileText,
  GitBranch,
  Globe,
  Grid2x2,
  Hammer,
  LayoutDashboard,
  List,
  MapPin,
  Menu,
  MoreHorizontal,
  Package,
  Plus,
  Rocket,
  Search,
  Settings,
  Star,
  TestTube2,
  Workflow,
} from "lucide-react"
import { AccordionNav, type AccordionNavItem } from "@/components/ui/accordion-nav"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Subheader } from "@/components/ui/subheader"
import { Switch } from "@/components/ui/switch"
import { Column, Table } from "@/components/ui/table"
import { TableShellFrame } from "@/components/ui/table-shell-frame"
import "./huawei-cloud-pipeline-overview.css"

type WorkItemTag = "Bug" | "Epic" | "Feature" | "Story" | "Task"
type WorkItemPriority = "高" | "中" | "低"
type WorkItemStatus = "未开始" | "已完成" | "开发中"
type ViewMode = "list" | "tree" | "grid"

type WorkItemRow = {
  uid: string
  serial: string
  tag: WorkItemTag
  title: string
  priority: WorkItemPriority
  module: "产品运营" | "基础服务" | "前端"
  status: WorkItemStatus
  dueDate: string
  assignee: "liumei" | "yuhai" | "delong" | "tony" | "zhangbiao"
  enabled: boolean
  language: "zh" | "en"
}

const topRegionOptions = [
  { name: "华北-北京四", value: "cn-north-4" },
  { name: "华东-上海一", value: "cn-east-3" },
  { name: "华南-广州", value: "cn-south-1" },
]

const languageOptions = [
  { name: "所有语言", value: "all" },
  { name: "中文", value: "zh" },
  { name: "English", value: "en" },
]

const advancedFilterOptions = [
  { name: "高级筛选", value: "all" },
  { name: "仅未开始", value: "未开始" },
  { name: "仅开发中", value: "开发中" },
  { name: "仅已完成", value: "已完成" },
]

const pageSizeOptions = [
  { name: "10", value: "10" },
  { name: "20", value: "20" },
  { name: "50", value: "50" },
]

const breadcrumbItems = [
  { label: "项目" },
  { label: "Furion移动客户端" },
  { label: "流水线" },
  { label: "流水线详情" },
]

const tabItems = [
  { id: "overview", label: "工程概览" },
  { id: "model-design", label: "模型设计" },
  { id: "architecture", label: "架构信息" },
  { id: "code-model", label: "代码模型" },
  { id: "requirement-model", label: "需求模型" },
]

const navigationItems: AccordionNavItem[] = [
  {
    key: "dashboard",
    label: <SidebarItemLabel icon={<LayoutDashboard size={16} />} text="仪表盘" />,
  },
  {
    key: "work-items",
    label: <SidebarItemLabel icon={<FileText size={16} />} text="工作项" />,
  },
  {
    key: "architecture-modeling",
    label: <SidebarItemLabel icon={<Workflow size={16} />} text="架构建模" />,
  },
  {
    key: "code",
    label: <SidebarItemLabel icon={<Code2 size={16} />} text="代码" />,
  },
  {
    key: "delivery",
    label: <SidebarItemLabel icon={<Rocket size={16} />} text="持续交付" />,
    children: [
      {
        key: "pipeline",
        label: <SidebarItemLabel icon={<GitBranch size={15} />} text="流水线" />,
      },
      {
        key: "release",
        label: <SidebarItemLabel icon={<Package size={15} />} text="发布管理" />,
      },
      {
        key: "build",
        label: <SidebarItemLabel icon={<Hammer size={15} />} text="编译构建" />,
      },
      {
        key: "deploy",
        label: <SidebarItemLabel icon={<Rocket size={15} />} text="部署" />,
      },
      {
        key: "ops",
        label: <SidebarItemLabel icon={<Settings size={15} />} text="运维" />,
      },
    ],
  },
  {
    key: "artifacts",
    label: <SidebarItemLabel icon={<Package size={16} />} text="制品仓库" />,
  },
  {
    key: "testing",
    label: <SidebarItemLabel icon={<TestTube2 size={16} />} text="测试" />,
  },
  {
    key: "wiki",
    label: <SidebarItemLabel icon={<BookOpen size={16} />} text="wiki" />,
  },
  {
    key: "docs",
    label: <SidebarItemLabel icon={<FileText size={16} />} text="文档" />,
  },
  {
    key: "settings",
    label: <SidebarItemLabel icon={<Settings size={16} />} text="设置" />,
  },
]

const workItems: WorkItemRow[] = [
  {
    uid: "req-1501251",
    serial: "1501251",
    tag: "Bug",
    title: "用户管理 - 无法手动设置会员级别",
    priority: "高",
    module: "产品运营",
    status: "未开始",
    dueDate: "2022-05-21 12:00:00",
    assignee: "liumei",
    enabled: true,
    language: "zh",
  },
  {
    uid: "req-1501252",
    serial: "1501252",
    tag: "Bug",
    title: "积分管理 - 无法显示积分规则界面",
    priority: "中",
    module: "基础服务",
    status: "未开始",
    dueDate: "2022-05-21 12:00:00",
    assignee: "yuhai",
    enabled: false,
    language: "zh",
  },
  {
    uid: "req-1501253",
    serial: "1501253",
    tag: "Epic",
    title: "凤凰城",
    priority: "低",
    module: "前端",
    status: "未开始",
    dueDate: "2022-05-21 12:00:00",
    assignee: "delong",
    enabled: true,
    language: "zh",
  },
  {
    uid: "req-1501254",
    serial: "1501254",
    tag: "Feature",
    title: "客户端",
    priority: "低",
    module: "产品运营",
    status: "未开始",
    dueDate: "2022-05-21 12:00:00",
    assignee: "liumei",
    enabled: true,
    language: "zh",
  },
  {
    uid: "req-1501255",
    serial: "1501255",
    tag: "Story",
    title: "作为用户应该可以查看个人主页",
    priority: "中",
    module: "产品运营",
    status: "未开始",
    dueDate: "2022-05-21 12:00:00",
    assignee: "liumei",
    enabled: true,
    language: "zh",
  },
  {
    uid: "req-1501256",
    serial: "1501256",
    tag: "Task",
    title: "配件数据库设计",
    priority: "中",
    module: "前端",
    status: "已完成",
    dueDate: "2022-05-21 12:00:00",
    assignee: "tony",
    enabled: true,
    language: "zh",
  },
  {
    uid: "req-1501257",
    serial: "1501257",
    tag: "Task",
    title: "作为管理员应该可以进行用户管理",
    priority: "低",
    module: "产品运营",
    status: "未开始",
    dueDate: "2022-05-21 12:00:00",
    assignee: "liumei",
    enabled: true,
    language: "zh",
  },
  {
    uid: "req-1501258",
    serial: "1501258",
    tag: "Task",
    title: "作为管理员应该可以进行用户分析",
    priority: "低",
    module: "产品运营",
    status: "未开始",
    dueDate: "2022-05-21 12:00:00",
    assignee: "delong",
    enabled: false,
    language: "zh",
  },
  {
    uid: "req-1501259",
    serial: "1501259",
    tag: "Task",
    title: "作为管理员应该可以设置会员级别",
    priority: "低",
    module: "产品运营",
    status: "开发中",
    dueDate: "2022-05-21 12:00:00",
    assignee: "liumei",
    enabled: true,
    language: "zh",
  },
  {
    uid: "req-1501260",
    serial: "1501260",
    tag: "Feature",
    title: "配件管理",
    priority: "低",
    module: "产品运营",
    status: "开发中",
    dueDate: "2022-05-21 12:00:00",
    assignee: "tony",
    enabled: true,
    language: "zh",
  },
  {
    uid: "req-1501261",
    serial: "1501261",
    tag: "Feature",
    title: "订单管理",
    priority: "中",
    module: "产品运营",
    status: "未开始",
    dueDate: "2022-05-21 12:00:00",
    assignee: "delong",
    enabled: true,
    language: "zh",
  },
  {
    uid: "req-1501262",
    serial: "1501262",
    tag: "Feature",
    title: "门店网络界面没有显示省份筛选",
    priority: "低",
    module: "产品运营",
    status: "未开始",
    dueDate: "2022-05-21 12:00:00",
    assignee: "liumei",
    enabled: false,
    language: "zh",
  },
  {
    uid: "req-1501263",
    serial: "1501263",
    tag: "Bug",
    title: "执行机上脚本命令慢的问题",
    priority: "高",
    module: "产品运营",
    status: "已完成",
    dueDate: "2022-05-21 12:00:00",
    assignee: "zhangbiao",
    enabled: false,
    language: "zh",
  },
  {
    uid: "req-1501264",
    serial: "1501264",
    tag: "Bug",
    title: "执行机上脚本命令慢的问题 - 复测",
    priority: "高",
    module: "产品运营",
    status: "已完成",
    dueDate: "2022-05-21 12:00:00",
    assignee: "zhangbiao",
    enabled: false,
    language: "zh",
  },
  {
    uid: "req-1501265",
    serial: "1501265",
    tag: "Epic",
    title: "作为管理员应该可以添加团购活动",
    priority: "高",
    module: "产品运营",
    status: "已完成",
    dueDate: "2022-05-21 12:00:00",
    assignee: "zhangbiao",
    enabled: false,
    language: "zh",
  },
  {
    uid: "req-1501266",
    serial: "1501266",
    tag: "Epic",
    title: "作为管理员应该可以添加优惠活动",
    priority: "高",
    module: "产品运营",
    status: "已完成",
    dueDate: "2022-05-21 12:00:00",
    assignee: "zhangbiao",
    enabled: false,
    language: "zh",
  },
  {
    uid: "req-1501267",
    serial: "1501267",
    tag: "Feature",
    title: "Pipeline Template Governance",
    priority: "中",
    module: "基础服务",
    status: "开发中",
    dueDate: "2022-05-21 12:00:00",
    assignee: "yuhai",
    enabled: true,
    language: "en",
  },
  {
    uid: "req-1501268",
    serial: "1501268",
    tag: "Story",
    title: "Order Detail Feed Sync",
    priority: "低",
    module: "前端",
    status: "未开始",
    dueDate: "2022-05-21 12:00:00",
    assignee: "tony",
    enabled: true,
    language: "en",
  },
]

const tagToneMap: Record<WorkItemTag, string> = {
  Bug: "bug",
  Epic: "epic",
  Feature: "feature",
  Story: "story",
  Task: "task",
}

const assigneeThemeMap: Record<WorkItemRow["assignee"], "male" | "female"> = {
  liumei: "female",
  yuhai: "male",
  delong: "male",
  tony: "male",
  zhangbiao: "male",
}

function SidebarItemLabel({
  icon,
  text,
}: {
  icon: ReactNode
  text: string
}) {
  return (
    <span className="hc-overview__sidebar-item-label">
      <span className="hc-overview__sidebar-item-icon">{icon}</span>
      <span>{text}</span>
    </span>
  )
}

function TopIconButton({
  children,
  muted,
}: {
  children: ReactNode
  muted?: boolean
}) {
  return (
    <button
      type="button"
      className={`hc-overview__top-icon-button${muted ? " hc-overview__top-icon-button--muted" : ""}`}
    >
      {children}
    </button>
  )
}

function TableTag({ tag }: { tag: WorkItemTag }) {
  return (
    <span
      className={`hc-overview__tag hc-overview__tag--${tagToneMap[tag]}`}
    >
      {tag}
    </span>
  )
}

function PriorityCell({ priority }: { priority: WorkItemPriority }) {
  return (
    <div className="hc-overview__priority">
      <span
        className={`hc-overview__priority-flag hc-overview__priority-flag--${priority}`}
        aria-hidden="true"
      />
      <span>{priority}</span>
    </div>
  )
}

function StatusCell({ status }: { status: WorkItemStatus }) {
  return (
    <div className="hc-overview__status">
      <span
        className={`hc-overview__status-dot hc-overview__status-dot--${status}`}
        aria-hidden="true"
      />
      <span>{status}</span>
    </div>
  )
}

function AssigneeCell({ assignee }: { assignee: WorkItemRow["assignee"] }) {
  return (
    <div className="hc-overview__assignee">
      <Avatar
        name={assignee}
        gender={assigneeThemeMap[assignee]}
        width={28}
        height={28}
      />
      <span>{assignee}</span>
    </div>
  )
}

function GridCard({
  row,
  enabled,
  onToggle,
}: {
  row: WorkItemRow
  enabled: boolean
  onToggle: (nextValue: boolean) => void
}) {
  return (
    <article className="hc-overview__grid-card">
      <div className="hc-overview__grid-card-head">
        <TableTag tag={row.tag} />
        <span className="hc-overview__serial-chip">#{row.serial}</span>
      </div>
      <h4 className="hc-overview__grid-card-title">{row.title}</h4>
      <div className="hc-overview__grid-card-meta">
        <PriorityCell priority={row.priority} />
        <StatusCell status={row.status} />
      </div>
      <div className="hc-overview__grid-card-line">
        <span>模块</span>
        <strong>{row.module}</strong>
      </div>
      <div className="hc-overview__grid-card-line">
        <span>截止</span>
        <strong>{row.dueDate}</strong>
      </div>
      <div className="hc-overview__grid-card-line">
        <span>处理者</span>
        <AssigneeCell assignee={row.assignee} />
      </div>
      <div className="hc-overview__grid-card-switch">
        <Switch modelValue={enabled} onUpdateModelValue={(next) => onToggle(Boolean(next))} />
        <span>{enabled ? "开启" : "关闭"}</span>
      </div>
    </article>
  )
}

function TreeGroup({
  module,
  rows,
  toggleState,
}: {
  module: WorkItemRow["module"]
  rows: WorkItemRow[]
  toggleState: Record<string, boolean>
}) {
  return (
    <section className="hc-overview__tree-group">
      <header className="hc-overview__tree-group-header">
        <span>{module}</span>
        <span>{rows.length} 项</span>
      </header>
      <div className="hc-overview__tree-list">
        {rows.map((row) => (
          <div key={row.uid} className="hc-overview__tree-row">
            <div className="hc-overview__tree-main">
              <TableTag tag={row.tag} />
              <div className="hc-overview__tree-text">
                <strong>{row.title}</strong>
                <span>
                  {row.serial} · {row.dueDate}
                </span>
              </div>
            </div>
            <div className="hc-overview__tree-side">
              <PriorityCell priority={row.priority} />
              <StatusCell status={row.status} />
              <AssigneeCell assignee={row.assignee} />
              <span
                className={`hc-overview__switch-text${toggleState[row.uid] ? " is-on" : ""}`}
              >
                {toggleState[row.uid] ? "开启" : "关闭"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function HuaweiCloudPipelineOverviewPage() {
  const [consoleRegion, setConsoleRegion] = useState("cn-north-4")
  const [consoleLanguage, setConsoleLanguage] = useState<"中文" | "EN">("中文")
  const [headerSearch, setHeaderSearch] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [toolbarLanguage, setToolbarLanguage] = useState("all")
  const [query, setQuery] = useState("")
  const [advancedFilter, setAdvancedFilter] = useState("all")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [toggleState, setToggleState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(workItems.map((item) => [item.uid, item.enabled]))
  )

  const filteredRows = useMemo(() => {
    const loweredQuery = query.trim().toLowerCase()
    return workItems.filter((item) => {
      const matchesLanguage =
        toolbarLanguage === "all" ? true : item.language === toolbarLanguage
      const matchesStatus =
        advancedFilter === "all" ? true : item.status === advancedFilter
      const matchesQuery = loweredQuery
        ? [item.serial, item.title, item.module, item.assignee]
            .join(" ")
            .toLowerCase()
            .includes(loweredQuery)
        : true

      return matchesLanguage && matchesStatus && matchesQuery
    })
  }, [advancedFilter, query, toolbarLanguage])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [advancedFilter, pageSize, query, toolbarLanguage])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredRows.slice(start, start + pageSize)
  }, [currentPage, filteredRows, pageSize])

  const groupedRows = useMemo(() => {
    return filteredRows.reduce<Record<WorkItemRow["module"], WorkItemRow[]>>(
      (accumulator, item) => {
        accumulator[item.module].push(item)
        return accumulator
      },
      {
        产品运营: [],
        基础服务: [],
        前端: [],
      }
    )
  }, [filteredRows])

  const pageButtons = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }, [totalPages])

  const updateRowToggle = (rowId: string, nextValue: boolean) => {
    setToggleState((current) => ({
      ...current,
      [rowId]: nextValue,
    }))
  }

  const renderContent = () => {
    if (viewMode === "grid") {
      return (
        <div className="hc-overview__grid">
          {pagedRows.map((row) => (
            <GridCard
              key={row.uid}
              row={row}
              enabled={toggleState[row.uid]}
              onToggle={(nextValue) => updateRowToggle(row.uid, nextValue)}
            />
          ))}
        </div>
      )
    }

    if (viewMode === "tree") {
      return (
        <div className="hc-overview__tree">
          {(
            Object.entries(groupedRows) as Array<
              [WorkItemRow["module"], WorkItemRow[]]
            >
          )
            .filter(([, rows]) => rows.length > 0)
            .map(([module, rows]) => (
              <TreeGroup
                key={module}
                module={module}
                rows={rows}
                toggleState={toggleState}
              />
            ))}
        </div>
      )
    }

    return (
      <Table
        data={pagedRows}
        rowKey="uid"
        size="sm"
        borderType="borderless"
        tableWidth="100%"
        empty="当前筛选条件下暂无工作项"
      >
        <Column type="checkable" width={52} />
        <Column field="serial" header="编号" minWidth={120} />
        <Column
          field="title"
          header="标题"
          minWidth={360}
          formatter={(row) => (
            <div className="hc-overview__title-cell">
              <TableTag tag={String(row.tag) as WorkItemTag} />
              <span className="hc-overview__title-text">{String(row.title)}</span>
            </div>
          )}
        />
        <Column
          field="priority"
          header="优先级"
          minWidth={110}
          formatter={(row) => (
            <PriorityCell priority={String(row.priority) as WorkItemPriority} />
          )}
        />
        <Column field="module" header="模块" minWidth={120} />
        <Column
          field="status"
          header="状态"
          minWidth={120}
          formatter={(row) => (
            <StatusCell status={String(row.status) as WorkItemStatus} />
          )}
        />
        <Column field="dueDate" header="预计结束日期" minWidth={180} />
        <Column
          field="assignee"
          header="处理者"
          minWidth={150}
          formatter={(row) => (
            <AssigneeCell assignee={String(row.assignee) as WorkItemRow["assignee"]} />
          )}
        />
        <Column
          field="enabled"
          header="开关"
          minWidth={128}
          formatter={(row) => {
            const rowId = String(row.uid)
            const enabled = toggleState[rowId]

            return (
              <div className="hc-overview__switch-cell">
                <Switch
                  modelValue={enabled}
                  onUpdateModelValue={(next) => updateRowToggle(rowId, Boolean(next))}
                />
                <span
                  className={`hc-overview__switch-text${enabled ? " is-on" : ""}`}
                >
                  {enabled ? "开启" : "关闭"}
                </span>
              </div>
            )
          }}
        />
        <Column
          header="操作"
          minWidth={120}
          formatter={() => (
            <div className="hc-overview__actions">
              <button type="button" className="hc-overview__action-button" aria-label="复制">
                <Copy size={15} />
              </button>
              <button type="button" className="hc-overview__action-button" aria-label="收藏">
                <Star size={15} />
              </button>
              <button type="button" className="hc-overview__action-button" aria-label="更多">
                <MoreHorizontal size={16} />
              </button>
            </div>
          )}
        />
      </Table>
    )
  }

  return (
    <div className="hc-overview">
      <header className="hc-overview__topbar">
        <div className="hc-overview__topbar-left">
          <button type="button" className="hc-overview__menu-button" aria-label="更多">
            <Menu size={20} />
          </button>
          <div className="hc-overview__brand">
            <div className="hc-overview__brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <span className="hc-overview__brand-name">华为云</span>
          </div>
          <span className="hc-overview__console-title">控制台</span>
          <div className="hc-overview__region">
            <MapPin size={14} />
            <Select
              modelValue={consoleRegion}
              options={topRegionOptions}
              onUpdateModelValue={(next) => setConsoleRegion(String(next))}
            />
          </div>
        </div>

        <div className="hc-overview__topbar-right">
          <div className="hc-overview__topbar-search">
            <Input
              modelValue={headerSearch}
              size="sm"
              styleType="gray"
              showGlowStyle={false}
              placeholder="搜索... (/)"
              prefix={<Search size={15} />}
              onUpdateModelValue={setHeaderSearch}
            />
          </div>
          <TopIconButton>
            <Plus size={16} />
          </TopIconButton>
          <TopIconButton>
            <Grid2x2 size={16} />
          </TopIconButton>
          <TopIconButton>
            <Bell size={16} />
          </TopIconButton>
          <Badge count={8} status="danger">
            <TopIconButton>
              <FileText size={16} />
            </TopIconButton>
          </Badge>
          <TopIconButton>
            <CircleHelp size={16} />
          </TopIconButton>
          <button
            type="button"
            className="hc-overview__language-toggle"
            onClick={() =>
              setConsoleLanguage((current) =>
                current === "中文" ? "EN" : "中文"
              )
            }
          >
            <Globe size={16} />
            <span>{consoleLanguage}</span>
          </button>
          <Avatar name="赵磊" gender="male" width={32} height={32} />
        </div>
      </header>

      <TableShellFrame
        className="hc-overview__shell"
        header={
          <div className="hc-overview__subheader-wrap">
            <Subheader
              breadcrumbs={breadcrumbItems}
              tabs={tabItems}
              modelValue={activeTab}
              onUpdateModelValue={setActiveTab}
            />
            <button type="button" className="hc-overview__template-entry">
              <Grid2x2 size={16} />
              <span>模板管理</span>
            </button>
          </div>
        }
        primaryNav={
          <div className="hc-overview__sidebar">
            <AccordionNav
              items={navigationItems}
              selectedKeys={["pipeline"]}
              defaultExpandedKeys={["delivery"]}
            />
            <button type="button" className="hc-overview__collapse-trigger" aria-label="收起侧边栏">
              <Menu size={16} />
            </button>
          </div>
        }
        toolbar={
          <div className="hc-overview__toolbar">
            <div className="hc-overview__toolbar-main">
              <Button variant="solid" color="primary" size="sm">
                新建需求
              </Button>
              <div className="hc-overview__toolbar-select hc-overview__toolbar-select--language">
                <Select
                  modelValue={toolbarLanguage}
                  options={languageOptions}
                  onUpdateModelValue={(next) => setToolbarLanguage(String(next))}
                />
              </div>
              <div className="hc-overview__toolbar-search">
                <Input
                  modelValue={query}
                  placeholder="点击此处添加筛选条件"
                  prefix={<Search size={16} />}
                  clearable
                  showGlowStyle={false}
                  onUpdateModelValue={setQuery}
                />
              </div>
            </div>
            <div className="hc-overview__toolbar-side">
              <div className="hc-overview__toolbar-select hc-overview__toolbar-select--advanced">
                <Select
                  modelValue={advancedFilter}
                  options={advancedFilterOptions}
                  onUpdateModelValue={(next) => setAdvancedFilter(String(next))}
                />
              </div>
              <div className="hc-overview__view-toggle" role="tablist" aria-label="视图切换">
                <button
                  type="button"
                  className={viewMode === "list" ? "is-active" : ""}
                  onClick={() => setViewMode("list")}
                  aria-label="列表视图"
                >
                  <List size={16} />
                </button>
                <button
                  type="button"
                  className={viewMode === "tree" ? "is-active" : ""}
                  onClick={() => setViewMode("tree")}
                  aria-label="树状视图"
                >
                  <GitBranch size={16} />
                </button>
                <button
                  type="button"
                  className={viewMode === "grid" ? "is-active" : ""}
                  onClick={() => setViewMode("grid")}
                  aria-label="宫格视图"
                >
                  <Grid2x2 size={16} />
                </button>
              </div>
            </div>
          </div>
        }
      >
        <div className="hc-overview__content-card">
          {activeTab !== "overview" ? (
            <div className="hc-overview__tab-note">
              当前页签为“{tabItems.find((item) => item.id === activeTab)?.label}”，演示继续复用工程概览工作项数据，便于在 Storybook 中统一查看视觉与组件状态。
            </div>
          ) : null}

          {renderContent()}

          <footer className="hc-overview__pagination">
            <div className="hc-overview__pagination-size">
              <div className="hc-overview__page-size-select">
                <Select
                  modelValue={String(pageSize)}
                  options={pageSizeOptions}
                  onUpdateModelValue={(next) => setPageSize(Number(next))}
                />
              </div>
              <span>条/页</span>
            </div>

            <div className="hc-overview__pagination-controls">
              <button
                type="button"
                className="hc-overview__pager-arrow"
                onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
                disabled={currentPage === 1}
                aria-label="上一页"
              >
                <ChevronLeft size={16} />
              </button>

              {pageButtons.map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`hc-overview__pager-button${page === currentPage ? " is-active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                className="hc-overview__pager-arrow"
                onClick={() =>
                  setCurrentPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={currentPage === totalPages}
                aria-label="下一页"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="hc-overview__pagination-total">
              共 {filteredRows.length} 条
            </div>
          </footer>
        </div>
      </TableShellFrame>
    </div>
  )
}
