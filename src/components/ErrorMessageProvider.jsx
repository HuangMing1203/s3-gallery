import { createContext, useContext, useState } from 'react'

import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

const ErrorMessageContext = createContext((message) => {
  throw new Error('no error message context provided')
})

export function ErrorMessageProvider({ children }) {
  const [errorMessage, setErrorMessage] = useState('')
  const [open, setOpen] = useState(false)

  function showErrorMessage(message) {
    setErrorMessage(message)
    setOpen(!!message)
  }

  function handleClose(e, reason) {
    if (reason === 'clickaway') return
    setOpen(false)
  }

  return (
    <ErrorMessageContext value={showErrorMessage}>
      {children}
      <Snackbar open={open} onClose={handleClose} autoHideDuration={6000}>
        <Alert severity="error" onClose={handleClose} sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </ErrorMessageContext>
  )
}

export const useErrorMessage = () => useContext(ErrorMessageContext)

export default ErrorMessageProvider
