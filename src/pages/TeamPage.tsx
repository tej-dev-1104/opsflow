import { useMemo, useState, type FormEvent } from 'react';
import { useData } from '../context/DataContext';
import { EmployeeCard } from '../components/EmployeeCard';
import { EmptyState } from '../components/EmptyState';
import { isTaskActive, isTaskOverdue } from '../lib/taskHelpers';

export function TeamPage() {
  const { employees, tasks, loading, error, createEmployee } = useData();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const cards = useMemo(
    () =>
      employees.map((emp) => {
        const assigned = tasks.filter((t) => t.assigned_to === emp.id);
        return {
          employee: emp,
          total: assigned.length,
          active: assigned.filter(isTaskActive).length,
          overdue: assigned.filter(isTaskOverdue).length,
        };
      }),
    [employees, tasks]
  );

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      setFormError('Name and role are required.');
      return;
    }
    setSaving(true);
    setFormError(null);
    setSuccess(null);
    try {
      await createEmployee({ name: name.trim(), role: role.trim() });
      setName('');
      setRole('');
      setSuccess('Employee added.');
    } catch (err) {
      console.error('createEmployee failed:', err);
      setFormError('Could not add employee. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-500">Loading team...</p>;
  if (error) {
    return <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Team</h1>
        <p className="mt-1 text-sm text-slate-500">People at Sunrise Traders and their current workload.</p>
      </div>

      <form
        onSubmit={handleAdd}
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <h2 className="text-sm font-semibold text-slate-900">+ Add Employee</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input
            className="input"
            aria-label="Name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            aria-label="Role"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Adding...' : 'Add Employee'}
          </button>
        </div>
        {formError ? <p className="mt-2 text-sm text-red-600">{formError}</p> : null}
        {success ? <p className="mt-2 text-sm text-emerald-600">{success}</p> : null}
      </form>

      {cards.length === 0 ? (
        <EmptyState title="No employees yet." description="Add your first team member above." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ employee, total, active, overdue }) => (
            <EmployeeCard
              key={employee.id}
              name={employee.name}
              role={employee.role}
              total={total}
              active={active}
              overdue={overdue}
            />
          ))}
        </div>
      )}
    </div>
  );
}
