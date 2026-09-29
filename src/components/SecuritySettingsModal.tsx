import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  KeyRound, 
  Mail, 
  User, 
  CheckCircle2, 
  ShieldCheck, 
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';
import { authService, type AuthUser } from '../services/authService';

interface SecuritySettingsModalProps {
  currentUser: AuthUser;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const SecuritySettingsModal: React.FC<SecuritySettingsModalProps> = ({
  currentUser,
  onClose,
  onSuccess,
}) => {
  const creds = authService.getStoredCredentials();

  const [name, setName] = useState(creds.name || currentUser.name);
  const [email, setEmail] = useState(creds.email || currentUser.email);
  const [password, setPassword] = useState(creds.password || '');
  const [pin, setPin] = useState(creds.pin || '');
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      alert('Password cannot be empty.');
      return;
    }

    const res = authService.changeCredentials(email, password, pin, name);
    if (res.success) {
      setSaved(true);
      setTimeout(() => {
        onSuccess('Security credentials updated successfully!');
        onClose();
      }, 500);
    } else {
      alert(res.error || 'Failed to update credentials.');
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset credentials back to default (admin / admin / PIN: 1234)?')) {
      authService.resetDefaultCredentials();
      const fresh = authService.getStoredCredentials();
      setName(fresh.name);
      setEmail(fresh.email);
      setPassword(fresh.password);
      setPin(fresh.pin);
      onSuccess('Reset to default credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Security & Login Settings</h3>
              <p className="text-xs text-slate-500">Change your private password and security PIN</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Account Holder Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-rose-500"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Login Email / Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-rose-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-rose-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-2 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 4-digit PIN */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Security PIN (4–6 digits for fast mobile unlock)
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="e.g. 1234"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm font-mono tracking-widest focus:outline-hidden focus:border-rose-500"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {saved && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{saved ? 'Saved!' : 'Save Credentials'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
