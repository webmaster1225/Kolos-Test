export default function SideButton({ icon, title, link, isDropdown = false }: { icon: string, title: string, link: string, isDropdown: boolean }) {
    return (
        <button className="flex items-center justify-between w-full gap-3 mb-4 py-3 rounded-lg transition">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 flex-shrink-0 flex items-center justify-center">
              <img 
                src={`/assets/images/${icon}.svg`} 
                alt={title} 
                className="h-full w-full object-contain"
                style={{ width: '18px', height: '18px' }}
              />
            </div>
            <span className="text-white text-sm font-medium">{title}</span>
          </div>
           {isDropdown && (
             <svg className="w-[18px] h-[18px] flex-shrink-0 text-kolos-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
             </svg>
           )}
        </button>
    )
}