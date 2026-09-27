import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { formatTimestamp, todayISO } from '../lib/taskHelpers';
import type { CreateTaskInput, Employee, Task, TaskPriority, TaskStatus } from '../types';

type TaskModalProps = {
  mode: 'create' | 'edit';
  employees: Employee[];
  initialTask?: Task | null;
  initialTitle?: string;
  onClose: () => void;
  onSave: (input: CreateTaskInput) => Promise<void>;
  onDelete?: () => Promise<void>;
};

const emptyForm = (title = ''): CreateTaskInput => ({
  title,
  description: '',
  assigned_to: null,
  priority: 'medium',
  status: 'todo',
  due_date: todayISO(),
});

const formFromTask = (task: Task): CreateTaskInput => ({
  title: task.title,
  description: task.description ?? '',
  assigned_to: task.assigned_to,
  priority: task.priority,
  status: task.status,
  due_date: task.due_date,
});

// Mounted only while open, so form state initializes fresh from props each time.
export function TaskModal({
  mode,
  employees,
  initialTask,
  initialTitle = '',
  onClose,
  onSave,
  onDelete,
}: TaskModalProps) {
  const [form, setForm] = useState<CreateTaskInput>(() =>
    mode === 'edit' && initialTask ? formFromTask(initialTask) : emptyForm(initialTitle)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Task title is required.');
      return;
    }
    if (!form.due_date) {
      setError('Due date is required.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave({
        ...form,
        title: form.title.trim(),
        description: form.description?.trim() || null,
        assigned_to: form.assigned_to || null,
      });
      onClose();
    } catch (err) {
      console.error('Task save failed:', err);
      setError("Couldn't save the task. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    setSaving(true);
    try {
      await onDelete();
      onClose();
    } catch (err) {
      console.error('Task delete failed:', err);
      setError("Couldn't delete the task. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'create' ? 'New Task' : 'Edit Task'}
    >
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close" tabIndex={-1} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {mode === 'create' ? 'New Task' : 'Edit Task'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <Field label="Task title">
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="What needs to get done?"
              autoFocus
              required
              maxLength={200}
            />
          </Field>

          <Field label="Description">
            <textarea
              className="input min-h-24 resize-y"
              value={form.description ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Optional details"
              maxLength={2000}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Assigned to">
              <select
                className="input"
                value={form.assigned_to ?? ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, assigned_to: e.target.value || null }))
                }
              >
                <option value="">Unassigned</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Priority">
              <select
                className="input"
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priority: e.target.value as TaskPriority }))
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </Field>

            <Field label="Due date">
              <input
                type="date"
                className="input"
                value={form.due_date}
                onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
                required
              />
            </Field>

            <Field label="Status">
              <select
                className="input"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value as TaskStatus }))
                }
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </Field>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          {mode === 'edit' && initialTask ? (
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              <div>
                <span className="font-medium text-slate-600">Created</span>
                <p>{formatTimestamp(initialTask.created_at)}</p>
              </div>
              <div>
                <span className="font-medium text-slate-600">Updated</span>
                <p>{formatTimestamp(initialTask.updated_at)}</p>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            {mode === 'edit' && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                Delete
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="btn-secondary" disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : mode === 'create' ? 'Create Task' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
