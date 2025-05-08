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
        <p>{summary}</p>
      </section>
      {quals.map((q) => (
        <section key={q.id}>
          <h2>{q.title}</h2>
          <p>{q.content}</p>
        </section>
      ))}
    </div>
  );
}

Preview.propTypes = {
  contact: PropTypes.object.isRequired,
  summary: PropTypes.string.isRequired,
  quals:   PropTypes.array.isRequired,
};
