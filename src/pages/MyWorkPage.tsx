import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { EmptyState } from '../components/EmptyState';
import { PriorityBadge, StatusBadge } from '../components/Badges';
import {
  formatDueDate,
  isTaskActive,
  isTaskDueToday,
  isTaskOverdue,
  isTaskUpcoming,
  overdueLabel,
  compareTasks,
} from '../lib/taskHelpers';
import type { Task } from '../types';

type MyWorkPageProps = {
  onOpenTask: (task: Task) => void;
};

export function MyWorkPage({ onOpenTask }: MyWorkPageProps) {
  const { tasks, employees, loading, error } = useData();
  const [pickedId, setPickedId] = useState<string>('');
  const selectedId = pickedId || employees[0]?.id || '';

  const selected = employees.find((e) => e.id === selectedId) ?? null;

  const myTasks = useMemo(
    () => tasks.filter((t) => t.assigned_to === selectedId),
    [tasks, selectedId]
  );

  const activeCount = useMemo(() => myTasks.filter(isTaskActive).length, [myTasks]);

  const groups = useMemo(
    () => ({
      overdue: myTasks.filter(isTaskOverdue).sort(compareTasks),
      today: myTasks.filter(isTaskDueToday).sort(compareTasks),
      upcoming: myTasks.filter(isTaskUpcoming).sort(compareTasks),
      completed: myTasks.filter((t) => t.status === 'completed'),
    }),
    [myTasks]
  );

  if (loading) return <p className="text-sm text-slate-500">Loading your work...</p>;
  if (error) {
    return <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">My Work</h1>
          {selected ? (
            <>
              <p className="mt-1 text-base font-medium text-slate-800">{selected.name}</p>
              <p className="text-sm text-slate-500">
                {activeCount} active · {myTasks.length} assigned
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-slate-500">Select an employee to view their work.</p>
          )}
        </div>
        <label className="block sm:min-w-56">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Viewing as:</span>
          <select
            className="input"
            value={selectedId}
            onChange={(e) => setPickedId(e.target.value)}
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!selected ? (
        <EmptyState title="No employees yet." description="Add someone on the Team page first." />
      ) : (
        <div className="space-y-4">
          <TaskGroup
            title="Overdue"
            accent="text-red-600"
            tasks={groups.overdue}
            empty="No overdue tasks."
            onOpenTask={onOpenTask}
            subtitle={(t) => overdueLabel(t.due_date)}
          />
          <TaskGroup
            title="Today"
            accent="text-amber-600"
            tasks={groups.today}
            empty="Nothing due today."
            onOpenTask={onOpenTask}
            subtitle={() => 'Due today'}
          />
          <TaskGroup
            title="Upcoming"
            accent="text-slate-500"
            tasks={groups.upcoming}
            empty="No upcoming tasks."
            onOpenTask={onOpenTask}
            subtitle={(t) => formatDueDate(t.due_date)}
          />
          <TaskGroup
            title="Completed"
            accent="text-emerald-600"
            tasks={groups.completed}
            empty="No completed tasks yet."
            onOpenTask={onOpenTask}
            subtitle={(t) => formatDueDate(t.due_date)}
          />
        </div>
      )}
    </div>
  );
}

function TaskGroup({
  title,
  accent,
  tasks,
  empty,
  onOpenTask,
  subtitle,
}: {
  title: string;
  accent: string;
  tasks: Task[];
  empty: string;
  onOpenTask: (task: Task) => void;
  subtitle: (task: Task) => string;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className={`text-xs font-semibold uppercase tracking-wide ${accent}`}>
        {title}
        <span className="ml-2 text-slate-400">{tasks.length}</span>
      </h2>
      {tasks.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">{empty}</p>
      ) : (
        <div className="mt-3 space-y-2">
          {tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => onOpenTask(task)}
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2.5 text-left transition hover:bg-slate-50"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{task.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{subtitle(task)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} overdue={isTaskOverdue(task)} />
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
