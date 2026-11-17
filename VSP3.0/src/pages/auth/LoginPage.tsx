import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Zap, ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { Link } from 'react-router-dom';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError);
      setLoading(false);
    } else {
      // Determine redirection based on email
      const lower = email.toLowerCase();
      if (lower.includes('admin')) {
        navigate('/admin');
      } else if (lower.includes('officer')) {
        navigate('/officer');
      } else if (lower.includes('worker')) {
        navigate('/worker');
      } else if (lower.includes('supervisor')) {
        navigate('/supervisor');
      } else {
        navigate('/map');
      }
    }
  };

  const setDemoCredentials = (role: string) => {
    switch (role) {
      case 'admin':
        setEmail('admin@vidyutspandan.gov.in');
        setPassword('Admin@1234');
        break;
      case 'officer':
        setEmail('officer@vidyutspandan.gov.in');
        setPassword('Officer@1234');
        break;
      case 'worker':
        setEmail('worker@vidyutspandan.gov.in');
        setPassword('Worker@1234');
        break;
      case 'supervisor':
        setEmail('supervisor@vidyutspandan.gov.in');
        setPassword('Supervisor@1234');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back to Home Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Public Portal
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Header Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <img 
              src="/logo.png" 
              alt="Vidyut Spandan Logo" 
              className="w-14 h-14 rounded-xl object-contain bg-amber-500/10 border border-amber-500/30 p-1 shadow-lg" 
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">VIDYUT SPANDAN</h2>
          <p className="text-xs text-amber-400 font-medium">ವಿದ್ಯುತ್ ಸ್ಪಂದನ</p>
          <p className="text-xs text-slate-400 mt-1">
            Department Operations & Maintenance Coordination Portal
          </p>
        </div>

        {/* Login Box */}
        <div className="mt-8 bg-[#111d35] border border-[#1e2d55] py-8 px-6 shadow-2xl rounded-lg sm:px-10">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-[#1e2d55]">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-semibold text-slate-200">Authorized Personnel Sign-In</span>
          </div>

          {error && (
            <div className="mb-4 bg-red-950/40 border border-red-500/30 rounded p-3 flex items-start gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Government Email Address"
              type="email"
              required
              placeholder="officer@vidyutspandan.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full justify-center"
              >
                Sign In to Department Portal
              </Button>
            </div>
          </form>

          {/* Prototype Quick Role Fillers */}
          <div className="mt-6 pt-6 border-t border-[#1e2d55]">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              ⚡ Quick Fill Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('admin')}
                className="text-left p-2 rounded bg-[#0a0f1e] hover:bg-[#162040] border border-[#1e2d55] text-[11px] transition-colors"
              >
                <div className="font-semibold text-red-400">1. Admin</div>
                <div className="text-slate-500 text-[10px]">Full Control</div>
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('officer')}
                className="text-left p-2 rounded bg-[#0a0f1e] hover:bg-[#162040] border border-[#1e2d55] text-[11px] transition-colors"
              >
                <div className="font-semibold text-indigo-400">2. Officer</div>
                <div className="text-slate-500 text-[10px]">Area Ops & Orders</div>
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('worker')}
                className="text-left p-2 rounded bg-[#0a0f1e] hover:bg-[#162040] border border-[#1e2d55] text-[11px] transition-colors"
              >
                <div className="font-semibold text-emerald-400">3. Field Lineman</div>
                <div className="text-slate-500 text-[10px]">Task Execution</div>
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('supervisor')}
                className="text-left p-2 rounded bg-[#0a0f1e] hover:bg-[#162040] border border-[#1e2d55] text-[11px] transition-colors"
              >
                <div className="font-semibold text-amber-400">4. Supervisor</div>
                <div className="text-slate-500 text-[10px]">Verification & QA</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Warning Notice */}
        <p className="text-center text-[11px] text-slate-500 mt-4 max-w-sm mx-auto">
          Unauthorized access to this government distribution operations platform is strictly prohibited and monitored under IT Act 2000.
        </p>
      </div>
    </div>
  );
}
