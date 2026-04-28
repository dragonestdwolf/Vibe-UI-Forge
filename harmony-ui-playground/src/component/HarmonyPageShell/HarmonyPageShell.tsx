import type { HTMLAttributes, ReactNode } from "react"

import { cn } from "@/lib/utils"

import { StatusBar, type StatusBarProps } from "@/component/StatusBar"

export interface HarmonyPageShellProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  background?: string
  children?: ReactNode
  statusBarProps?: Omit<StatusBarProps, "backgroundColor">
  bottomBar?: ReactNode
}

function DefaultBottomBar() {
  return (
    <div className="flex h-7 justify-center">
      <div className="h-1.5 w-28 rounded-full bg-black/18" />
    </div>
  )
}

export function HarmonyPageShell({
  background = "#F1F3F5",
  children,
  statusBarProps,
  bottomBar,
  className,
  style,
  ...rest
}: HarmonyPageShellProps) {
  return (
    <div
      {...rest}
      className={cn("mx-auto flex min-h-[800px] w-[360px] flex-col text-black", className)}
      style={{ backgroundColor: background, ...style }}
      data-runtime-component="HarmonyPageShell"
    >
      <StatusBar {...statusBarProps} backgroundColor={background} />
      <div className="flex-1">{children}</div>
      {bottomBar === undefined ? <DefaultBottomBar /> : bottomBar}
    </div>
  )
}

export default HarmonyPageShell
