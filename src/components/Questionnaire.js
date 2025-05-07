import React, { useState } from "react";
import { useRouter } from "next/router";


const QUESTIONS = [
  {
    prompt: "What matters most to you in a job?",
    options: [
      "Autonomy to make my own decisions",
      "Impact and positive change for others",
      "Financial stability and security",
      "Creative freedom to innovate",
      "Work–life balance and flexibility",
      "Recognition and professional status",
    ],
  },
  {
    prompt: "Which activity consistently makes you lose track of time?",
    options: [
      "Solving complex puzzles or challenges",
      "Teaching, mentoring, or coaching someone",
      "Designing or crafting something new",
      "Researching data to uncover insights",
      "Writing or storytelling",
      "Negotiating or persuading others",
    ],
  },
  {
    prompt: "When you face a tough problem, what’s your go-to approach?",
    options: [
      "Thoroughly researching and planning before acting",
      "Diving in and learning by doing",
      "Gathering others’ perspectives and collaborating",
      "Brainstorming creative, out-of-the-box solutions",
      "Analyzing data and evidence",
      "Consulting experts and mentors",
    ],
  },
  {
    prompt: "Which work environment energizes you most?",
    options: [
      "A fast-paced startup with shifting priorities",
      "A structured corporate setting with clear processes",
      "A creative studio or agency full of visual thinkers",
      "An academic or research lab focused on deep inquiry",
      "A remote, distributed team model",
      "On-site field work or hands-on projects",
    ],
  },
  {
    prompt: "What drives you to keep going when the work gets tough?",
    options: [
      "The satisfaction of personal growth and mastery",
      "Knowing I’m making a real difference for others",
      "The thrill of creating something beautiful or original",
      "The excitement of discovering new knowledge",
      "Achieving goals and earning recognition",
      "Solving urgent crises under pressure",
    ],
  },
  {
    prompt: "If you had unlimited resources, what project would you pour your energy into?",
    options: [
      "Building cutting-edge technology that transforms lives",
      "Developing a mentorship program to uplift others",
      "Leading a bold design campaign that shifts perceptions",
      "Conducting groundbreaking research in a field I love",
      "Launching a global community initiative",
      "Crafting transformative public policy projects",
    ],
  },
];

export default function Questionnaire() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(""));
  const router = useRouter();

  const handleSelect = (opt) => {
    const copy = [...answers];
    copy[current] = opt;
    setAnswers(copy);
  };

  const goNext = () => {
    if (!answers[current]) return;
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      localStorage.setItem("cn_answers", JSON.stringify(answers));
      router.push("/loading");
    }
  };

  const goBack = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const progress = ((current + 1) / QUESTIONS.length) * 100;

  return (
    <div className="questionnaire-container">
      <div className="question-header">
        <span className="step-indicator">
          Question {current + 1} of {QUESTIONS.length}
        </span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="question-card">
        <h2 className="question-prompt">{QUESTIONS[current].prompt}</h2>
        <div className="options-list" role="radiogroup">
          {QUESTIONS[current].options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className={
                answers[current] === opt
                  ? "option-btn selected"
                  : "option-btn"
              }
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="nav-buttons">
        <button
          onClick={goBack}
          disabled={current === 0}
          className="nav-btn back"
        >
          ← Back
        </button>
        <button
          onClick={goNext}
          disabled={!answers[current]}
          className="nav-btn next"
        >
          {current < QUESTIONS.length - 1 ? "Next →" : "Submit"}
        </button>
      </div>
    </div>
  );
}
