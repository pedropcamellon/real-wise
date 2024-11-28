// Types
import type { PropertyAPIPayloadCreate, Property } from '@/modules/properties/types/'

import { useState, useCallback } from 'react'
import { PropertiesApiClient } from '@/modules/properties/api/PropertiesApiClient'

const getUserFriendlyError = (error: unknown): string => {
  // Log technical details for developers
  console.error('[useProperties] Technical error details:', error)

  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    // Auth errors
    if (message.includes('must be logged in')) {
      return 'Please log in to perform this action.'
    }
    if (message.includes('do not have permission')) {
      return error.message
    }

    // Configuration errors
    if (message.includes('api_url') || message.includes('api url')) {
      return 'System configuration error. Please contact support.'
    }

    // HTTP Status Code errors
    if (message.startsWith('404')) {
      return 'No properties found.'
    }
    if (message.startsWith('401') || message.startsWith('403')) {
      return 'You do not have permission to perform this action. Please log in with an agent account.'
    }
    if (message.startsWith('500')) {
      return 'Server error. Please try again later.'
    }
    if (message.startsWith('503')) {
      return 'Service temporarily unavailable. Please try again later.'
    }

    // Network errors
    if (message.includes('failed to fetch') || message.includes('network')) {
      return 'Unable to connect to the server. Please check your internet connection.'
    }

    // Return the actual error message if it's user-friendly enough
    return error.message
  }

  // Default error message
  return 'Something went wrong. Please try again later.'
}

// Singleton
const propertiesApiClient = new PropertiesApiClient()

export const useProperties = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  const getAllProperties = useCallback(async (): Promise<Property[]> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await propertiesApiClient.getProperties()
      return response.results || []
    } catch (err) {
      const userMessage = getUserFriendlyError(err)
      setError(userMessage)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [propertiesApiClient])

  const getProperty = useCallback(async (id: number): Promise<Property | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await propertiesApiClient.getProperty(id)
      return response
    } catch (err) {
      const userMessage = getUserFriendlyError(err)
      setError(userMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [propertiesApiClient])

  const createProperty = useCallback(async (data: PropertyAPIPayloadCreate) => {
    setIsLoading(true)
    setError(null)

    try {
      return await propertiesApiClient.createProperty(data)
    } catch (err) {
      const userMessage = getUserFriendlyError(err)
      setError(userMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [propertiesApiClient])

  const updateProperty = useCallback(async (id: number, data: Partial<PropertyAPIPayloadCreate>) => {
    setIsLoading(true)
    setError(null)

    try {
      return await propertiesApiClient.updateProperty(id, data)
    } catch (err) {
      const userMessage = getUserFriendlyError(err)
      setError(userMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [propertiesApiClient])

  return {
    createProperty,
    getAllProperties,
    getProperty,
    updateProperty,
    isLoading,
    error
  }
}
