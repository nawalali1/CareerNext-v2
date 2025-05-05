// src/components/Questionnaire.js
import { useState } from 'react'
import { useRouter } from 'next/router'

const questions = [
  {
    question: "Which activity energizes you the most?",
    options: [
      "Solving complex problems",
      "Expressing ideas visually or verbally",
      "Helping others achieve their goals",
      "Organizing systems or processes",
    ],
  },
  // … (rest of your v1 questions array here)
]

export default function Questionnaire() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState(Array(questions.length).fill(null))
  const router = useRouter()

  const handleNext = () => {
    if (current === questions.length - 1) {
      router.push({
        pathname: '/results',
        query: { answers: JSON.stringify(answers) },
      })
    } else {
      setCurrent((c) => c + 1)
    }
  }

  const handleBack = () => {
    if (current > 0) setCurrent((c) => c - 1)
  }

  const selectOption = (opt) => {
    const newAns = [...answers]
    newAns[current] = opt
    setAnswers(newAns)
  }

  return (
    <div className="questionnaire-container">
      <h2>{questions[current].question}</h2>
      <div className="options-list">
        {questions[current].options.map((option) => (
          <label key={option}>
            <input
              type="radio"
              name="option"
              checked={answers[current] === option}
              onChange={() => selectOption(option)}
            />
            {option}
          </label>
        ))}
      </div>
      <div className="navigation-buttons">
        <button onClick={handleBack} disabled={current === 0}>
          Back
        </button>
        <button onClick={handleNext}>
          {current === questions.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  )
}
