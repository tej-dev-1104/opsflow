import { formatDueDate, isTaskOverdue, overdueLabel } from '../lib/taskHelpers';
import type { Employee, Task, TaskStatus } from '../types';
import { PriorityBadge, StatusBadge } from './Badges';

type TaskRowProps = {
  task: Task;
  employeeName: string;
  onClick: () => void;
  onStatusChange?: (status: TaskStatus) => void;
};

export function TaskRow({ task, employeeName, onClick, onStatusChange }: TaskRowProps) {
  const overdue = isTaskOverdue(task);

  return (
    <div className="grid w-full grid-cols-1 items-center justify-items-start gap-2 border-b border-slate-100 px-4 py-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_84px_130px_128px] md:gap-4">
      <button type="button" onClick={onClick} className="w-full min-w-0 text-left hover:opacity-80">
        <p className="truncate font-medium text-slate-900">{task.title}</p>
        {task.description ? (
          <p className="mt-0.5 truncate text-sm text-slate-500">{task.description}</p>
        ) : null}
      </button>
      <button type="button" onClick={onClick} className="w-full truncate text-left text-sm text-slate-600 hover:opacity-80">
        {employeeName}
      </button>
      <PriorityBadge priority={task.priority} />
      <button
        type="button"
        onClick={onClick}
        className={`text-left text-sm hover:opacity-80 ${overdue ? 'font-medium text-red-600' : 'text-slate-600'}`}
      >
        {overdue ? overdueLabel(task.due_date) : formatDueDate(task.due_date)}
      </button>
      {onStatusChange ? (
        <select
          className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          value={task.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
          aria-label={`Status for ${task.title}`}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      ) : (
        <StatusBadge status={task.status} overdue={overdue} />
      )}
    </div>
  );
}

type AttentionItemProps = {
  task: Task;
  employee?: Employee | null;
  subtitle: string;
  onClick: () => void;
};

export function AttentionItem({ task, employee, subtitle, onClick }: AttentionItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50"
    >
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-900">{task.title}</p>
        <p className="mt-0.5 text-sm text-slate-500">{employee?.name ?? 'Unassigned'}</p>
        <p className="mt-1 text-xs font-medium text-slate-500">{subtitle}</p>
      </div>
      <PriorityBadge priority={task.priority} />
    </button>
  );
}
