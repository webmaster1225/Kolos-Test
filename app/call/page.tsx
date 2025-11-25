'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

export default function CallPage() {
  const retellWidgetRef = useRef<any>(null)

  useEffect(() => {
    // Initialize Retell AI widget when component mounts
    if (typeof window !== 'undefined' && (window as any).Retell) {
      initializeRetell()
    }
  }, [])

  const initializeRetell = () => {
    const Retell = (window as any).Retell
    if (!Retell) return

    retellWidgetRef.current = new Retell.WebClient({
      onAgentStartSpeaking: () => {
        console.log('Agent started speaking')
      },
      onAgentStopSpeaking: () => {
        console.log('Agent stopped speaking')
      },
      onConversationEnded: (data: any) => {
        console.log('Conversation ended:', data)
        // Redirect to dashboard after call ends
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      },
    })
  }

  const handleStartCall = () => {
    const agentId = process.env.NEXT_PUBLIC_RETELL_AGENT_ID
    if (!agentId) {
      alert('Retell AI Agent ID is not configured. Please set NEXT_PUBLIC_RETELL_AGENT_ID in your environment variables.')
      return
    }
    
    if (retellWidgetRef.current) {
      retellWidgetRef.current.startCall({
        agentId: agentId,
      })
    } else {
      // Retry initialization
      if (typeof window !== 'undefined' && (window as any).Retell) {
        initializeRetell()
        setTimeout(() => {
          if (retellWidgetRef.current) {
            retellWidgetRef.current.startCall({ agentId })
          }
        }, 100)
      } else {
        alert('Retell AI SDK is not loaded. Please check your internet connection and try again.')
      }
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">AI Audio Assistant</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-600 mb-6">
            Click the button below to start your conversation. The AI assistant will ask you 
            6-10 questions about your role, industries, regions, and goals.
          </p>
          
          <button
            onClick={handleStartCall}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition text-lg font-semibold"
          >
            Start Call
          </button>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Make sure you have configured your Retell AI agent ID in the environment variables.
              The call will automatically save your responses to Airtable.
            </p>
          </div>
        </div>
      </div>

      {/* Retell AI SDK */}
      <Script
        src="https://cdn.retell.ai/web-client-sdk/retell-web-client-sdk.js"
        onLoad={initializeRetell}
      />
    </div>
  )
}

