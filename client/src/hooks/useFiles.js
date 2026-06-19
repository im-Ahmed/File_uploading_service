import { useState, useCallback } from 'react'
import * as api from '../lib/api'

export function useFiles() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadStatus, setUploadStatus] = useState(null) // { type: 'success'|'error', msg }

  const load = useCallback(async () => { 
    setLoading(true); setError('')
    try {
      const data = await api.getAllFiles()
      setFiles(data.data.allFiles || data.files || (Array.isArray(data) ? data : []))
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }, [])

  const upload = useCallback(async (filename, file) => {
    setUploadStatus(null)
    try {
      await api.uploadFile(filename, file)
      setUploadStatus({ type: 'success', msg: '✓ File pinned!' })
      await load()
      return true
    } catch (e) {
      setUploadStatus({ type: 'error', msg: e.message })
      return false
    }
  }, [load])

  const remove = useCallback(async (id) => {
    try {
      await api.deleteFile(id)
      setFiles(prev => prev.filter(f => (f._id || f.id) !== id))
      return true
    } catch (e) {
      setError(e.message); return false
    }
  }, [])

  const getById = useCallback(async (id) => {
    try {
      const data = await api.getFileById(id)
      return data.data || data
    } catch { return null }
  }, [])

  const clearUploadStatus = useCallback(() => setUploadStatus(null), [])

  return { files, loading, error, uploadStatus, load, upload, remove, getById, clearUploadStatus }
}
