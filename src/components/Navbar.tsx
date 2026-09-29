import React, { useRef, useState } from 'react';
import { 
  HeartPulse, 
  UserPlus, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  RotateCcw, 
  Database,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onNewProfile: () => void;
  onHomeClick: () => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
  onExportCSV: () => void;
  onResetData: () => void;
  profileCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewProfile,
  onHomeClick,
  onExportJSON,
  onImportJSON,
  onExportCSV,
  onResetData,
  profileCount,
}) => {
  const [dataMenuOpen, setDataMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setDataMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={onHomeClick}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">BioMed Registry</span>
                <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {profileCount} {profileCount === 1 ? 'Profile' : 'Profiles'}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Biodata, Medical Passport & Emergency Network</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Data Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDataMenuOpen(!dataMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                title="Backup and Export Options"
              >
                <Database className="w-4 h-4 text-slate-600" />
                <span className="hidden md:inline">Data & Backup</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${dataMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {dataMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setDataMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => {
                        onExportJSON();
                        setDataMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-left transition-colors"
                    >
                      <Download className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-medium">Export Backup (JSON)</div>
                        <div className="text-xs text-slate-400">Complete raw biodata</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        fileInputRef.current?.click();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-left transition-colors"
                    >
                      <Upload className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium">Import Backup (JSON)</div>
                        <div className="text-xs text-slate-400">Restore saved database</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onExportCSV();
                        setDataMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-left transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                      <div>
                        <div className="font-medium">Export to CSV / Excel</div>
                        <div className="text-xs text-slate-400">Table spreadsheet format</div>
                      </div>
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        if (window.confirm('Reset all records to default sample data? Any unexported custom profiles will be replaced.')) {
                          onResetData();
                        }
                        setDataMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 text-left transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-amber-600" />
                      <div>
                        <div className="font-medium">Reset Sample Records</div>
                        <div className="text-xs text-amber-600/70">Reload default 3 profiles</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Hidden File Input for JSON Import */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            {/* New Profile CTA */}
            <button
              onClick={onNewProfile}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Record Biodata</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
