'use client'

import { FC, useMemo } from 'react'
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Button,
  Divider,
  Stack,
  ButtonGroup
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { PropertyFilterState } from '../../types'
import { RangeFilter } from './controls/RangeFilter'
import { SelectFilter } from './controls/SelectFilter'
import { PropertyType, PropertyStatus } from '../../types'

const propertyTypeOptions = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' }
]

const propertyStatusOptions = [
  { value: 'on_market', label: 'On Market' },
  { value: 'off_market', label: 'Off Market' },
]

const bedroomOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5+', label: '5+' }
]

const bathroomOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5+', label: '5+' }
]

interface PropertyFilterPanelProps {
  isOpen: boolean
  onClose: () => void
  onFilterChange: (filterState: Partial<PropertyFilterState>) => void
  currentFilters: PropertyFilterState
  onClearFilters: () => void
  onApplyFilters: () => void
  isLoading?: boolean
}

export const PropertyFilterPanel: FC<PropertyFilterPanelProps> = ({
  isOpen,
  onClose,
  onFilterChange,
  currentFilters,
  onClearFilters,
  onApplyFilters,
  isLoading = false
}) => {
  const handlePriceChange = (priceRange: PropertyFilterState['priceRange']) => {
    onFilterChange({ priceRange })
  }

  const handleSizeChange = (sizeRange: PropertyFilterState['sizeRange']) => {
    onFilterChange({ sizeRange })
  }

  const handleTypeChange = (propertyType: PropertyType | '') => {
    onFilterChange({ propertyType: propertyType || undefined })
  }

  const handleStatusChange = (propertyStatus: PropertyStatus | '') => {
    onFilterChange({ propertyStatus: propertyStatus || undefined })
  }

  const handleBedroomsChange = (bedrooms: string) => {
    onFilterChange({ bedrooms: bedrooms || undefined })
  }

  const handleBathroomsChange = (bathrooms: string) => {
    onFilterChange({ bathrooms: bathrooms || undefined })
  }

  const showResidentialFilters = currentFilters.propertyType === 'residential'

  const handleClearFilters = () => {
    onClearFilters()
    onClose()
  }

  const hasActiveFilters = useMemo(() => {
    return Object.values(currentFilters).some(value =>
      value !== undefined &&
      value !== '' &&
      (typeof value === 'object' ? Object.values(value || {}).some(v => v !== undefined) : true)
    )
  }, [currentFilters])

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Filter Content */}
        <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
          <Stack spacing={3}>
            <SelectFilter
              label="Property Type"
              value={currentFilters.propertyType || ''}
              onChange={handleTypeChange}
              options={propertyTypeOptions}
              placeholder="Any type"
            />

            <SelectFilter
              label="Status"
              value={currentFilters.propertyStatus || ''}
              onChange={handleStatusChange}
              options={propertyStatusOptions}
              placeholder="Any status"
            />

            <RangeFilter
              label="Price Range ($)"
              value={currentFilters.priceRange || { min: undefined, max: undefined }}
              onChange={handlePriceChange}
              minPlaceholder="Min Price"
              maxPlaceholder="Max Price"
              step={1000}
            />

            <RangeFilter
              label="Size (sq ft)"
              value={currentFilters.sizeRange || { min: undefined, max: undefined }}
              onChange={handleSizeChange}
              minPlaceholder="Min Size"
              maxPlaceholder="Max Size"
              step={100}
            />

            {showResidentialFilters && (
              <>
                <SelectFilter
                  label="Bedrooms"
                  value={currentFilters.bedrooms || ''}
                  onChange={handleBedroomsChange}
                  options={bedroomOptions}
                  placeholder="Any bedrooms"
                />

                <SelectFilter
                  label="Bathrooms"
                  value={currentFilters.bathrooms || ''}
                  onChange={handleBathroomsChange}
                  options={bathroomOptions}
                  placeholder="Any bathrooms"
                />
              </>
            )}
          </Stack>
        </Box>

        {/* Footer Actions */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Stack spacing={2}>
            {hasActiveFilters && (
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClearFilters}
                color="inherit"
                disabled={isLoading}
              >
                Clear All Filters
              </Button>
            )}
            <Button
              fullWidth
              variant="contained"
              onClick={onApplyFilters}
              disabled={isLoading}
            >
              {isLoading ? 'Applying Filters...' : 'Apply Filters'}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  )
}
