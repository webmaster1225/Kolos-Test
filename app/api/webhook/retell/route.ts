import { NextRequest, NextResponse } from 'next/server'
import { saveMemberData, generateSignals } from '@/lib/airtable'

interface RetellWebhookBody {
  event: string
  call?: {
    call_id: string
    transcript?: string
    [key: string]: any
  }
  [key: string]: any
}

export async function POST(request: NextRequest) {
  try {
    const body: RetellWebhookBody = await request.json()
    const { event, call } = body

    switch (event) {
      case 'call_started':
        console.log('Call started event received', call?.call_id)
        // Acknowledge the receipt of the event
        return NextResponse.json({ message: 'Webhook received' }, { status: 200 })

      case 'call_ended':
        console.log('Call ended event received', call?.call_id)
        const callResponse = await fetch(`https://api.retellai.com/v2/get-call/${call?.call_id}`)
        const callData = await callResponse.json()
        console.log('callData---------->', callData);
        
        // If transcript is available, process it
        if (call?.transcript) {
          try {
            const memberData = extractMemberDataFromTranscript(call.transcript)
            
            // Save to Airtable
            const memberId = await saveMemberData(memberData)
            
            // Generate signals
            const signals = await generateSignals(memberData)
            
            console.log(`Member data saved: ${memberId}, Signals generated: ${signals.length}`)
          } catch (error) {
            console.error('Error processing call transcript:', error)
          }
        }
        
        // Acknowledge the receipt of the event
        return NextResponse.json({ message: 'Webhook received' }, { status: 200 })

      case 'call_analyzed':
        console.log('Call analyzed event received', call?.call_id)
        
        // Process analyzed call data if available
        if (call?.transcript) {
          try {
            const memberData = extractMemberDataFromTranscript(call.transcript)
            const memberId = await saveMemberData(memberData)
            const signals = await generateSignals(memberData)
            
            console.log(`Call analyzed - Member saved: ${memberId}`)
          } catch (error) {
            console.error('Error processing analyzed call:', error)
          }
        }
        
        // Acknowledge the receipt of the event
        return NextResponse.json({ message: 'Webhook received' }, { status: 200 })

      default:
        console.log('Received an unknown event:', event)
        // Acknowledge the receipt of the event
        return NextResponse.json({ message: 'Webhook received' }, { status: 200 })
    }
  } catch (error) {
    console.error('Webhook error:', error)
    // Still acknowledge to prevent retries
    return NextResponse.json({ message: 'Webhook received' }, { status: 200 })
  }
}

function extractMemberDataFromTranscript(transcript: string): any {
  // Simple extraction - in production, use NLP or structured prompts
  const data: any = {}
  
  // Extract name
  const nameMatch = transcript.match(/name is ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/i)
  if (nameMatch) data.name = nameMatch[1]
  
  // Extract role
  const roleMatch = transcript.match(/(?:role|position|title) (?:is|as) ([^,\.]+)/i)
  if (roleMatch) data.role = roleMatch[1].trim()
  
  // Extract industries
  const industriesMatch = transcript.match(/industr(?:y|ies)[:\s]+([^,\.]+)/i)
  if (industriesMatch) {
    data.industries = industriesMatch[1].split(',').map((i: string) => i.trim())
  }
  
  // Extract regions
  const regionsMatch = transcript.match(/region(?:s)?[:\s]+([^,\.]+)/i)
  if (regionsMatch) {
    data.regions = regionsMatch[1].split(',').map((r: string) => r.trim())
  }
  
  // Extract goals
  const goalsMatch = transcript.match(/goal(?:s)?[:\s]+([^,\.]+)/i)
  if (goalsMatch) data.goals = goalsMatch[1].trim()
  
  // Extract check size
  const checkSizeMatch = transcript.match(/(?:check size|investment|raise)[:\s]+(\$?[\d\.]+[MBK]?)/i)
  if (checkSizeMatch) data.checkSize = checkSizeMatch[1]
  
  // Extract capital role
  const capitalRoleMatch = transcript.match(/(?:capital role|preferred|equity|co-gp)[:\s]+([^,\.]+)/i)
  if (capitalRoleMatch) data.capitalRole = capitalRoleMatch[1].trim()
  
  return data
}

