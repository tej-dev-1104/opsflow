import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  accent?: 'default' | 'blue' | 'green' | 'red';
};

const accentMap = {
  default: 'text-slate-700 bg-slate-50',
  blue: 'text-blue-700 bg-blue-50',
  green: 'text-emerald-700 bg-emerald-50',
  red: 'text-red-700 bg-red-50',
};

export function StatCard({ label, value, icon: Icon, accent = 'default' }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={`rounded-lg p-2 ${accentMap[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
