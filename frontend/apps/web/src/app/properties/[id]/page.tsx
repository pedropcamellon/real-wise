'use client'

import { ArrowBack } from '@mui/icons-material'
import { Container, Box, IconButton, Typography, Paper } from '@mui/material'
import { PropertyDetails } from '@/modules/properties/components/details/PropertyDetails'
import { use } from 'react'
import { useRouter } from 'next/navigation'

type PageParams = {
  params: Promise<{ id: number }>
}

export default function PropertyPage({
  params
}: PageParams) {
  const router = useRouter()
  const resolvedParams = use(params)

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box display="flex" alignItems="center" gap={1} mb={4}>
        <IconButton
          onClick={() => router.push('/properties')}
          aria-label="back to properties"
          sx={{ color: 'text.primary' }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          Property Details
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <PropertyDetails propertyId={resolvedParams.id} />
      </Paper>
    </Container>
  )
}
