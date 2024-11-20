'use client'

// Types
import type { PropertyAPIPayloadCreate } from '@/modules/properties/types/'

import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  CircularProgress
} from '@mui/material'
import { Toast } from '@/components/common/Toast'
import { useProperties } from '@/modules/properties/hooks/useProperties'
import { useState } from 'react'

interface AddPropertyFormProps {
  formData: PropertyAPIPayloadCreate
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  onCancel: () => void
  showSuccess: boolean
  showError: boolean
}

export const AddPropertyForm = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  showSuccess,
  showError
}: AddPropertyFormProps) => {
  const { isLoading, error } = useProperties()

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'price':
        return value < 0 ? 'Price must be a positive number' : ''
      case 'size':
        return value < 0 ? 'Size must be a positive number' : ''
      case 'zip_code':
        return !/^\d{5}(-\d{4})?$/.test(value) ? 'Invalid ZIP code format' : ''
      default:
        return ''
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setValidationErrors((prev: Record<string, string>) => ({
      ...prev,
      [name]: error
    }))
    onChange(e)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate all fields
    const errors: Record<string, string> = {}

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value)
      if (error) errors[key] = error
    })

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    onSubmit(e)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Title */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />
          </Grid>

          {/* Property Type */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Property Type"
              name="type"
              value={formData.property_type}
              onChange={handleChange}
              required
            >
              <MenuItem value="residential">Residential</MenuItem>
              <MenuItem value="commercial">Commercial</MenuItem>
            </TextField>
          </Grid>

          {/* Price */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: '$'
              }}
              error={!!validationErrors.price}
              helperText={validationErrors.price}
            />
          </Grid>

          {/* Size */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Size (sq ft)"
              name="size"
              type="number"
              value={formData.size}
              onChange={handleChange}
              required
              error={!!validationErrors.size}
              helperText={validationErrors.size}
            />
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* City */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* State */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* ZIP Code */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="ZIP Code"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              required
              error={!!validationErrors.zip_code}
              helperText={validationErrors.zip_code}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? 'Creating...' : 'Create Property'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      <Toast
        open={showSuccess}
        message="Property created successfully!"
        severity="success"
        onClose={() => { }}
      />

      <Toast
        open={showError}
        message={error || 'Failed to create property'}
        severity="error"
        onClose={() => { }}
      />
    </>
  )
}
