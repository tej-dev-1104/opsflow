import { useState } from 'react';
import { Chrome, Workflow } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setError(null);
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error.message || 'Google sign-in failed.');
      setSigningIn(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Workflow className="h-6 w-6" />
        </div>
        <div className="mt-5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome to OpsFlow</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your team's tasks, deadlines, and workload.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={signingIn}
          className="mt-7 flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Chrome className="h-5 w-5" />
          {signingIn ? 'Connecting to Google...' : 'Continue with Google'}
        </button>

        {error ? (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <p className="mt-6 text-center text-xs text-slate-400">
          Google authentication is handled securely through Supabase Auth.
        </p>
      </section>
    </main>
  );
}
