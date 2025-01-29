import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom"
import MUNConferenceDisplay from "./components/mun-conference-display"
import { committeeData } from "./data/committee-data"
import "./index.css"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:committee" element={<CommitteePage />} />
        <Route
          path="/"
          element={
            <main className="h-screen w-screen overflow-hidden bg-[#2B4170]">
              <MUNConferenceDisplay />
            </main>
          }
        />
      </Routes>
    </Router>
  )
}

function CommitteePage() {
  const { committee } = useParams()
  const upperCommittee = committee?.toUpperCase() || ""

  if (!committeeData[upperCommittee]) {
    return <Navigate to="/" />
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#2B4170]">
      <MUNConferenceDisplay initialCommittee={upperCommittee} />
    </main>
  )
}

