import { PropertyType } from './PropertyType'
import { PropertyStatus } from './PropertyStatus'
import { MinValueMaxValue } from '@/types/minValueMaxValue';

export interface PropertyFilterState {
  page: number
  pageSize: number
  priceRange?: MinValueMaxValue<number>
  sizeRange?: MinValueMaxValue<number>
  propertyType?: PropertyType
  propertyStatus?: PropertyStatus
  bedrooms?: string
  bathrooms?: string
}
