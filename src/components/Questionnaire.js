import React, { useState } from "react";
import { useRouter } from "next/router";

const questions = [
  {
    text: "What type of work feels the most fulfilling to you?",
    options: [
      "Solving complex problems or puzzles",
      "Helping others improve or grow",
      "Leading and making decisions",
      "Creating or building things",
      "Organizing systems or data",
      "Exploring new ideas or technologies",
    ],
  },
  {
    text: "What kind of day-to-day work environment energizes you most?",
    options: [
      "Fast-paced and dynamic",
      "Calm, steady, and predictable",
      "Collaborative and social",
      "Independent and quiet",
      "Structured with clear expectations",
      "Flexible and constantly changing",
    ],
  },
  {
    text: "Which of these activities sounds most appealing long-term?",
    options: [
      "Developing software or digital tools",
      "Managing people and leading teams",
      "Conducting research and writing reports",
      "Planning logistics or organizing workflows",
      "Teaching, coaching, or mentoring",
      "Designing, building, or crafting creative solutions",
    ],
  },
  {
    text: "What motivates you most at work?",
    options: [
      "Making a positive social impact",
      "Earning a high income",
      "Job stability and security",
      "Autonomy and creative control",
      "Recognition and upward mobility",
      "Solving important, challenging problems",
    ],
  },
  {
    text: "How do you prefer to make decisions?",
    options: [
      "Based on data, logic, and facts",
      "Based on gut feeling or instinct",
      "By talking things through with others",
      "Through trial-and-error",
      "Slowly, with time and reflection",
      "Quickly, based on past experience",
    ],
  },
  {
    text: "Which industries or fields are you naturally curious about?",
    options: [
      "Technology and software",
      "Healthcare or mental health",
      "Education or training",
      "Business or finance",
      "Creative industries (design, media, writing)",
      "Government, policy, or law",
    ],
  },
];

function Questionnaire() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));

  const handleSelect = (option) => {
    const updated = [...answers];
    updated[current] = option;
    setAnswers(updated);
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // TODO: save answers if needed
      router.push("/loading");
    }
  };

  const back = () => {
    if (current > 0) setCurrent(current - 1);
  };

  return (
    <div className="questionnaire-container">
      <h2>{questions[current].text}</h2>
      <div className="progress">
        Question {current + 1} of {questions.length}
      </div>

      <div className="options">
        {questions[current].options.map((opt, idx) => (
          <label
            key={idx}
            className={`option ${
              answers[current] === opt ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              name={`q${current}`}
              checked={answers[current] === opt}
              onChange={() => handleSelect(opt)}
            />
            {opt}
          </label>
        ))}
      </div>

      <div className="navigation-buttons">
        <button onClick={back} disabled={current === 0}>
          Back
        </button>
        <button onClick={next} disabled={!answers[current]}>
          {current === questions.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}

export default Questionnaire;
