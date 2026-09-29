import React, { useState } from 'react';
import { 
  HeartPulse, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  User,
  AlertCircle,
  HelpCircle,
  KeyRound
} from 'lucide-react';
import { authService, type AuthUser } from '../services/authService';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
  onRegisterUser?: (name: string, email: string, pass: string, pin: string) => AuthUser;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onRegisterUser }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loginMode, setLoginMode] = useState<'password' | 'pin'>('password');
  
  // Login fields - strictly blank by default
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPin, setRegPin] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your username or email address.');
      return;
    }
    if (loginMode === 'password' && !password.trim()) {
      setError('Please enter your password.');
      return;
    }
    if (loginMode === 'pin' && !pin.trim()) {
      setError('Please enter your security PIN.');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      let res;
      if (loginMode === 'password') {
        res = authService.login(identifier, password, rememberMe);
      } else {
        res = authService.login(identifier, pin, rememberMe);
      }

      setLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError(res.error || 'Authentication failed. Please check your credentials.');
      }
    }, 250);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError('Please fill in all required registration fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        if (onRegisterUser) {
          const user = onRegisterUser(regName, regEmail, regPassword, regPin || '1234');
          setLoading(false);
          onLoginSuccess(user);
        } else {
          const res = authService.register(regName, regEmail, regPassword, regPin || '1234');
          setLoading(false);
          if (res.success && res.user) {
            onLoginSuccess(res.user);
          } else {
            setError(res.error || 'Registration failed');
          }
        }
      } catch (err) {
        setLoading(false);
        setError(err instanceof Error ? err.message : 'Registration failed');
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 flex flex-col justify-center items-center p-4 select-none">
      
      {/* Login Card Container */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-8 pb-5 bg-gradient-to-b from-rose-50/60 to-white text-center border-b border-slate-100">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 mb-3 animate-in zoom-in-75 duration-300">
            <HeartPulse className="w-8 h-8 animate-pulse" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">BioMed Registry</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Private Medical Records & Personal Health Passport
          </p>

          <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-rose-100/70 text-rose-800 rounded-full text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            <span>Secure Access Control</span>
          </div>
        </div>

        {/* Tab switch: Sign In vs Register */}
        <div className="flex border-b border-slate-100 bg-slate-50 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Create Personal Account</span>
          </button>
        </div>

        {tab === 'login' ? (
          <div>
            {/* Sub-tab: Password vs PIN */}
            <div className="flex px-6 pt-5 gap-2 text-xs">
              <button
                type="button"
                onClick={() => { setLoginMode('password'); setError(''); }}
                className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  loginMode === 'password' 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Password Login</span>
              </button>
              <button
                type="button"
                onClick={() => { setLoginMode('pin'); setError(''); }}
                className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  loginMode === 'pin' 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>PIN Login</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="p-6 pt-4 space-y-4">
              
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Username / Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Username or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter your username or email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {loginMode === 'password' ? (
                /* Password */
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-2.5 cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                /* PIN */
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                    Security PIN (4 digits)
                  </label>
                  <div className="max-w-[180px] mx-auto">
                    <input
                      type="password"
                      maxLength={6}
                      required
                      placeholder="••••"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full py-2.5 text-center tracking-[0.5em] text-xl font-mono font-bold rounded-xl border border-slate-200 focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span>Remember my login</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </div>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="p-6 space-y-3.5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. ramesh@gmail.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Create password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  4-Digit PIN
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 1234"
                  value={regPin}
                  onChange={(e) => setRegPin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono tracking-widest focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Creating Profile...' : 'Register & Open My Profile'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Footnote & Info */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500 space-y-1.5">
          <p>Personal data is encrypted and isolated strictly to your account session.</p>
          
          <div>
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3 h-3" />
              <span>{showHelp ? 'Hide account access notes' : 'View account access notes'}</span>
            </button>
          </div>

          {showHelp && (
            <div className="mt-2 text-left bg-white p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1.5 animate-in fade-in-50 duration-200">
              <div className="font-semibold text-slate-800">Access Control Overview:</div>
              <div>
                • <strong className="text-slate-700">Administrator:</strong> Enter username <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-700">admin</code> &amp; password <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-700">admin</code> (or PIN <code className="bg-slate-100 px-1 py-0.5 rounded">1234</code>) to access the complete registry directory and all patient profiles.
              </div>
              <div>
                • <strong className="text-slate-700">Individual Accounts:</strong> Individual users see <em>strictly their own private medical records</em> upon login. All other patient profiles and registry dashboards are hidden.
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
