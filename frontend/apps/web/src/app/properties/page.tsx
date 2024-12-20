'use client'

import { Container } from '@mui/material'
import { PropertyList } from '@/modules/properties/components/list/PropertyList'

export default function PropertiesPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <PropertyList showFullFeatures />
    </Container>
  )
}
