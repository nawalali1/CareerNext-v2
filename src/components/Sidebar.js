// src/components/Sidebar.js
import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiPlus, FiMove, FiTrash2, FiDownload } from 'react-icons/fi';

export default function Sidebar({
  sections,
  activeKey,
  onSelect,
  onReorder,
  onAddSection,
  onRemoveSection,
  onTitleChange,
  onDownload
}) {
  return (
    <aside className="cv-sidebar">
      <h2>Sections</h2>
      <button
        className="add-section-btn"
        onClick={onAddSection}
        aria-label="Add Section"
      >
        <FiPlus /> Add Section
      </button>

      <DragDropContext onDragEnd={onReorder}>
        <Droppable droppableId="sidebar">
          {(provided) => (
            <ul
              className="sidebar-list"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {sections.map((sec, index) => (
                <Draggable key={sec.key} draggableId={sec.key} index={index}>
                  {(draggableProvided) => (
                    <li
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      className={`sidebar-item ${
                        sec.key === activeKey ? 'active' : ''
                      }`}
                      onClick={() => onSelect(sec.key)}
                    >
                      <span
                        {...draggableProvided.dragHandleProps}
                        className="move-handle"
                        aria-label="Drag"
                      >
                        <FiMove />
                      </span>
                      <input
                        className="section-title-input"
                        value={sec.title}
                        onChange={(e) =>
                          onTitleChange(sec.key, e.target.value)
                        }
                        aria-label="Section Title"
                      />
                      <button
                        className="remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveSection(sec.key);
                        }}
                        aria-label="Remove Section"
                      >
                        <FiTrash2 />
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <button
        className="download-btn"
        onClick={onDownload}
        aria-label="Download PDF"
      >
        <FiDownload /> Download PDF
      </button>
    </aside>
  );
}

Sidebar.propTypes = {
  sections: PropTypes.array.isRequired,
  activeKey: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onReorder: PropTypes.func.isRequired,
  onAddSection: PropTypes.func.isRequired,
  onRemoveSection: PropTypes.func.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};
