import { useRef, useState } from 'react'
import { useFormControl } from '@mui/material/FormControl'
import axios from 'axios'

import UploadFileIcon from '@mui/icons-material/UploadFile'
import ClearIcon from '@mui/icons-material/Clear'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import EditDocumentIcon from '@mui/icons-material/EditDocument'
import ErrorIcon from '@mui/icons-material/Error'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Tooltip from '@mui/material/Tooltip'
import BlobInputDialog from './BlobInputDialog'
import ConfirmationProvider from './ConfirmationProvider'

function FetchFile(props) {
  const { color = 'inherit', disabled = false } = useFormControl() || {}
  const {
    value = '',
    placeholder = '',
    loading = false,
    onChange = () => {},
    onClear = () => {},
    onLoadStart = () => {},
    onLoadEnd = () => {},
    onSubmit = () => {},
  } = (props = props || {})

  const inputRef = useRef(null)

  const [errorMessage, setErrorMessage] = useState(false)
  const error = errorMessage !== false

  function handleChange(e) {
    const newValue = e.target.value
    setErrorMessage(false)
    onChange(newValue)
  }

  async function handleSubmit() {
    if (disabled || loading) return
    setErrorMessage(false)
    try {
      onLoadStart()
      const res = await axios
        .get(value, { responseType: 'blob' })
        .finally(onLoadEnd)
      // const res = await fetch(value, {
      //   method: 'get',
      //   mode: 'no-cors',
      //   // headers: {
      //   //   // 'Access-Control-Allow-Origin': '*',
      //   //   // "X-Requested-With": "XMLHttpRequest",
      //   // },
      // }).finally(onLoadEnd)
      // if (!res.ok) {
      //   setErrorMessage(`Fetch failed: HTTP ${res.status} ${res.statusText}`)
      //   return
      // }
      onSubmit({
        source: 'fetch',
        url: value,
        blob: res.data,
        // blob: await res.blob(),
      })
    } catch (err) {
      setErrorMessage(`Fetch error: ${err.message}`)
    }
  }

  function handleSnackbarClose(e, reason) {
    if (reason === 'clickaway') return
    setErrorMessage('')
  }

  return (
    <>
      <InputBase
        inputRef={inputRef}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        color={error ? 'error' : color}
        placeholder={placeholder}
        fullWidth
        startAdornment={
          <InputAdornment position="start">
            {error && <ErrorIcon color="error" fontSize="medium" />}
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            {value && !disabled && (
              <IconButton onClick={onClear}>
                <ClearIcon />
              </IconButton>
            )}
          </InputAdornment>
        }
      />

      <Snackbar
        open={!!errorMessage}
        onClose={handleSnackbarClose}
        autoHideDuration={6000}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

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
  const { color = 'inherit', disabled = false } = useFormControl() || {}
  const { accept = '*/*', onSubmit = () => {} } = props || {}

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
  const { color = 'inherit', disabled = false } = useFormControl() || {}
  const { onSubmit = () => {} } = props || {}

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
    <FormControl
      component={Paper}
      disabled={disabled || loading}
      color={color}
      sx={{ p: 1, display: 'flex', flexFlow: 'row nowrap', gap: 1 }}
    >
      <FetchFile
        loading={loading}
        placeholder={placeholder}
        value={value}
        onChange={setValue}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onClear={() => setValue('')}
        onSubmit={handleSubmit}
      />
      <Divider orientation="vertical" variant="middle" flexItem />
      <UploadFile accept={accept} onSubmit={handleSubmit} />
      <InputFile onSubmit={handleSubmit} />
    </FormControl>
  )
}
