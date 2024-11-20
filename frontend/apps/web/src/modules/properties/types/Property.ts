// Base property types for the properties module
import type { PropertyType } from './PropertyType'
import type { PropertyStatus } from './PropertyStatus'
import type { PropertyImage } from './PropertyImage'
import type { PropertyAmenity } from './PropertyAmenity'

export type Property = {
  id: number
  address: string
  amenities: PropertyAmenity[]
  bathrooms: number
  bedrooms: number
  city: string
  created_at: string
  description: string
  image_url?: string
  images: PropertyImage[]
  latitude: number
  longitude: number
  modified_at: string
  price: number
  property_type: PropertyType
  size: number
  state: string
  status: PropertyStatus
  title: string
  zip_code: string
}
