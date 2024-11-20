import { Property } from './Property'

export type PropertyAPIPayloadCreate = Pick<Property,
  | 'address'
  | 'amenities'
  | 'bathrooms'
  | 'bedrooms'
  | 'city'
  | 'description'
  | 'image_url'
  | 'latitude'
  | 'longitude'
  | 'price'
  | 'property_type'
  | 'size'
  | 'state'
  | 'title'
  | 'zip_code'
>