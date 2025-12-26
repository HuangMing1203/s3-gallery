import { createContext, lazy, Suspense, useContext, useState } from 'react'

const ErrorMessageSnackbar = lazy(() => import('./ErrorMessageSnackbar'))

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
      <Suspense>
        <ErrorMessageSnackbar
          open={open}
          onClose={handleClose}
          message={errorMessage}
        />
      </Suspense>
    </ErrorMessageContext>
  )
}

export const useErrorMessage = () => useContext(ErrorMessageContext)

export default ErrorMessageProvider
