export default function HeroStrip({ onCTA }) {
  return (
    <div className="bg-charcoal text-on-dark rounded-md p-10 flex flex-col sm:flex-row
                    items-center justify-between gap-6 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight leading-snug">
          Upload, manage,<br className="hidden sm:block" /> and share your files.
        </h1>
        <p className="text-sm text-white/60 mt-2">
          Your personal file board — beautifully organized.
        </p>
      </div>
      <button
        onClick={onCTA}
        className="bg-primary text-white rounded-md px-7 py-3.5 text-base font-bold
                   hover:bg-primary-pressed transition-colors shrink-0"
      >
        Get started free
      </button>
    </div>
  )
}
