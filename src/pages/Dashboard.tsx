import { useMemo, useState, type FormEvent } from 'react';
import { AlertTriangle, CheckCircle2, ListTodo, Plus, Activity } from 'lucide-react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';
import { EmptyState } from '../components/EmptyState';
import { AttentionItem } from '../components/TaskRow';
import {
  compareTasks,
  greetingForNow,
  isTaskDueToday,
  isTaskOverdue,
  overdueLabel,
} from '../lib/taskHelpers';
import type { Task } from '../types';

type DashboardProps = {
  onOpenTask: (task: Task) => void;
  onQuickAdd: (title: string) => void;
};

export function Dashboard({ onOpenTask, onQuickAdd }: DashboardProps) {
  const { tasks, employees, loading, error, stats } = useData();
  const [quickTitle, setQuickTitle] = useState('');

  const overdueTasks = useMemo(
    () => tasks.filter(isTaskOverdue).sort(compareTasks),
    [tasks]
  );
  const dueTodayTasks = useMemo(
    () => tasks.filter(isTaskDueToday).sort(compareTasks),
    [tasks]
  );

  const workload = useMemo(() => {
    const counts = employees.map((emp) => {
      const assigned = tasks.filter((t) => t.assigned_to === emp.id);
      return {
        employee: emp,
        count: assigned.filter((t) => t.status !== 'completed').length,
        overdue: assigned.filter(isTaskOverdue).length,
      };
    });
    const max = Math.max(1, ...counts.map((c) => c.count));
    return counts
      .sort((a, b) => b.count - a.count)
      .map((item) => ({ ...item, pct: Math.round((item.count / max) * 100) }));
  }, [employees, tasks]);

  const handleQuickAdd = (e: FormEvent) => {
    e.preventDefault();
    const title = quickTitle.trim();
    if (!title) return;
    onQuickAdd(title);
    setQuickTitle('');
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-600">{greetingForNow()}</p>
        <p className="text-sm text-slate-500">Here's what needs attention today.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Tasks" value={stats.total} icon={ListTodo} />
        <StatCard label="Active" value={stats.active} icon={Activity} accent="blue" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} accent="green" />
        <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} accent="red" />
      </div>

      <form
        onSubmit={handleQuickAdd}
        className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
      >
        <input
          className="input flex-1"
          placeholder="What needs to get done?"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
        />
        <button type="submit" className="btn-primary whitespace-nowrap">
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </form>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Needs Attention</h2>
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-red-600">
              Overdue
            </h3>
            {overdueTasks.length === 0 ? (
              <EmptyState title="No overdue tasks." description="Everything is on track." />
            ) : (
              <div className="space-y-2">
                {overdueTasks.map((task) => (
                  <AttentionItem
                    key={task.id}
                    task={task}
                    employee={employees.find((e) => e.id === task.assigned_to)}
                    subtitle={overdueLabel(task.due_date)}
                    onClick={() => onOpenTask(task)}
                  />
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-amber-600">
              Due Today
            </h3>
            {dueTodayTasks.length === 0 ? (
              <EmptyState title="Nothing due today." />
            ) : (
              <div className="space-y-2">
                {dueTodayTasks.map((task) => (
                  <AttentionItem
                    key={task.id}
                    task={task}
                    employee={employees.find((e) => e.id === task.assigned_to)}
                    subtitle="Due today"
                    onClick={() => onOpenTask(task)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Team Workload</h2>
        <p className="mt-1 text-sm text-slate-500">Active tasks assigned per person.</p>
        <div className="mt-4 space-y-3">
          {workload.length === 0 ? (
            <EmptyState title="No employees yet." />
          ) : (
            workload.map(({ employee, count, overdue, pct }) => (
              <div key={employee.id} className="grid grid-cols-[140px_1fr_auto] items-center gap-3 sm:grid-cols-[180px_1fr_auto]">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{employee.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {count} active{overdue > 0 ? ` · ${overdue} overdue` : ''}
                  </p>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-right text-sm font-semibold text-slate-700">{count}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
