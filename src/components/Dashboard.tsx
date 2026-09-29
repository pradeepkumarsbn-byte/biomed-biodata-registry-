import React, { useState, useMemo } from 'react';
import { 
  Search, 
  LayoutGrid, 
  List, 
  UserPlus, 
  ArrowUpDown,
  XCircle,
  Users
} from 'lucide-react';
import type { BiodataProfile, BloodGroup } from '../types/biodata';
import { StatsOverview } from './StatsOverview';
import { ProfileCard } from './ProfileCard';
import { ProfileTableView } from './ProfileTableView';

interface DashboardProps {
  profiles: BiodataProfile[];
  onNewProfile: () => void;
  onViewProfile: (profile: BiodataProfile) => void;
  onEditProfile: (profile: BiodataProfile) => void;
  onDeleteProfile: (id: string, name: string) => void;
  onOpenCard: (profile: BiodataProfile) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profiles,
  onNewProfile,
  onViewProfile,
  onEditProfile,
  onDeleteProfile,
  onOpenCard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [insuranceFilter, setInsuranceFilter] = useState<'ALL' | 'INSURED' | 'UNINSURED'>('ALL');
  const [sortBy, setSortBy] = useState<'updated' | 'name-asc' | 'name-desc' | 'age-asc' | 'age-desc'>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filtered & sorted profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      // Search term
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = p.personal.fullName.toLowerCase().includes(query);
        const phoneMatch = p.contact.primaryPhone.includes(query) || (p.contact.secondaryPhone || '').includes(query);
        const emailMatch = p.contact.email.toLowerCase().includes(query);
        const cityMatch = p.contact.residentialAddress.city.toLowerCase().includes(query);
        const policyMatch = p.insurance.hasInsurance && (p.insurance.policyNumber.toLowerCase().includes(query) || p.insurance.providerName.toLowerCase().includes(query));
        const allergyMatch = p.medical.allergies.some(a => a.allergen.toLowerCase().includes(query));
        const conditionMatch = p.medical.chronicConditions.some(c => c.toLowerCase().includes(query));
        const emergMatch = p.familyAndEmergency.primaryEmergencyContact.name.toLowerCase().includes(query) || p.familyAndEmergency.primaryEmergencyContact.phone.includes(query);

        if (!nameMatch && !phoneMatch && !emailMatch && !cityMatch && !policyMatch && !allergyMatch && !conditionMatch && !emergMatch) {
          return false;
        }
      }

      // Blood group filter
      if (selectedBloodGroup !== 'ALL' && p.medical.bloodGroup !== selectedBloodGroup) {
        return false;
      }

      // Insurance filter
      if (insuranceFilter === 'INSURED' && !p.insurance.hasInsurance) {
        return false;
      }
      if (insuranceFilter === 'UNINSURED' && p.insurance.hasInsurance) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.personal.fullName.localeCompare(b.personal.fullName);
      }
      if (sortBy === 'name-desc') {
        return b.personal.fullName.localeCompare(a.personal.fullName);
      }
      if (sortBy === 'age-asc') {
        return a.personal.age - b.personal.age;
      }
      if (sortBy === 'age-desc') {
        return b.personal.age - a.personal.age;
      }
      // 'updated'
      return new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime();
    });
  }, [profiles, searchQuery, selectedBloodGroup, insuranceFilter, sortBy]);

  const hasActiveFilters = searchQuery.trim() !== '' || selectedBloodGroup !== 'ALL' || insuranceFilter !== 'ALL';

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedBloodGroup('ALL');
    setInsuranceFilter('ALL');
  };

  return (
    <div className="space-y-6">
      
      {/* High-level metrics */}
      <StatsOverview
        profiles={profiles}
        selectedBloodGroup={selectedBloodGroup}
        onSelectBloodGroup={setSelectedBloodGroup}
      />

      {/* Search and Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, phone, email, policy #, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Selectors & Sort */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            
            {/* Insurance filter */}
            <select
              value={insuranceFilter}
              onChange={(e) => setInsuranceFilter(e.target.value as any)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:border-rose-500 cursor-pointer"
            >
              <option value="ALL">All Insurance Status</option>
              <option value="INSURED">Insured Only</option>
              <option value="UNINSURED">No Insurance</option>
            </select>

            {/* Sorting */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value="updated">Recently Updated</option>
                <option value="name-asc">Name (A → Z)</option>
                <option value="name-desc">Name (Z → A)</option>
                <option value="age-asc">Age (Youngest first)</option>
                <option value="age-desc">Age (Oldest first)</option>
              </select>
            </div>

            {/* Grid vs Table toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Results summary & active filter indicators */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div>
            Showing <span className="font-bold text-slate-800">{filteredProfiles.length}</span> of {profiles.length} profiles
            {hasActiveFilters && (
              <span className="ml-2 text-rose-600 font-medium">
                (filtered)
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline underline-offset-2 cursor-pointer"
            >
              Reset all search & filters
            </button>
          )}
        </div>

      </div>

      {/* Profile List / Grid */}
      {filteredProfiles.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onView={onViewProfile}
                onEdit={onEditProfile}
                onDelete={onDeleteProfile}
                onOpenCard={onOpenCard}
              />
            ))}
          </div>
        ) : (
          <ProfileTableView
            profiles={filteredProfiles}
            onView={onViewProfile}
            onEdit={onEditProfile}
            onDelete={onDeleteProfile}
            onOpenCard={onOpenCard}
          />
        )
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
            <Users className="w-8 h-8" />
          </div>
          <div className="max-w-sm mx-auto">
            <h3 className="font-bold text-slate-800 text-base">No Matching Biodata Records Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {hasActiveFilters 
                ? 'Try adjusting your search criteria or clearing active blood group / insurance filters.' 
                : 'Start recording comprehensive biodata and emergency medical profiles now.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            {hasActiveFilters ? (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={onNewProfile}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Record First Biodata</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
