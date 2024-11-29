import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

const API_URL = process.env.API_URL

// Debug helper
const debugLog = (message: string, data?: any) => {
  console.log(`[API Route Debug] ${message}`, data || '')
}

export async function GET(request: NextRequest) {
  try {
    // Debug environment
    debugLog('Environment check:')
    debugLog('API_URL:', API_URL)
    debugLog('NODE_ENV:', process.env.NODE_ENV)

    if (!API_URL) {
      console.error('[API Route] API_URL is not defined')
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
    }

    // Forward authorization headers
    const headersList = await headers()
    const authorization = headersList.get('authorization')
    const cookie = headersList.get('cookie')

    debugLog('Authorization header:', authorization)
    debugLog('Cookie header:', cookie)

    // Get and forward query parameters
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    const targetUrl = `${API_URL}/api/properties/${queryString ? `?${queryString}` : ''}`

    debugLog('Forwarding GET request to:', targetUrl)

    const response = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(authorization ? { 'Authorization': authorization } : {}),
        ...(cookie ? { 'Cookie': cookie } : {})
      },
    })

    // Debug response
    debugLog('Response status:', response.status)
    debugLog('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[API Route] Backend responded with ${response.status}:`, errorText)

      // Try to parse error as JSON
      try {
        const errorJson = JSON.parse(errorText)
        return NextResponse.json(
          { error: errorJson.detail || errorJson.message || response.statusText },
          { status: response.status }
        )
      } catch {
        return NextResponse.json(
          { error: errorText || response.statusText },
          { status: response.status }
        )
      }
    }

    const rawText = await response.text()
    debugLog('Raw response:', rawText)

    try {
      const data = JSON.parse(rawText)
      return NextResponse.json(data)
    } catch (parseError) {
      console.error('[API Route] Failed to parse JSON response:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON response from backend' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[API Route] GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    if (!API_URL) {
      console.error('[API Route] API_URL is not defined')
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
    }

    // Forward authorization headers
    const headersList = await headers()
    const authorization = headersList.get('authorization')
    const cookie = headersList.get('cookie')

    const body = await request.json()
    const targetUrl = `${API_URL}/api/properties/`

    debugLog('Forwarding POST request to:', targetUrl)
    debugLog('Request body:', body)
    debugLog('Authorization header:', authorization)
    debugLog('Cookie header:', cookie)

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(authorization ? { 'Authorization': authorization } : {}),
        ...(cookie ? { 'Cookie': cookie } : {})
      },
      body: JSON.stringify(body),
    })

    // Debug response
    debugLog('Response status:', response.status)
    debugLog('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[API Route] Backend responded with ${response.status}:`, errorText)

      try {
        const errorJson = JSON.parse(errorText)
        return NextResponse.json(
          { error: errorJson.detail || errorJson.message || response.statusText },
          { status: response.status }
        )
      } catch {
        return NextResponse.json(
          { error: errorText || response.statusText },
          { status: response.status }
        )
      }
    }

    const rawText = await response.text()
    debugLog('Raw response:', rawText)

    try {
      const data = JSON.parse(rawText)
      return NextResponse.json(data)
    } catch (parseError) {
      console.error('[API Route] Failed to parse JSON response:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON response from backend' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[API Route] POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    )
  }
}
