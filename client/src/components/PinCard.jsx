import { useState, useRef } from 'react'
import { TrashIcon, FileIcon, ImageIcon, VideoIcon } from './Icons'

export function getFileType(file) {
  const check = ((file.url || file.path || '') + (file.filename || file.name || '')).toLowerCase()
  if (/\.(jpg|jpeg|png|gif|webp|svg|bmp)/.test(check)) return 'image'
  if (/\.(mp4|avi|mov|mkv|webm|flv|wmv|m4v|3gp)/.test(check)) return 'video'
  if (/\.(doc|docx|txt|xls|xlsx|csv|ppt|pptx)/.test(check)) return 'doc'
  if (/\.(pdf)/.test(check)) return 'pdf'
  return 'other'
}

function humanSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const PLACEHOLDER_HEIGHTS = [140, 190, 160, 230, 125, 175, 210, 145]

export default function PinCard({ file, index, onClick, onDelete }) {
  const [imgError, setImgError] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const videoRef = useRef(null)

  const fileType = { image: 'Image', video: 'Video', pdf: 'PDF', doc: 'Doc', other: 'File' }
  const rawType = getFileType(file)
  const type = fileType[rawType]
  const isImage = rawType === 'image'
  const isVideo = rawType === 'video'
  const url = file.url || file.path || ''
  const name = file.filename || file.name || 'Untitled'
  const size = humanSize(file.size)
  const id = file._id || file.id
  const placeholderH = PLACEHOLDER_HEIGHTS[index % PLACEHOLDER_HEIGHTS.length]

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm('Delete this file? This cannot be undone.')) {
      onDelete(id)
    }
  }

  const handleMouseEnter = () => {
    setShowActions(true)
    if (videoRef.current) videoRef.current.play().catch(() => {})
  }

  const handleMouseLeave = () => {
    setShowActions(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  const renderPreview = () => {
    if (isImage && url && !imgError) {
      return (
        <img
          src={url}
          alt={name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full block object-cover"
        />
      )
    }

    if (isVideo && url && !videoError) {
      return (
        <div className="relative w-full" style={{ height: placeholderH }}>
          <video
            ref={videoRef}
            src={url}
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover"
          />
          {/* Play icon badge — hidden on hover while video plays */}
          <div className={`absolute inset-0 flex items-center justify-center
                           transition-opacity ${showActions ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
              <svg className="w-5 h-5 text-white fill-current translate-x-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      )
    }

    // Fallback placeholder for docs, other, or failed media
    return (
      <div
        className="w-full flex items-center justify-center bg-hairline-soft text-stone"
        style={{ height: placeholderH }}
      >
        {isImage && <ImageIcon className="w-9 h-9" />}
        {isVideo && <VideoIcon className="w-9 h-9" />}
        {!isImage && !isVideo && <FileIcon className="w-9 h-9" />}
      </div>
    )
  }

  return (
    <div
      className="pin-card-item"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative bg-surface-card rounded-md overflow-hidden cursor-pointer
                   transition-transform hover:scale-[1.01] group"
        onClick={() => onClick(file)}
      >
        {renderPreview()}

        {/* Type pill overlay */}
        <span className="absolute bottom-[52px] left-2 bg-canvas text-ink text-xs font-bold
                         rounded-full px-2.5 py-1">
          {type}
        </span>

        {/* Delete action overlay */}
        <div className={`absolute top-2 right-2 flex gap-1.5 transition-opacity ${
          showActions ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={handleDelete}
            className="w-9 h-9 rounded-full bg-canvas flex items-center justify-center
                       text-ink hover:bg-secondary-pressed shadow transition-colors"
            title="Delete file"
          >
            <TrashIcon />
          </button>
        </div>

        {/* Meta */}
        <div className="px-3 py-2.5">
          <p className="text-sm font-bold text-ink truncate">{name}</p>
          {size && <p className="text-xs text-ash mt-0.5">{size}</p>}
        </div>
      </div>
    </div>
  )
}