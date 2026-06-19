import { useState, useEffect, useMemo, useCallback } from "react";
import Navbar from "./components/Navbar";
import AuthForm from "./components/AuthForm";
import UploadCard from "./components/UploadCard";
import PinGrid from "./components/PinGrid";
import FileModal from "./components/FileModal";
import HeroStrip from "./components/HeroStrip";
import FilterChips from "./components/FilterChips";
import ServerSetup from "./components/ServerSetup";
import { useAuth } from "./hooks/useAuth";
import { useFiles } from "./hooks/useFiles";
import { getFileType } from "./components/PinCard";



export default function App() {
  const [serverReady, setServerReady] = useState(() =>
    Boolean(localStorage.getItem("fp_server")),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const auth = useAuth();
  const filesHook = useFiles();

  // Load files when user logs in
  useEffect(() => {
    if (auth.isLoggedIn) {
      filesHook.load();
    }
  }, [auth.isLoggedIn]);

  // Filtered + searched files
  const visibleFiles = useMemo(() => {
    let list = filesHook.files;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((f) =>
        (f.filename || f.name || "").toLowerCase().includes(q),
      );
    }
    if (filter !== "all") {
      list = list.filter((f) => getFileType(f) === filter);
    }
    return list;
  }, [filesHook.files, searchQuery, filter]);

  const handleLogout = async () => {
    await auth.doLogout();
    setSearchQuery("");
    setFilter("all");
    setSelectedFile(null);
  };

  const handleFileDelete = useCallback(
    async (id) => {
      await filesHook.remove(id);
      setSelectedFile(null);
    },
    [filesHook],
  );

  const memoizedFileModal = useMemo(() => {
    if (!selectedFile) return null;
    return (
      <FileModal
        file={selectedFile}
        onClose={() => setSelectedFile(null)}
        onDelete={handleFileDelete}
        getById={filesHook.getById}
      />
    );
  }, [selectedFile, handleFileDelete, filesHook.getById]);

  if (!serverReady) {
    return <ServerSetup onSave={() => setServerReady(true)} />;
  }

  return (
    <div className="min-h-screen bg-surface-soft">
      <Navbar
        user={auth.user}
        isLoggedIn={auth.isLoggedIn}
        onLogout={handleLogout}
        onSearch={setSearchQuery}
      />

      <div className="max-w-screen-xl mx-auto px-6 py-6 flex gap-6">
        {/* ── Sidebar ── */}
        <aside className="w-72 shrink-0 flex flex-col gap-3 md:flex">
          {/* Server config badge */}
          <div className="flex items-center justify-between bg-canvas rounded-md px-4 py-2.5">
            <span className="text-xs text-mute truncate">
              {localStorage.getItem("fp_server") || "No server"}
            </span>
            <button
              onClick={() => {
                const s = prompt(
                  "New server URL:",
                  localStorage.getItem("fp_server") || "",
                );
                if (s) {
                  localStorage.setItem(
                    "fp_server",
                    s.trim().replace(/\/$/, ""),
                  );
                  window.location.reload();
                }
              }}
              className="text-xs font-bold text-primary hover:underline ml-2 shrink-0"
            >
              Change
            </button>
          </div>

          {auth.isLoggedIn ? (
            <UploadCard onUpload={filesHook.upload} />
          ) : (
            <div className="bg-canvas rounded-md p-5">
              <AuthForm
                onLogin={auth.doLogin}
                onRegister={auth.doRegister}
                loading={auth.loading}
                error={auth.error}
              />
            </div>
          )}
        </aside>

        {/* ── Main feed ── */}
        <main className="flex-1 min-w-0">
          {/* Hero (logged-out only) */}
          {!auth.isLoggedIn && (
            <HeroStrip onCTA={() => setShowAuthModal(true)} />
          )}

          {/* Feed header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold tracking-tight text-ink">
              {auth.isLoggedIn ? "Your files" : "Discover files"}
            </h2>
            {auth.isLoggedIn && (
              <span className="text-sm text-mute">
                {visibleFiles.length}{" "}
                {visibleFiles.length === 1 ? "file" : "files"}
              </span>
            )}
          </div>

          {/* Filter chips (logged-in only) */}
          {auth.isLoggedIn && (
            <FilterChips active={filter} onChange={setFilter} />
          )}

          {/* Error banner */}
          {filesHook.error && (
            <div className="bg-red-50 text-error-color rounded-md px-4 py-3 text-sm font-bold mb-4">
              {filesHook.error}
            </div>
          )}

          {/* Grid */}
          {auth.isLoggedIn ? (
            <PinGrid
              files={visibleFiles}
              loading={filesHook.loading}
              onCardClick={setSelectedFile}
              onDelete={filesHook.remove}
              searchQuery={searchQuery}
              filter={filter}
            />
          ) : (
            <div className="bg-canvas rounded-md py-20 text-center">
              <p className="text-mute text-sm">
                Log in to see and manage your files.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* ── File detail modal ── */}
      {memoizedFileModal}

      {/* ── Auth modal (mobile / hero CTA) ── */}
      {showAuthModal && !auth.isLoggedIn && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAuthModal(false);
          }}
        >
          <div className="bg-canvas rounded-lg p-8 w-full max-w-sm shadow-modal relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-card
                         flex items-center justify-center hover:bg-secondary-pressed"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-ink mb-1">
              Welcome to FilePin
            </h2>
            <p className="text-sm text-mute mb-5">
              Sign up or log in to upload and manage your files.
            </p>
            <AuthForm
              onLogin={async (e, p) => {
                const ok = await auth.doLogin(e, p);
                if (ok) setShowAuthModal(false);
              }}
              onRegister={async (e, p, u) => {
                const ok = await auth.doRegister(e, p, u);
                if (ok) setShowAuthModal(false);
              }}
              loading={auth.loading}
              error={auth.error}
            />
          </div>
        </div>
      )}
    </div>
  );
}
