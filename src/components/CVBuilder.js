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
  // contact fields
  contact: { name: '', email: '', phone: '', address: '' },
  // single summary field
  summary: '',
  // quals: can add/remove custom sections on top of these three
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
      <Toolbar />

      <div className="builder-body">
        <Sidebar
          steps          ={WIZARD_STEPS}
          currentStep    ={step}
          onChangeStep   ={setStep}
          onDownload     ={downloadPDF}
          // For contact fields
          contact        ={state.contact}
          onContactChange={(f,v)=>dispatch({ type:'UPDATE_CONTACT', field:f, value:v })}
          // For professional summary
          summary        ={state.summary}
          onSummaryChange={v=>dispatch({ type:'UPDATE_SUMMARY', value:v })}
          // For qualifications
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
