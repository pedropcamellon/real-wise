// Types
import type {
  PropertiesApi,
  Property,
  PropertyAPIPayloadCreate
} from '@/modules/properties/types/'

import type { PaginatedResponse, ApiResponse, ApiError } from '@real-wise/types/api/core'
import { getSession } from 'next-auth/react'

export class PropertiesApiClient implements PropertiesApi {
  private readonly baseUrl: string | undefined

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const session = await getSession()
    if (!session?.accessToken) {
      throw new Error('You must be logged in to perform this action')
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.accessToken}`,
    }
  }

  private async handleApiError(error: unknown): ApiError {
    console.error('[PropertiesApi] Error:', error)
    return {
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      status: error instanceof Error ? 500 : undefined
    }
  }

  async getProperties(
    page: number = 1,
    limit: number = 10,
    queryString?: string
  ): Promise<PaginatedResponse<Property>> {
    try {
      if (!this.baseUrl) {
        throw new Error('Base URL is not defined')
      }

      const headers = await this.getAuthHeaders()
      const baseUrl = `${this.baseUrl}/api/properties?page=${page}&limit=${limit}`
      const url = queryString ? `${baseUrl}&${queryString}` : baseUrl

      const response = await fetch(url, {
        method: 'GET',
        headers,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch properties')
      }

      return await response.json()
    } catch (error) {
      throw this.handleApiError(error)
    }
  }

  async getProperty(id: number): Promise<ApiResponse<Property>> {
    try {
      const headers = await this.getAuthHeaders()

      const response = await fetch(`${this.baseUrl}/api/properties/${id}`, {
        method: 'GET',
        headers,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch property')
      }

      return await response.json()
    } catch (error) {
      throw this.handleApiError(error)
    }
  }

  async createProperty(property: PropertyAPIPayloadCreate): Promise<ApiResponse<Property>> {
    try {
      if (!this.baseUrl) {
        throw new Error('API URL is not configured')
      }

      const headers = await this.getAuthHeaders()

      const response = await fetch(`${this.baseUrl}/api/properties/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(property),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)

        throw new Error(
          errorData?.message ||
          `Failed to create property. Status: ${response.status}`
        )
      }

      return await response.json()
    } catch (error) {
      throw this.handleApiError(error)
    }
  }

  async updateProperty(id: number, property: Partial<PropertyAPIPayloadCreate>): Promise<ApiResponse<Property>> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.baseUrl}/properties/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(property),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update property')
      }

      return await response.json()
    } catch (error) {
      throw this.handleApiError(error)
    }
  }

  async deleteProperty(id: number): Promise<void> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.baseUrl}/properties/${id}`, {
        method: 'DELETE',
        headers,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete property')
      }
    } catch (error) {
      throw this.handleApiError(error)
    }
  }
}

// Export a singleton instance
export const propertiesApi = new PropertiesApiClient()
