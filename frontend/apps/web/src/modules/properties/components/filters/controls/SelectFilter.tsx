'use client'

import { FC } from 'react'
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material'

interface SelectOption {
  value: string
  label: string
}

interface SelectFilterProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
}

export const SelectFilter: FC<SelectFilterProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...'
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value)
  }

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <FormControl fullWidth size="small">
        <Select
          value={value}
          onChange={handleChange}
          displayEmpty
        >
          <MenuItem value="">
            <Typography color="text.secondary">{placeholder}</Typography>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
