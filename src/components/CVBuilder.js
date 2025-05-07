"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  FiDownload,
  FiPlus,
  FiTrash2,
  FiMove,
  FiPlusCircle,
} from "react-icons/fi";


const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

// Section templates
const TEMPLATES = {
  personal: { id: "personal", title: "Personal Details" },
  summary:  { id: "summary",  title: "Professional Summary", content: "<p>Your summary...</p>" },
};

export default function CVBuilder() {
  // Sidebar sections state
  const [sections, setSections] = useState([
    {
      key: "personal-0",
      ...TEMPLATES.personal,
      fields: [
        { key: "name",  label: "Name",  value: "" },
        { key: "email", label: "Email", value: "" },
        { key: "phone", label: "Phone", value: "" },
      ],
    },
    { key: "summary-0", ...TEMPLATES.summary },
  ]);
  const [activeKey, setActiveKey] = useState(sections[0].key);
  const previewRef = useRef();

  // Drag & drop reorder
  const onDragEnd = (res) => {
    if (!res.destination) return;
    const a = Array.from(sections);
    const [m] = a.splice(res.source.index, 1);
    a.splice(res.destination.index, 0, m);
    setSections(a);
  };

  // Add blank section
  const addSection = () => {
    const key = `custom-${Date.now()}`;
    setSections((p) => [
      ...p,
      { key, id: "custom", title: "New Section", content: "<p>Content...</p>" },
    ]);
    setActiveKey(key);
  };

  // Remove section
  const removeSection = (key) => {
    setSections((p) => p.filter((s) => s.key !== key));
    if (activeKey === key && sections.length > 1) setActiveKey(sections[0].key);
  };

  // Update title/content/fields
  const updateTitle   = (key, t) => setSections((p) => p.map(s=>s.key===key?{...s,title:t}:s));
  const updateContent = (key, h) => setSections((p) => p.map(s=>s.key===key?{...s,content:h}:s));
  const updateField   = (secKey, fKey, v) =>
    setSections((p) => p.map(s => {
      if (s.key!==secKey) return s;
      return {
        ...s,
        fields: s.fields.map(f=>f.key===fKey?{...f,value:v}:f)
      };
    }));
  const addPersonalField = (secKey) =>
    setSections((p) => p.map(s => {
      if (s.key!==secKey) return s;
      return {
        ...s,
        fields: [
          ...s.fields,
          { key:`field-${Date.now()}`, label:"Custom", value:"" }
        ]
      };
    }));

  // PDF export
  const downloadPDF = async () => {
    const canvas = await html2canvas(previewRef.current,{scale:2});
    const img    = canvas.toDataURL("image/png");
    const pdf    = new jsPDF("p","pt","a4");
    const w      = pdf.internal.pageSize.getWidth();
    const h      = (canvas.height*w)/canvas.width;
    pdf.addImage(img,"PNG",0,0,w,h);
    pdf.save("My_CV.pdf");
  };

  // Render editor or form for active section
  const renderActive = () => {
    const sec = sections.find(s=>s.key===activeKey);
    if (!sec) return null;
    if (sec.id==="personal") {
      return (
        <div className="personal-form">
          {sec.fields.map(f=>(
            <div key={f.key} className="form-row">
              <label>{f.label}</label>
              <input
                value={f.value}
                onChange={e=>updateField(sec.key,f.key,e.target.value)}
              />
            </div>
          ))}
          <button className="add-personal-field-btn"
            onClick={()=>addPersonalField(sec.key)}>
            <FiPlusCircle /> Add Field
          </button>
        </div>
      );
    }
    return (
      <ReactQuill
        theme="snow"
        value={sec.content}
        onChange={h=>updateContent(sec.key,h)}
        modules={{ toolbar: "#global-toolbar" }}
        formats={[
          "font","size","bold","italic","underline","strike",
          "color","background","list","bullet","link","image","clean"
        ]}
      />
    );
  };

  return (
    <div className="cv-builder-container">
      {/* Global Toolbar */}
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

      <div className="builder-body">
        {/* Sidebar */}
        <aside className="cv-sidebar">
          <h2>Sections</h2>
          <button className="add-section-btn" onClick={addSection}>
            <FiPlus /> Add Section
          </button>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sidebar">
              {(prov)=>(<ul
                className="sidebar-list"
                ref={prov.innerRef}
                {...prov.droppableProps}
              >
                {sections.map((s,i)=>(
                  <Draggable key={s.key} draggableId={s.key} index={i}>
                    {(dr)=>(<li
                      ref={dr.innerRef}
                      {...dr.draggableProps}
                      className={`sidebar-item ${
                        s.key===activeKey?"active":""}`}
                      onClick={()=>setActiveKey(s.key)}
                    >
                      <span {...dr.dragHandleProps}
                        className="move-handle">
                        <FiMove/>
                      </span>
                      <input
                        className="section-title-input"
                        value={s.title}
                        onChange={e=>updateTitle(s.key,e.target.value)}
                      />
                      <button className="remove-btn"
                        onClick={()=>removeSection(s.key)}>
                        <FiTrash2/>
                      </button>
                    </li>)}
                  </Draggable>
                ))}
                {prov.placeholder}
              </ul>)}
            </Droppable>
          </DragDropContext>

          <button className="download-btn" onClick={downloadPDF}>
            <FiDownload/> Download PDF
          </button>
        </aside>

        {/* Preview / Editor */}
        <main className="cv-main">
          <div className="cv-preview" ref={previewRef}>
            {/* Render personal header on top */}
            {(() => {
              const p = sections.find(s=>s.id==="personal");
              return p ? (
                <div className="personal-header">
                  <h1>{p.fields.find(f=>f.key==="name")?.value || "Your Name"}</h1>
                  <p className="contact-line">
                    {p.fields.find(f=>f.key==="email")?.value} |{" "}
                    {p.fields.find(f=>f.key==="phone")?.value}
                  </p>
                </div>
              ) : null;
            })()}

            {/* Other sections */}
            {sections.filter(s=>s.id!=="personal").map(s=>(
              <section key={s.key} className="cv-section">
                <h3 className="cv-section-heading">{s.title}</h3>
                {s.key===activeKey
                  ? renderActive()
                  : <div className="rich-display"
                      dangerouslySetInnerHTML={{__html:s.content}} />}
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
