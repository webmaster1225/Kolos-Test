import { NextRequest, NextResponse } from 'next/server'
import { getMemberData, generateSignals } from '@/lib/airtable'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const memberId = searchParams.get('memberId')
    
    if (!memberId) {
      return NextResponse.json(
        { error: 'memberId is required' },
        { status: 400 }
      )
    }
    
    const memberData = await getMemberData(memberId)
    
    if (!memberData) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 500 }
      )
    }
    
    const signals = await generateSignals(memberData)
    
    return NextResponse.json(signals)
  } catch (error) {
    console.error('Error generating signals:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

