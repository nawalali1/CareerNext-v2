// src/components/Results.js
import { useRouter } from 'next/router'

export default function Results() {
  const router = useRouter()
  const { answers } = router.query
  const parsed = answers ? JSON.parse(answers) : []

  // your existing logic for filtering/displaying results based on parsed[]

  return (
    <div className="results-container">
      <h2>Your Career Matches</h2>
      {/* map over your matches here */}
      <button onClick={() => router.push('/')}>Back to Home</button>
    </div>
  )
}
