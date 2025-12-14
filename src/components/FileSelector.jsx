import { useRef, useState } from 'react'
import { useErrorMessage } from './ErrorMessageProvider'
import request from '../utils/request'

import UploadFileIcon from '@mui/icons-material/UploadFile'
import ClearIcon from '@mui/icons-material/Clear'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import EditDocumentIcon from '@mui/icons-material/EditDocument'
import ErrorIcon from '@mui/icons-material/Error'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import BlobInputDialog from './BlobInputDialog'
import ConfirmationProvider from './ConfirmationProvider'

function FetchFile(props) {
  const {
    color = 'inherit',
    disabled = false,
    value = '',
    placeholder = '',
    loading = false,
    onChange = () => {},
    onLoadingChange = () => {},
    onSubmit = () => {},
  } = props || {}

  const [error, setError] = useState(false)
  const showErrorMessage = useErrorMessage()
  function setErrorMessage(message) {
    setError(!!message)
    if (message) showErrorMessage(message)
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') onChange('')
  }

  function handleChange(e) {
    const newValue = e.target.value
    setError(false)
    onChange(newValue)
  }

  async function handleSubmit() {
    if (disabled || loading) return
    setError(false)
    onLoadingChange(true)
    return request(value)
      .finally(() => onLoadingChange(false))
      .then((blob) => {
        onSubmit({
          source: 'fetch',
          url: value,
          blob: blob,
        })
      })
      .catch((err) => setErrorMessage(err.message))
  }

  return (
    <>
      <InputBase
        value={value}
        onChange={handleChange}
        disabled={disabled}
        color={error ? 'error' : color}
        placeholder={placeholder}
        onKeyUp={handleKeyPress}
        fullWidth
        startAdornment={
          <InputAdornment position="start">
            {error && <ErrorIcon color="error" fontSize="medium" />}
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            {value && !disabled && (
              <IconButton onClick={() => onChange('')}>
                <ClearIcon />
              </IconButton>
            )}
          </InputAdornment>
        }
      />

      <Tooltip title="Submit file URL">
        <IconButton
          color={color}
          disabled={disabled}
          onClick={handleSubmit}
          loading={loading}
        >
          <CloudDownloadIcon />
        </IconButton>
      </Tooltip>
    </>
  )
}

function UploadFile(props) {
  const {
    color = 'inherit',
    disabled = false,
    accept = '*/*',
    onSubmit = () => {},
  } = props || {}

  const inputRef = useRef(null)

  function handleFileChange(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    onSubmit({
      source: 'upload',
      url: new URL(e.target.value).href,
      blob: file,
    })
  }

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        accept={accept}
        disabled={disabled}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <Tooltip title="Upload local file">
        <IconButton
          color={color}
          disabled={disabled}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <UploadFileIcon />
        </IconButton>
      </Tooltip>
    </>
  )
}

function InputFile(props) {
  const {
    color = 'inherit',
    disabled = false,
    onSubmit = () => {},
  } = props || {}

  const [open, setOpen] = useState(false)

  function handleSubmit(blob) {
    setOpen(false)
    onSubmit({
      source: 'input',
      url: URL.createObjectURL(blob),
      blob: blob,
    })
  }

  return (
    <>
      <ConfirmationProvider>
        <BlobInputDialog
          open={open}
          title="Paste File Content"
          onSubmit={handleSubmit}
          onClose={() => setOpen(false)}
          type="text/plain"
        />
      </ConfirmationProvider>

      <Tooltip title="Paste file content">
        <IconButton
          color={color}
          disabled={disabled}
          onClick={() => !disabled && setOpen(true)}
        >
          <EditDocumentIcon />
        </IconButton>
      </Tooltip>
    </>
  )
}

/**
 * General purpose file selector component.
 *
 * @param {string} color - MUI color scheme
 * @param {boolean} disabled - Whether the component is disabled.
 * @param {string} placeholder - Placeholder text for the URL input.
 * @param {string} accept - Accepted MIME types for file upload.
 * @param {(blob: File | Blob, url: string, source: 'fetch' | 'upload' | 'input') => void} onSubmit - Called when user submits a file.
 */
export default function FileSelector(props) {
  const {
    color = 'primary',
    disabled = false,
    placeholder = '',
    accept = '*/*',
    onSubmit = () => {},
  } = props || {}

  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit({ blob, url, source }) {
    setValue(url)
    setLoading(false)
    onSubmit(blob, url, source)
  }

  return (
    <Paper sx={{ p: 1, display: 'flex', flexFlow: 'row nowrap', gap: 1 }}>
      <FetchFile
        disabled={disabled || loading}
        color={color}
        loading={loading}
        placeholder={placeholder}
        value={value}
        onChange={setValue}
        onLoadingChange={setLoading}
        onSubmit={handleSubmit}
      />
      <Divider orientation="vertical" variant="middle" flexItem />
      <UploadFile
        disabled={disabled || loading}
        color={color}
        accept={accept}
        onSubmit={handleSubmit}
      />
      <InputFile
        disabled={disabled || loading}
        color={color}
        onSubmit={handleSubmit}
      />
    </Paper>
  )
}
