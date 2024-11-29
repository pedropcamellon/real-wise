'use client'

import { type FC } from 'react'
import { Box, Button, FormControl, InputLabel, OutlinedInput } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

interface PropertySearchProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  isLoading?: boolean
}

export const PropertySearch: FC<PropertySearchProps> = ({ 
  value, 
  onChange, 
  onSearch,
  isLoading = false
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <FormControl fullWidth>
        <InputLabel>Search Properties</InputLabel>
        <OutlinedInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          label="Search Properties"
          placeholder="Search by title, location, or property type..."
        />
      </FormControl>
      <Button
        variant="contained"
        onClick={onSearch}
        disabled={isLoading}
        sx={{ minWidth: '120px' }}
      >
        {isLoading ? 'Searching...' : (
          <>
            <SearchIcon sx={{ mr: 1 }} />
            Search
          </>
        )}
      </Button>
    </Box>
  )
}