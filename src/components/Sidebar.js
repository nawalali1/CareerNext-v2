// src/components/Sidebar.js
"use client";

import React from 'react';
import PropTypes from 'prop-types';
import {
  FiPlus,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

export default function Sidebar({
  steps,
  currentStep,
  onChangeStep,
  onDownload,

  contact,
  onContactChange,

  summary,
  onSummaryChange,

  quals,
  onAddQual,
  onUpdateQual,
  onRemoveQual,
}) {
  const isFirst = currentStep === 0;
  const isLast  = currentStep === steps.length - 1;

  return (
    <aside className="cv-sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ─── Wizard Nav ───────────────────────────────────────── */}
      <div className="sidebar-wizard-header" style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #ddd' }}>
        <button onClick={() => !isFirst && onChangeStep(currentStep - 1)} disabled={isFirst} style={{ background: 'none', border: 'none', cursor: isFirst ? 'default' : 'pointer' }}>
          <FiChevronLeft size={20}/>
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>{steps[currentStep].title}</h2>
        <button onClick={() => !isLast && onChangeStep(currentStep + 1)} disabled={isLast} style={{ background: 'none', border: 'none', cursor: isLast ? 'default' : 'pointer' }}>
          <FiChevronRight size={20}/>
        </button>
      </div>

      {/* ─── Step Content ─────────────────────────────────────── */}
      <div className="sidebar-content" style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {currentStep === 0 && (
          <>
            {['name','email','phone','address'].map((f) => (
              <div key={f} className="form-row" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '.25rem' }}>
                  {f.charAt(0).toUpperCase()+f.slice(1)}
                </label>
                <input
                  type={f==='email'?'email':f==='phone'?'tel':'text'}
                  placeholder={`Enter ${f}`}
                  value={contact[f]}
                  onChange={e => onContactChange(f, e.target.value)}
                  style={{ width: '100%', padding: '.5rem', border: '1px solid #ccc', borderRadius: 4 }}
                />
              </div>
            ))}
          </>
        )}

        {currentStep === 1 && (
          <div className="form-row">
            <textarea
              rows={5}
              placeholder="Write a 2–3 sentence summary…"
              value={summary}
              onChange={e => onSummaryChange(e.target.value)}
              style={{ width: '100%', padding: '.5rem', border: '1px solid #ccc', borderRadius:4 }}
            />
          </div>
        )}

        {currentStep === 2 && (
          <>
            {quals.map((q) => (
              <div key={q.id} className="qual-section" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                <input
                  value={q.title}
                  onChange={e => onUpdateQual(q.id, 'title', e.target.value)}
                  placeholder="Section title"
                  style={{ width: '100%', padding: '.5rem', marginBottom: '.5rem', border: '1px solid #ccc', borderRadius:4 }}
                />
                <textarea
                  rows={3}
                  value={q.content}
                  onChange={e => onUpdateQual(q.id, 'content', e.target.value)}
                  placeholder="Enter details…"
                  style={{ width: '100%', padding: '.5rem', border: '1px solid #ccc', borderRadius:4 }}
                />
                <button
                  onClick={() => onRemoveQual(q.id)}
                  style={{ marginTop: '.5rem', background: 'none', border: 'none', color: '#b00', cursor: 'pointer' }}
                >
                  Remove Section
                </button>
              </div>
            ))}

            {/* ← Inline Add Section button for Qualifications */}
            <button
              onClick={onAddQual}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '.5rem',
                background: 'none',
                border: '1px solid #00bcd4',
                color: '#00bcd4',
                padding: '.5rem 1rem',
                borderRadius: 4,
                cursor: 'pointer',
                marginBottom: '1rem',
              }}
            >
              <FiPlus /> Add Section
            </button>
          </>
        )}
      </div>

      {/* ─── Footer: PDF Download ─────────────────────────────── */}
      <div className="sidebar-footer" style={{ padding: '1rem', borderTop: '1px solid #ddd', textAlign: 'right' }}>
        <button
          onClick={onDownload}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: 'none', border: '1px solid #888', padding: '.5rem 1rem', borderRadius:4, cursor:'pointer' }}
        >
          <FiDownload /> Download PDF
        </button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  steps:           PropTypes.array.isRequired,
  currentStep:     PropTypes.number.isRequired,
  onChangeStep:    PropTypes.func.isRequired,
  onDownload:      PropTypes.func.isRequired,

  contact:         PropTypes.object.isRequired,
  onContactChange: PropTypes.func.isRequired,

  summary:         PropTypes.string.isRequired,
  onSummaryChange: PropTypes.func.isRequired,

  quals:           PropTypes.array.isRequired,
  onAddQual:       PropTypes.func.isRequired,
  onUpdateQual:    PropTypes.func.isRequired,
  onRemoveQual:    PropTypes.func.isRequired,
};
