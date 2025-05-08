// src/components/Toolbar.js
import React from 'react';

export default function Toolbar() {
  return (
    <div id="global-toolbar" className="global-toolbar">
      <select className="ql-font"></select>
      <select className="ql-size"></select>
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <button className="ql-underline"></button>
      <button className="ql-list" value="ordered"></button>
      <button className="ql-list" value="bullet"></button>
      <button className="ql-link"></button>
      <button className="ql-image"></button>
      <button className="ql-clean"></button>
    </div>
  );
}
