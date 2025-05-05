// src/components/CVBuilder.js

import React, { useState, useRef, useEffect } from "react";
import ChatPanel from "./ChatPanel";

function AccordionSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`acc-section ${open ? "open" : ""}`}>
      <div className="acc-header" onClick={() => setOpen(!open)}>
        <h3>{title}</h3>
        <span>{open ? "−" : "+"}</span>
      </div>
      {open && <div className="acc-content">{children}</div>}
    </div>
  );
}

export default function CVBuilder() {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");
  const [experience, setExperience] = useState([""]);
  const [education, setEducation] = useState([""]);
  const [skills, setSkills] = useState([""]);

  // Chat toggle
  const [showChat, setShowChat] = useState(true);

  // Paper ref & sync
  const paperRef = useRef(null);
  const buildHTML = () => `
    <h1>${name || "Your Name"}</h1>
    <p class="contact">${email || "email@example.com"} | ${phone || "000-000-0000"}</p>
    <section><h2>Professional Summary</h2><p>${summary}</p></section>
    <section><h2>Experience</h2><ul>${experience
      .filter((e) => e)
      .map((e) => `<li>${e}</li>`)
      .join("")}</ul></section>
    <section><h2>Education</h2><ul>${education
      .filter((e) => e)
      .map((e) => `<li>${e}</li>`)
      .join("")}</ul></section>
    <section><h2>Skills</h2><ul class="skills-list">${skills
      .filter((s) => s)
      .map((s) => `<li>${s}</li>`)
      .join("")}</ul></section>
  `;
  useEffect(() => {
    if (paperRef.current) paperRef.current.innerHTML = buildHTML();
  }, [name, email, phone, summary, experience, education, skills]);

  // List handlers
  const listHandler = (list, setList) => (i, val) => {
    const copy = [...list];
    copy[i] = val;
    setList(copy);
  };
  const addItem = (setList) => () => setList((l) => [...l, ""]);
  const removeItem = (list, setList) => (i) =>
    setList(list.filter((_, idx) => idx !== i));

  // Grid columns
  const gridCols = showChat
    ? "240px 1fr 280px"
    : "240px 1fr";

  return (
    <div
      className="cvbuilder-page"
      style={{ gridTemplateColumns: gridCols }}
    >
      {/* LEFT: Accordion CV Editor */}
      <div className="cvbuilder-left">
        <h2>CV Editor</h2>

        <AccordionSection title="Personal Details">
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Phone
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
        </AccordionSection>

        <AccordionSection title="Professional Summary">
          <textarea
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="A brief summary about yourself..."
          />
        </AccordionSection>

        <AccordionSection title="Experience">
          {experience.map((exp, i) => (
            <div key={i} className="exp-row">
              <input
                type="text"
                value={exp}
                onChange={(e) =>
                  listHandler(experience, setExperience)(i, e.target.value)
                }
                placeholder="Company — Role (Year–Year)"
              />
              <button
                onClick={() => removeItem(experience, setExperience)(i)}
              >
                ✕
              </button>
            </div>
          ))}
          <button onClick={addItem(setExperience)}>+ Add Experience</button>
        </AccordionSection>

        <AccordionSection title="Education">
          {education.map((ed, i) => (
            <div key={i} className="exp-row">
              <input
                type="text"
                value={ed}
                onChange={(e) =>
                  listHandler(education, setEducation)(i, e.target.value)
                }
                placeholder="Degree — Institution (Year–Year)"
              />
              <button
                onClick={() => removeItem(education, setEducation)(i)}
              >
                ✕
              </button>
            </div>
          ))}
          <button onClick={addItem(setEducation)}>+ Add Education</button>
        </AccordionSection>

        <AccordionSection title="Skills">
          {skills.map((sk, i) => (
            <div key={i} className="exp-row">
              <input
                type="text"
                value={sk}
                onChange={(e) =>
                  listHandler(skills, setSkills)(i, e.target.value)
                }
                placeholder="e.g. JavaScript"
              />
              <button onClick={() => removeItem(skills, setSkills)(i)}>
                ✕
              </button>
            </div>
          ))}
          <button onClick={addItem(setSkills)}>+ Add Skill</button>
        </AccordionSection>
      </div>

      {/* CENTER: Live CV “paper” */}
      <div className="cvbuilder-center">
        <div ref={paperRef} className="cvbuilder-paper" />
      </div>

      {/* RIGHT: Collapsible Chat */}
      {showChat ? (
        <div className="cvbuilder-right">
          <div className="panel-header">
            <h2>AI CV Coach</h2>
            <button
              className="toggle-btn"
              onClick={() => setShowChat(false)}
            >
              ↔
            </button>
          </div>
          <ChatPanel />
        </div>
      ) : (
        <button
          className="tab-btn right-tab"
          onClick={() => setShowChat(true)}
        >
          AI CV Coach
        </button>
      )}
    </div>
  );
}
