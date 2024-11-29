'use client'

import { FC, useMemo } from 'react'
import {
  Box,
  Typography,
  TextField,
  Stack,
  FormHelperText
} from '@mui/material'
import { MinValueMaxValue } from '@/types/MinValueMaxValue'

interface RangeFilterProps {
  label: string
  value: MinValueMaxValue<number>
  onChange: (value: MinValueMaxValue<number>) => void
  minPlaceholder?: string
  maxPlaceholder?: string
  step?: number
}

export const RangeFilter: FC<RangeFilterProps> = ({
  label,
  value,
  onChange,
  minPlaceholder = 'Min',
  maxPlaceholder = 'Max',
  step = 1
}) => {
  const error = useMemo(() => {
    if (value.min !== undefined && value.max !== undefined) {
      if (value.min > value.max) {
        return 'Minimum value cannot be greater than maximum'
      }
    }
    return undefined
  }, [value.min, value.max])

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Stack direction="row" spacing={2}>
        <TextField
          size="small"
          placeholder={minPlaceholder}
          type="number"
          value={value.min || ''}
          onChange={(e) => {
            const min = e.target.value ? Number(e.target.value) : undefined
            onChange({ ...value, min })
          }}
          InputProps={{
            inputProps: { min: 0, step }
          }}
          error={!!error}
          fullWidth
        />
        <TextField
          size="small"
          placeholder={maxPlaceholder}
          type="number"
          value={value.max || ''}
          onChange={(e) => {
            const max = e.target.value ? Number(e.target.value) : undefined
            onChange({ ...value, max })
          }}
          InputProps={{
            inputProps: { min: 0, step }
          }}
          error={!!error}
          fullWidth
        />
      </Stack>
      {error && (
        <FormHelperText error>{error}</FormHelperText>
      )}
    </Box>
  )
}
