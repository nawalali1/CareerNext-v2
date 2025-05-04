import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { jsPDF } from 'jspdf';
import './CVBuilder.css';

const defaultData = {
  fullName: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  experience: [{ company: '', role: '', period: '', details: '' }],
  education: [{ institution: '', degree: '', year: '' }],
  skills: [''],
};

export default function CVBuilder() {
  const [data, setData] = useState(defaultData);
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const cvRef = useRef();

  useEffect(() => {
    const saved = localStorage.getItem('careerNextCV');
    if (saved) setData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('careerNextCV', JSON.stringify(data));
  }, [data]);

  const handleChange = (section, idx, field, value) => {
    setData(prev => {
      const clone = { ...prev };
      if (Array.isArray(clone[section])) {
        clone[section][idx][field] = value;
      } else {
        clone[section] = value;
      }
      return clone;
    });
  };

  const addItem = section => {
    setData(prev => {
      const clone = { ...prev };
      const template = defaultData[section][0];
      clone[section] = [...clone[section], { ...template }];
      return clone;
    });
  };

  const addSkill = () =>
    setData(prev => ({ ...prev, skills: [...prev.skills, ''] }));

  const downloadPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.html(cvRef.current, {
      callback: () => doc.save('CareerNext_CV.pdf'),
      x: 20,
      y: 20,
      html2canvas: { scale: 0.57 },
    });
  };

  const generateCVContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generatecv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      const result = await response.json();

      if (response.ok) {
        setGeneratedText(result.generatedText);
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert('Failed to generate CV text');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="cv-builder">
        <div className="cv-sidebar">
          <h2>Your Details</h2>
          <label>Full Name</label>
          <input
            value={data.fullName}
            onChange={e => handleChange('fullName', null, null, e.target.value)}
          />
          <label>Title</label>
          <input
            value={data.title}
            onChange={e => handleChange('title', null, null, e.target.value)}
          />
          <label>Email</label>
          <input
            value={data.email}
            onChange={e => handleChange('email', null, null, e.target.value)}
          />
          <label>Phone</label>
          <input
            value={data.phone}
            onChange={e => handleChange('phone', null, null, e.target.value)}
          />
          <label>Location</label>
          <input
            value={data.location}
            onChange={e => handleChange('location', null, null, e.target.value)}
          />

          <h3>Experience</h3>
          {data.experience.map((exp, i) => (
            <div key={i}>
              <input placeholder="Company" value={exp.company} onChange={e => handleChange('experience', i, 'company', e.target.value)} />
              <input placeholder="Role" value={exp.role} onChange={e => handleChange('experience', i, 'role', e.target.value)} />
              <input placeholder="Period" value={exp.period} onChange={e => handleChange('experience', i, 'period', e.target.value)} />
              <textarea placeholder="Details" value={exp.details} onChange={e => handleChange('experience', i, 'details', e.target.value)} />
            </div>
          ))}
          <button onClick={() => addItem('experience')}>+ Experience</button>

          <h3>Education</h3>
          {data.education.map((edu, i) => (
            <div key={i}>
              <input placeholder="Institution" value={edu.institution} onChange={e => handleChange('education', i, 'institution', e.target.value)} />
              <input placeholder="Degree" value={edu.degree} onChange={e => handleChange('education', i, 'degree', e.target.value)} />
              <input placeholder="Year" value={edu.year} onChange={e => handleChange('education', i, 'year', e.target.value)} />
            </div>
          ))}
          <button onClick={() => addItem('education')}>+ Education</button>

          <h3>Skills</h3>
          {data.skills.map((skill, i) => (
            <input key={i} placeholder="Skill" value={skill} onChange={e => {
              const newSkills = [...data.skills];
              newSkills[i] = e.target.value;
              setData(prev => ({ ...prev, skills: newSkills }));
            }} />
          ))}
          <button onClick={addSkill}>+ Skill</button>

          <button className="generate-btn" onClick={generateCVContent} disabled={loading}>
            {loading ? 'Generating...' : 'Generate CV Content'}
          </button>

          <button className="download-btn" onClick={downloadPDF}>
            Download PDF
          </button>
        </div>

        <div className="cv-preview" ref={cvRef}>
          <div className="cv-content">
            <h1>{data.fullName || 'Your Name'}</h1>
            <h2>{data.title || 'Professional Title'}</h2>
            <p>{data.email} | {data.phone} | {data.location}</p>

            {generatedText && (
              <section className="ai-generated-section">
                <h3>AI-Generated CV Content</h3>
                <p>{generatedText}</p>
              </section>
            )}

            <h3>Experience</h3>
            {data.experience.map((exp, i) => (
              <div key={i}>
                <strong>{exp.role}</strong> @ {exp.company} ({exp.period})
                <p>{exp.details}</p>
              </div>
            ))}

            <h3>Education</h3>
            {data.education.map((edu, i) => (
              <div key={i}>
                <strong>{edu.degree}</strong>, {edu.institution} ({edu.year})
              </div>
            ))}

            <h3>Skills</h3>
            <ul>{data.skills.filter(Boolean).map((skill, i) => <li key={i}>{skill}</li>)}</ul>
          </div>
        </div>
      </div>
    </>
  );
}
