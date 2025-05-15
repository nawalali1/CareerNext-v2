// src/pages/sidebar.js
import React, { useState } from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';

export default function SidebarPage() {
  //define three wizard steps
  const steps = [
    { key: 'contact', title: 'Contact Details' },
    { key: 'summary', title: 'Professional Summary' },
    { key: 'quals',   title: 'Qualifications' },
  ];

  //current step index
  const [currentStep, setCurrentStep] = useState(0);

  //Step 1: contact
  const [contact, setContact] = useState({
    name:    '',
    email:   '',
    phone:   '',
    address: '',
  });
  const onContactChange = (field, value) =>
    setContact(c => ({ ...c, [field]: value }));

  //Step 2: summary
  const [summary, setSummary] = useState('');

  //Step 3: qualifications
  const [quals, setQuals]     = useState([
    { id: 1, title: 'Education',  content: '' },
    { id: 2, title: 'Experience', content: '' },
    { id: 3, title: 'Skills',     content: '' },
  ]);
  const [nextQualId, setNextQualId] = useState(4);

  const onAddQual = () => {
    setQuals(qs => [...qs, { id: nextQualId, title: 'New Section', content: '' }]);
    setNextQualId(id => id + 1);
  };
  const onUpdateQual = (id, key, value) => {
    setQuals(qs => qs.map(q => q.id === id ? { ...q, [key]: value } : q));
  };
  const onRemoveQual = (id) => setQuals(qs => qs.filter(q => q.id !== id));

  //stub download handler
  const onDownload = () => alert('Download PDF…');

  return (
    <>
      <Head>
        <title>Sidebar Preview</title>
      </Head>

      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar
          steps           ={steps}
          currentStep     ={currentStep}
          onChangeStep    ={setCurrentStep}
          onDownload      ={onDownload}

          contact         ={contact}
          onContactChange ={onContactChange}

          summary         ={summary}
          onSummaryChange ={setSummary}

          quals           ={quals}
          onAddQual       ={onAddQual}
          onUpdateQual    ={onUpdateQual}
          onRemoveQual    ={onRemoveQual}
        />

        <main style={{ flex: 1, padding: '2rem' }}>
          <h1>Inspect Sidebar</h1>
          <p>Current step: <strong>{steps[currentStep].title}</strong></p>
          <p>Make edits in the sidebar on the left.</p>
        </main>
      </div>
    </>
  );
}
