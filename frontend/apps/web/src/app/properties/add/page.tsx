'use client'

// Types
import type { PropertyAPIPayloadCreate } from '@/modules/properties/types/'

import {
  Container,
  Box,
  IconButton,
  Typography,
  Paper
} from '@mui/material'
import { AddPropertyForm } from '@/modules/properties/components/form/AddPropertyForm'
import { ArrowBack } from '@mui/icons-material'
import { useProperties } from '@/modules/properties/hooks/useProperties'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AddPropertyPage() {
  const router = useRouter()

  const { createProperty } = useProperties()

  const [showSuccess, setShowSuccess] = useState(false)

  const [showError, setShowError] = useState(false)

  const [formData, setFormData] = useState<PropertyAPIPayloadCreate>({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCreate = async () => {
    const payload = {
      ...formData,
      price: Number(formData.price),
      size: Number(formData.size)
    }

    try {
      const result = await createProperty(payload)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await handleCreate()
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Box display="flex" alignItems="center" gap={1} mb={4}>
        <IconButton
          onClick={() => router.push('/properties')}
          aria-label="back to previous page"
          sx={{ color: 'text.primary' }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          Add New Property
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <AddPropertyForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/properties')}
          showSuccess={showSuccess}
          showError={showError}
        />
      </Paper>
    </Container>
  )
}
