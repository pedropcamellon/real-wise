'use client'

import { Alert, AlertColor, Snackbar, Slide } from '@mui/material'
import { SyntheticEvent } from 'react'

interface ToastProps {
  open: boolean
  message: string
  severity?: AlertColor
  onClose: () => void
}

export const Toast = ({ open, message, severity = 'success', onClose }: ToastProps) => {
  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return
    onClose()
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={Slide}
    >
      <Alert 
        onClose={handleClose} 
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
