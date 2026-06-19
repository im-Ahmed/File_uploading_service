import { useEffect, useState } from "react";
import { getFileType } from "/src/components/PinCard";
import { CloseIcon, TrashIcon, ExternalIcon, CopyIcon } from "./Icons";

export default function FileModal({ file, onClose, onDelete, getById }) {
  const [detail, setDetail] = useState(file);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    if (!file) return;
    setDetail(file);
    const id = file._id || file.id;
    if (id) {
      getById(id).then((d) => {
        if (d) setDetail(d);
      });
    }
  }, [file, getById]);

  if (!file) return null;

  const name = file?.filename || detail?.name || "File";
  const url = file?.url || detail?.path || "";
  const size = file?.size
    ? file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(1)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    : "";
  const createdAt = file?.createdAt
    ? new Date(file.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
    
  const fileType = { image: 'Image', video: 'Video', doc: 'Doc', other: 'File' }
  const isImage = fileType[getFileType(file)] === 'Image'
  const isVideo = fileType[getFileType(file)] === 'Video'

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this file? This cannot be undone.")) return;
    setDeleting(true);
    await onDelete(file?._id || detail?.id);
    setDeleting(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-canvas rounded-lg p-8 w-full max-w-md shadow-modal relative max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-card
                     flex items-center justify-center hover:bg-secondary-pressed transition-colors"
        >
          <CloseIcon />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-ink pr-10 mb-1">{name}</h2>
        {(size || createdAt) && (
          <p className="text-sm text-mute mb-4">
            {[size, createdAt].filter(Boolean).join(" · ")}
          </p>
        )}

        {/* Image preview */}
        {isImage && url && (
          <img
            src={url}
            alt={name}
            className="w-full rounded-md mb-4 max-h-72 object-contain bg-surface-card"
          />
        )}
        {/* Video preview */}
        {isVideo && url && (
          <video
            src={url}
            playsInline
            autoPlay
            preload="metadata"
            className="w-full rounded-md mb-4 max-h-full object-contain bg-surface-card"
          />
        )}

        {/* URL row */}
        {url && (
          <div className="flex gap-2 mb-3">
            <input
              readOnly
              value={url}
              className="flex-1 h-9 px-3 text-xs text-mute bg-surface-card border border-hairline
                         rounded-md outline-none"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-secondary-bg hover:bg-secondary-pressed
                         text-ink text-xs font-bold px-3 h-9 rounded-md transition-colors shrink-0"
            >
              <CopyIcon className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}

        {/* Open in new tab */}
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer">
            <button
              className="flex items-center gap-2 bg-secondary-bg hover:bg-secondary-pressed
                               text-ink text-sm font-bold px-4 py-2 rounded-md transition-colors mb-4"
            >
              <ExternalIcon />
              Open file
            </button>
          </a>
        )}


        {/* Divider + Delete */}
        <div className="border-t border-hairline pt-4 mt-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 text-error-color text-sm font-bold px-3 py-2
                       rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <TrashIcon />
            {deleting ? "Deleting…" : "Delete this file"}
          </button>
        </div>
      </div>
    </div>
  );
}
