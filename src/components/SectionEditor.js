// src/components/SectionEditor.js
import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { FiPlusCircle } from 'react-icons/fi';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function SectionEditor({
  section,
  onContentChange,
  onFieldChange,
  onAddField
}) {
  // ← Guard against undefined
  if (!section) {
    return (
      <div style={{ color: 'var(--color-muted)', padding: '1rem' }}>
        No section to edit. Use the “+ Add” button above to create one.
      </div>
    );
  }

  if (section.id === 'personal') {
    return (
      <div className="personal-form">
        {section.fields.map((f) => (
          <div key={f.key} className="form-row">
            <label>{f.label}</label>
            <input
              value={f.value}
              onChange={(e) => onFieldChange(section.key, f.key, e.target.value)}
            />
          </div>
        ))}
        <button
          className="add-personal-field-btn"
          onClick={() => onAddField(section.key)}
        >
          <FiPlusCircle /> Add Field
        </button>
      </div>
    );
  }

  // Rich‐text editor for any other section
  return (
    <ReactQuill
      theme="snow"
      value={section.content}
      onChange={(value) => onContentChange(section.key, value)}
      modules={{ toolbar: '#global-toolbar' }}
      formats={[
        'font', 'size', 'bold', 'italic', 'underline', 'strike',
        'color', 'background', 'list', 'bullet', 'link', 'image', 'clean'
      ]}
    />
  );
}

SectionEditor.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.string,
    key: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    fields: PropTypes.array
  }),
  onContentChange: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onAddField: PropTypes.func.isRequired,
};
