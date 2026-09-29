import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ProfileDetail } from './components/ProfileDetail';
import { WizardContainer } from './components/ProfileWizard/WizardContainer';
import { EmergencyPocketCard } from './components/EmergencyPocketCard';
import { LoginScreen } from './components/LoginScreen';
import { SecuritySettingsModal } from './components/SecuritySettingsModal';
import { storageService } from './services/storageService';
import { authService, type AuthUser } from './services/authService';
import { createEmptyProfile, type BiodataProfile } from './types/biodata';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [securityModalOpen, setSecurityModalOpen] = useState(false);

  const [profiles, setProfiles] = useState<BiodataProfile[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'detail' | 'wizard'>('dashboard');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [wizardProfile, setWizardProfile] = useState<BiodataProfile>(createEmptyProfile());
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [pocketCardProfile, setPocketCardProfile] = useState<BiodataProfile | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Load profiles on mount and sync with cloud
  useEffect(() => {
    const loaded = storageService.getProfiles();
    setProfiles(loaded);

    // If already logged in as Individual, jump straight to personal profile
    const active = authService.getCurrentUser();
    if (active && active.role === 'Individual') {
      const personal = loaded.find(p => p.id === active.profileId || p.contact.email.toLowerCase() === active.email.toLowerCase());
      if (personal) {
        setSelectedProfileId(personal.id);
        setCurrentView('detail');
      }
    }

    // Fetch latest cloud state (cross-device sync so Admin sees all newly created individual profiles)
    storageService.fetchFromCloud().then((cloudList) => {
      setProfiles(cloudList);
      const curr = authService.getCurrentUser();
      if (curr && curr.role === 'Individual') {
        const pers = cloudList.find(p => p.id === curr.profileId || p.contact.email.toLowerCase() === curr.email.toLowerCase());
        if (pers) {
          setSelectedProfileId(pers.id);
        }
      }
    });

    // Subscribe to cloud sync updates
    const unsubscribe = storageService.onSync((syncedList) => {
      setProfiles(syncedList);
      const curr = authService.getCurrentUser();
      if (curr && curr.role === 'Individual') {
        const pers = syncedList.find(p => p.id === curr.profileId || p.contact.email.toLowerCase() === curr.email.toLowerCase());
        if (pers) {
          setSelectedProfileId(pers.id);
        }
      }
    });

    // Periodic sync every 15 seconds
    const syncInterval = setInterval(() => {
      storageService.fetchFromCloud();
    }, 15000);

    // Sync whenever user focuses the browser tab
    const handleFocus = () => {
      storageService.fetchFromCloud();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      unsubscribe();
      clearInterval(syncInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Helper to resolve an Individual user's personal profile
  const resolvePersonalProfile = (user: AuthUser, list: BiodataProfile[]): BiodataProfile => {
    const existing = list.find(p => p.id === user.profileId || p.contact.email.toLowerCase() === user.email.toLowerCase());
    if (existing) return existing;

    // Create a new starter profile for this individual
    const newProfile = createEmptyProfile();
    newProfile.id = user.profileId || `bio-usr-${Date.now()}`;
    newProfile.personal.fullName = user.name;
    newProfile.contact.email = user.email;
    storageService.saveProfile(newProfile);
    const refreshed = storageService.getProfiles();
    setProfiles(refreshed);
    return newProfile;
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    storageService.fetchFromCloud().then((loaded) => {
      setProfiles(loaded);

      if (user.role === 'Individual') {
        const personal = resolvePersonalProfile(user, loaded);
        setSelectedProfileId(personal.id);
        setCurrentView('detail');
        showToast(`Welcome back, ${user.name}! Your medical profile is loaded.`, 'success');
      } else {
        setCurrentView('dashboard');
        setSelectedProfileId(null);
        showToast(`Welcome, Administrator! You have full registry access.`, 'success');
      }
    });
  };

  const handleRegisterUser = (name: string, email: string, pass: string, pin: string): AuthUser => {
    // 1. Create a personal profile
    const newProfile = createEmptyProfile();
    newProfile.id = `bio-${Date.now()}`;
    newProfile.personal.fullName = name;
    newProfile.contact.email = email;
    storageService.saveProfile(newProfile);
    setProfiles(storageService.getProfiles());

    // 2. Register account
    const res = authService.register(name, email, pass, pin, newProfile.id);
    if (!res.user) {
      throw new Error(res.error || 'Registration failed');
    }

    // 3. Immediately push to cloud so Admin sees it across all computers & devices
    storageService.pushToCloud();
    return res.user;
  };


  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setSelectedProfileId(null);
    setCurrentView('dashboard');
    showToast('You have been logged out securely.', 'info');
  };

  // Currently viewed profile
  const currentProfile = profiles.find(p => p.id === selectedProfileId);

  // Handlers
  const handleHomeClick = () => {
    if (currentUser?.role === 'Individual') {
      const personal = resolvePersonalProfile(currentUser, profiles);
      setSelectedProfileId(personal.id);
      setCurrentView('detail');
    } else {
      setCurrentView('dashboard');
      setSelectedProfileId(null);
    }
  };

  const handleNewProfile = () => {
    setWizardProfile(createEmptyProfile());
    setIsEditing(false);
    setCurrentView('wizard');
  };

  const handleEditProfile = (profile: BiodataProfile) => {
    setWizardProfile(profile);
    setIsEditing(true);
    setCurrentView('wizard');
  };

  const handleViewProfile = (profile: BiodataProfile) => {
    setSelectedProfileId(profile.id);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProfile = (id: string, name: string) => {
    if (currentUser?.role === 'Individual') {
      alert('Individual accounts cannot delete primary profile. You can edit your information anytime.');
      return;
    }

    if (window.confirm(`Are you sure you want to permanently delete the biodata record for "${name}"?`)) {
      const ok = storageService.deleteProfile(id);
      if (ok) {
        setProfiles(storageService.getProfiles());
        if (selectedProfileId === id) {
          setCurrentView('dashboard');
          setSelectedProfileId(null);
        }
        showToast(`Record for ${name} has been removed.`, 'info');
      }
    }
  };

  const handleSaveProfile = (savedData: BiodataProfile) => {
    const saved = storageService.saveProfile(savedData);
    const updatedList = storageService.getProfiles();
    setProfiles(updatedList);
    setSelectedProfileId(saved.id);
    setCurrentView('detail');
    showToast(`Biodata profile for ${saved.personal.fullName} saved successfully!`, 'success');
  };

  const handleUpdateProfile = (updatedProfile: BiodataProfile) => {
    storageService.saveProfile(updatedProfile);
    const updatedList = storageService.getProfiles();
    setProfiles(updatedList);
    showToast(`Updated medical records for ${updatedProfile.personal.fullName}`, 'success');
  };

  const handleExportJSON = () => {
    const jsonStr = storageService.exportProfilesAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biomed_registry_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Registry backup exported (JSON format)', 'success');
  };

  const handleImportJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const result = storageService.importProfilesFromJSON(content);
        if (result.success) {
          const reloaded = storageService.getProfiles();
          setProfiles(reloaded);
          if (currentUser?.role === 'Individual') {
            const personal = resolvePersonalProfile(currentUser, reloaded);
            setSelectedProfileId(personal.id);
            setCurrentView('detail');
          } else {
            setCurrentView('dashboard');
          }
          showToast(`Successfully restored ${result.count} biodata profiles!`, 'success');
        } else {
          showToast(result.error || 'Failed to import backup.', 'error');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    const csvStr = storageService.exportProfilesAsCSV();
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biomed_registry_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported table records as CSV for Excel / Sheets', 'success');
  };

  const handleResetData = () => {
    const reset = storageService.resetToSampleData();
    setProfiles(reset);
    if (currentUser?.role === 'Individual') {
      const personal = resolvePersonalProfile(currentUser, reset);
      setSelectedProfileId(personal.id);
      setCurrentView('detail');
    } else {
      setCurrentView('dashboard');
    }
    showToast('Reset to default medical profiles', 'info');
  };

  // If not authenticated, render Login Screen
  if (!currentUser) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

  // Active user's profile count representation
  const displayedCount = currentUser.role === 'Individual' ? 1 : profiles.length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenSecuritySettings={() => setSecurityModalOpen(true)}
        onNewProfile={handleNewProfile}
        onHomeClick={handleHomeClick}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        onExportCSV={handleExportCSV}
        onResetData={handleResetData}
        profileCount={displayedCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Administrator sees all profiles on Dashboard */}
        {currentView === 'dashboard' && currentUser.role === 'Administrator' && (
          <Dashboard
            profiles={profiles}
            onNewProfile={handleNewProfile}
            onViewProfile={handleViewProfile}
            onEditProfile={handleEditProfile}
            onDeleteProfile={handleDeleteProfile}
            onOpenCard={(p) => setPocketCardProfile(p)}
          />
        )}

        {/* Profile Detail: Individual sees only their profile, or Admin views selected profile */}
        {currentView === 'detail' && currentProfile && (
          <ProfileDetail
            profile={currentProfile}
            onBack={handleHomeClick}
            onEdit={handleEditProfile}
            onDelete={handleDeleteProfile}
            onOpenCard={(p) => setPocketCardProfile(p)}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {/* Wizard for Adding / Editing Profile */}
        {currentView === 'wizard' && (
          <WizardContainer
            initialData={wizardProfile}
            isEditing={isEditing}
            onSave={handleSaveProfile}
            onCancel={() => {
              if (selectedProfileId) {
                setCurrentView('detail');
              } else if (currentUser.role === 'Administrator') {
                setCurrentView('dashboard');
              } else {
                const personal = resolvePersonalProfile(currentUser, profiles);
                setSelectedProfileId(personal.id);
                setCurrentView('detail');
              }
            }}
          />
        )}
      </main>

      {/* Emergency Pocket Card Modal */}
      {pocketCardProfile && (
        <EmergencyPocketCard
          profile={pocketCardProfile}
          onClose={() => setPocketCardProfile(null)}
        />
      )}

      {/* Security & Password Settings Modal */}
      {securityModalOpen && (
        <SecuritySettingsModal
          currentUser={currentUser}
          onClose={() => setSecurityModalOpen(false)}
          onSuccess={(msg) => showToast(msg, 'success')}
        />
      )}

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none no-print">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border text-sm font-medium transition-all transform animate-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border-slate-800'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-700'
                : 'bg-white text-slate-800 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-white shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-blue-500 shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 opacity-70 hover:opacity-100 transition-opacity ml-2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-bold text-slate-700">BioMed Registry</span> — {currentUser.role === 'Administrator' ? 'Administrator Control Panel' : `Private Health Passport (${currentUser.name})`}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-700 font-semibold">● Session Active ({currentUser.email})</span>
            <span>•</span>
            <span>Private & Encrypted Storage</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
