import type { SVGProps } from "react"

export function DoNotDisturbIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      role="img"
      aria-label="免打扰"
      {...props}
    >
      <path
        fill="#0000d4"
        d="M21.5 4.8C14.8 7 7 14.8 4.7 21.4c-2.1 6.2-2.2 14.9-.1 20.9 2.1 6.1 8.2 12.9 14.6 16.1 7.4 3.7 18.2 3.7 25.6 0 17.9-8.9 21.9-32.9 7.8-46.9C44.5 3.4 33 1 21.5 4.8m9 11.4c-.3 1.3-.9 4.3-1.2 6.8-.9 8.1 5.6 14.6 14.5 14.3 4.8-.2 5.3 1 2.1 5.1-3.4 4.4-9.5 6.9-14.8 6.2C17.6 46.7 10.9 31 19.2 20.5c2.6-3.3 7.6-6.5 10.2-6.5 1.4 0 1.7.5 1.1 2.2"
      />
    </svg>
  )
}

export function FocusModeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="专注模式"
      {...props}
    >
      <circle cx="32" cy="32" r="29" fill="#0A59F7" />
      <circle cx="32" cy="32" r="14" fill="none" stroke="#FFFFFF" strokeWidth="3" />
      <circle cx="32" cy="32" r="5" fill="#FFFFFF" />
    </svg>
  )
}

export function CloudBackupIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="云备份"
      {...props}
    >
      <circle cx="32" cy="32" r="29" fill="#11B981" />
      <path
        d="M22 38c-3.3 0-6-2.7-6-6 0-3 2.2-5.5 5.1-5.9C22 22.5 25.6 20 30 20c4.5 0 8.3 3 9.5 7.1.5-.1 1-.2 1.5-.2 3.3 0 6 2.7 6 6s-2.7 6-6 6H22z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

export function PersonalModeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="个人模式"
      {...props}
    >
      <defs>
        <linearGradient id="feature-promo-personal-fill" x1="12" y1="10" x2="52" y2="54">
          <stop offset="0%" stopColor="#F091FF" />
          <stop offset="100%" stopColor="#B65CFF" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="29" fill="url(#feature-promo-personal-fill)" />
      <circle cx="32" cy="24.5" r="7" fill="#FFFFFF" />
      <path
        d="M20.5 44.5c0-6.1 5-11 11.2-11h.6c6.2 0 11.2 4.9 11.2 11v1.5h-23v-1.5Z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

export function WorkModeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="工作模式"
      {...props}
    >
      <circle cx="32" cy="32" r="29" fill="#47A7FF" />
      <rect x="19" y="23" width="26" height="20" rx="4" fill="#FFFFFF" />
      <path d="M25 23.5v-3a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" stroke="#47A7FF" strokeWidth="3" strokeLinecap="round" />
      <path d="M19 30h26" stroke="#47A7FF" strokeWidth="3" />
    </svg>
  )
}

export function SleepModeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="睡眠模式"
      {...props}
    >
      <circle cx="32" cy="32" r="29" fill="#41CCE3" />
      <path
        d="M40 41c-7.5 0-13.5-6-13.5-13.5 0-2.6.7-5 2-7-5.5 1.5-9.5 6.5-9.5 12.5 0 7.2 5.8 13 13 13 5.4 0 10-3.3 12-8-1.3.6-2.7 1-4 1z"
        fill="#FFFFFF"
      />
      <circle cx="43.5" cy="18.5" r="2.2" fill="#FFFFFF" opacity="0.95" />
      <circle cx="38.5" cy="14.2" r="1.3" fill="#FFFFFF" opacity="0.8" />
    </svg>
  )
}
