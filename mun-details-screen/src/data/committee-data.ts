import { Speaker, Motion } from '../types/mun-types'

interface CommitteeData {
  fullName: string
  topic: string
  subTopic: string
  speakers: Speaker[]
  motions: Motion[]
}

export const committeeData: Record<string, CommitteeData> = {
  UNSC: {
    fullName: "United Nations Security Council",
    topic: "Global Security Challenges",
    subTopic: "Cybersecurity Threats",
    speakers: [
      { name: "Delegate of USA", country: "USA", timeRemaining: 120 },
      { name: "Delegate of China", country: "China", timeRemaining: 120 },
      { name: "Delegate of Russia", country: "Russia", timeRemaining: 120 },
    ],
    motions: [
      { id: 1, type: "Formal Debate", proposedBy: "France", duration: 10, topic: "Cybersecurity Cooperation" },
      { id: 2, type: "Informal Debate", proposedBy: "UK", duration: 15 },
      { id: 3, type: "Moderated Caucus", proposedBy: "Germany", duration: 20, topic: "Cyber Attack Prevention" },
    ],
  },
  UNGA: {
    fullName: "United Nations General Assembly",
    topic: "Sustainable Development",
    subTopic: "Climate Action",
    speakers: [
      { name: "Delegate of Brazil", country: "Brazil", timeRemaining: 180 },
      { name: "Delegate of India", country: "India", timeRemaining: 180 },
      { name: "Delegate of Nigeria", country: "Nigeria", timeRemaining: 180 },
    ],
    motions: [
      { id: 1, type: "Formal Debate", proposedBy: "Germany", duration: 15, topic: "Renewable Energy Transition" },
      { id: 2, type: "Unmoderated Caucus", proposedBy: "Japan", duration: 10 },
      { id: 3, type: "Moderated Caucus", proposedBy: "Australia", duration: 20, topic: "Climate Finance" },
    ],
  },
  WHO: {
    fullName: "World Health Organization",
    topic: "Global Health Emergencies",
    subTopic: "Pandemic Preparedness",
    speakers: [
      { name: "Delegate of South Korea", country: "South Korea", timeRemaining: 150 },
      { name: "Delegate of Italy", country: "Italy", timeRemaining: 150 },
      { name: "Delegate of Canada", country: "Canada", timeRemaining: 150 },
    ],
    motions: [
      { id: 1, type: "Formal Debate", proposedBy: "Switzerland", duration: 12, topic: "Vaccine Distribution" },
      { id: 2, type: "Informal Debate", proposedBy: "Sweden", duration: 18 },
      { id: 3, type: "Moderated Caucus", proposedBy: "Mexico", duration: 15, topic: "Healthcare System Resilience" },
    ],
  },
  UNHRC: {
    fullName: "United Nations Human Rights Council",
    topic: "Protection of Human Rights",
    subTopic: "Digital Privacy and Surveillance",
    speakers: [
      { name: "Delegate of Netherlands", country: "Netherlands", timeRemaining: 140 },
      { name: "Delegate of Argentina", country: "Argentina", timeRemaining: 140 },
      { name: "Delegate of South Africa", country: "South Africa", timeRemaining: 140 },
    ],
    motions: [
      { id: 1, type: "Formal Debate", proposedBy: "Denmark", duration: 10, topic: "Data Protection Laws" },
      { id: 2, type: "Unmoderated Caucus", proposedBy: "Spain", duration: 15 },
      { id: 3, type: "Moderated Caucus", proposedBy: "New Zealand", duration: 20, topic: "Government Surveillance Oversight" },
    ],
  },
  UNEP: {
    fullName: "United Nations Environment Programme",
    topic: "Environmental Conservation",
    subTopic: "Marine Pollution",
    speakers: [
      { name: "Delegate of Norway", country: "Norway", timeRemaining: 160 },
      { name: "Delegate of Indonesia", country: "Indonesia", timeRemaining: 160 },
      { name: "Delegate of Costa Rica", country: "Costa Rica", timeRemaining: 160 },
    ],
    motions: [
      { id: 1, type: "Formal Debate", proposedBy: "Finland", duration: 15, topic: "Plastic Waste Reduction" },
      { id: 2, type: "Informal Debate", proposedBy: "Chile", duration: 12 },
      { id: 3, type: "Moderated Caucus", proposedBy: "Kenya", duration: 18, topic: "Ocean Ecosystem Protection" },
    ],
  },
}

