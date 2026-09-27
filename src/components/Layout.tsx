import { NavLink } from 'react-router-dom';
import {
  CheckSquare,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  UserRound,
  X,
  Workflow,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/my-work', label: 'My Work', icon: UserRound },
  { to: '/team', label: 'Team', icon: Users },
];

type LayoutProps = {
  children: ReactNode;
  onNewTask: () => void;
};

export function Layout({ children, onNewTask }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
          <Brand />
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => <NavItem key={item.to} {...item} />)}
          </nav>
          <BusinessFooter />
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-30 md:hidden">
            <button type="button" className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
            <aside className="relative flex h-full w-64 flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                <Brand compact />
                <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Close menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => <NavItem key={item.to} {...item} onClick={() => setMobileOpen(false)} />)}
              </nav>
              <BusinessFooter />
            </aside>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex items-center gap-3">
              <button type="button" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
              <div className="md:hidden"><Brand compact /></div>
            </div>
            <button type="button" onClick={onNewTask} className="btn-primary">+ New Task</button>
          </header>

          <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

function BusinessFooter() {
  const { user, signOut } = useAuth();

  return (
    <div className="border-t border-slate-100 px-4 py-4">
      <p className="text-sm font-medium text-slate-800">Sunrise Traders</p>
      <p className="mt-0.5 text-xs text-slate-500">Small Business</p>
      {user?.email ? <p className="mt-2 truncate text-xs text-slate-500">{user.email}</p> : null}
      {isSupabaseConfigured && user ? (
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      ) : !isSupabaseConfigured ? (
        <p className="mt-2 text-xs text-amber-700">Local demo mode (Supabase not configured)</p>
      ) : null}
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'border-b border-slate-100 px-4 py-5'}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
        <Workflow className="h-4 w-4" />
      </div>
      <div>
        <p className="text-base font-semibold tracking-tight text-slate-900">OpsFlow</p>
        {!compact ? <p className="text-xs text-slate-500">Know what needs to get done.</p> : null}
      </div>
    </div>
  );
}

function NavItem({ to, label, icon: Icon, end, onClick }: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );
}
