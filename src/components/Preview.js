// src/components/Preview.js
import React from 'react';
import PropTypes from 'prop-types';

export default function Preview({ sections, activeKey, renderActive }) {
  const personal = sections.find((s) => s.id === 'personal');
  return (
    <div className="cv-preview">
      {personal && (
        <div className="personal-header">
          <h1>
            {personal.fields.find((f) => f.key === 'name')?.value || 'Your Name'}
          </h1>
          <p className="contact-line">
            {personal.fields.find((f) => f.key === 'email')?.value} |{' '}
            {personal.fields.find((f) => f.key === 'phone')?.value}
          </p>
        </div>
      )}

      {sections.filter((s) => s.id !== 'personal').map((s) => (
        <section key={s.key} className="cv-section">
          <h3 className="cv-section-heading">{s.title}</h3>
          {s.key === activeKey ? (
            renderActive()
          ) : (
            <div
              className="rich-display"
              dangerouslySetInnerHTML={{ __html: s.content }}
            />
          )}
        </section>
      ))}
    </div>
  );
}

Preview.propTypes = {
  sections: PropTypes.array.isRequired,
  activeKey: PropTypes.string.isRequired,
  renderActive: PropTypes.func.isRequired,
};
