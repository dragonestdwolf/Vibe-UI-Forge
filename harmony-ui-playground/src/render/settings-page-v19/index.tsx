"use client"

import { useState } from "react"
import { StatusBar } from "@/component/StatusBar"
import { TitleBar } from "@/component/TitleBar"
import { ServiceCard } from "@/component/ServiceCard"
import { ListItem } from "@/component/List"
import { Switch } from "@/component/Switch"
import { Avatar } from "@/component/Avatar"

import iconArrowRight from "../../blocks/assets/pixso-icons/icon-arrow-right-small.png"

import {
  Wifi,
  Bluetooth,
  Signal,
  Satellite,
  Monitor,
  Sun,
  Layout,
  Info,
  Shield,
} from "lucide-react"

function SettingsPageV19() {
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true)
  const [mobileNetworkEnabled, setMobileNetworkEnabled] = useState(true)
  const [satelliteEnabled, setSatelliteEnabled] = useState(false)
  const [multiScreenEnabled, setMultiScreenEnabled] = useState(true)

  return (
    <div className="w-[360px] min-h-[792px] mx-auto bg-gray-100">
      <StatusBar time="20:42" backgroundColor="#f3f4f6" />

      <div className="w-[328px] mx-auto">
        <TitleBar variant="secondary" title="设置" />
      </div>

      {/* 全局搜索框 */}
      <div className="px-4 mt-1">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="搜索设置"
            className="w-full h-11 pl-11 pr-4 bg-white rounded-[20px] text-sm placeholder:text-gray-400 outline-none border border-gray-200 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="px-4 space-y-3 mt-3">
        {/* 个人账户卡片 */}
        <ServiceCard variant="white">
          <div className="px-3 py-1">
            <div className="flex items-center gap-3">
              <Avatar
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                size={56}
              />
              <div className="flex-1 min-w-0">
                <div className="text-lg font-bold text-gray-900">张三</div>
                <div className="text-sm text-gray-500 mt-0.5">138****8888</div>
              </div>
              <img src={iconArrowRight} alt="" className="w-3 h-6" />
            </div>
          </div>
          <div className="mx-3 mt-2 mb-1">
            <button className="w-full py-2.5 px-4 bg-orange-50 rounded-[12px] text-sm font-medium text-orange-600 flex items-center justify-center gap-1">
              <Shield size={16} strokeWidth={1.5} />
              <span>账号与安全</span>
              <img src={iconArrowRight} alt="" className="w-2.5 h-4 ml-1" />
            </button>
          </div>
        </ServiceCard>

        {/* 设备卡片 */}
        <ServiceCard variant="muted">
          <div className="px-1 py-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">当前设备</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-900">Mate 70 Pro</span>
                <img src={iconArrowRight} alt="" className="w-2.5 h-4" />
              </div>
            </div>
          </div>
        </ServiceCard>

        {/* 网络与连接卡片 */}
        <ServiceCard variant="muted">
          <div className="space-y-0">
            <ListItem
              left={<Wifi size={20} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
              title={<span className="font-medium text-sm">WLAN</span>}
              right={
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-500">已连接</span>
                  <Switch
                    modelValue={wifiEnabled}
                    onUpdateModelValue={setWifiEnabled}
                  />
                </div>
              }
              showArrow={false}
              border={true}
            />
            <ListItem
              left={<Bluetooth size={20} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
              title={<span className="font-medium text-sm">蓝牙</span>}
              right={
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600">已开启</span>
                  <Switch
                                        modelValue={bluetoothEnabled}
                    onUpdateModelValue={setBluetoothEnabled}
                  />
                </div>
              }
              showArrow={false}
              border={true}
            />
            <ListItem
              left={<Signal size={20} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
              title={<span className="font-medium text-sm">移动网络</span>}
              right={
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-500">已连接</span>
                  <Switch
                                        modelValue={mobileNetworkEnabled}
                    onUpdateModelValue={setMobileNetworkEnabled}
                  />
                </div>
              }
              showArrow={false}
              border={true}
            />
            <ListItem
              left={<Satellite size={20} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
              title={<span className="font-medium text-sm">卫星网络</span>}
              right={
                <Switch
                                    modelValue={satelliteEnabled}
                  onUpdateModelValue={setSatelliteEnabled}
                />
              }
              showArrow={false}
              border={true}
            />
            <ListItem
              left={<Monitor size={20} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
              title={<span className="font-medium text-sm">多屏协同</span>}
              right={
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600">已开启</span>
                  <Switch
                                        modelValue={multiScreenEnabled}
                    onUpdateModelValue={setMultiScreenEnabled}
                  />
                </div>
              }
              showArrow={false}
              border={false}
            />
          </div>
        </ServiceCard>

        {/* 外观与显示卡片 */}
        <ServiceCard variant="muted">
          <div className="space-y-0">
            <ListItem
              left={<Layout size={20} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
              title={<span className="font-medium text-sm">桌面和个性化</span>}
              right={
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">默认</span>
                  <img src={iconArrowRight} alt="" className="w-2.5 h-4" />
                </div>
              }
              showArrow={false}
              border={true}
            />
            <ListItem
              left={<Sun size={20} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
              title={<span className="font-medium text-sm">显示和亮度</span>}
              right={
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">标准</span>
                  <img src={iconArrowRight} alt="" className="w-2.5 h-4" />
                </div>
              }
              showArrow={false}
              border={false}
            />
          </div>
        </ServiceCard>

        {/* 关于系统卡片 */}
        <ServiceCard variant="muted">
          <ListItem
            left={<Info size={20} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
            title={<span className="font-medium text-sm">关于系统</span>}
            right={
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">v5.0.0</span>
                <img src={iconArrowRight} alt="" className="w-2.5 h-4" />
              </div>
            }
            showArrow={false}
            border={false}
          />
        </ServiceCard>

        {/* 退出登录按钮 */}
        <div className="pt-2 pb-4">
          <button className="w-full h-12 bg-red-500 text-white text-base font-medium rounded-[24px] hover:bg-red-600 active:bg-red-700 transition-colors">
            退出登录
          </button>
        </div>
      </div>

      {/* 底部指示条 */}
      <div className="h-7 flex justify-center pb-2">
        <div className="w-28 h-1.5 rounded-full bg-gray-300"></div>
      </div>
    </div>
  )
}

export default SettingsPageV19
