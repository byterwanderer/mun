import { useState } from 'react'
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Badge } from "./ui/badge"

interface RollCallProps {
  countries: string[]
  onComplete: (presentCountries: string[]) => void
}

export function RollCall({ countries, onComplete }: RollCallProps) {
  const [presentCountries, setPresentCountries] = useState<Set<string>>(new Set())

  const toggleCountry = (country: string) => {
    const newPresentCountries = new Set(presentCountries)
    if (newPresentCountries.has(country)) {
      newPresentCountries.delete(country)
    } else {
      newPresentCountries.add(country)
    }
    setPresentCountries(newPresentCountries)
  }

  const handleComplete = () => {
    onComplete(Array.from(presentCountries))
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-[#C4A23D]/20 rounded-xl p-4 mb-4">
      <h2 className="text-lg font-bold text-[#C4A23D] mb-2">Roll Call</h2>
      <ScrollArea className="h-60 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {countries.map((country) => (
            <Button
              key={country}
              onClick={() => toggleCountry(country)}
              variant="outline"
              className={`text-xs sm:text-sm ${
                presentCountries.has(country)
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-[#C4A23D]/10 hover:bg-[#C4A23D]/20'
              } text-white backdrop-blur-sm transition-colors border border-[#C4A23D]/20`}
            >
              {country}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="flex justify-between items-center">
        <Badge variant="secondary" className="text-xs bg-[#C4A23D]/10 text-[#C4A23D] backdrop-blur-sm">
          {presentCountries.size} / {countries.length} Present
        </Badge>
        <Button onClick={handleComplete} className="bg-[#C4A23D]/10 hover:bg-[#C4A23D]/20 text-white backdrop-blur-sm transition-colors border border-[#C4A23D]/20">
          Complete Roll Call
        </Button>
      </div>
    </div>
  )
}

