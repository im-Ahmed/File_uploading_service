import { useState, useEffect, useRef } from "react";
import { PinLogo, SearchIcon } from "./Icons";
import { healthCheck } from "../lib/api";

export default function Navbar({
  user,
  onLogout,
  onSearch,
  onToggleSidebar,
  onDeleteUser,
}) {
  const [health, setHealth] = useState(null); // null=checking, true=ok, false=err
  const [query, setQuery] = useState("");
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const overlayInputRef = useRef(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const check = async () => setHealth(await healthCheck());
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (mobileSearchActive) {
      const onKey = (e) => {
        if (e.key === "Escape") setMobileSearchActive(false);
      };
      document.addEventListener("keydown", onKey);
      // focus input inside overlay when opened
      setTimeout(() => overlayInputRef.current?.focus(), 0);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [mobileSearchActive]);

  useEffect(() => {
    if (!profileMenuOpen) return;
    const onDocClick = (e) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target)) setProfileMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setProfileMenuOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileMenuOpen]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const displayName = user?.username || user?.email || "U";
  const initial = displayName[0]?.toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-50 bg-canvas border-b border-hairline h-16 flex items-center px-4 gap-4">
      {/* Mobile menu button */}
      <button
        onClick={() => onToggleSidebar && onToggleSidebar()}
        className="md:hidden p-2 rounded-md hover:bg-secondary-pressed"
        aria-label="Open sidebar"
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Logo */}
      <a
        href="#"
        className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight shrink-0 no-underline"
      >
        <PinLogo />
        <span>FilePin</span>
      </a>

      {/* Centered search for desktop */}
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
        <div className="relative">
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
      </div>

      {/* Mobile search icon (opens overlay) */}
      <div className="md:hidden flex-1" />

      {/* Mobile search overlay (appears when focused on small screens) */}
      {mobileSearchActive && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-5 md:hidden"
          onClick={() => setMobileSearchActive(false)}
        >
          <div
            className="pointer-events-auto w-full max-w-xl bg-surface-card rounded-full shadow-lg px-4 py-3 flex items-center gap-3"
            onClick={(e) => e.stopPropagation()}
            style={{ transform: "translateY(0)" }}
          >
            <span className="text-ash">
              <SearchIcon />
            </span>
            <input
              ref={overlayInputRef}
              type="search"
              value={query}
              onChange={handleSearch}
              placeholder="Search your files…"
              className="w-full h-10 bg-transparent text-ink text-base outline-none"
            />
            <button
              onClick={() => setMobileSearchActive(false)}
              aria-label="Close search"
              className="text-ash hover:text-ink p-1"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Right cluster */}
      <div className="flex items-center gap-3 ml-auto shrink-0">
        {/* Health indicator */}
        <div className="flex items-center gap-1.5 text-sm text-mute">
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              health === null
                ? "bg-stone"
                : health
                  ? "bg-green-500"
                  : "bg-error-color"
            }`}
          />
          <span className="hidden sm:inline">
            {health === null ? "Checking…" : health ? "Online" : "Offline"}
          </span>
        </div>

        {/* Mobile search icon (right side) */}
        <button
          onClick={() => setMobileSearchActive(true)}
          className="md:hidden p-2 rounded-md hover:bg-secondary-pressed"
          aria-label="Open search"
        >
          <SearchIcon />
        </button>

        {/* Profile avatar */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileMenuOpen((s) => !s)}
            className="flex items-center gap-2 bg-surface-card rounded-full px-3 py-1.5 focus-ring"
            aria-label="Open profile menu"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
              {initial}
            </div>
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-surface-card border border-hairline rounded-md shadow-lg py-1 z-50">
              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  onLogout && onLogout();
                }}
                className="w-full text-left px-4 py-2 hover:bg-secondary-pressed text-ink"
              >
                Log out
              </button>
              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  if (typeof window !== "undefined") {
                    if (!confirm("Delete user? This action is irreversible."))
                      return;
                  }
                  // optional prop callback
                  if (typeof window !== "undefined") {
                    if (typeof onDeleteUser === "function") onDeleteUser();
                  }
                }}
                className="w-full text-left px-4 py-2 hover:bg-secondary-pressed text-error-color"
              >
                Delete user
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
