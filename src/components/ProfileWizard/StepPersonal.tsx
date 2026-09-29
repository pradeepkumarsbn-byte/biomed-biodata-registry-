import React from 'react';
import { User, Shield, Image, Sparkles } from 'lucide-react';
import { GENDERS, MARITAL_STATUSES, GOV_ID_TYPES, type BiodataProfile, type Gender, type MaritalStatus, type GovIdType } from '../../types/biodata';

interface StepPersonalProps {
  data: BiodataProfile;
  onChange: (updated: BiodataProfile) => void;
  errors: Record<string, string>;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'
];

export const StepPersonal: React.FC<StepPersonalProps> = ({ data, onChange, errors }) => {
  const { personal } = data;

  const updatePersonal = <K extends keyof typeof personal>(key: K, value: (typeof personal)[K]) => {
    onChange({
      ...data,
      personal: {
        ...personal,
        [key]: value,
      }
    });
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value;
    let computedAge = personal.age;
    if (dob) {
      const birth = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      computedAge = Math.max(0, age);
    }
    onChange({
      ...data,
      personal: {
        ...personal,
        dob,
        age: computedAge,
      }
    });
  };

  const handleGovIdChange = (field: 'idType' | 'idNumber', value: string) => {
    onChange({
      ...data,
      personal: {
        ...personal,
        govId: {
          ...personal.govId,
          [field]: value,
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-rose-600" />
          <span>Step 1: Personal Particulars & Identity</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Enter legal name, date of birth, identity card number, and demographic profile.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Full Legal Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Dr. Ramesh Chandra Gupta"
            value={personal.fullName}
            onChange={(e) => updatePersonal('fullName', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 ${
              errors.fullName 
                ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30' 
                : 'border-slate-200 focus:border-rose-500 focus:ring-rose-100'
            }`}
          />
          {errors.fullName && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.fullName}</p>}
        </div>

        {/* Preferred Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Preferred / Call Name (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Ramesh"
            value={personal.preferredName || ''}
            onChange={(e) => updatePersonal('preferredName', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        {/* Occupation */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Occupation / Profession
          </label>
          <input
            type="text"
            placeholder="e.g. Senior Software Engineer"
            value={personal.occupation}
            onChange={(e) => updatePersonal('occupation', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Date of Birth <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            required
            value={personal.dob}
            onChange={handleDobChange}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 ${
              errors.dob 
                ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30' 
                : 'border-slate-200 focus:border-rose-500 focus:ring-rose-100'
            }`}
          />
          {errors.dob && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.dob}</p>}
        </div>

        {/* Age (Auto-calculated, editable) */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Calculated Age (Years)
          </label>
          <input
            type="number"
            min="0"
            max="125"
            value={personal.age || ''}
            onChange={(e) => updatePersonal('age', parseInt(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-hidden focus:border-rose-500"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Gender
          </label>
          <select
            value={personal.gender}
            onChange={(e) => updatePersonal('gender', e.target.value as Gender)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-rose-500"
          >
            {GENDERS.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Marital Status
          </label>
          <select
            value={personal.maritalStatus}
            onChange={(e) => updatePersonal('maritalStatus', e.target.value as MaritalStatus)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-rose-500"
          >
            {MARITAL_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Nationality
          </label>
          <input
            type="text"
            placeholder="e.g. Indian"
            value={personal.nationality}
            onChange={(e) => updatePersonal('nationality', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-rose-500"
          />
        </div>

      </div>

      {/* Government Identification Details */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
          <Shield className="w-4 h-4 text-slate-600" />
          <span>Government Identification Document</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">ID Type</label>
            <select
              value={personal.govId.idType}
              onChange={(e) => handleGovIdChange('idType', e.target.value as GovIdType)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-rose-500"
            >
              {GOV_ID_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">ID Number</label>
            <input
              type="text"
              placeholder="e.g. 5928-1920-4491 or Passport #"
              value={personal.govId.idNumber}
              onChange={(e) => handleGovIdChange('idNumber', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Photo / Avatar Section */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Image className="w-4 h-4 text-slate-600" />
            <span>Profile Photo / Avatar</span>
          </label>
          {personal.photoUrl && (
            <button
              type="button"
              onClick={() => updatePersonal('photoUrl', '')}
              className="text-xs text-rose-600 hover:underline"
            >
              Remove Photo
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl border-2 border-slate-200 bg-white overflow-hidden shrink-0 flex items-center justify-center">
            {personal.photoUrl ? (
              <img src={personal.photoUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-slate-300" />
            )}
          </div>

          <div className="flex-1 space-y-2">
            <input
              type="text"
              placeholder="Paste image URL (https://...)"
              value={personal.photoUrl || ''}
              onChange={(e) => updatePersonal('photoUrl', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:border-rose-500"
            />
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Or pick a preset avatar:</span>
            </div>
            <div className="flex items-center gap-2">
              {PRESET_AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => updatePersonal('photoUrl', url)}
                  className={`w-7 h-7 rounded-lg overflow-hidden border transition-transform hover:scale-110 ${
                    personal.photoUrl === url ? 'ring-2 ring-rose-500 border-white' : 'border-slate-300'
                  }`}
                >
                  <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
