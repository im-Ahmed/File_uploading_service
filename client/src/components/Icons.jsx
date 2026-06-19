export function PinLogo({ className = 'w-7 h-7' }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="currentColor">
      <path d="M14 2C7.37 2 2 7.37 2 14c0 5.1 3.07 9.5 7.5 11.45-.1-.95-.19-2.4.04-3.44l1.4-5.93s-.35-.71-.35-1.76c0-1.65.96-2.88 2.15-2.88 1.01 0 1.5.76 1.5 1.67 0 1.02-.65 2.54-1 3.95-.28 1.18.59 2.14 1.75 2.14 2.1 0 3.72-2.21 3.72-5.41 0-2.83-2.03-4.8-4.94-4.8-3.37 0-5.34 2.53-5.34 5.14 0 1.02.39 2.11.88 2.7.1.12.11.22.08.34l-.33 1.33c-.05.22-.18.27-.4.16-1.5-.7-2.44-2.88-2.44-4.64 0-3.77 2.74-7.23 7.9-7.23 4.15 0 7.37 2.96 7.37 6.9 0 4.12-2.6 7.43-6.2 7.43-1.21 0-2.35-.63-2.74-1.37l-.74 2.78c-.27 1.04-1 2.34-1.49 3.13.56.17 1.16.27 1.77.27C20.63 26 26 20.63 26 14S20.63 2 14 2z" />
    </svg>
  )
}

export function SearchIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

export function UploadIcon({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

export function TrashIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
  )
}

export function CloseIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export function FileIcon({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

export function ImageIcon({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  )
}
export function VideoIcon({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

export function ExternalIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

export function CopyIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}
