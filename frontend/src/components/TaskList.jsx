import { useEffect, useState, useCallback } from 'react';
import { getTasks, getStats, createTask, updateTask, deleteTask } from '../api.js';
import TaskItem from './TaskItem.jsx';
import Stats from './Stats.jsx';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState('');

  const refresh = useCallback(async (currentFilter) => {
    try {
      const [taskData, statsData] = await Promise.all([getTasks(currentFilter), getStats()]);
      setTasks(taskData);
      setStats(statsData);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    }
  }, []);

  useEffect(() => {
    refresh(filter);
  }, [filter, refresh]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await createTask(newTitle.trim());
      setNewTitle('');
      await refresh(filter);
    } catch (err) {
      setError(err.message || 'Failed to add task');
    }
  }

    async function handleToggle(id, completed) {
    try {
      await updateTask(id, { completed });
      await refresh(filter);
    } catch (err) {
      setError(err.message || 'Failed to update task');
    }
  }

  async function handleRename(id, title) {
    try {
      await updateTask(id, { title });
      await refresh(filter);
    } catch (err) {
      setError(err.message || 'Failed to rename task');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      await refresh(filter);
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  }

  return (
    <div className="task-page">
      <h1>Task Tracker</h1>

      <Stats stats={stats} />

      <form className="add-task-form" onSubmit={handleAdd} data-testid="add-task-form">
        <input
          data-testid="new-task-input"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button type="submit" data-testid="add-task-button">
          Add
        </button>
      </form>

      <div className="filters">
        <button
          data-testid="filter-all"
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          data-testid="filter-active"
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          data-testid="filter-completed"
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {error && <p className="error-message" data-testid="task-error">{error}</p>}

      <ul className="task-list" data-testid="task-list">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} onRename={handleRename} />
        ))}
      </ul>
    </div>
  );
}
