export default function Stats({ stats }) {
  if (!stats) return null;

  return (
    <div className="stats-panel" data-testid="stats-panel">
      <span data-testid="stats-total">{stats.total} total</span>
      <span data-testid="stats-active">{stats.active} active</span>
      <span data-testid="stats-completed">{stats.completed} completed</span>
    </div>
  );
}
