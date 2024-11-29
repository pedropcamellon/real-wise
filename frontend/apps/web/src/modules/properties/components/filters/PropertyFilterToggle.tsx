'use client'

import { FC } from 'react'
import { Button } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'

interface PropertyFilterToggleProps {
  onToggle: () => void
  isOpen: boolean
}

export const PropertyFilterToggle: FC<PropertyFilterToggleProps> = ({
  onToggle,
  isOpen
}) => {
  return (
    <Button
      onClick={onToggle}
      startIcon={<FilterListIcon />}
      variant="outlined"
      color={isOpen ? "primary" : "inherit"}
      size="small"
    >
      Filters
    </Button>
  )
}
