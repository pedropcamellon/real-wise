import type { Property } from '.'

export type PropertyApiResponse = {
  success: boolean
  message?: string
  data?: Property
}
