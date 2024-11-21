import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Grid,
  TextField,
  MenuItem,
  Box,
  Button,
  Alert,
  CircularProgress,
  Typography
} from '@mui/material'
import { useProperties } from '../../hooks/useProperties'
import type { Property } from '../../types'

interface EditPropertyFormProps {
  propertyId: number
  onNotFound?: () => void
}

export const EditPropertyForm = ({ propertyId, onNotFound }: EditPropertyFormProps) => {
  const router = useRouter()
  const { getProperty, updateProperty, isLoading, error } = useProperties()

  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [property, setProperty] = useState<Property | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'residential',
    price: 0,
    size: 0,
    address: '',
    city: '',
    state: '',
    zip_code: '',
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
    image_url: '',
    latitude: 0,
    longitude: 0
  })

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getProperty(propertyId)
        if (data) {
          setProperty(data)
          setFormData({
            title: data.title,
            description: data.description,
            property_type: data.property_type,
            price: data.price,
            size: data.size,
            address: data.address,
            city: data.city,
            state: data.state,
            zip_code: data.zip_code,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            amenities: data.amenities,
            image_url: data.image_url || '',
            latitude: data.latitude,
            longitude: data.longitude
          })
        } else {
          setNotFound(true)
          if (onNotFound) {
            setTimeout(onNotFound, 3000) // Redirect after 3 seconds
          }
        }
      } catch (err) {
        setShowError(true)
      }
    }

    fetchProperty()
  }, [propertyId, getProperty, onNotFound])

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
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }))
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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

    try {
      const result = await updateProperty(propertyId, {
        ...formData,
        price: Number(formData.price),
        size: Number(formData.size)
      })

      if (result) {
        setShowSuccess(true)
        setTimeout(() => {
          router.push('/properties')
        }, 1500)
      }
    } catch (err) {
      setShowError(true)
    }
  }

  if (notFound) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        p={4}
        gap={2}
      >
        <Typography variant="h5" color="error">
          Property Not Found
        </Typography>
        <Typography color="text.secondary">
          The property you are trying to edit does not exist or has been removed.
        </Typography>
        <Typography color="text.secondary">
          Redirecting to properties list...
        </Typography>
      </Box>
    )
  }

  if (!property && isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (!property && !isLoading && !notFound) {
    return (
      <Alert severity="error">
        Failed to load property. Please try again later.
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Property has been successfully updated!
        </Alert>
      )}

      {showError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Failed to update property. Please try again.'}
        </Alert>
      )}

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
            name="property_type"
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
              variant="outlined"
              onClick={() => router.push('/properties')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Property'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}
