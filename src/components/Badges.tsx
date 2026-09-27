import { CheckCircle2, Circle, Clock3 } from 'lucide-react';
import type { TaskPriority, TaskStatus } from '../types';
import { priorityLabel, statusLabel } from '../lib/taskHelpers';

const priorityStyles: Record<TaskPriority, string> = {
  high: 'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-slate-50 text-slate-600 border-slate-200',
};

const statusStyles: Record<TaskStatus, string> = {
  todo: 'bg-slate-100 text-slate-700 border-slate-200',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide ${priorityStyles[priority]}`}
    >
      {priorityLabel(priority)}
    </span>
  );
}

export function StatusBadge({
  status,
  overdue,
}: {
  status: TaskStatus;
  overdue?: boolean;
}) {
  if (overdue && status !== 'completed') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold tracking-wide text-red-700">
        <Clock3 className="h-3 w-3" />
        OVERDUE
      </span>
    );
  }

  const Icon = status === 'completed' ? CheckCircle2 : status === 'in_progress' ? Clock3 : Circle;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide ${statusStyles[status]}`}
    >
      <Icon className="h-3 w-3" />
      {statusLabel(status)}
    </span>
  );
}
