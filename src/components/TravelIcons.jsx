export function AirplaneIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10.5 19.5 8 21v-3.5L3 14l1.2-.9L8 14.5V10L2.5 7.5 3.4 6.4 10.5 8.5 12.8 3h1.4l1.8 5.5 7.1-2.1.9 1.1L18 10l4.5 3.5-.9.9-5.5-1.5v4.5L19 19.5l-1.1.9-3.6-2.2L12 21l-1.5-1.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function AirportIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20h16v-2H4v2Zm2-4h12l-1-3H7l-1 3Zm1.5-5h9L15 6H9L7.5 11Z"
        fill="currentColor"
      />
      <path d="M11 3h2v2h-2V3Z" fill="currentColor" />
    </svg>
  )
}

export function SeatIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6h2a2 2 0 0 1 2 2v4H3v-4a2 2 0 0 1 2-2h2V4Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path d="M5 18h14v2H5v-2Z" fill="currentColor" />
    </svg>
  )
}

export function MoneyIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      <path d="M6 10v4M18 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function GateIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20V8l8-5 8 5v12h-5v-7H9v7H4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}
