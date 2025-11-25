import { NextRequest, NextResponse } from 'next/server'
import { saveMemberData, generateSignals } from '@/lib/airtable'

// Test endpoint to simulate saving member data without going through Retell
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Save to Airtable
    const memberId = await saveMemberData(body)
    
    // Generate signals
    const signals = await generateSignals(body)
    
    return NextResponse.json({ 
      success: true, 
      memberId,
      signalsCount: signals.length,
      signals 
    })
  } catch (error) {
    console.error('Error saving test member:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

