export default function Card({title, description}: {title: string, description: string}) {
    return (
        <div className="border border-gray-200 rounded-lg p-4 w-full">
            <div className="text-kolos-gold">Travel</div>
            <div className="text-gray-500 text-sm">
                I'd like to go to Spain in September.
                Any OPMers live there? or plan to travelthere?
            </div>
        </div>
    )
}