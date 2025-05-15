// src/components/Preview.js
import React from 'react';
import PropTypes from 'prop-types';

export default function Preview({ contact, summary, quals }) {
  return (
    <div className="cv-preview" style={{ padding: '2rem' }}>
      <section>
        <h1>{contact.name || 'Your Name'}</h1>
        <p>
          {contact.email} {contact.phone} {contact.address}
        </p>
      </section>

      <section>
        <h2>Summary</h2>
        {/* Render the rich-text HTML */}
        <div
          className="summary-content"
          dangerouslySetInnerHTML={{ __html: summary || '<p>Your summary here…</p>' }}
        />
      </section>

      {quals.map((q) => (
        <section key={q.id}>
          <h2>{q.title}</h2>
          {/* Same for each qualification */}
          <div
            className="qual-content"
            dangerouslySetInnerHTML={{ __html: q.content || '<p>Details…</p>' }}
          />
        </section>
      ))}
    </div>
  );
}

Preview.propTypes = {
  contact: PropTypes.object.isRequired,
  summary: PropTypes.string.isRequired,   //HTML string from React Quill
  quals:   PropTypes.arrayOf(
    PropTypes.shape({
      id:      PropTypes.string.isRequired,
      title:   PropTypes.string.isRequired,
      content: PropTypes.string.isRequired, //HTML string
    })
  ).isRequired,
};
