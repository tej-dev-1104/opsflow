type EmployeeCardProps = {
  name: string;
  role: string;
  total: number;
  active: number;
  overdue: number;
  onClick?: () => void;
};

export function EmployeeCard({ name, role, total, active, overdue, onClick }: EmployeeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={`Open details for ${name}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{name}</h3>
          <p className="mt-0.5 text-sm text-slate-500">{role}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
          {name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
        <Metric label="assigned" value={total} />
        <Metric label="active" value={active} />
        <Metric label="overdue" value={overdue} accent={overdue > 0} />
      </div>
      <p className="mt-3 text-xs text-blue-600">View team member →</p>
    </button>
  );
}

function Metric({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div>
      <p className={`text-xl font-semibold ${accent ? 'text-red-600' : 'text-slate-900'}`}>{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
