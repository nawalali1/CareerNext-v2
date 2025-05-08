// src/components/CVBuilder.js
"use client";

import React, { useReducer, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import Toolbar from './Toolbar';
import SectionEditor from './SectionEditor';
import Preview from './Preview';
import StepIndicator from './StepIndicator';

// Your section templates
const TEMPLATES = {
  personal: { id: 'personal', title: 'Contact Details' },
  summary:  { id: 'summary',  title: 'Professional Summary', content: '<p>Your summary...</p>' },
  // add more (experience, education, skills) here if you like
};

// Define the _shape_ of your state and a name for the initial value
const initialState = {
  sections: [
    {
      key: 'personal-0',
      ...TEMPLATES.personal,
      fields: [
        { key: 'name',  label: 'Name',  value: '' },
        { key: 'email', label: 'Email', value: '' },
        { key: 'phone', label: 'Phone', value: '' },
      ],
    },
    { key: 'summary-0', ...TEMPLATES.summary },
  ],
  activeKey: 'personal-0',
};

// A reducer that always returns a valid state (never `undefined`)
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'REORDER': {
      const items = Array.from(state.sections);
      const [moved] = items.splice(action.payload.sourceIndex, 1);
      items.splice(action.payload.destIndex, 0, moved);
      return { ...state, sections: items };
    }
    case 'SELECT':
      return { ...state, activeKey: action.payload };
    case 'ADD_SECTION': {
      const key = `custom-${Date.now()}`;
      return {
        ...state,
        sections: [
          ...state.sections,
          { key, id: 'custom', title: 'New Section', content: '<p>Content…</p>' }
        ],
        activeKey: key,
      };
    }
    case 'REMOVE_SECTION': {
      const filtered = state.sections.filter(s => s.key !== action.payload);
      const newActive =
        state.activeKey === action.payload && filtered.length
          ? filtered[0].key
          : state.activeKey;
      return { ...state, sections: filtered, activeKey: newActive };
    }
    case 'TITLE_CHANGE':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.key === action.payload.key
            ? { ...s, title: action.payload.title }
            : s
        ),
      };
    case 'CONTENT_CHANGE':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.key === action.payload.key
            ? { ...s, content: action.payload.content }
            : s
        ),
      };
    case 'FIELD_CHANGE':
      return {
        ...state,
        sections: state.sections.map(s => {
          if (s.key !== action.payload.secKey) return s;
          return {
            ...s,
            fields: s.fields.map(f =>
              f.key === action.payload.fieldKey
                ? { ...f, value: action.payload.value }
                : f
            ),
          };
        }),
      };
    case 'ADD_FIELD':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.key === action.payload
            ? {
                ...s,
                fields: [
                  ...s.fields,
                  { key: `field-${Date.now()}`, label: 'Custom', value: '' },
                ],
              }
            : s
        ),
      };
    default:
      // VERY IMPORTANT: always return state if action unhandled
      return state;
  }
}

export default function CVBuilder() {
  // Initialize reducer with our initialState
  const [state, dispatch] = useReducer(reducer, initialState);
  const [step, setStep]  = useState(0);
  const previewRef       = useRef();

  // Now state.sections can never be undefined
  const steps = state.sections;
  const currentSection = steps[step];

  // PDF download logic unchanged
  const downloadPDF = async () => {
    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const img    = canvas.toDataURL('image/png');
    const pdf    = new jsPDF('p','pt','a4');
    const w      = pdf.internal.pageSize.getWidth();
    const h      = (canvas.height * w) / canvas.width;
    pdf.addImage(img, 'PNG', 0, 0, w, h);
    pdf.save('My_CV.pdf');
  };

  return (
    <div className="cv-builder-container">
      <Toolbar />

      {/* Stepper */}
      <div className="builder-header">
        <StepIndicator steps={steps} current={step} />
      </div>

      <div className="builder-body">
        {/* Left: form panel */}
        <aside className="form-panel">
          <SectionEditor
            section={currentSection}
            onContentChange={(key, content) =>
              dispatch({ type: 'CONTENT_CHANGE', payload: { key, content } })
            }
            onFieldChange={(secKey, fieldKey, value) =>
              dispatch({ type: 'FIELD_CHANGE', payload: { secKey, fieldKey, value } })
            }
            onAddField={(secKey) =>
              dispatch({ type: 'ADD_FIELD', payload: secKey })
            }
          />

          <div className="form-nav">
            <button
              disabled={step === 0}
              onClick={() => setStep(s => Math.max(0, s - 1))}
            >
              Back
            </button>
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)}>Next</button>
            ) : (
              <button onClick={downloadPDF}>Download CV</button>
            )}
          </div>
        </aside>

        {/* Right: live preview */}
        <div className="preview-panel" ref={previewRef}>
          <Preview
            sections={state.sections}
            activeKey={currentSection.key}
            renderActive={() => (
              <SectionEditor
                section={currentSection}
                onContentChange={(key, content) =>
                  dispatch({ type: 'CONTENT_CHANGE', payload: { key, content } })
                }
                onFieldChange={(secKey, fieldKey, value) =>
                  dispatch({ type: 'FIELD_CHANGE', payload: { secKey, fieldKey, value } })
                }
                onAddField={(secKey) =>
                  dispatch({ type: 'ADD_FIELD', payload: secKey })
                }
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
