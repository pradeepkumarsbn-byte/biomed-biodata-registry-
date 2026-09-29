import React from 'react';
import { Users, Droplets, ShieldCheck, Heart, AlertTriangle } from 'lucide-react';
import type { BiodataProfile, BloodGroup } from '../types/biodata';

interface StatsOverviewProps {
  profiles: BiodataProfile[];
  selectedBloodGroup: BloodGroup | 'ALL';
  onSelectBloodGroup: (bg: BloodGroup | 'ALL') => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  profiles,
  selectedBloodGroup,
  onSelectBloodGroup,
}) => {
  // Blood group counts
  const bloodCounts = profiles.reduce<Record<string, number>>((acc, p) => {
    const bg = p.medical.bloodGroup;
    acc[bg] = (acc[bg] || 0) + 1;
    return acc;
  }, {});

  const insuredCount = profiles.filter(p => p.insurance.hasInsurance).length;
  const organDonors = profiles.filter(p => p.medical.organDonor).length;
  const criticalAllergiesCount = profiles.filter(p => 
    p.medical.allergies.some(a => a.severity.includes('Severe'))
  ).length;

  return (
    <div className="space-y-4 mb-8">
      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Registered */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Records</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{profiles.length}</div>
          <p className="text-xs text-slate-500 mt-1">Registered individuals</p>
        </div>

        {/* Insured Status */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Health Insurance</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {insuredCount} <span className="text-xs text-slate-400 font-normal">/ {profiles.length}</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {profiles.length > 0 ? Math.round((insuredCount / profiles.length) * 100) : 0}% Covered
          </p>
        </div>

        {/* Severe Allergies / Critical */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Critical Allergies</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700">{criticalAllergiesCount}</div>
          <p className="text-xs text-slate-500 mt-1">Anaphylaxis / High alert</p>
        </div>

        {/* Organ Donors */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Organ Donors</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-700">{organDonors}</div>
          <p className="text-xs text-slate-500 mt-1">Pledged life donors</p>
        </div>

      </div>

      {/* Blood Group Matrix / Interactive Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Filter by Blood Group Distribution
            </span>
          </div>
          {selectedBloodGroup !== 'ALL' && (
            <button
              onClick={() => onSelectBloodGroup('ALL')}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline underline-offset-2"
            >
              Clear filter (Show All)
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelectBloodGroup('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedBloodGroup === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Groups ({profiles.length})
          </button>

          {(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Bombay / Rare'] as BloodGroup[]).map((bg) => {
            const count = bloodCounts[bg] || 0;
            const isSelected = selectedBloodGroup === bg;
            return (
              <button
                key={bg}
                onClick={() => onSelectBloodGroup(isSelected ? 'ALL' : bg)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-rose-600 text-white ring-2 ring-rose-600/30 shadow-xs'
                    : count > 0
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60'
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                <span>{bg}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-white/25 text-white' : count > 0 ? 'bg-rose-200/70 text-rose-800' : 'bg-slate-200 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
