import { useMemo, useState } from 'react';
import { X, Trash2, CheckCircle2, Clock3, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { isTaskActive, isTaskOverdue, compareTasks } from '../lib/taskHelpers';
import type { Employee } from '../types';

type Props = {
  employee: Employee;
  onClose: () => void;
  onDeleted: () => void;
};

export function EmployeeDetailModal({ employee, onClose, onDeleted }: Props) {
  const { tasks, getEmployeeName, updateEmployee, deleteEmployee } = useData();
  const [name, setName] = useState(employee.name);
  const [role, setRole] = useState(employee.role);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignedTasks = useMemo(
    () => tasks.filter((task) => task.assigned_to === employee.id).sort(compareTasks),
    [tasks, employee.id]
  );

  const active = assignedTasks.filter(isTaskActive).length;
  const overdue = assignedTasks.filter(isTaskOverdue).length;
  const completed = assignedTasks.filter((task) => task.status === 'completed').length;

  const handleSave = async () => {
    if (!name.trim() || !role.trim()) {
      setError('Name and role are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateEmployee(employee.id, { name: name.trim(), role: role.trim() });
    } catch (err) {
      console.error('updateEmployee failed:', err);
      setError('Could not update this employee.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(
      `Remove ${employee.name}? Their ${assignedTasks.length} assigned task(s) will become unassigned.`
    )) return;

    setDeleting(true);
    setError(null);
    try {
      await deleteEmployee(employee.id);
      onDeleted();
    } catch (err) {
      console.error('deleteEmployee failed:', err);
      setError('Could not remove this employee.');
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-label={employee.name}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{employee.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{employee.role}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close employee details">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid grid-cols-3 gap-3">
            <Metric icon={Clock3} label="Active" value={active} />
            <Metric icon={AlertCircle} label="Overdue" value={overdue} danger={overdue > 0} />
            <Metric icon={CheckCircle2} label="Completed" value={completed} />
          </div>

          <section>
            <h3 className="text-sm font-semibold text-slate-900">Employee details</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-slate-600">
                Name
                <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
              </label>
              <label className="text-sm text-slate-600">
                Role
                <input className="input mt-1" value={role} onChange={(e) => setRole(e.target.value)} maxLength={100} />
              </label>
            </div>
            <button type="button" onClick={handleSave} disabled={saving || deleting} className="btn-primary mt-3">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Assigned tasks</h3>
              <span className="text-xs text-slate-500">{assignedTasks.length} total</span>
            </div>
            <div className="mt-3 space-y-2">
              {assignedTasks.length === 0 ? (
                <p className="rounded-lg bg-slate-50 px-3 py-4 text-sm text-slate-500">No tasks assigned.</p>
              ) : (
                assignedTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{task.title}</p>
                      <p className="text-xs text-slate-500">{task.status.replace('_', ' ')} · {task.priority}</p>
                    </div>
                    {isTaskOverdue(task) ? (
                      <span className="shrink-0 text-xs font-medium text-red-600">Overdue</span>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </section>

          {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
            <button type="button" onClick={handleDelete} disabled={saving || deleting} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50">
              <Trash2 className="h-4 w-4" />
              {deleting ? 'Removing...' : 'Remove employee'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  danger = false,
}: {
  icon: typeof Clock3;
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <Icon className={`h-4 w-4 ${danger ? 'text-red-600' : 'text-blue-600'}`} />
      <p className={`mt-2 text-xl font-semibold ${danger ? 'text-red-600' : 'text-slate-900'}`}>{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
