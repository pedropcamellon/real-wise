'use client'

// Types
import type { PropertyType, PropertyStatus, Property } from '@/modules/properties/types/'

import { FC, useState, useMemo, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { PropertyCard } from './PropertyCard'
import {
  Typography,
  Grid,
  Button,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Skeleton,
  OutlinedInput
} from '@mui/material'
import {
  Add as AddIcon,
  ArrowBack,
  ErrorOutline as ErrorOutlineIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useProperties } from '@/modules/properties/hooks/useProperties'

interface PropertyListProps {
  showFullFeatures?: boolean
  filter?: 'all' | 'hot'
}

export const PropertyList: FC<PropertyListProps> = ({
  showFullFeatures = false,
  filter = 'all'
}) => {
  const { isAgent } = useAuth()

  const router = useRouter()

  const { getAllProperties, isLoading, error } = useProperties()

  const [properties, setProperties] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'all'>('all')
  const [showError, setShowError] = useState(false)

  // Add debounce effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [searchTerm])

  const fetchProperties = useCallback(async () => {
    try {
      const data = await getAllProperties()
      setProperties(data)
    } catch (err) {
      setShowError(true)
    }
  }, [getAllProperties])

  useEffect(() => {
    fetchProperties()
  }, [])

  const filteredProperties = useMemo(() => {
    let filtered = properties

    if (filter === 'hot') {
      // For homepage, show only top 3 hot properties
      return filtered
        .filter(p => p.status === 'on_market')
        .slice(0, 3)
    }

    if (!showFullFeatures) {
      return filtered
    }

    return filtered.filter((property) => {
      const matchesSearch = !debouncedSearchTerm ||
        property.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(debouncedSearchTerm.toLowerCase())

      const matchesType = typeFilter === 'all' || property.property_type === typeFilter

      const matchesStatus = statusFilter === 'all' || property.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [debouncedSearchTerm, typeFilter, statusFilter, showFullFeatures, filter, properties])

  return (
    <>
      {showError && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            mt: 4,
            p: 3,
            bgcolor: 'error.lighter',
            borderRadius: 2,
            border: 1,
            borderColor: 'error.light'
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 48, color: 'error.main' }} />
          <Typography
            variant="h6"
            color="error.main"
            align="center"
            sx={{ maxWidth: 'sm' }}
          >
            {error || 'Unable to load properties'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setShowError(false)
              fetchProperties()
            }}
            startIcon={<RefreshIcon />}
            sx={{ mt: 1 }}
          >
            Try Again
          </Button>
        </Box>
      )}

      {showFullFeatures ? (
        // Full header for properties page
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                onClick={() => router.push('/')}
                aria-label="back to previous page"
                sx={{ color: 'text.primary' }}
              >
                <ArrowBack />
              </IconButton>

              <Typography variant="h4" component="h1" fontWeight="bold">
                Properties
              </Typography>
            </Box>

            {isAgent && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/properties/add')}
              >
                Add Property
              </Button>
            )}
          </Box>

          {/* Search and Filters */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <FormControl fullWidth>
                <InputLabel>Search Properties</InputLabel>
                <OutlinedInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  label="Search Properties"
                  placeholder="Search by title or address..."
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Type"
                  onChange={(e) => setTypeFilter(e.target.value as PropertyType | 'all')}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="residential">Residential</MenuItem>
                  <MenuItem value="commercial">Commercial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      ) : (
        // Simple header for homepage
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Hot Properties This Week
          </Typography>
        </Box>
      )}

      {/* Property Grid */}
      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((key) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Skeleton variant="rectangular" height={300} />
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 48, color: 'error.main' }} />
          <Typography variant="h6" color="error">
            {error.includes('ECONNREFUSED')
              ? 'Unable to connect to the server. Please try again later.'
              : error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setShowError(false)
              fetchProperties()
            }}
            startIcon={<RefreshIcon />}
          >
            Retry
          </Button>
        </Box>
      ) : filteredProperties.length > 0 ? (
        <Grid container spacing={3}>
          {filteredProperties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <PropertyCard property={property} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">
            No properties found matching your criteria.
          </Typography>
        </Box>
      )}
    </>
  )
}
