import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
import { committeeData } from "../data/committee-data"

interface CommitteeSelectDialogProps {
  open: boolean
  onSelect: (committee: string) => void
}

export function CommitteeSelectDialog({ open, onSelect }: CommitteeSelectDialogProps) {
  const [selectedCommittee, setSelectedCommittee] = useState<string | undefined>()

  const handleSelect = () => {
    if (selectedCommittee) {
      onSelect(selectedCommittee)
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px] bg-[#2B4170] text-white border border-[#C4A23D]/20 shadow-xl backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-[#C4A23D] text-xl font-bold">Select Committee</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select onValueChange={setSelectedCommittee}>
            <SelectTrigger className="bg-white/5 border-[#C4A23D]/20 text-white">
              <SelectValue placeholder="Select a committee" />
            </SelectTrigger>
            <SelectContent className="bg-[#2B4170] border-[#C4A23D]/20">
              {Object.entries(committeeData).map(([key, value]) => (
                <SelectItem key={key} value={key} className="text-white hover:bg-white/10">
                  {value.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleSelect}
          disabled={!selectedCommittee}
          className="w-full bg-[#C4A23D]/10 hover:bg-[#C4A23D]/20 text-white backdrop-blur-sm transition-colors border border-[#C4A23D]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Selection
        </Button>
      </DialogContent>
    </Dialog>
  )
}

