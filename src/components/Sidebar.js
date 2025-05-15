// src/components/Sidebar.js
"use client";

import React from 'react';
import PropTypes from 'prop-types';
import 'react-quill/dist/quill.snow.css';

import dynamic from 'next/dynamic';
import {
  FiPlus,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function Sidebar({
  steps,
  currentStep,
  onChangeStep,
  onDownload,

  contact,
  onContactChange,
  onAddContact,

  summary,
  onSummaryChange,

  quals,
  onAddQual,
  onUpdateQual,
  onRemoveQual,
}) {
  const isFirst = currentStep === 0;
  const isLast  = currentStep === steps.length - 1;

  const handleContactChange = (field) => (e) => {
    onContactChange(field, e.target.value);
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };
  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet',
    'link', 'image',
  ];

  return (
    <aside className="cv-sidebar">
      {/* Wizard Nav */}
      <div className="sidebar-wizard-header">
        <button
          onClick={() => !isFirst && onChangeStep(currentStep - 1)}
          disabled={isFirst}
          aria-label="Previous step"
        >
          <FiChevronLeft size={20}/>
        </button>
        <h2>{steps[currentStep].title}</h2>
        <button
          onClick={() => !isLast && onChangeStep(currentStep + 1)}
          disabled={isLast}
          aria-label="Next step"
        >
          <FiChevronRight size={20}/>
        </button>
      </div>

      {/* Step Content */}
      <div className="sidebar-content">
        {/* Step 0: Contact Info with placeholders (no subheading) */}
        {currentStep === 0 && (
          <div className="sidebar-section">
            {['name','email','phone','address'].map((f) => (
              <div key={f} className="form-row">
                <input
                  id={f}
                  type={f==='email'?'email':f==='phone'?'tel':'text'}
                  placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                  value={contact[f] || ''}
                  onChange={handleContactChange(f)}
                />
              </div>
            ))}

            {onAddContact && (
              <button
                className="add-contact-btn"
                onClick={onAddContact}
              >
                <FiPlus /> Add Field
              </button>
            )}
          </div>
        )}

        {/* Step 1: Professional Summary */}
        {currentStep === 1 && (
          <div className="sidebar-section">
            <h3 className="sidebar-section__title">Professional Summary</h3>
            <ReactQuill
              theme="snow"
              value={summary}
              onChange={onSummaryChange}
              modules={quillModules}
              formats={quillFormats}
              placeholder="Write a 2–3 sentence summary…"
            />
          </div>
        )}

        {/* Step 2: Qualifications */}
        {currentStep === 2 && (
          <div className="sidebar-section">
            <h3 className="sidebar-section__title">Qualifications</h3>
            {quals.map((q) => (
              <div key={q.id} className="qual-section">
                <button
                  className="remove-qual-btn"
                  onClick={() => onRemoveQual(q.id)}
                  aria-label="Remove qualification"
                >
                  ×
                </button>
                <input
                  className="qual-title-input"
                  value={q.title}
                  onChange={e => onUpdateQual(q.id, 'title', e.target.value)}
                  placeholder="Qualification Title"
                />
                <ReactQuill
                  theme="snow"
                  value={q.content}
                  onChange={content => onUpdateQual(q.id, 'content', content)}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Enter details…"
                />
              </div>
            ))}
            <button className="add-qual-btn" onClick={onAddQual}>
              <FiPlus /> Add Section
            </button>
          </div>
        )}
      </div>

      {/* Footer: Download PDF */}
      <div className="sidebar-footer">
        <button className="download-btn" onClick={onDownload}>
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
  onAddContact:    PropTypes.func,

  summary:         PropTypes.string.isRequired,
  onSummaryChange: PropTypes.func.isRequired,

  quals:           PropTypes.array.isRequired,
  onAddQual:       PropTypes.func.isRequired,
  onUpdateQual:    PropTypes.func.isRequired,
  onRemoveQual:    PropTypes.func.isRequired,
};
