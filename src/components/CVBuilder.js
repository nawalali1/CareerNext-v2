// src/components/CVBuilder.js
"use client";

import React, { useReducer, useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF       from 'jspdf';

import Toolbar       from './Toolbar';
import Sidebar       from './Sidebar';
import SectionEditor from './SectionEditor';
import Preview       from './Preview';

const WIZARD_STEPS = [
  { key: 'contact', title: 'Contact Details' },
  { key: 'summary', title: 'Professional Summary' },
  { key: 'quals',   title: 'Qualifications' },
];

const initialState = {
  contact: { name: '', email: '', phone: '', address: '' },
  summary: '',
  quals: [
    { id: 1, title: 'Education',  content: '' },
    { id: 2, title: 'Experience', content: '' },
    { id: 3, title: 'Skills',     content: '' },
  ],
  nextQualId: 4,
};

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_CONTACT':
      return { ...state, contact: { ...state.contact, [action.field]: action.value } };
    case 'UPDATE_SUMMARY':
      return { ...state, summary: action.value };
    case 'ADD_QUAL':
      return {
        ...state,
        quals: [...state.quals, { id: state.nextQualId, title: 'New Section', content: '' }],
        nextQualId: state.nextQualId + 1,
      };
    case 'UPDATE_QUAL':
      return {
        ...state,
        quals: state.quals.map(q =>
          q.id === action.id ? { ...q, [action.key]: action.value } : q
        ),
      };
    case 'REMOVE_QUAL':
      return { ...state, quals: state.quals.filter(q => q.id !== action.id) };
    default:
      return state;
  }
}

export default function CVBuilder() {
  const [step, setStep] = useState(0);
  const [state, dispatch] = useReducer(reducer, initialState);
  const previewRef = useRef();

  // AI-assistant drawer logic: show every mount after 500ms
  const [showHelper, setShowHelper] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowHelper(true), 500);
    return () => clearTimeout(t);
  }, []);

  const closeHelper = () => {
    setShowHelper(false);
  };

  const downloadPDF = async () => {
    if (!previewRef.current) return;
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
      {/* AI Helper Drawer */}
      <div className={`ai-drawer${showHelper ? ' open' : ''}`}>
        <button className="ai-drawer-close" onClick={closeHelper}>×</button>
        <div className="ai-drawer-content">
          <h3>Need a hand?</h3>
          <p>
            Use the AI Chat Panel to paste a job brief or ask for bullet-points, summaries
            and more, right here while you build your CV!
          </p>
        </div>
      </div>

      <Toolbar />

      <div className="builder-body">
        <Sidebar
          steps          ={WIZARD_STEPS}
          currentStep    ={step}
          onChangeStep   ={setStep}
          onDownload     ={downloadPDF}
          contact        ={state.contact}
          onContactChange={(f,v)=>dispatch({ type:'UPDATE_CONTACT', field:f, value:v })}
          summary        ={state.summary}
          onSummaryChange={v=>dispatch({ type:'UPDATE_SUMMARY', value:v })}
          quals          ={state.quals}
          onAddQual      ={()=>dispatch({ type:'ADD_QUAL' })}
          onUpdateQual   ={(id,key,v)=>dispatch({ type:'UPDATE_QUAL', id, key, value:v })}
          onRemoveQual   ={id=>dispatch({ type:'REMOVE_QUAL', id })}
        />

        <div className="preview-panel" ref={previewRef}>
          <Preview
            contact={state.contact}
            summary={state.summary}
            quals  ={state.quals}
          />
        </div>
      </div>
    </div>
  );
}
