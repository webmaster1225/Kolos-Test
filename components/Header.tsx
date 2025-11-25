'use client'

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-kolos-gold fixed top-0 left-64 right-0 z-10 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="ml-8">
          <h1 className="text-lg font-semibold text-gray-800">
            AI Al-Match Assistant by OBS Group
          </h1>
          <p className="text-xs text-gray-500">Exclusively for Harvard OPM Alumni</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  )
}

