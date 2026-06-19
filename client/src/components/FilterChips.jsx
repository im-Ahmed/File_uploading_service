const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'image', label: 'Images' },
  { key: 'video', label: 'Videos' },
  { key: 'pdf', label: 'PDF' },
  { key: 'doc', label: 'Docs' },
  { key: 'other', label: 'Other' },
]

export default function FilterChips({ active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap mb-5">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
            active === key
              ? 'bg-ink text-on-dark'
              : 'bg-surface-card text-ink hover:bg-secondary-pressed'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
