import { useState } from 'react'
import { PinLogo } from './Icons'

export default function ServerSetup({ onSave }) {
  const [url, setUrl] = useState('http://localhost:3000')

  const handleSave = () => {
    const trimmed = url.trim().replace(/\/$/, '')
    if (!trimmed) return
    localStorage.setItem('fp_server', trimmed)
    onSave(trimmed)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-canvas rounded-lg p-8 w-full max-w-md shadow-modal">
        <div className="flex items-center gap-3 text-primary mb-6">
          <PinLogo className="w-9 h-9" />
          <h1 className="text-2xl font-bold tracking-tight">FilePin</h1>
        </div>

        <h2 className="text-lg font-semibold text-ink mb-1">Connect your backend</h2>
        <p className="text-sm text-mute mb-5">
          Enter your API server URL to get started. This is saved locally in your browser.
        </p>

        <label className="block text-sm font-bold text-ink mb-1.5">Server URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="http://localhost:3000"
          className="w-full h-11 px-4 bg-canvas border border-ash rounded-md text-base text-ink
                     input-focus placeholder:text-ash mb-4"
          autoFocus
        />

        <button
          onClick={handleSave}
          className="w-full bg-primary text-white rounded-md py-2.5 text-sm font-bold
                     hover:bg-primary-pressed transition-colors"
        >
          Connect →
        </button>

        <p className="text-xs text-ash mt-4 text-center">
          You can change this later in Settings.
        </p>
      </div>
    </div>
  )
}
