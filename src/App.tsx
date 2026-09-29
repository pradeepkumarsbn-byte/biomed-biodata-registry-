import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ProfileDetail } from './components/ProfileDetail';
import { WizardContainer } from './components/ProfileWizard/WizardContainer';
import { EmergencyPocketCard } from './components/EmergencyPocketCard';
import { storageService } from './services/storageService';
import { createEmptyProfile, type BiodataProfile } from './types/biodata';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const App: React.FC = () => {
  const [profiles, setProfiles] = useState<BiodataProfile[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'detail' | 'wizard'>('dashboard');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [wizardProfile, setWizardProfile] = useState<BiodataProfile>(createEmptyProfile());
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [pocketCardProfile, setPocketCardProfile] = useState<BiodataProfile | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Load profiles on mount
  useEffect(() => {
    const loaded = storageService.getProfiles();
    setProfiles(loaded);
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

  // Currently viewed profile
  const currentProfile = profiles.find(p => p.id === selectedProfileId);

  // Handlers
  const handleHomeClick = () => {
    setCurrentView('dashboard');
    setSelectedProfileId(null);
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
          setCurrentView('dashboard');
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
    setCurrentView('dashboard');
    showToast('Reset to default 3 comprehensive medical profiles', 'info');
  };

  const handleUpdateProfile = (updatedProfile: BiodataProfile) => {
    storageService.saveProfile(updatedProfile);
    const updatedList = storageService.getProfiles();
    setProfiles(updatedList);
    showToast(`Updated medical documents for ${updatedProfile.personal.fullName}`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        onNewProfile={handleNewProfile}
        onHomeClick={handleHomeClick}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        onExportCSV={handleExportCSV}
        onResetData={handleResetData}
        profileCount={profiles.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard
            profiles={profiles}
            onNewProfile={handleNewProfile}
            onViewProfile={handleViewProfile}
            onEditProfile={handleEditProfile}
            onDeleteProfile={handleDeleteProfile}
            onOpenCard={(p) => setPocketCardProfile(p)}
          />
        )}

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

        {currentView === 'wizard' && (
          <WizardContainer
            initialData={wizardProfile}
            isEditing={isEditing}
            onSave={handleSaveProfile}
            onCancel={() => {
              if (selectedProfileId) {
                setCurrentView('detail');
              } else {
                setCurrentView('dashboard');
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
            <span className="font-bold text-slate-700">BioMed Registry</span> — Secure Personal Biodata & Emergency Medical Passport System
          </div>
          <div className="flex items-center gap-4">
            <span>Client-side persistent storage</span>
            <span>•</span>
            <span>Instant Emergency Wallet Cards</span>
            <span>•</span>
            <span>Ready for Print & PDF</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
