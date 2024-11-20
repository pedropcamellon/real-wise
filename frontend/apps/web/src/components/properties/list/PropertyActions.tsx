'use client'

import { FC } from 'react'
import { useAuth } from '@/hooks/useAuth'
import type { Property } from '@/modules/properties/types/'
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material'
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import { useState } from 'react'

interface PropertyActionsProps {
  property: Property
}

export const PropertyActions: FC<PropertyActionsProps> = ({ property }) => {
  const { isAgent } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    handleClose()
    // Will implement edit functionality
  }

  const handleView = () => {
    // Will implement view details
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <Button
        variant="outlined"
        size="small"
        startIcon={<VisibilityIcon />}
        onClick={handleView}
      >
        View Details
      </Button>

      {isAgent && (
        <>
          <Tooltip title="Property Actions">
            <IconButton
              size="small"
              onClick={handleClick}
              aria-controls={open ? 'property-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="property-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Property</ListItemText>
            </MenuItem>
          </Menu>
        </>
      )}
    </div>
  )
}
