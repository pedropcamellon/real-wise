import { PropertyAPIPayloadCreate } from "./PropertyAPIPayloadCreate"
import { PaginatedResponse } from "@/types/PaginatedResponse"
import { Property } from "./Property"
import { PropertyApiResponse } from "./PropertyApiResponse"

export interface PropertiesApi {
  getProperties(page?: number, limit?: number): Promise<PaginatedResponse<Property>>
  getProperty(id: number): Promise<PropertyApiResponse>
  createProperty(property: PropertyAPIPayloadCreate): Promise<PropertyApiResponse>
  updateProperty(id: number, property: Partial<PropertyAPIPayloadCreate>): Promise<PropertyApiResponse>
  deleteProperty(id: number): Promise<void>
}
