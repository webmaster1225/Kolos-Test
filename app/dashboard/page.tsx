'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface MemberData {
  id?: string
  name?: string
  role?: string
  industries?: string[]
  regions?: string[]
  goals?: string
  checkSize?: string
  capitalRole?: string
}

interface Signal {
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

export default function DashboardPage() {
  const [member, setMember] = useState<MemberData | null>(null)
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // First, check if we have call data from WebSocket (sessionStorage)
    const callDataFromStorage = sessionStorage.getItem('callData')
    
    if (callDataFromStorage) {
      try {
        const parsedData = JSON.parse(callDataFromStorage)
        console.log('Loaded call data from WebSocket:', parsedData)
        
        // Set member data if available
        if (parsedData.memberData) {
          setMember({
            id: parsedData.memberId,
            ...parsedData.memberData
          })
        }
        
        // Set signals if available
        if (parsedData.signals && Array.isArray(parsedData.signals)) {
          setSignals(parsedData.signals)
        }
        
        // Clear the sessionStorage after using it
        sessionStorage.removeItem('callData')
        
        setLoading(false)
        return
      } catch (err) {
        console.error('Error parsing call data from storage:', err)
        // Fall through to load from API
      }
    }
    
    // If no WebSocket data, load from API
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Get the most recent member
      const membersResponse = await fetch('/api/members')
      const members = await membersResponse.json()
      
      if (members && members.length > 0) {
        const latestMember = members[0]
        setMember(latestMember)
        
        // Generate signals for this member
        const signalsResponse = await fetch(`/api/signals?memberId=${latestMember.id}`)
        const signalsData = await signalsResponse.json()
        setSignals(signalsData)
      } else {
        setError('No member data found. Please complete the audio call first.')
      }
    } catch (err) {
      console.error('Error loading dashboard:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
          <Link 
            href="/"
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Start Conversation
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Member Dashboard</h1>
          <Link 
            href="/"
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            Start New Conversation
          </Link>
        </div>

        {/* Member Profile */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Member Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg font-semibold mt-1">{member?.name || 'Not provided'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Role</label>
              <p className="text-lg font-semibold mt-1">{member?.role || 'Not provided'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Industries</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {member?.industries && member.industries.length > 0 ? (
                  member.industries.map((industry, idx) => (
                    <span 
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {industry}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">Not provided</span>
                )}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Regions</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {member?.regions && member.regions.length > 0 ? (
                  member.regions.map((region, idx) => (
                    <span 
                      key={idx}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {region}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">Not provided</span>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-500">Goals</label>
              <p className="mt-1 text-gray-700">{member?.goals || 'Not provided'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Check Size</label>
              <p className="mt-1 text-gray-700">{member?.checkSize || 'Not provided'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Capital Role</label>
              <p className="mt-1 text-gray-700">{member?.capitalRole || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Signals */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Kolos Signals</h2>
          
          {signals.length === 0 ? (
            <p className="text-gray-500">No signals generated yet. Complete the audio call to generate personalized signals.</p>
          ) : (
            <div className="space-y-6">
              {signals.map((signal, idx) => (
                <div 
                  key={idx}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        {signal.type}
                      </span>
                      <span className="ml-3 text-sm text-gray-500">{signal.date}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-blue-600">{signal.overall.toFixed(1)}</span>
                      <p className="text-xs text-gray-500">Overall Score</p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    {signal.signal_headline_source}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Check Size Focus</label>
                      <p className="text-sm text-gray-700">{signal.check_size_focus}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Capital Role</label>
                      <p className="text-sm text-gray-700">{signal.capital_role}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="text-xs font-medium text-gray-500">Why Fit</label>
                    <p className="text-sm text-gray-700 mt-1">{signal.why_fit}</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="text-xs font-medium text-gray-500">What to Pitch</label>
                    <p className="text-sm text-gray-700 mt-1">{signal.what_to_pitch}</p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Next Step</label>
                      <p className="text-sm font-semibold text-gray-800 mt-1">{signal.next_step}</p>
                    </div>
                    <div className="text-right">
                      <label className="text-xs font-medium text-gray-500">Scores (R/O/A)</label>
                      <p className="text-sm text-gray-700 mt-1">{signal.scores_R_O_A}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

