'use client'

import { Card, CardContent, Typography, CardMedia } from '@mui/material'
import { Property } from '@/modules/properties/types/'
import { PropertyActions } from './PropertyActions'
import { formatPrice } from '@/utils/format'

interface PropertyCardProps {
  property: Property
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Card className="relative h-full flex flex-col">
      <CardMedia
        component="img"
        height="200"
        image={property.image_url || 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18c42998876%20text%20%7B%20fill%3Argba(128%2C128%2C128%2C.8)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18c42998876%22%3E%3Crect%20width%3D%22288%22%20height%3D%22200%22%20fill%3D%22%23f5f5f5%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22106.390625%22%20y%3D%22105.9%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'}
        alt={property.title}
        className="object-cover h-[200px]"
        sx={{
          backgroundColor: 'grey.100',
        }}
      />
      <CardContent className="flex-grow flex flex-col">
        <Typography variant="h6" component="div" className="mb-2">
          {property.title}
        </Typography>

        <Typography variant="body2" className="text-gray-600 mb-4">
          {property.description}
        </Typography>

        <Typography variant="h6" className="text-primary mt-auto mb-4">
          {property.price ? formatPrice(property.price) : 'Price on request'}
        </Typography>

        <PropertyActions property={property} />
      </CardContent>
    </Card>
  )
}
