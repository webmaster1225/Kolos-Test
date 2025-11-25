import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// Handle GET requests for testing
export async function GET(request: NextRequest) {
  const agentId = process.env.RETELL_AGENT_ID
  return NextResponse.json({ 
    message: 'Retell AI Access Token endpoint',
    method: 'Use POST to get access token',
    agentIdConfigured: !!agentId,
    apiKeyConfigured: !!process.env.RETELL_API_KEY
  })
}

export async function POST(request: NextRequest) {
  try {
    const retellApiKey = process.env.RETELL_API_KEY
    const agentId = process.env.RETELL_AGENT_ID
    
    if (!retellApiKey) {
      return NextResponse.json(
        { error: 'Retell API key not configured' },
        { status: 500 }
      )
    }

    if (!agentId) {
      return NextResponse.json(
        { error: 'Retell Agent ID not configured' },
        { status: 500 }
      )
    }

    // Call Retell AI API to create a web call and get access token
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${retellApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: agentId,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Retell AI API error:', error)
      return NextResponse.json(
        { error: 'Failed to create call with Retell AI', details: error },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('response data---------->', data);
    
    return NextResponse.json({
      accessToken: data.access_token || data.token,
      callId: data.call_id,
    })
  } catch (error) {
    console.error('Error getting access token:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

