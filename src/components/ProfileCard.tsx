import React from 'react';
import { 
  Phone, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  CreditCard, 
  Eye, 
  Edit3, 
  Trash2, 
  Heart,
  Droplets,
  FileText,
  Scale
} from 'lucide-react';
import { calculateBmi, type BiodataProfile } from '../types/biodata';

interface ProfileCardProps {
  profile: BiodataProfile;
  onView: (profile: BiodataProfile) => void;
  onEdit: (profile: BiodataProfile) => void;
  onDelete: (id: string, name: string) => void;
  onOpenCard: (profile: BiodataProfile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onView,
  onEdit,
  onDelete,
  onOpenCard,
}) => {
  const { personal, contact, medical, insurance, familyAndEmergency } = profile;
  
  // Calculate insurance validity status
  let insuranceStatus: 'active' | 'expiring-soon' | 'expired' | 'none' = 'none';
  if (insurance.hasInsurance && insurance.validTill) {
    const validDate = new Date(insurance.validTill);
    const now = new Date();
    const diffDays = Math.ceil((validDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      insuranceStatus = 'expired';
    } else if (diffDays <= 45) {
      insuranceStatus = 'expiring-soon';
    } else {
      insuranceStatus = 'active';
    }
  }

  const primaryEmerg = familyAndEmergency.primaryEmergencyContact;
  const severeAllergies = medical.allergies.filter(a => a.severity.includes('Severe'));
  const bmiInfo = calculateBmi(medical.heightCm, medical.weightKg);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Banner & Blood Group */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          
          {/* Avatar + Main Identity */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              {personal.photoUrl ? (
                <img
                  src={personal.photoUrl}
                  alt={personal.fullName}
                  className="w-13 h-13 rounded-xl object-cover border border-slate-200 shadow-xs"
                />
              ) : (
                <div className="w-13 h-13 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                  {personal.fullName.substring(0, 2).toUpperCase()}
                </div>
              )}
              {medical.organDonor && (
                <span 
                  title="Pledged Organ Donor"
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] ring-2 ring-white shadow-xs"
                >
                  <Heart className="w-2.5 h-2.5 fill-current" />
                </span>
              )}
            </div>

            <div>
              <h3 
                onClick={() => onView(profile)}
                className="font-bold text-slate-900 text-base hover:text-rose-600 cursor-pointer transition-colors line-clamp-1"
                title={personal.fullName}
              >
                {personal.fullName}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {personal.age} yrs • {personal.gender} • {personal.maritalStatus}
              </p>
              {(medical.heightCm || medical.weightKg) && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-0.5">
                  <Scale className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{medical.heightCm ? `${medical.heightCm}cm` : '—'} / {medical.weightKg ? `${medical.weightKg}kg` : '—'}</span>
                  {bmiInfo && (
                    <span className="font-semibold text-slate-700">
                      (BMI {bmiInfo.bmi})
                    </span>
                  )}
                </div>
              )}
              {personal.occupation && (
                <p className="text-xs text-slate-400 truncate max-w-[180px]">{personal.occupation}</p>
              )}
            </div>
          </div>

          {/* Blood Group Badge */}
          <div className="flex flex-col items-center">
            <div className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-700 flex items-center gap-1 shadow-xs">
              <Droplets className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span className="font-extrabold text-sm tracking-wide">{medical.bloodGroup}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">Blood Type</span>
          </div>

        </div>

        {/* Location & Contact Bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 py-2 border-y border-slate-100">
          <div className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{contact.residentialAddress.city || 'No city'}, {contact.residentialAddress.state || ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a 
              href={`tel:${contact.primaryPhone}`} 
              className="hover:text-slate-900 hover:underline font-mono"
            >
              {contact.primaryPhone || 'N/A'}
            </a>
          </div>
        </div>

        {/* Emergency Alert Strip */}
        <div className="mt-3 bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse"></span>
              Emergency Contact:
            </span>
            <span className="text-[11px] bg-slate-200/70 text-slate-700 px-1.5 py-0.5 rounded font-medium">
              {primaryEmerg.relationship || 'Contact'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800 truncate max-w-[140px]">
              {primaryEmerg.name || 'Not specified'}
            </span>
            {primaryEmerg.phone && (
              <a
                href={`tel:${primaryEmerg.phone}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-medium transition-colors"
                title={`Call ${primaryEmerg.name}`}
              >
                <Phone className="w-3 h-3" />
                Call Now
              </a>
            )}
          </div>
        </div>

        {/* Medical & Insurance Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5 items-center">
          {/* Severe Allergies Tag */}
          {severeAllergies.length > 0 && (
            <span 
              className="inline-flex items-center gap-1 text-[11px] font-semibold bg-red-100 text-red-800 px-2 py-0.5 rounded-full"
              title={`Severe Allergies: ${severeAllergies.map(a => a.allergen).join(', ')}`}
            >
              <AlertCircle className="w-3 h-3" />
              {severeAllergies.length} Severe {severeAllergies.length === 1 ? 'Allergy' : 'Allergies'}
            </span>
          )}

          {/* Chronic conditions count */}
          {medical.chronicConditions.length > 0 && (
            <span className="text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
              {medical.chronicConditions.length} Condition{medical.chronicConditions.length > 1 ? 's' : ''}
            </span>
          )}

          {/* Insurance Badge */}
          {insurance.hasInsurance ? (
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
              insuranceStatus === 'active' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : insuranceStatus === 'expiring-soon'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-slate-100 text-slate-600'
            }`}>
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {insurance.providerName ? insurance.providerName.split(' ')[0] : 'Insured'}
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              No Insurance
            </span>
          )}

          {/* Medical Reports Tag */}
          {profile.medicalReports && profile.medicalReports.length > 0 && (
            <span 
              className="inline-flex items-center gap-1 text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full"
              title={`${profile.medicalReports.length} uploaded diagnostic reports`}
            >
              <FileText className="w-3 h-3 text-indigo-600" />
              {profile.medicalReports.length} {profile.medicalReports.length === 1 ? 'Report' : 'Reports'}
            </span>
          )}
        </div>
      </div>

      {/* Card Actions Bottom Toolbar */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
        
        {/* Left: Pocket Card trigger */}
        <button
          onClick={() => onOpenCard(profile)}
          className="inline-flex items-center gap-1 text-slate-700 hover:text-rose-600 font-semibold transition-colors py-1 cursor-pointer"
          title="Open printable Emergency Pocket Card"
        >
          <CreditCard className="w-3.5 h-3.5 text-rose-500" />
          <span>Emergency Card</span>
        </button>

        {/* Right: View, Edit, Delete */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(profile)}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
            title="View Full Profile Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(profile)}
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
            title="Edit Biodata"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(profile.id, personal.fullName)}
            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            title="Delete Record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
