'use client'

import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
} from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import type { Property } from '../../types'

interface PropertyContactFormProps {
  property: Property
}

export const PropertyContactForm = ({ property }: PropertyContactFormProps) => {
  const { isAgent } = useAuth()
  const [message, setMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement contact form submission
    setShowSuccess(true)
    setMessage('')
  }

  if (isAgent) {
    return null
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Contact Agent
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="I'm interested in this property..."
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!message.trim()}
        >
          Send Message
        </Button>
      </form>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Message sent successfully!
        </Alert>
      </Snackbar>
    </Paper>
  )
}
