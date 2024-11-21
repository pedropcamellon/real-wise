'use client'

// Types
import type { Property } from '@/modules/properties/types/'

import { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  CardMedia,
} from '@mui/material'
import { useProperties } from '../../hooks/useProperties'
import { PropertyGallery } from './PropertyGallery'
import { PropertySpecs } from './PropertySpecs'
import { PropertyLocation } from './PropertyLocation'
import { PropertyAmenities } from './PropertyAmenities'
import { PropertyContactForm } from './PropertyContactForm'

interface PropertyDetailsProps {
  propertyId: number
}

export const PropertyDetails = ({ propertyId }: PropertyDetailsProps) => {
  const { getProperty, isLoading, error } = useProperties()

  const [property, setProperty] = useState<Property | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getProperty(propertyId)
        if (data) {
          setProperty(data)
        } else {
          setNotFound(true)
        }
      } catch (err) {
        console.error('Error fetching property:', err)
      }
    }

    fetchProperty()
  }, [propertyId, getProperty])

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
          The property you are looking for does not exist or has been removed.
        </Typography>
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load property details. Please try again later.
      </Alert>
    )
  }

  if (!property) {
    return null
  }

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box mb={2}>
            <Typography variant="h4" component="h1" gutterBottom>
              {property.title}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              {property.price ? property.price : 'Price on request'}
            </Typography>
            <Chip
              label={property.property_type}
              color="secondary"
              size="small"
              sx={{ mr: 1 }}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <CardMedia
            component="img"
            height="200"
            image={property.image_url || 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18c42998876%20text%20%7B%20fill%3Argba(128%2C128%2C128%2C.8)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18c42998876%22%3E%3Crect%20width%3D%22288%22%20height%3D%22200%22%20fill%3D%22%23f5f5f5%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22106.390625%22%20y%3D%22105.9%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'}
            alt={property.title}
            className="object-cover h-[200px]"
            sx={{
              backgroundColor: 'grey.100',
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography>{property.description}</Typography>
          </Box>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Grid item xs={12}>
          <PropertySpecs
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            size={property.size}
          />
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Grid item xs={12}>

          <PropertyLocation
            address={property.address}
            city={property.city}
            state={property.state}
            zipCode={property.zip_code}
            latitude={property.latitude}
            longitude={property.longitude}
          />
        </Grid>

        <Divider sx={{ my: 4 }} />

        <PropertyAmenities amenities={property.amenities} />
      </Grid>

      <Grid item xs={12} md={4}>
        <PropertyContactForm property={property} />
      </Grid>
    </Box >
  )
}
