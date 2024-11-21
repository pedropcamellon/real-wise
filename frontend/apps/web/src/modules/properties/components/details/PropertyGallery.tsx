'use client'

import { Box } from '@mui/material'
import Image from 'next/image'

interface PropertyGalleryProps {
  imageUrl: string
}

export const PropertyGallery = ({ imageUrl }: PropertyGalleryProps) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '300px', md: '500px' },
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <Image
        src={imageUrl}
        alt="Property"
        fill
        style={{ objectFit: 'cover' }}
        priority
      />
    </Box>
  )
}
