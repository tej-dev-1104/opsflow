import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useData } from '../context/DataContext';
import { EmptyState } from '../components/EmptyState';
import { TaskRow } from '../components/TaskRow';
import { compareTasks, isTaskOverdue } from '../lib/taskHelpers';
import type { Task, TaskStatus } from '../types';

type FilterKey = 'all' | 'todo' | 'in_progress' | 'completed' | 'overdue';

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'overdue', label: 'Overdue' },
];

type TasksPageProps = {
  onOpenTask: (task: Task) => void;
  onNewTask: () => void;
};

export function TasksPage({ onOpenTask, onNewTask }: TasksPageProps) {
  const { tasks, loading, error, getEmployeeName, updateTask } = useData();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [statusError, setStatusError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks
      .filter((task) => {
        const matchesQuery = !q || task.title.toLowerCase().includes(q);
        if (!matchesQuery) return false;
        if (filter === 'all') return true;
        if (filter === 'overdue') return isTaskOverdue(task);
        return task.status === filter;
      })
      .sort(compareTasks);
  }, [tasks, query, filter]);

  const handleStatusChange = async (task: Task, status: TaskStatus) => {
    setStatusError(null);
    try {
      await updateTask(task.id, { status });
    } catch (err) {
      console.error('Status update failed:', err);
      setStatusError("Couldn't update status. Please try again.");
    }
  };

  if (loading) return <p className="text-sm text-slate-500">Loading tasks...</p>;
  if (error) {
    return <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Tasks</h1>
          <p className="mt-1 text-sm text-slate-500">Manage and track your team's work.</p>
        </div>
        <button type="button" onClick={onNewTask} className="btn-primary self-start">
          + New Task
        </button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                filter === item.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {statusError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{statusError}</p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_84px_130px_128px] md:gap-4">
          <span>Title</span>
          <span>Assignee</span>
          <span>Priority</span>
          <span>Due</span>
          <span>Status</span>
        </div>
        <div>
          {filtered.length === 0 ? (
            <div className="p-4">
              <EmptyState
                title="No tasks found."
                description="Try another search or create a new task."
              />
            </div>
          ) : (
            filtered.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                employeeName={getEmployeeName(task.assigned_to)}
                onClick={() => onOpenTask(task)}
                onStatusChange={(status) => handleStatusChange(task, status)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
