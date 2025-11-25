import { NextRequest, NextResponse } from 'next/server'


// Handle GET requests for testing
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    console.log('searchParams---------->', searchParams);
    const callId = searchParams.get('callId')
    if(callId) {
        console.log('callId---------->', callId);
        const response = await fetch(`https://api.retellai.com/v2/get-call/${callId}`, {
            headers: {
                'Authorization': `Bearer ${process.env.RETELL_API_KEY}`,
            },
        })
        if (!response.ok) {
            throw new Error(`Failed to get call: ${response.statusText}`)
        }
        const call = await response.json()
        console.log('call---------->', call);
        return NextResponse.json(call)
    } else {
        return NextResponse.json({ error: 'Call ID is required' }, { status: 400 })
    }
}