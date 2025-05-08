// src/components/CVBuilder.js
"use client";

import React, { useReducer, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF        from 'jspdf';

import Toolbar     from './Toolbar';
import SectionEditor from './SectionEditor';
import Preview       from './Preview';
import StepIndicator from './StepIndicator';
import Sidebar       from './Sidebar';    // ← NEW!

// Extend your templates to cover all the IDs Sidebar will use
const TEMPLATES = {
  personal:   { id: 'personal',   title: 'Contact Details',    fields: [
                  { key: 'name', label: 'Name', value: '' },
                  { key: 'email',label: 'Email',value: '' },
                  { key: 'phone',label: 'Phone',value: '' },
              ] },
  summary:    { id: 'summary',    title: 'Professional Summary', content: '<p>Your summary…</p>' },
  education:  { id: 'education',  title: 'Education',            content: '<p>Your education details…</p>' },
  experience: { id: 'experience', title: 'Experience',           content: '<p>Your experience details…</p>' },
  skills:     { id: 'skills',     title: 'Skills',               content: '<p>Your skills…</p>' },
};

// initial state now driven by TEMPLATES
const initialState = {
  sections: [
    { key: 'personal-0',   ...TEMPLATES.personal },
    { key: 'summary-0',    ...TEMPLATES.summary },
  ],
  activeKey: 'personal-0',
};

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
      // payload is the template ID (e.g. 'education', 'experience', etc.)
      const tplId = action.payload;
      const tpl   = TEMPLATES[tplId] || { id: 'custom', title: 'New Section', content: '<p>New…</p>' };
      const key   = `${tplId}-${Date.now()}`;
      // Personal template has fields, other templates use content
      const section = tpl.fields
        ? { key, ...tpl }
        : { key, id: tpl.id, title: tpl.title, content: tpl.content };
      return {
        ...state,
        sections: [...state.sections, section],
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
      return state;
  }
}

export default function CVBuilder() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [step, setStep]   = useState(0);
  const previewRef        = useRef();

  const steps = state.sections;
  const currentSection = steps[step];

  // PDF download
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

      <div className="builder-header">
        <StepIndicator steps={steps} current={step} />
      </div>

      <div className="builder-body">
        {/* ← REPLACE your old form-panel with Sidebar */}
        <Sidebar
          sections={state.sections}
          activeKey={state.activeKey}
          onSelect={(key) => {
            const idx = state.sections.findIndex(s => s.key === key);
            if (idx >= 0) setStep(idx);
            dispatch({ type: 'SELECT', payload: key });
          }}
          onReorder={({ sourceIndex, destIndex }) =>
            dispatch({ type: 'REORDER', payload: { sourceIndex, destIndex } })
          }
          onAddSection={(tplId) => dispatch({ type: 'ADD_SECTION', payload: tplId })}
          onRemoveSection={(key) => dispatch({ type: 'REMOVE_SECTION', payload: key })}
          onTitleChange={(key, title) =>
            dispatch({ type: 'TITLE_CHANGE', payload: { key, title } })
          }
          onDownload={downloadPDF}
          theme="light"  // or "dark"
        />

        <div className="preview-panel" ref={previewRef}>
          <Preview
            sections={state.sections}
            activeKey={currentSection.key}
            renderActive={() => (
              <SectionEditor
                section={currentSection}
                onContentChange={(k, c) =>
                  dispatch({ type: 'CONTENT_CHANGE', payload: { key: k, content: c } })
                }
                onFieldChange={(secKey, fieldKey, v) =>
                  dispatch({ type: 'FIELD_CHANGE', payload: { secKey, fieldKey, value: v } })
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
