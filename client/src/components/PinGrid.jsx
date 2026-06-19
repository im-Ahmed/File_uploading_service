import PinCard from './PinCard'
import { UploadIcon } from './Icons'

const SKELETON_HEIGHTS = [140, 200, 160, 240, 130, 180, 210, 150, 170, 195, 155, 220]

function SkeletonCard({ height }) {
  return (
    <div className="pin-card-item">
      <div className="skeleton rounded-md" style={{ height }} />
    </div>
  )
}

export default function PinGrid({ files, loading, onCardClick, onDelete, searchQuery }) {
  if (loading) {
    return (
      <div className="pin-grid">
        {SKELETON_HEIGHTS.map((h, i) => (
          <SkeletonCard key={i} height={h} />
        ))}
      </div>
    )
  }

  if (!files.length) {
    return (
      <div className="bg-canvas rounded-md py-16 px-6 text-center">
        <div className="text-stone flex justify-center mb-4">
          <UploadIcon className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-semibold text-ink mb-2">
          {searchQuery ? 'No results found' : 'No files yet'}
        </h3>
        <p className="text-sm text-mute max-w-xs mx-auto">
          {searchQuery
            ? `No files match "${searchQuery}". Try a different search.`
            : 'Upload your first file using the panel on the left.'}
        </p>
      </div>
    )
  }

  return (
    <div className="pin-grid">
      {files.map((file, i) => (
        <PinCard
          key={file._id || file.id || i}
          file={file}
          index={i}
          onClick={onCardClick}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
