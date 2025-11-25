'use client'

import { useState, useRef, useEffect } from 'react'
import Card from '@/components/Card'
import { RetellWebClient } from 'retell-client-js-sdk'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [callId, setCallId] = useState('')
  const [input, setInput] = useState('')
  const [isCallActive, setIsCallActive] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [hasConversationStarted, setHasConversationStarted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const retellWidgetRef = useRef<any>(null)
  const lastMessageRef = useRef<string>('') // Track last message to prevent duplicates

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Initialize Retell SDK
    initializeRetell()
  }, [])

  const initializeRetell = () => {
    try {
      retellWidgetRef.current = new RetellWebClient()
      
      // Set up event listeners
      if (retellWidgetRef.current) {
        retellWidgetRef.current.on('agent_start_speaking', () => {
          setIsTyping(true)
        })
        
        retellWidgetRef.current.on('agent_stop_speaking', () => {
          setIsTyping(false)
        })
        
        // Listen for various transcription events
        // Try multiple event names as SDK might use different ones
        const possibleEvents = [
          'update',
          'transcript',
          'user_speech',
          'agent_speech',
          'user_start_speaking',
          'user_stop_speaking',
          'conversation_update'
        ]
        
        possibleEvents.forEach(eventName => {
          console.log('eventName---------->', eventName);
          retellWidgetRef.current.on(eventName, (data: any) => {
            
            // Handle transcript data in various formats
            if (data?.transcript) {
              const transcript = data.transcript
              if (typeof transcript === 'string') {
                // If transcript is a string, determine if it's user or agent based on event
                if (eventName.includes('user')) {
                  addMessage('user', transcript)
                } else if (eventName.includes('agent')) {
                  addMessage('assistant', transcript)
                }
              } else if (typeof transcript === 'object') {
                if (transcript.user_transcript || transcript.user) {
                  addMessage('user', transcript.user_transcript || transcript.user)
                }
                if (transcript.agent_transcript || transcript.agent || transcript.assistant) {
                  addMessage('assistant', transcript.agent_transcript || transcript.agent || transcript.assistant)
                }
              }
            }
            
            // Handle direct text content
            if (data?.text && typeof data.text === 'string') {
              if (eventName.includes('user')) {
                addMessage('user', data.text)
              } else if (eventName.includes('agent') || eventName.includes('assistant')) {
                addMessage('assistant', data.text)
              }
            }
          })
        })
        
        retellWidgetRef.current.on('conversation_ended', (data: any) => {
          setIsCallActive(false)
          addMessage('assistant', 'Thank you for the conversation! Your responses have been saved. You can view your profile and signals on the dashboard.')
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 3000)
        })
      }
      
      console.log('Retell AI SDK initialized successfully')
    } catch (error) {
      console.error('Error initializing Retell AI:', error)
    }
  }

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    if (!content || !content.trim()) return
    
    // Prevent duplicate messages
    const messageKey = `${role}-${content.trim()}`
    if (lastMessageRef.current === messageKey) {
      return
    }
    lastMessageRef.current = messageKey
    
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      role,
      content: content.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
    
    // Reset duplicate check after a short delay
    setTimeout(() => {
      lastMessageRef.current = ''
    }, 1000)
  }

  const handleStartAudioCall = async () => {
    if (!retellWidgetRef.current) {
      initializeRetell()
    }

    if (retellWidgetRef.current) {
      try {
        // Get access token from backend (backend uses RETELL_API_KEY and RETELL_AGENT_ID from env)
        const response = await fetch('/api/retell/get-access-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })


        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to get access token')
        }

        const { accessToken, callId } = await response.json()

        await retellWidgetRef.current.startCall({
          accessToken: accessToken,
        })

        setCallId(callId)
        setIsCallActive(true)
        setHasConversationStarted(true)
        addMessage('assistant', 'Audio call started! Please speak your answers to my questions.')
      } catch (error) {
        console.error('Error starting call:', error)
        alert(`Failed to start audio call: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    } else {
      alert('Retell AI SDK is not initialized. Please refresh the page and try again.')
    }
  }

  const handleEndCall = async () => {
    console.log('handleEndCall---------->');
    if (retellWidgetRef.current) {
      console.log('callId---------->', callId);
      const callResponse = await fetch(`/api/retell/get-call?callId=${callId}`)
      const callData = await callResponse.json()
      console.log('callData---------->', callData);
      setIsCallActive(false);
      addMessage('assistant', 'Audio conversation ended. You can continue with text messages.')
    }
  }

  return (
    <div className="h-full flex flex-col bg-white pt-14">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center">
                <img 
                  src="/assets/images/KolosLogo.svg" 
                  alt="Assistant" 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div
              className={`max-w-2xl rounded-lg px-4 py-3 text-gray-800 ${
                message.role === 'user'
                  ? 'bg-gray-100'
                  : 'bg-[#F7F7F7]'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
        
        {!hasConversationStarted && (
          <div className="flex w-full px-16 justify-center gap-4">
            <div className="flex flex-col gap-4 max-w-[28%]">
              <div className="flex items-center gap-2">
                <img src="/assets/images/Sun.svg" alt="Sun" />
                <div>Examples</div>
              </div>
              <Card title="Travel" description="I'd like to go to Spain in September. Any OPMers live there? or plan to travelthere?" />
              <Card title="Travel" description="I'd like to go to Spain in September. Any OPMers live there? or plan to travelthere?" />
              <Card title="Travel" description="I'd like to go to Spain in September. Any OPMers live there? or plan to travelthere?" />
            </div>
            <div className="flex flex-col gap-4 max-w-[28%]">
              <div className="flex items-center gap-2">
                <img src="/assets/images/Sun.svg" alt="Sun" />
                <div>Examples</div>
              </div>
              <Card title="Travel" description="I'd like to go to Spain in September. Any OPMers live there? or plan to travelthere?" />
              <Card title="Travel" description="I'd like to go to Spain in September. Any OPMers live there? or plan to travelthere?" />
              <Card title="Travel" description="I'd like to go to Spain in September. Any OPMers live there? or plan to travelthere?" />
            </div>
            <div className="flex flex-col gap-4 max-w-[28%]">
              <div className="flex items-center gap-2">
                <img src="/assets/images/Sun.svg" alt="Sun" />
                <div>Examples</div>
              </div>
              <Card title="Travel" description="I'd like to go to Spain in September. Any OPMers live there? or plan to travelthere?" />
              <Card title="Travel" description="I'd like to go to Spain in September. Any OPMers live there? or plan to travelthere?" />
              <Card title="Travel" description="I'd like to go to Spain in September. Any OPMers live there? or plan to travelthere?" />
            </div>
          </div>
        )}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      {/* Input with Audio Call and Send buttons */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        {/* Text Input */}
        <form onSubmit={handleStartAudioCall} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isCallActive ? "Audio call active - speak your message..." : "Type your message or use audio call..."}
            className="w-full px-14 py-3 pr-14 border border-gray-300 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={true}
          />
          
          {/* Audio Call Button (Left side) */}
          {!isCallActive ? (
            <button
              type="button"
              onClick={handleStartAudioCall}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition"
            >
              <img src="/assets/images/lightning.svg" alt="Start Audio Call" className="w-6 h-6" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEndCall}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition"
            >
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zm4-1a1 1 0 00-1 1v4a1 1 0 102 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          
          {/* Send Button (Right side) */}
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src="/assets/images/Send.svg" alt="Send" className="w-6 h-6" />
          </button>
        </form>
        <div className="text-gray-500 text-sm">Kolos introduces a ChatGPT 4.0 adaptation for Harvard OPM alumni, offering a private platform for interest-based networking, exclusive communication, travel meetups, and lunch opportunities, all within a secure environment that prioritizes data privacy.</div>
      </div>
    </div>
  )
}
