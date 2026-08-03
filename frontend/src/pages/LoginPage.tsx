import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBookOpen, FiLock, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login({ username: email, password });
      toast.success('Successfully logged in');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="auth-orbit right-0 top-0" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <Link to="/catalog" className="mb-8 flex items-center justify-center gap-2 text-sm font-semibold tracking-[-0.02em] text-slate-300 transition-colors hover:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-300/25 bg-gradient-to-br from-indigo-400 to-violet-600 text-white shadow-lg shadow-indigo-500/25"><FiBookOpen size={16} /></span>
          Smart<span className="text-indigo-300">Library</span>
        </Link>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-300/25 bg-gradient-to-br from-indigo-400 to-violet-600 text-white shadow-lg shadow-indigo-500/30 animate-pulse-glow">
            <FiBookOpen size={29} />
          </div>
          <p className="section-kicker mb-3 justify-center">Your reading journey continues</p>
          <h1 className="mb-2 text-3xl font-bold tracking-[-0.04em] text-white">Welcome back</h1>
          <p className="text-slate-400">Sign in to pick up where you left off.</p>
        </div>

        <Card padding="lg" className="border-white/[0.1] bg-slate-950/75 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<FiMail />}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<FiLock />}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Secure sign-in</span>
              <span className="text-slate-500">Need help? Contact your library.</span>
            </div>

            <Button type="submit" fullWidth loading={loading} className="mt-2">
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-400 transition-colors hover:text-indigo-300">
              Create one
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
