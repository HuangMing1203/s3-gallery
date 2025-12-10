import { createContext, useContext, useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const ConfirmationContext = createContext(() =>
  Promise.reject('no confirmation context provided'),
)

const ConfirmationDialog = ({ open, onConfirm, onCancel }) => (
  <Dialog
    open={open}
    onClose={onCancel}
    aria-labelledby="confirmation-dialog-title"
    aria-describedby="confirmation-dialog-description"
  >
    <DialogTitle id="confirmation-dialog-title">
      Do you want to discard the content?
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="confirmation-dialog-description">
        Your changes will be lost if you close the dialog.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onConfirm} autoFocus>
        Discard
      </Button>
      <Button onClick={onCancel}>Cancel</Button>
    </DialogActions>
  </Dialog>
)

export function ConfirmationProvider({ children }) {
  const initialState = {
    open: false,
    onConfirm() {},
    onCancel() {},
  }
  const [state, setState] = useState(initialState)

  const confirm = (rejectOnCancel = false) =>
    new Promise((resolve, reject) =>
      setState({
        open: true,
        onConfirm() {
          setState(initialState)
          if (rejectOnCancel) resolve()
          else resolve(true)
        },
        onCancel() {
          setState(initialState)
          if (rejectOnCancel) reject()
          else resolve(false)
        },
      }),
    )

  return (
    <ConfirmationContext value={confirm}>
      {children}
      <ConfirmationDialog {...state} />
    </ConfirmationContext>
  )
}

export const useConfirmation = () => useContext(ConfirmationContext)

export default ConfirmationProvider
