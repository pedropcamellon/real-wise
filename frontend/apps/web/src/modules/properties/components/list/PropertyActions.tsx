'use client'

// Types
import type { Property } from '@/modules/properties/types/'

import { FC, useState } from 'react'
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  Tooltip
} from '@mui/material'
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface PropertyActionsProps {
  property: Property
}

export const PropertyActions: FC<PropertyActionsProps> = ({ property }) => {
  const { isAgent } = useAuth()
  const router = useRouter()

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
    router.push(`/properties/${property.id}/edit`)
  }

  const handleView = () => {
    router.push(`/properties/${property.id}`)
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
