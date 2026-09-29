import React, { useState } from 'react';
import { 
  Users, 
  Phone, 
  ShieldAlert, 
  UserPlus, 
  Trash2, 
  Stethoscope, 
  CheckSquare, 
  Square 
} from 'lucide-react';
import type { BiodataProfile, FamilyMemberItem } from '../../types/biodata';

interface StepFamilyProps {
  data: BiodataProfile;
  onChange: (updated: BiodataProfile) => void;
  errors: Record<string, string>;
}

export const StepFamily: React.FC<StepFamilyProps> = ({ data, onChange, errors }) => {
  const { familyAndEmergency } = data;

  // Local scratch for adding a family member
  const [famName, setFamName] = useState('');
  const [famRelation, setFamRelation] = useState('Child');
  const [famAge, setFamAge] = useState<number | ''>('');
  const [famPhone, setFamPhone] = useState('');
  const [famDependent, setFamDependent] = useState(false);

  const updatePrimaryEmergency = (field: string, value: any) => {
    onChange({
      ...data,
      familyAndEmergency: {
        ...familyAndEmergency,
        primaryEmergencyContact: {
          ...familyAndEmergency.primaryEmergencyContact,
          [field]: value,
        }
      }
    });
  };

  const updateSecondaryEmergency = (field: string, value: string) => {
    onChange({
      ...data,
      familyAndEmergency: {
        ...familyAndEmergency,
        secondaryEmergencyContact: {
          name: familyAndEmergency.secondaryEmergencyContact?.name || '',
          relationship: familyAndEmergency.secondaryEmergencyContact?.relationship || '',
          phone: familyAndEmergency.secondaryEmergencyContact?.phone || '',
          email: familyAndEmergency.secondaryEmergencyContact?.email || '',
          [field]: value,
        }
      }
    });
  };

  const updateDoctor = (field: string, value: string) => {
    onChange({
      ...data,
      familyAndEmergency: {
        ...familyAndEmergency,
        primaryPhysician: {
          name: familyAndEmergency.primaryPhysician?.name || '',
          clinicHospital: familyAndEmergency.primaryPhysician?.clinicHospital || '',
          phone: familyAndEmergency.primaryPhysician?.phone || '',
          [field]: value,
        }
      }
    });
  };

  const handleAddFamilyMember = () => {
    if (!famName.trim()) return;
    const item: FamilyMemberItem = {
      id: `fam-${Date.now()}`,
      name: famName.trim(),
      relationship: famRelation,
      age: famAge !== '' ? Number(famAge) : undefined,
      phone: famPhone.trim() || undefined,
      isDependent: famDependent,
    };
    onChange({
      ...data,
      familyAndEmergency: {
        ...familyAndEmergency,
        familyMembers: [...familyAndEmergency.familyMembers, item],
      }
    });
    setFamName('');
    setFamAge('');
    setFamPhone('');
    setFamDependent(false);
  };

  const handleRemoveFamilyMember = (id: string) => {
    onChange({
      ...data,
      familyAndEmergency: {
        ...familyAndEmergency,
        familyMembers: familyAndEmergency.familyMembers.filter(f => f.id !== id),
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-rose-600" />
          <span>Step 5: Family & Emergency Network</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Designate primary emergency decision makers, family dependents, and primary physician.
        </p>
      </div>

      {/* 1. Primary Emergency Contact (Critical) */}
      <div className="p-5 bg-rose-50/70 rounded-2xl border-2 border-rose-300 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Primary Emergency Contact (Highest Priority) <span className="text-rose-600">*</span></span>
          </label>
          <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">
            Dialed First in Emergencies
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Contact Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sunita Sharma"
              value={familyAndEmergency.primaryEmergencyContact.name}
              onChange={(e) => updatePrimaryEmergency('name', e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white focus:outline-hidden focus:ring-2 ${
                errors.emergName 
                  ? 'border-rose-400 focus:ring-rose-200' 
                  : 'border-slate-200 focus:border-rose-500'
              }`}
            />
            {errors.emergName && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.emergName}</p>}
          </div>

          {/* Relationship */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Relationship to Person
            </label>
            <input
              type="text"
              placeholder="e.g. Spouse, Mother, Father, Sibling, Guardian"
              value={familyAndEmergency.primaryEmergencyContact.relationship}
              onChange={(e) => updatePrimaryEmergency('relationship', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-rose-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Emergency Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +91 98452 98765"
              value={familyAndEmergency.primaryEmergencyContact.phone}
              onChange={(e) => updatePrimaryEmergency('phone', e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono bg-white focus:outline-hidden focus:ring-2 ${
                errors.emergPhone 
                  ? 'border-rose-400 focus:ring-rose-200' 
                  : 'border-slate-200 focus:border-rose-500'
              }`}
            />
            {errors.emergPhone && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.emergPhone}</p>}
          </div>

          {/* Alternate Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Alternate Phone / Office Phone
            </label>
            <input
              type="tel"
              placeholder="e.g. +91 80 2345 6780"
              value={familyAndEmergency.primaryEmergencyContact.altPhone || ''}
              onChange={(e) => updatePrimaryEmergency('altPhone', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono bg-white focus:outline-hidden focus:border-rose-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Contact Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. emergency@family.com"
              value={familyAndEmergency.primaryEmergencyContact.email || ''}
              onChange={(e) => updatePrimaryEmergency('email', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-rose-500"
            />
          </div>

          {/* Authorized Medical Decision Maker */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => updatePrimaryEmergency('isAuthorizedMedicalDecisionMaker', !familyAndEmergency.primaryEmergencyContact.isAuthorizedMedicalDecisionMaker)}
              className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer p-2 rounded-xl bg-white/80 border border-rose-200 w-full"
            >
              {familyAndEmergency.primaryEmergencyContact.isAuthorizedMedicalDecisionMaker ? (
                <CheckSquare className="w-5 h-5 text-rose-600 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-400 shrink-0" />
              )}
              <div className="text-left">
                <span>Authorized Medical Decision Maker</span>
                <span className="block text-[10px] text-slate-500 font-normal">Can provide legal consent for emergency surgery / treatments</span>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Secondary Emergency Contact */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Phone className="w-4 h-4 text-slate-500" />
          <span>Secondary Emergency Contact (Backup)</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Name</label>
            <input
              type="text"
              placeholder="e.g. Suresh Mehta"
              value={familyAndEmergency.secondaryEmergencyContact?.name || ''}
              onChange={(e) => updateSecondaryEmergency('name', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Relationship</label>
            <input
              type="text"
              placeholder="e.g. Father / Sibling"
              value={familyAndEmergency.secondaryEmergencyContact?.relationship || ''}
              onChange={(e) => updateSecondaryEmergency('relationship', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
            <input
              type="tel"
              placeholder="e.g. +91 94480 11223"
              value={familyAndEmergency.secondaryEmergencyContact?.phone || ''}
              onChange={(e) => updateSecondaryEmergency('phone', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono bg-white focus:outline-hidden focus:border-rose-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Primary Care Physician / Doctor */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Stethoscope className="w-4 h-4 text-emerald-600" />
          <span>Primary Care Physician / Family Doctor</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Doctor Name</label>
            <input
              type="text"
              placeholder="e.g. Dr. K. S. Raman"
              value={familyAndEmergency.primaryPhysician?.name || ''}
              onChange={(e) => updateDoctor('name', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Clinic / Hospital</label>
            <input
              type="text"
              placeholder="e.g. Manipal Hospital, Airport Road"
              value={familyAndEmergency.primaryPhysician?.clinicHospital || ''}
              onChange={(e) => updateDoctor('clinicHospital', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Doctor / Clinic Phone</label>
            <input
              type="tel"
              placeholder="e.g. +91 80 2502 4444"
              value={familyAndEmergency.primaryPhysician?.phone || ''}
              onChange={(e) => updateDoctor('phone', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono bg-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 4. Family Members & Dependents List */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-500" />
            <span>Family Members, Next-of-Kin & Dependents</span>
          </label>
          <span className="text-xs text-slate-400">{familyAndEmergency.familyMembers.length} listed</span>
        </div>

        {/* Add Family Member Form */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div>
            <input
              type="text"
              placeholder="Name (e.g. Reyansh)"
              value={famName}
              onChange={(e) => setFamName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-rose-500"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Relationship (e.g. Son)"
              value={famRelation}
              onChange={(e) => setFamRelation(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-rose-500"
            />
          </div>

          <div>
            <input
              type="number"
              placeholder="Age"
              value={famAge}
              onChange={(e) => setFamAge(e.target.value ? parseInt(e.target.value) : '')}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-rose-500"
            />
          </div>

          <div>
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={famPhone}
              onChange={(e) => setFamPhone(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-mono focus:outline-hidden focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={famDependent}
                onChange={(e) => setFamDependent(e.target.checked)}
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span>Dependent</span>
            </label>
            <button
              type="button"
              onClick={handleAddFamilyMember}
              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Family Members list */}
        {familyAndEmergency.familyMembers.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {familyAndEmergency.familyMembers.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-800">{f.name}</span>
                  <span className="text-slate-500">{f.relationship} {f.age ? `(${f.age} yrs)` : ''}</span>
                  {f.phone && <span className="font-mono text-slate-600">{f.phone}</span>}
                  {f.isDependent && (
                    <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-semibold text-[10px]">
                      Dependent
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFamilyMember(f.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
