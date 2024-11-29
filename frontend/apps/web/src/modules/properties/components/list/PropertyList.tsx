'use client'

// Types
import type { Property, PropertyFilterState } from '@/modules/properties/types/'

import { type FC, type KeyboardEvent, useState, useMemo, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { PropertyCard } from './PropertyCard'
import {
  Typography,
  Grid,
  Button,
  Box,
  IconButton,
  Skeleton,
  Container
} from '@mui/material'
import {
  Add as AddIcon,
  ArrowBack,
  ErrorOutline as ErrorOutlineIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useProperties } from '@/modules/properties/hooks/useProperties'
import { PropertySearch } from '../PropertySearch'
import { PropertyFilterToggle } from '../filters/PropertyFilterToggle'
import { PropertyFilterPanel } from '../filters/PropertyFilterPanel'

interface PropertyListProps {
  showFullFeatures?: boolean
  filter?: 'all' | 'hot'
}

export const PropertyList: FC<PropertyListProps> = () => {
  const { isAgent } = useAuth()

  const router = useRouter()

  const [showError, setShowError] = useState(false)

  // Properties
  const { getAllProperties, isLoading: isLoadingProperties, error } = useProperties()
  const [properties, setProperties] = useState<Property[]>([])

  // Search state
  const [searchTerm, setSearchTerm] = useState('')
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterState, setFilterState] = useState<PropertyFilterState>({
    page: 1,
    pageSize: 10
  })
  const [appliedFilters, setAppliedFilters] = useState<PropertyFilterState>({
    page: 1,
    pageSize: 10
  })
  const [isApplyingFilters, setIsApplyingFilters] = useState(false)

  // Utility functions
  const buildQueryString = useCallback((filters: PropertyFilterState): string => {
    const params = new URLSearchParams()

    if (appliedSearchTerm) params.append('search', appliedSearchTerm.trim())
    if (filters.propertyType) params.append('property_type', filters.propertyType)
    if (filters.propertyStatus) params.append('property_status', filters.propertyStatus)
    if (filters.priceRange?.min) params.append('min_price', filters.priceRange.min.toString())
    if (filters.priceRange?.max) params.append('max_price', filters.priceRange.max.toString())
    if (filters.sizeRange?.min) params.append('min_size', filters.sizeRange.min.toString())
    if (filters.sizeRange?.max) params.append('max_size', filters.sizeRange.max.toString())
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString())
    if (filters.bathrooms) params.append('bathrooms', filters.bathrooms.toString())

    return params.toString()
  }, [appliedSearchTerm])

  const fetchProperties = useCallback(async () => {
    try {
      setShowError(false)
      const queryString = buildQueryString(appliedFilters)
      const { page, pageSize } = appliedFilters
      const results = await getAllProperties(page, pageSize, queryString)
      setProperties(results)
    } catch (err) {
      console.error('[PropertyList] Error fetching properties:', err)
      setShowError(true)
    }
  }, [getAllProperties, appliedFilters, buildQueryString])

  const handleSearchSubmit = useCallback(async () => {
    try {
      setIsSearching(true)
      setAppliedSearchTerm(searchTerm)
      await fetchProperties()
    } finally {
      setIsSearching(false)
    }
  }, [fetchProperties, searchTerm])

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
  }, [])

  const handleSearchKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchSubmit()
    }
  }, [handleSearchSubmit])

  const handleFilterChange = useCallback((newFilters: Partial<PropertyFilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilters }))
  }, [])

  const handleApplyFilters = useCallback(async () => {
    setIsApplyingFilters(true)
    try {
      setAppliedFilters(filterState)
      await fetchProperties()
    } finally {
      setIsApplyingFilters(false)
      setIsFilterOpen(false)
    }
  }, [filterState, fetchProperties])

  const handleClearFilters = useCallback(async () => {
    setIsApplyingFilters(true)
    try {
      const initialState = {
        page: 1,
        pageSize: 10
      }
      setFilterState(initialState)
      setAppliedFilters(initialState)
      setSearchTerm('')
      setAppliedSearchTerm('')
      await fetchProperties()
    } finally {
      setIsApplyingFilters(false)
    }
  }, [fetchProperties])

  // Initial fetch and filter changes trigger fetch
  useEffect(() => {
    fetchProperties()
  }, [fetchProperties, appliedFilters])

  // Memoized values
  const filteredProperties = useMemo(() => {
    return properties
  }, [properties])

  // Error handling
  if (showError) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography color="error" align="center">
            {error || 'Failed to load properties. Please try again later.'}
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <>
      {/* Error Alert */}
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

      {/* Header Section */}
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

        {/* Search */}
        <Box sx={{ mb: 1 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <PropertySearch
                isLoading={isSearching}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onSearch={handleSearchSubmit}
                value={searchTerm}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Filter Toggle */}
        <Box sx={{ mb: 2 }}>
          <Grid item>
            <PropertyFilterToggle
              onToggle={() => setIsFilterOpen(true)}
              isOpen={Object.keys(appliedFilters).length > 2}
            />
          </Grid>
        </Box>
      </Box>

      {/* Filter Panel */}
      {isFilterOpen && (
        <Box>
          <PropertyFilterPanel
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onFilterChange={handleFilterChange}
            currentFilters={filterState}
            onClearFilters={handleClearFilters}
            onApplyFilters={handleApplyFilters}
            isLoading={isApplyingFilters}
          />
        </Box>
      )}

      {/* Content Section */}
      {isLoadingProperties ? (
        // Loading State
        <Grid container spacing={3}>
          {[1, 2, 3].map((key) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Skeleton variant="rectangular" height={300} />
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        // Error State
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
        // Properties Grid
        <Grid container spacing={3}>
          {filteredProperties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <PropertyCard property={property} />
            </Grid>
          ))}
        </Grid>
      ) : (
        // Empty State
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">
            No properties found matching your criteria.
          </Typography>
        </Box>
      )}
    </>
  )
}
