'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SideButton from './SideButton'

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className="w-64 text-white h-screen fixed left-0 top-0 overflow-y-auto" style={{ background: 'linear-gradient(180deg, #03171A 0%, #032E2C 100%)' }}>
      <div className="p-6">
        {/* Logo */}
        <div className="mb-10">
          <img 
            src="/assets/images/Logo.svg" 
            alt="KOLOS Logo" 
            className="h-auto w-full max-w-[180px]"
          />
        </div>
        <SideButton icon="Travel" title="Travel Planning" link="/business-match" isDropdown={true} />
        <SideButton icon="Handsshake" title="Business Match" link="/business-match" isDropdown={true} />
        <div className="border-b border-kolos-gold my-4"></div>
        <SideButton icon="Goal" title="Find Outside Contacts" link="/business-match" isDropdown={false} />
        <SideButton icon="Hand" title="Introduction" link="/business-match" isDropdown={false} />
        <SideButton icon="Find" title="Find a Coach" link="/business-match" isDropdown={false} />
        <div className="border-b border-kolos-gold my-4"></div>
        <div className='mb-4 text-sm'>
            <div className="text-white">Your OPM Cohort</div>
            <div className='text-gray-500'>42</div>
        </div>
        <div className='mb-4 text-sm'>
            <div className="text-white">Your Primary Location</div>
            <div className='text-gray-500'>Washington D.C. USA 20852</div>
        </div>
        <div className='mb-4 text-sm'>
            <div className="text-white">Live Virtual Assistant</div>
            <div className='text-gray-500'>Not available under Basic</div>
        </div>
        <div className="border-b border-kolos-gold my-4"></div>
        <div className='text-sm text-gray-400'>OPM WA Group</div>
        <div className='text-sm text-gray-400'>Updates & FAQ</div>
      </div>
    </div>
  )
}

