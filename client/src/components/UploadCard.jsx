import { useState, useRef } from 'react'
import { UploadIcon } from './Icons'

export default function UploadCard({ onUpload }) {
  const [filename, setFilename] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null) // { type, msg }
  const inputRef = useRef()

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    if (!filename) setFilename(f.name.replace(/\.[^.]+$/, ''))
    if (f.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(f)
    } else {
      setPreview(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = async () => {
    if (!filename.trim()) return setStatus({ type: 'error', msg: 'Add a name first.' })
    if (!file) return setStatus({ type: 'error', msg: 'Choose a file to upload.' })
    setLoading(true)
    setStatus(null)
    const ok = await onUpload(filename.trim(), file)
    setLoading(false)
    if (ok) {
      setStatus({ type: 'success', msg: '✓ File pinned!' })
      setFilename('')
      setFile(null)
      setPreview(null)
      if (inputRef.current) inputRef.current.value = ''
      setTimeout(() => setStatus(null), 3000)
    } else {
      setStatus({ type: 'error', msg: 'Upload failed. Try again.' })
    }
  }

  return (
    <div className="bg-canvas rounded-md p-5">
      <h3 className="text-lg font-semibold text-ink mb-4">Upload a file</h3>

      {status && (
        <div className={`rounded-md px-4 py-3 text-sm font-bold mb-4 ${
          status.type === 'success'
            ? 'bg-success-pale text-success-deep'
            : 'bg-red-50 text-error-color'
        }`}>
          {status.msg}
        </div>
      )}

      {/* Name */}
      <div className="mb-3">
        <label className="block text-sm font-bold text-ink mb-1.5">Name</label>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="e.g. My inspiration board"
          className="w-full h-11 px-4 bg-canvas border border-ash rounded-md text-base text-ink
                     input-focus placeholder:text-ash"
        />
      </div>

      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-md p-7 text-center cursor-pointer
          transition-colors mb-3 ${
          dragOver
            ? 'border-primary bg-red-50'
            : 'border-stone bg-surface-card hover:border-ash'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
          accept="image/*,application/pdf,.doc,.docx,.txt,.zip,.csv,.xlsx"
        />

        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="w-full max-h-36 object-cover rounded-sm mb-2"
          />
        ) : (
          <div className="text-ash mb-2 flex justify-center">
            <UploadIcon />
          </div>
        )}

        {file ? (
          <p className="text-sm font-bold text-ink truncate">{file.name}</p>
        ) : (
          <>
            <p className="text-sm font-bold text-ink">Drop a file here</p>
            <p className="text-xs text-ash mt-1">or click to browse</p>
          </>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-primary text-white rounded-md py-2.5 text-sm font-bold
                   hover:bg-primary-pressed disabled:opacity-60 transition-colors focus-ring"
      >
        {loading ? 'Pinning…' : '📌 Pin it'}
      </button>
    </div>
  )
}
