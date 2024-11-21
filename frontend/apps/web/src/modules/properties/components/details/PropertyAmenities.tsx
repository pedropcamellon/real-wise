'use client'

// Types
import type { PropertyAmenity } from '@/modules/properties/types/'

import { Box, Typography, Chip } from '@mui/material'

interface PropertyAmenitiesProps {
  amenities: PropertyAmenity[]
}

export const PropertyAmenities = ({ amenities }: PropertyAmenitiesProps) => {
  if (!amenities?.length) {
    return null
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Amenities
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {amenities.map((amenity) => (
          <Chip
            key={amenity.id}
            label={amenity.name}
            variant="outlined"
            size="small"
          />
        ))}
      </Box>
    </Box>
  )
}
