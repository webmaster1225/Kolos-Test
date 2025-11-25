import { NextRequest, NextResponse } from 'next/server'
import { getAllMembers, getMemberData } from '@/lib/airtable'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const memberId = searchParams.get('id')
    
    if (memberId) {
      const member = await getMemberData(memberId)
      return NextResponse.json(member)
    } else {
      const members = await getAllMembers()
      return NextResponse.json(members)
    }
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

