import React from 'react';
import { 
  CheckCircle, 
  Droplets, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Heart,
  CheckCircle2,
  FileText,
  Scale
} from 'lucide-react';
import { calculateBmi, type BiodataProfile } from '../../types/biodata';

interface StepReviewProps {
  data: BiodataProfile;
  onSubmit: () => void;
  isSaving: boolean;
}

export const StepReview: React.FC<StepReviewProps> = ({ data, onSubmit, isSaving }) => {
  const { personal, contact, medical, insurance, familyAndEmergency, medicalReports = [] } = data;
  const primaryEmerg = familyAndEmergency.primaryEmergencyContact;
  const bmiInfo = calculateBmi(medical.heightCm, medical.weightKg);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Step 6: Review & Finalize Record</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Please review the summary below before saving the profile to the registry.
        </p>
      </div>

      {/* Review Card */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-6 shadow-xs">
        
        {/* Header Preview */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            {personal.photoUrl ? (
              <img
                src={personal.photoUrl}
                alt={personal.fullName}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl">
                {personal.fullName.substring(0, 2).toUpperCase() || 'BD'}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {personal.fullName || 'Unnamed Record'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {personal.age} yrs • {personal.gender} • {personal.maritalStatus} • {personal.occupation || 'No occupation'}
              </p>
              {(medical.heightCm || medical.weightKg) && (
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold">
                    <Scale className="w-3.5 h-3.5 text-slate-400" />
                    {medical.heightCm ? `${medical.heightCm} cm` : '—'} / {medical.weightKg ? `${medical.weightKg} kg` : '—'}
                  </span>
                  {bmiInfo && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${bmiInfo.badgeClass}`}>
                      BMI {bmiInfo.bmi} ({bmiInfo.category})
                    </span>
                  )}
                </div>
              )}
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {personal.govId.idType}: {personal.govId.idNumber || 'Not recorded'}
              </p>
            </div>
          </div>

          {/* Blood Type Badge */}
          <div className="bg-rose-50 border border-rose-300 px-4 py-2 rounded-xl text-rose-700 flex items-center gap-2 self-start sm:self-auto">
            <Droplets className="w-5 h-5 fill-rose-600 text-rose-600" />
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-600 block">Blood Group</span>
              <span className="text-xl font-black">{medical.bloodGroup}</span>
            </div>
          </div>
        </div>

        {/* 4 Summary Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* Contact & Address */}
          <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
            <span className="font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-500" /> Contact & Location
            </span>
            <div className="text-slate-700 space-y-1">
              <p>Primary Phone: <span className="font-mono font-bold">{contact.primaryPhone || 'None'}</span></p>
              {contact.email && <p>Email: <span>{contact.email}</span></p>}
              <p className="text-slate-600">
                Address: {contact.residentialAddress.street || ''} {contact.residentialAddress.city} {contact.residentialAddress.state} - {contact.residentialAddress.postalCode}
              </p>
            </div>
          </div>

          {/* Primary Emergency */}
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
            <span className="font-bold text-rose-900 uppercase tracking-wider block flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-rose-600" /> Primary Emergency Contact
            </span>
            <div className="text-rose-950 space-y-1">
              <p className="font-bold text-sm">{primaryEmerg.name || 'Not provided'} ({primaryEmerg.relationship})</p>
              <p>Phone: <span className="font-mono font-bold text-rose-700">{primaryEmerg.phone || 'None'}</span></p>
              {primaryEmerg.isAuthorizedMedicalDecisionMaker && (
                <span className="inline-block px-1.5 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold">
                  Authorized Medical Decision Maker
                </span>
              )}
            </div>
          </div>

          {/* Medical Highlights */}
          <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
            <span className="font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Medical Alerts & Medications
            </span>
            <div className="text-slate-700 space-y-1">
              <p>
                Allergies: <span className="font-medium">{medical.allergies.length > 0 ? medical.allergies.map(a => a.allergen).join(', ') : 'None reported'}</span>
              </p>
              <p>
                Conditions: <span className="font-medium">{medical.chronicConditions.length > 0 ? medical.chronicConditions.join(', ') : 'None'}</span>
              </p>
              <p>
                Daily Medications: <span className="font-medium">{medical.currentMedications.length} active</span>
              </p>
              {medical.organDonor && (
                <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
                  <Heart className="w-3 h-3 fill-rose-600" /> Pledged Organ Donor
                </span>
              )}
            </div>
          </div>

          {/* Attached Reports & Insurance */}
          <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
            <span className="font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Insurance & Test Reports
            </span>
            <div className="text-slate-700 space-y-1">
              {insurance.hasInsurance ? (
                <>
                  <p className="font-bold text-slate-900">{insurance.providerName || 'Provider not set'}</p>
                  <p>Policy #: <span className="font-mono">{insurance.policyNumber || 'N/A'}</span></p>
                  <p className="text-emerald-700 font-semibold">TPA: {insurance.tpaHelpline || 'N/A'}</p>
                </>
              ) : (
                <p className="italic text-slate-400">No health insurance recorded</p>
              )}

              <div className="pt-2 border-t border-slate-200 mt-2 flex items-center gap-1.5 text-indigo-700 font-semibold">
                <FileText className="w-3.5 h-3.5" />
                <span>
                  {medicalReports.length} Attached Medical Test {medicalReports.length === 1 ? 'Report' : 'Reports'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            By clicking Save, this biodata profile and attached medical records will be stored in your registry.
          </span>

          <button
            type="button"
            disabled={isSaving}
            onClick={onSubmit}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isSaving ? 'Saving Record...' : 'Confirm & Save Biodata'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
