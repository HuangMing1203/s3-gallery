import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

export default function ErrorMessageSnackbar({ message, open, onClose }) {
  return (
    <Snackbar open={open} onClose={onClose} autoHideDuration={6000}>
      <Alert severity="error" onClose={onClose} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
