import { useState, useEffect } from 'react'
import { PinLogo, SearchIcon } from './Icons'
import { healthCheck } from '../lib/api'

export default function Navbar({ user, isLoggedIn, onLogout, onSearch }) {
  const [health, setHealth] = useState(null) // null=checking, true=ok, false=err
  const [query, setQuery] = useState('')

  useEffect(() => {
    const check = async () => setHealth(await healthCheck())
    check()
    const id = setInterval(check, 30000)
    return () => clearInterval(id)
  }, [])

  const handleSearch = (e) => {
    setQuery(e.target.value)
    onSearch(e.target.value)
  }

  const displayName = user?.username || user?.email || 'U'
  const initial = displayName[0]?.toUpperCase() || 'U'

  return (
    <nav className="sticky top-0 z-50 bg-canvas border-b border-hairline h-16 flex items-center px-6 gap-4">
      {/* Logo */}
      <a href="#" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight shrink-0 no-underline">
        <PinLogo />
        <span>FilePin</span>
      </a>

      {/* Search */}
      <div className="relative flex-1 max-w-xl">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ash pointer-events-none">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={query}
          onChange={handleSearch}
          placeholder="Search your files…"
          className="w-full h-12 pl-11 pr-4 bg-surface-card rounded-full text-ink text-base
                     border border-transparent focus:bg-canvas focus:border-ink focus:border-2
                     focus:shadow-focus outline-none transition-all placeholder:text-ash"
        />
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-3 ml-auto shrink-0">
        {/* Health indicator */}
        <div className="flex items-center gap-1.5 text-sm text-mute">
          <span className={`w-2 h-2 rounded-full transition-colors ${
            health === null ? 'bg-stone' : health ? 'bg-green-500' : 'bg-error-color'
          }`} />
          <span className="hidden sm:inline">
            {health === null ? 'Checking…' : health ? 'Online' : 'Offline'}
          </span>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-surface-card rounded-full px-4 py-1.5">
              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                {initial}
              </div>
              <span className="text-sm font-bold text-ink hidden sm:inline">{displayName}</span>
            </div>
            <button
              onClick={onLogout}
              className="bg-secondary-bg text-ink rounded-md px-4 py-2 text-sm font-bold
                         hover:bg-secondary-pressed transition-colors focus-ring"
            >
              Log out
            </button>
          </div>
        ) : (
          <button
            onClick={() => {}}
            className="bg-primary text-white rounded-md px-4 py-2 text-sm font-bold
                       hover:bg-primary-pressed transition-colors focus-ring"
          >
            Log in
          </button>
        )}
      </div>
    </nav>
  )
}
