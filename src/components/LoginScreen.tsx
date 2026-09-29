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
  Users,
  AlertCircle
} from 'lucide-react';
import { authService, type AuthUser } from '../services/authService';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
  onRegisterUser?: (name: string, email: string, pass: string, pin: string) => AuthUser;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onRegisterUser }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loginMode, setLoginMode] = useState<'password' | 'pin'>('password');
  
  // Login fields
  const [identifier, setIdentifier] = useState('pradeep');
  const [password, setPassword] = useState('user123');
  const [pin, setPin] = useState('1111');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPin, setRegPin] = useState('1234');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
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
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    }, 250);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError('Please fill all registration fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (onRegisterUser) {
        const user = onRegisterUser(regName, regEmail, regPassword, regPin);
        setLoading(false);
        onLoginSuccess(user);
      } else {
        const res = authService.register(regName, regEmail, regPassword, regPin);
        setLoading(false);
        if (res.success && res.user) {
          onLoginSuccess(res.user);
        } else {
          setError(res.error || 'Registration failed');
        }
      }
    }, 300);
  };

  // Quick Account Selectors
  const selectQuickAccount = (type: 'individual' | 'admin') => {
    setError('');
    if (type === 'individual') {
      setIdentifier('pradeep');
      setPassword('user123');
      setPin('1111');
    } else {
      setIdentifier('admin');
      setPassword('admin');
      setPin('1234');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 flex flex-col justify-center items-center p-4 select-none">
      
      {/* Container */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Top Header */}
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
            {/* Quick Role Selector Buttons */}
            <div className="px-6 pt-4 pb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Choose Access Role:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => selectQuickAccount('individual')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    identifier === 'pradeep' || identifier.includes('pradeep')
                      ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <User className="w-3.5 h-3.5 text-rose-600" />
                    <span>My Profile</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Sees ONLY own record (Pradeep)</p>
                </button>

                <button
                  type="button"
                  onClick={() => selectQuickAccount('admin')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    identifier === 'admin'
                      ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Administrator</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Sees ALL registry profiles</p>
                </button>
              </div>
            </div>

            {/* Sub-tab: Password vs PIN */}
            <div className="flex px-6 pt-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => setLoginMode('password')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  loginMode === 'password' ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => setLoginMode('pin')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  loginMode === 'pin' ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                PIN Login
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="p-6 pt-3 space-y-4">
              
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Username / Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. pradeep or admin"
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
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-2.5 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                /* PIN */
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 text-center">
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
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-rose-500"
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
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-rose-500"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-rose-500"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono tracking-widest focus:outline-hidden focus:border-rose-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Creating Profile...' : 'Register & Open My Profile'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Security Footnote */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
          Personal data is encrypted and isolated strictly to your account session.
        </div>

      </div>

    </div>
  );
};
