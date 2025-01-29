import { useState } from "react"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"

interface RollCallDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  countries: string[]
  onComplete: (presentCountries: string[]) => void
}

export function RollCallDialog({ open, onOpenChange, countries, onComplete }: RollCallDialogProps) {
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
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#2B4170] text-white border border-[#C4A23D]/20 shadow-xl backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-[#C4A23D] text-xl font-bold">Roll Call</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {countries.map((country) => (
              <Button
                key={country}
                onClick={() => toggleCountry(country)}
                variant="outline"
                className={`text-xs sm:text-sm ${
                  presentCountries.has(country)
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-[#C4A23D]/10 hover:bg-[#C4A23D]/20"
                } text-white backdrop-blur-sm transition-colors border border-[#C4A23D]/20`}
              >
                {country}
              </Button>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter className="flex justify-between items-center">
          <Badge variant="secondary" className="text-xs bg-[#C4A23D]/10 text-[#C4A23D] backdrop-blur-sm">
            {presentCountries.size} / {countries.length} Present
          </Badge>
          <Button
            onClick={handleComplete}
            className="bg-[#C4A23D]/10 hover:bg-[#C4A23D]/20 text-white backdrop-blur-sm transition-colors border border-[#C4A23D]/20"
          >
            Complete Roll Call
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

