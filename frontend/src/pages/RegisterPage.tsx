import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBookOpen, FiLock, FiMail, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register({ full_name: fullName, email, password });
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="auth-orbit bottom-0 left-0 rotate-180" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <Link to="/catalog" className="mb-8 flex items-center justify-center gap-2 text-sm font-semibold tracking-[-0.02em] text-slate-300 transition-colors hover:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-300/25 bg-gradient-to-br from-indigo-400 to-violet-600 text-white shadow-lg shadow-indigo-500/25"><FiBookOpen size={16} /></span>
          Smart<span className="text-indigo-300">Library</span>
        </Link>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-300/25 bg-gradient-to-br from-indigo-400 to-violet-600 text-white shadow-lg shadow-indigo-500/30 animate-pulse-glow">
            <FiBookOpen size={29} />
          </div>
          <p className="section-kicker mb-3 justify-center">Join the community</p>
          <h1 className="mb-2 text-3xl font-bold tracking-[-0.04em] text-white">Create your account</h1>
          <p className="text-slate-400">A personal space for every next great read.</p>
        </div>

        <Card padding="lg" className="border-white/[0.1] bg-slate-950/75 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              type="text"
              placeholder="John Doe"
              icon={<FiUser />}
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />

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

            <Input
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              icon={<FiLock />}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />

            <Button type="submit" fullWidth loading={loading} className="mt-4">
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already a member?{' '}
            <Link to="/login" className="font-medium text-indigo-400 transition-colors hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
