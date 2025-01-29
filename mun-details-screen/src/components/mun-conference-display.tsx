"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { AlertCircle, Clock, AlertTriangle, Check, Pause, Play, UserCheck } from "lucide-react"
import {CommitteeSelectDialog} from "./committee-select-dialog"
import {RollCallDialog} from "./roll-call-dialog"
import { committeeData } from "../data/committee-data" // Adjust the import path as needed
import { Speaker, Motion } from "../types/mun-types"

type ConferenceStage = 'Not Started' | 'Roll Call' | 'Opening Speeches' | 'Debate' | 'Voting' | 'Closed'

interface MunConferenceDisplayProps {
  initialCommittee?: string
  munLogo?: string
}

const MunConferenceDisplay: React.FC<MunConferenceDisplayProps> = ({ initialCommittee }) => {
  const [currentSpeaker, setCurrentSpeaker] = useState<Speaker | null>(null)
  const [speakersList, setSpeakersList] = useState<Speaker[]>([])
  const [motions, setMotions] = useState<Motion[]>([])
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [debateTimeRemaining, setDebateTimeRemaining] = useState<number>(0)
  const [isCrisisMode, setIsCrisisMode] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [activeMotion, setActiveMotion] = useState<Motion | null>(null)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [conferenceStage, setConferenceStage] = useState<ConferenceStage>("Not Started")
  const [selectedCommittee, setSelectedCommittee] = useState<string>(initialCommittee || "UNSC")
  const [isCommitteeDialogOpen, setIsCommitteeDialogOpen] = useState<boolean>(!initialCommittee)
  const [isRollCallDialogOpen, setIsRollCallDialogOpen] = useState<boolean>(false)
  const [presentCountries, setPresentCountries] = useState<string[]>([])

  const playSound = useCallback((frequency: number, duration: number) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01)
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  }, [])

  const showAlert = useCallback((message: string, duration: number = 3000) => {
    setAlertMessage(message)
    setTimeout(() => setAlertMessage(null), duration)
  }, [])

  useEffect(() => {
    setIsCommitteeDialogOpen(true)
  }, [])

  useEffect(() => {
    if (currentSpeaker && timeRemaining > 0 && !isPaused) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            playSound(440, 0.5) // End of speech sound
            showAlert("Speaker's time is up!")
            return 0
          }
          if (prevTime === 10) {
            playSound(330, 0.3) // 10 seconds remaining sound
            showAlert("10 seconds remaining")
          }
          return prevTime - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [currentSpeaker, timeRemaining, playSound, showAlert, isPaused])

  useEffect(() => {
    if (activeMotion && debateTimeRemaining > 0 && !isPaused) {
      const timer = setInterval(() => {
        setDebateTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            playSound(523, 0.5) // End of debate sound
            showAlert("Debate time is up!")
            setActiveMotion(null)
            return 0
          }
          if (prevTime === Math.floor(activeMotion.duration! * 30) && activeMotion.type === "Formal Debate") {
            playSound(392, 0.3) // Half-time sound for formal debate
            showAlert("Half-time for formal debate")
          }
          if (prevTime === Math.floor(activeMotion.duration! * 45) && activeMotion.type === "Informal Debate") {
            playSound(349, 0.3) // 3/4-time sound for informal debate
            showAlert("3/4-time for informal debate")
          }
          return prevTime - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [debateTimeRemaining, activeMotion, playSound, showAlert, isPaused])

  useEffect(() => {
    const committee = committeeData[selectedCommittee]
    setSpeakersList(committee.speakers)
    setMotions(committee.motions)
  }, [selectedCommittee])

  const startNextSpeaker = () => {
    if (speakersList.length > 0) {
      const nextSpeaker = speakersList[0]
      setCurrentSpeaker(nextSpeaker)
      setTimeRemaining(nextSpeaker.timeRemaining)
      setSpeakersList(speakersList.slice(1))
      if (conferenceStage === 'Not Started') {
        setConferenceStage('Opening Speeches')
      }
    } else {
      setCurrentSpeaker(null)
      setTimeRemaining(0)
      if (conferenceStage === 'Opening Speeches') {
        setConferenceStage('Debate')
      }
    }
  }

  const startDebate = (motion: Motion) => {
    setActiveMotion(motion)
    setDebateTimeRemaining(motion.duration! * 60)
    setConferenceStage('Debate')
  }

  const toggleCrisisMode = () => {
    const newCrisisMode = !isCrisisMode
    setIsCrisisMode(newCrisisMode)
    if (newCrisisMode) {
      playSound(587, 1) // Crisis mode activation sound
      showAlert("Crisis Mode Activated! Starting new Formal Debate.", 5000)
      
      // Create a new Formal Debate motion
      const crisisMotion: Motion = {
        id: Date.now(), // Use current timestamp as a unique ID
        type: "Formal Debate",
        proposedBy: "Crisis Committee",
        duration: 20, // Set a default duration for crisis debate
        topic: "Urgent Crisis Response",
        passed: true // Automatically pass the crisis motion
      }
      
      // Clear old motions and set the new crisis motion
      setMotions([crisisMotion])
      
      // Start the crisis debate immediately
      startDebate(crisisMotion)
    } else {
      showAlert("Crisis Mode Deactivated", 3000)
      setActiveMotion(null)
      setDebateTimeRemaining(0)
    }
  }

  const passMotion = (passedMotion: Motion) => {
    setMotions(motions.map(motion => 
      motion.id === passedMotion.id ? { ...motion, passed: true } : { ...motion, passed: false }
    ))
  }

  const clearMotions = () => {
    setMotions([])
    setActiveMotion(null)
    setDebateTimeRemaining(0)
    showAlert("All motions have been cleared", 3000)
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
    showAlert(isPaused ? "Conference Resumed" : "Conference Paused", 3000)
  }

  const advanceStage = () => {
    switch (conferenceStage) {
      case 'Not Started':
        setConferenceStage('Roll Call')
        setIsRollCallDialogOpen(true)
        break
      case 'Roll Call':
        if (presentCountries.length === 0) {
          showAlert("Please complete the roll call before advancing", 3000)
        } else {
          setConferenceStage('Opening Speeches')
          showAlert(`Roll Call completed. ${presentCountries.length} countries present.`, 3000)
        }
        break
      case 'Opening Speeches':
        setConferenceStage('Debate')
        break
      case 'Debate':
        setConferenceStage('Voting')
        break
      case 'Voting':
        setConferenceStage('Closed')
        break
      default:
        break
    }
  }

const handleCommitteeSelect = (committee: string) => {
  setSelectedCommittee(committee)
  setIsCommitteeDialogOpen(false)
  showAlert(`Selected committee: ${committeeData[committee].fullName}`, 3000)
  // Initialize speakers and motions for the selected committee
  setSpeakersList(committeeData[committee].speakers)
  setMotions(committeeData[committee].motions) // Fix: access motions from committeeData
}

  const handleRollCallComplete = (presentCountries: string[]) => {
    setPresentCountries(presentCountries)
    showAlert(`Roll Call completed. ${presentCountries.length} countries present.`, 3000)
    setConferenceStage('Opening Speeches')
  }

  return (
    <div className="h-screen w-screen p-2 sm:p-4 flex flex-col bg-[#2B4170]">
      <CommitteeSelectDialog open={isCommitteeDialogOpen} onSelect={handleCommitteeSelect} />
      <RollCallDialog
        open={isRollCallDialogOpen}
        onOpenChange={setIsRollCallDialogOpen}
        countries={committeeData[selectedCommittee].speakers.map((speaker) => speaker.country)}
        onComplete={handleRollCallComplete}
      />
      <div className="flex justify-between items-center mb-2">
        <img src="./Logo.png" alt="EWC MUN Logo" className="h-12 w-auto" />
        <div className="flex items-center gap-2">
          <Button
            onClick={togglePause}
            className="bg-[#C4A23D]/10 hover:bg-[#C4A23D]/20 text-white backdrop-blur-sm transition-colors border border-[#C4A23D]/20"
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
          <Button
            onClick={clearMotions}
            className="bg-[#C4A23D]/10 hover:bg-[#C4A23D]/20 text-white backdrop-blur-sm transition-colors border border-[#C4A23D]/20"
          >
            Clear Motions
          </Button>
          <Button
            onClick={() => setIsCommitteeDialogOpen(true)}
            className="bg-[#C4A23D]/10 hover:bg-[#C4A23D]/20 text-white backdrop-blur-sm transition-colors border border-[#C4A23D]/20"
          >
            Change Committee
          </Button>
          <Button
            onClick={toggleCrisisMode}
            className={`${
              isCrisisMode ? 'bg-red-600 hover:bg-red-700' : 'bg-[#C4A23D]/10 hover:bg-[#C4A23D]/20'
            } text-white backdrop-blur-sm transition-colors border border-[#C4A23D]/20`}
          >
            {isCrisisMode ? 'Deactivate Crisis Mode' : 'Activate Crisis Mode'}
          </Button>
          <Button
            onClick={() => setIsRollCallDialogOpen(true)}
            className="bg-[#C4A23D]/10 hover:bg-[#C4A23D]/20 text-white backdrop-blur-sm transition-colors border border-[#C4A23D]/20"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Take Roll Call
          </Button>
        </div>
      </div>
      <Card className="mb-2 bg-white/5 backdrop-blur-sm border-[#C4A23D]/20 shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="p-2">
          <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#C4A23D] font-bold">{committeeData[selectedCommittee].fullName}</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white/90">Topic: {committeeData[selectedCommittee].topic}</h3>
              <p className="text-xs text-white/70">Sub-topic: {isCrisisMode ? "Urgent Crisis Response" : committeeData[selectedCommittee].subTopic}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1">
              <Badge variant="secondary" className="text-xs bg-[#C4A23D]/10 text-[#C4A23D] backdrop-blur-sm">
                {activeMotion?.type || "No active debate"}
              </Badge>
              <Badge variant="secondary" className="text-xs bg-[#C4A23D]/10 text-[#C4A23D] backdrop-blur-sm">
                Stage: {conferenceStage}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {alertMessage && (
        <div className="mb-2 p-2 bg-yellow-500 text-black rounded-md text-center">
          {alertMessage}
        </div>
      )}

      {isCrisisMode && (
        <div className="mb-2 p-2 bg-red-600 text-white rounded-md text-center flex items-center justify-center">
          <AlertTriangle className="mr-2" />
          <span>CRISIS MODE ACTIVE</span>
        </div>
      )}

      {isPaused && (
        <div className="mb-2 p-2 bg-blue-600 text-white rounded-md text-center flex items-center justify-center">
          <Pause className="mr-2" />
          <span>CONFERENCE PAUSED</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 flex-grow">
        <Card className="flex flex-col bg-white/5 backdrop-blur-sm border-[#C4A23D]/20 shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="p-2">
            <CardTitle className="text-sm sm:text-base text-[#C4A23D] font-bold">Current Speaker</CardTitle>
          </CardHeader>
          <CardContent className="p-2 flex-grow flex items-center">
            {currentSpeaker ? (
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="font-semibold text-xs sm:text-sm text-white/90">{currentSpeaker.name}</p>
                  <p className="text-xs text-white/70">{currentSpeaker.country}</p>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 sm:h-5 sm:w-5 text-[#C4A23D]" />
                  <span className="text-sm sm:text-base font-bold text-[#C4A23D]">{timeRemaining}s</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full text-white/70">
                <AlertCircle className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">No active speaker</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col bg-white/5 backdrop-blur-sm border-[#C4A23D]/20 shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="p-2">
            <CardTitle className="text-sm sm:text-base text-[#C4A23D] font-bold">Speakers List</CardTitle>
          </CardHeader>
          <CardContent className="p-2 flex-grow flex flex-col">
            <ScrollArea className="flex-grow pr-2">
              {speakersList.map((speaker, index) => (
                <div key={index} className="flex justify-between items-center mb-1">
                  <span className="text-xs sm:text-sm text-white/90">{speaker.name}</span>
                  <Badge variant="secondary" className="text-xs bg-[#C4A23D]/10 text-[#C4A23D] backdrop-blur-sm">{speaker.country}</Badge>
                </div>
              ))}
            </ScrollArea>
            <Button 
              onClick={startNextSpeaker} 
              className="w-full mt-2 text-xs sm:text-sm bg-[#C4A23D]/10 hover:bg-[#C4A23D]/20 text-[#C4A23D] backdrop-blur-sm transition-colors border border-[#C4A23D]/20"
            >
              {currentSpeaker ? "Next Speaker" : "Start Speaking"}
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-2 flex flex-col bg-white/5 backdrop-blur-sm border-[#C4A23D]/20 shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="p-2 flex justify-between items-center">
            <CardTitle className="text-sm sm:text-base text-[#C4A23D] font-bold">Motions</CardTitle>
            {activeMotion && (
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4 sm:h-5 sm:w-5 text-[#C4A23D]" />
                <span className="text-sm sm:text-base font-bold text-[#C4A23D]">
                  {Math.floor(debateTimeRemaining / 60)}:{(debateTimeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-2 flex-grow">
            <ScrollArea className="h-full pr-2">
              <div className={`grid gap-2 ${motions.length > 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {motions.map((motion) => (
                  <div key={motion.id} className="p-2 bg-white/10 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-xs sm:text-sm text-white/90">{motion.type}</span>
                      <Badge className="text-xs bg-[#C4A23D]/10 text-[#C4A23D] backdrop-blur-sm">{motion.proposedBy}</Badge>
                    </div>
                    {motion.duration && <p className="text-xs text-white/70">Duration: {motion.duration} min</p>}
                    {motion.topic && <p className="text-xs text-white/70">Topic: {motion.topic}</p>}
                    <div className="flex justify-between items-center mt-2">
                      <Button 
                        onClick={() => passMotion(motion)}
                        disabled={isCrisisMode}
                        className={`text-xs sm:text-sm ${
                          motion.passed ? 'bg-green-600 hover:bg-green-700' : 'bg-[#C4A23D]/10 hover:bg-[#C4A23D]/20'
                        } text-white backdrop-blur-sm transition-colors border border-[#C4A23D]/20 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {motion.passed ? <Check className="h-4 w-4" /> : 'Pass Motion'}
                      </Button>
                      <Button 
                        onClick={() => startDebate(motion)}
                        disabled={!motion.passed || activeMotion !== null || isCrisisMode}
                        className="text-xs sm:text-sm bg-[#C4A23D]/10 hover:bg-[#C4A23D]/20 text-[#C4A23D] backdrop-blur-sm transition-colors border border-[#C4A23D]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {activeMotion?.id === motion.id ? 'Debate in Progress' : 'Start Debate'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="mt-2">
        <Button
          onClick={advanceStage}
          className="w-full bg-[#C4A23D]/10 hover:bg-[#C4A23D]/20 text-white backdrop-blur-sm transition-colors border border-[#C4A23D]/20"
        >
          Advance Stage
        </Button>
      </div>
    </div>
  )
}

export default MunConferenceDisplay

