// src/components/CVBuilder.js
import React, { useState } from 'react';


function CVBuilder() {
  const [cvContent, setCvContent] = useState(`
    <h2>Your Name</h2>
    <p class="faded">Professional Summary...</p>
  `);

  const insertSection = (section) => {
    let block = '';
    switch (section) {
      case 'summary':
        block = `<h3>Professional Summary</h3><p>A motivated and adaptable professional seeking...</p>`;
        break;
      case 'education':
        block = `<h3>Education</h3><ul><li>B.A. in English — University X (2015-2019)</li></ul>`;
        break;
      case 'experience':
        block = `<h3>Experience</h3><ul><li>Software Engineer at Acme Corp (2019-2022)</li></ul>`;
        break;
      case 'skills':
        block = `<h3>Skills</h3><p>JavaScript | React | Node.js | Python</p>`;
        break;
      default:
        block = '';
    }
    setCvContent((prev) => prev + block);
  };

  const downloadPDF = () => {
    const element = document.createElement('a');
    const file = new Blob([cvContent], { type: 'application/pdf' });
    element.href = URL.createObjectURL(file);
    element.download = 'My_CV.pdf';
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="cv-builder">
      <div className="cv-sidebar">
        <h2>Build Your CV</h2>
        <button onClick={() => insertSection('summary')}>Add Summary</button>
        <button onClick={() => insertSection('education')}>Add Education</button>
        <button onClick={() => insertSection('experience')}>Add Experience</button>
        <button onClick={() => insertSection('skills')}>Add Skills</button>
        <button onClick={downloadPDF} className="download-btn">
          Download PDF
        </button>
      </div>

      <div className="cv-preview">
        <div
          className="cv-content"
          dangerouslySetInnerHTML={{ __html: cvContent }}
        />
        <img
          src="/ai-hand.png"
          alt="AI Assistant Hand"
          className="assistant-hand-static"
        />
      </div>
    </div>
  );
}

export default CVBuilder;
