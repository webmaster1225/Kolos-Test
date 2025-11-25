import Airtable from 'airtable'

if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
  throw new Error('Missing Airtable configuration. Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID environment variables.')
}

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID)

const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Members'
const SIGNALS_TABLE = 'Signals'

export interface MemberData {
  name?: string
  role?: string
  industries?: string[]
  regions?: string[]
  goals?: string
  checkSize?: string
  capitalRole?: string
  [key: string]: any
}

export interface Signal {
  date: string
  type: string
  signal_headline_source: string
  check_size_focus: string
  capital_role: string
  why_fit: string
  what_to_pitch: string
  next_step: string
  scores_R_O_A: string
  overall: number
}

// Save member data to Airtable
export async function saveMemberData(data: MemberData): Promise<string> {
  try {
    const record = await base(TABLE_NAME).create({
      Name: data.name || 'Unknown',
      Role: data.role || '',
      Industries: data.industries || [],
      Regions: data.regions || [],
      Goals: data.goals || '',
      CheckSize: data.checkSize || '',
      CapitalRole: data.capitalRole || '',
      CreatedAt: new Date().toISOString(),
    })
    
    return record.id
  } catch (error) {
    console.error('Error saving to Airtable:', error)
    throw error
  }
}

// Get member data from Airtable
export async function getMemberData(memberId?: string): Promise<MemberData | null> {
  try {
    if (memberId) {
      const record = await base(TABLE_NAME).find(memberId)
      return {
        name: record.fields.Name as string,
        role: record.fields.Role as string,
        industries: (record.fields.Industries as string[]) || [],
        regions: (record.fields.Regions as string[]) || [],
        goals: record.fields.Goals as string,
        checkSize: record.fields.CheckSize as string,
        capitalRole: record.fields.CapitalRole as string,
      }
    } else {
      // Get the most recent member
      const records = await base(TABLE_NAME)
        .select({
          sort: [{ field: 'CreatedAt', direction: 'desc' }],
          maxRecords: 1,
        })
        .firstPage()
      
      if (records && records.length > 0) {
        const record = records[0]
        return {
          name: record.fields.Name as string,
          role: record.fields.Role as string,
          industries: (record.fields.Industries as string[]) || [],
          regions: (record.fields.Regions as string[]) || [],
          goals: record.fields.Goals as string,
          checkSize: record.fields.CheckSize as string,
          capitalRole: record.fields.CapitalRole as string,
        }
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching from Airtable:', error)
    return null
  }
}

// Get all members
export async function getAllMembers(): Promise<MemberData[]> {
  try {
    const records = await base(TABLE_NAME)
      .select({
        sort: [{ field: 'CreatedAt', direction: 'desc' }],
      })
      .all()
    
    return records.map(record => ({
      id: record.id,
      name: record.fields.Name as string,
      role: record.fields.Role as string,
      industries: (record.fields.Industries as string[]) || [],
      regions: (record.fields.Regions as string[]) || [],
      goals: record.fields.Goals as string,
      checkSize: record.fields.CheckSize as string,
      capitalRole: record.fields.CapitalRole as string,
    }))
  } catch (error) {
    console.error('Error fetching members:', error)
    return []
  }
}

// Generate and save signals for a member
export async function generateSignals(memberData: MemberData): Promise<Signal[]> {
  // Simple rule-based signal generation
  // In production, this could call an AI API (OpenAI, Anthropic, etc.)
  const signals: Signal[] = []
  
  const industries = memberData.industries || []
  const regions = memberData.regions || []
  const checkSize = memberData.checkSize || '$5M'
  const role = memberData.role || 'Investor'
  const goals = memberData.goals || 'strategic investment opportunities'
  const capitalRole = memberData.capitalRole || 'Co-GP'
  
  const today = new Date().toISOString().split('T')[0]
  
  // Signal 1: Industry-focused opportunity
  if (industries.length > 0) {
    const primaryIndustry = industries[0]
    signals.push({
      date: today,
      type: 'Family Office',
      signal_headline_source: `Family office recently closed ${primaryIndustry} deal matching your ${checkSize} check size`,
      check_size_focus: checkSize,
      capital_role: capitalRole,
      why_fit: `Strong track record in ${primaryIndustry} sector${regions.length > 0 ? ` with ${regions[0]} presence` : ''}. Their investment thesis aligns with ${goals.toLowerCase()}`,
      what_to_pitch: `Present your ${role} background and ${goals.toLowerCase()} as a strategic fit for their portfolio`,
      next_step: 'Schedule introductory call this week via warm introduction',
      scores_R_O_A: 'R:4, O:4, A:4',
      overall: 4.0,
    })
  }
  
  // Signal 2: Region-focused opportunity
  if (regions.length > 0) {
    const primaryRegion = regions[0]
    signals.push({
      date: today,
      type: 'Operator-Investor',
      signal_headline_source: `Operator-investor active in ${primaryRegion} market seeking ${capitalRole} partnerships`,
      check_size_focus: checkSize,
      capital_role: capitalRole,
      why_fit: `Geographic focus matches your ${primaryRegion} strategy. They bring operational expertise${industries.length > 0 ? ` in ${industries.join(' and ')}` : ''} that complements your capital`,
      what_to_pitch: `Discuss ${goals.toLowerCase()} and explore ${capitalRole} structure for ${primaryRegion} opportunities`,
      next_step: 'Send personalized outreach email with deal flow summary',
      scores_R_O_A: 'R:3, O:4, A:4',
      overall: 3.7,
    })
  }
  
  // Signal 3: Platform/Network opportunity
  if (signals.length < 3) {
    signals.push({
      date: today,
      type: 'Platform',
      signal_headline_source: `Investment platform matching ${role} profiles with ${checkSize} capital seeking ${capitalRole} opportunities`,
      check_size_focus: checkSize,
      capital_role: capitalRole,
      why_fit: `Platform specializes in connecting ${role} professionals with capital partners. Their network includes${industries.length > 0 ? ` ${industries.join(', ')}` : ''} sector focus${regions.length > 0 ? ` and ${regions.join(', ')}` : ''} presence`,
      what_to_pitch: `Introduce your ${goals.toLowerCase()} and explore platform benefits for deal sourcing and capital access`,
      next_step: 'Complete platform profile and request introduction to 2-3 relevant connections',
      scores_R_O_A: 'R:3, O:3, A:5',
      overall: 3.7,
    })
  }
  
  // Ensure we return at least 2 signals
  if (signals.length === 0) {
    signals.push({
      date: today,
      type: 'General Opportunity',
      signal_headline_source: `Investment opportunity matching ${checkSize} check size and ${capitalRole} structure`,
      check_size_focus: checkSize,
      capital_role: capitalRole,
      why_fit: `Opportunity aligns with your investment profile and ${goals.toLowerCase()}`,
      what_to_pitch: `Present your ${role} background and investment thesis`,
      next_step: 'Schedule exploratory call to discuss fit',
      scores_R_O_A: 'R:3, O:3, A:3',
      overall: 3.0,
    })
  }
  
  return signals.slice(0, 3) // Return max 3 signals
}

