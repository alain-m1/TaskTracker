import { useState } from 'react';

export default function TaskItem({ task, onToggle, onDelete, onRename }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);

  function startEditing() {
    setDraftTitle(task.title);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  function saveEditing() {
    const trimmed = draftTitle.trim();
    if (trimmed && trimmed !== task.title) {
      onRename(task.id, trimmed);
    }
    setIsEditing(false);
  }

  return (
    <li
      className={`task-item ${task.completed ? 'completed' : ''}`}
      data-testid="task-item"
      data-task-id={task.id}
    >
      <input
        type="checkbox"
        data-testid="task-checkbox"
        checked={task.completed}
        onChange={(e) => onToggle(task.id, e.target.checked)}
      />

      {isEditing ? (
        <input
          data-testid="task-edit-input"
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          autoFocus
        />
      ) : (
        <span data-testid="task-title">{task.title}</span>
      )}

      <div className="task-actions">
        {isEditing ? (
          <>
            <button data-testid="task-save-button" onClick={saveEditing}>
              Save
            </button>
            <button data-testid="task-cancel-button" onClick={cancelEditing}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button data-testid="task-edit-button" onClick={startEditing}>
              Edit
            </button>
            <button data-testid="task-delete-button" onClick={() => onDelete(task.id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}