'use client'

import { EditPropertyForm } from '@/modules/properties/components/form/EditPropertyForm'
import { Container, Box, IconButton, Typography, Paper } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

export default function EditPropertyPage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter()

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
          Edit Property
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <EditPropertyForm propertyId={parseInt(params.id, 10)} onNotFound={() => router.push('/properties')} />
      </Paper>
    </Container>
  )
}
