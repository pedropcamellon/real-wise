import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const API_URL = process.env.API_URL

// Debug helper
const debugLog = (message: string, data?: any) => {
    console.log(`[API Route Debug] ${message}`, data || '')
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        debugLog('Environment check:')
        debugLog('API_URL:', API_URL)
        debugLog('Property ID:', params.id)

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

        const targetUrl = `${API_URL}/api/properties/${params.id}`
        debugLog('Forwarding GET request to:', targetUrl)

        const response = await fetch(targetUrl, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...(authorization ? { 'Authorization': authorization } : {}),
                ...(cookie ? { 'Cookie': cookie } : {})
            },
        })

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
        console.error('[API Route] GET error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch property' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
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

        // Get request body
        const body = await request.json()
        debugLog('Request body:', body)

        const targetUrl = `${API_URL}/api/properties/${params.id}`
        debugLog('Forwarding PATCH request to:', targetUrl)

        const response = await fetch(targetUrl, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...(authorization ? { 'Authorization': authorization } : {}),
                ...(cookie ? { 'Cookie': cookie } : {})
            },
            body: JSON.stringify(body)
        })

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
        console.error('[API Route] PATCH error:', error)
        return NextResponse.json(
            { error: 'Failed to update property' },
            { status: 500 }
        )
    }
}
