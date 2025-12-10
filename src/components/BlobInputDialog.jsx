import { forwardRef, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useConfirmation } from './ConfirmationProvider'

import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import Slide from '@mui/material/Slide'
import TextField from '@mui/material/TextField'
import ToolBar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

const SlideUp = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
))

/**
 * Blob input dialog component.
 *
 * @param {string | false} maxWidth - Maximum width of the dialog, or false for no maximum.
 * @param {string} title - Title of the dialog.
 * @param {string} placeholder - Placeholder text for the input field.
 * @param {boolean} open - Whether the dialog is open.
 * @param {(blob: Blob) => void} onSubmit - Called when user submits with the created Blob.
 * @param {() => void} onClose - Called when the user closes the dialog.
 * @param {string} type - MIME type of the created Blob.
 * @param {string} endings - Endings option for the created Blob.
 */
export default function BlobInputDialog(props) {
  const {
    maxWidth = 'md',
    title = 'Blob Content',
    placeholder = '',
    open = false,
    onSubmit = () => {},
    onClose = () => {},
    type = 'text/plain',
    endings = 'transparent',
  } = props || {}

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down(maxWidth))
  const Transition = fullScreen ? SlideUp : Fade
  const slots = { transition: Transition }

  const [value, setValue] = useState('')

  const confirm = useConfirmation()

  function handleSubmit() {
    const blob = new Blob([value], { type, endings })
    setValue('')
    onSubmit(blob)
  }

  async function handleClose() {
    if (value) {
      if (!(await confirm())) return
      setValue('')
    }
    onClose()
  }

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={maxWidth}
      fullScreen={fullScreen}
      slots={slots}
      onClose={handleClose}
      aria-labelledby="blob-dialog-title"
    >
      {fullScreen && (
        <AppBar position="relative">
          <ToolBar sx={{ gap: 2 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography
              id="blob-dialog-title"
              htmlFor="blob-dialog-input"
              component="label"
              variant="h6"
              sx={{ flexGrow: 1, userSelect: 'none' }}
            >
              {title}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleSubmit}
              aria-label="submit"
            >
              <DoneIcon />
            </IconButton>
          </ToolBar>
        </AppBar>
      )}
      {!fullScreen && (
        <DialogTitle
          id="blob-dialog-title"
          component="label"
          htmlFor="blob-dialog-input"
        >
          {title}
        </DialogTitle>
      )}
      <DialogContent>
        <TextField
          id="blob-dialog-input"
          multiline
          minRows={8}
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          placeholder={placeholder}
          // variant="filled"
        />
      </DialogContent>
      {!fullScreen && (
        <DialogActions>
          <Button
            onClick={handleSubmit}
            // variant="contained"
            // startIcon={<DoneIcon />}
          >
            Submit
          </Button>
          <Button
            onClick={handleClose}
            // startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}
