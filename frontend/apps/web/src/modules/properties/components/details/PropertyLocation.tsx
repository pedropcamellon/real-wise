'use client'

import { Box, Typography, Paper } from '@mui/material'
import { LocationOn as LocationIcon } from '@mui/icons-material'

interface PropertyLocationProps {
  address: string
  city: string
  state: string
  zipCode: string
  latitude: number
  longitude: number
}

export const PropertyLocation = ({
  address,
  city,
  state,
  zipCode,
  latitude,
  longitude,
}: PropertyLocationProps) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Location
      </Typography>
      <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
        <LocationIcon color="action" />
        <Typography>
          {address}
          <br />
          {city}, {state} {zipCode}
        </Typography>
      </Box>
      <Paper 
        sx={{ 
          width: '100%', 
          height: '300px', 
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography color="text.secondary">
          Map view will be implemented soon
        </Typography>
      </Paper>
    </Box>
  )
}
