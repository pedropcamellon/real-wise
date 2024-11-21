'use client'

import { Box, Grid, Typography } from '@mui/material'
import {
  Bed as BedIcon,
  Bathtub as BathtubIcon,
  SquareFoot as SquareFootIcon,
} from '@mui/icons-material'

interface PropertySpecsProps {
  bedrooms: number
  bathrooms: number
  size: number
}

export const PropertySpecs = ({ bedrooms, bathrooms, size }: PropertySpecsProps) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Property Specifications
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Box display="flex" alignItems="center" gap={1}>
            <BedIcon color="action" />
            <Box>
              <Typography variant="h6">{bedrooms}</Typography>
              <Typography variant="body2" color="text.secondary">
                Bedrooms
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box display="flex" alignItems="center" gap={1}>
            <BathtubIcon color="action" />
            <Box>
              <Typography variant="h6">{bathrooms}</Typography>
              <Typography variant="body2" color="text.secondary">
                Bathrooms
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box display="flex" alignItems="center" gap={1}>
            <SquareFootIcon color="action" />
            <Box>
              <Typography variant="h6">{size}</Typography>
              <Typography variant="body2" color="text.secondary">
                Square Feet
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
