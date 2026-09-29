import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  CreditCard, 
  Edit3, 
  Trash2, 
  Droplets, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Pill, 
  Activity, 
  UserCheck, 
  Calendar,
  Building2,
  Stethoscope,
  FileText,
  Scale
} from 'lucide-react';
import { calculateBmi, type BiodataProfile, type MedicalTestReport } from '../types/biodata';
import { MedicalReportsSection } from './MedicalReportsSection';

interface ProfileDetailProps {
  profile: BiodataProfile;
  onBack: () => void;
  onEdit: (profile: BiodataProfile) => void;
  onDelete: (id: string, name: string) => void;
  onOpenCard: (profile: BiodataProfile) => void;
  onUpdateProfile?: (updated: BiodataProfile) => void;
}

export const ProfileDetail: React.FC<ProfileDetailProps> = ({
  profile,
  onBack,
  onEdit,
  onDelete,
  onOpenCard,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'medical' | 'reports' | 'insurance' | 'family'>('overview');
  const [showGovId, setShowGovId] = useState(false);

  const { personal, contact, medical, insurance, familyAndEmergency, medicalReports = [] } = profile;
  const primaryEmerg = familyAndEmergency.primaryEmergencyContact;
  const bmiInfo = calculateBmi(medical.heightCm, medical.weightKg);

  const handlePrint = () => {
    window.print();
  };

  const handleAddReport = (newReport: MedicalTestReport) => {
    if (onUpdateProfile) {
      const updated: BiodataProfile = {
        ...profile,
        medicalReports: [newReport, ...medicalReports],
      };
      onUpdateProfile(updated);
    }
  };

  const handleDeleteReport = (reportId: string) => {
    if (onUpdateProfile) {
      const updated: BiodataProfile = {
        ...profile,
        medicalReports: medicalReports.filter(r => r.id !== reportId),
      };
      onUpdateProfile(updated);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Navigation Bar (Hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenCard(profile)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Emergency Pocket Card</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Full Record</span>
          </button>

          <button
            onClick={() => onEdit(profile)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => onDelete(profile.id, personal.fullName)}
            className="p-2 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xl transition-colors cursor-pointer"
            title="Delete Record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Profile Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        
        {/* Color stripe */}
        <div className="h-32 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {medical.organDonor && (
              <span className="bg-rose-600/90 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <Heart className="w-3.5 h-3.5 fill-current" /> Pledged Organ Donor
              </span>
            )}
            <span className="bg-white/10 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-mono">
              ID: {profile.id.substring(0, 10)}
            </span>
          </div>
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 mb-4">
            
            {/* Avatar & Title */}
            <div className="flex items-end gap-4">
              <div className="relative">
                {personal.photoUrl ? (
                  <img
                    src={personal.photoUrl}
                    alt={personal.fullName}
                    className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center font-bold text-3xl border-4 border-white shadow-md">
                    {personal.fullName.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="pb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {personal.fullName}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 font-medium mt-1">
                  <span>{personal.age} years old</span>
                  <span>•</span>
                  <span>{personal.gender}</span>
                  <span>•</span>
                  <span>{personal.maritalStatus}</span>
                  {personal.occupation && (
                    <>
                      <span>•</span>
                      <span className="text-slate-700 font-semibold">{personal.occupation}</span>
                    </>
                  )}
                </div>

                {/* Vitals pill strip (Height, Weight, BMI) */}
                {(medical.heightCm || medical.weightKg) && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      <Scale className="w-3 h-3 text-slate-500" />
                      {medical.heightCm ? `${medical.heightCm} cm` : '—'} / {medical.weightKg ? `${medical.weightKg} kg` : '—'}
                    </span>
                    {bmiInfo && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${bmiInfo.badgeClass}`}>
                        BMI: {bmiInfo.bmi} ({bmiInfo.category})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Prominent Blood Group Badge */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between">
              <div className="bg-rose-50 border-2 border-rose-300 text-rose-700 px-4 py-2 rounded-xl flex items-center gap-2 shadow-xs">
                <Droplets className="w-6 h-6 fill-rose-600 text-rose-600" />
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-rose-600">Blood Group</div>
                  <div className="text-2xl font-black leading-none">{medical.bloodGroup}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Contact & Emergency Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Primary Phone</span>
                <a href={`tel:${contact.primaryPhone}`} className="font-mono font-semibold text-slate-800 hover:underline">
                  {contact.primaryPhone || 'None'}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <span className="text-slate-400 block text-[10px] uppercase">Email</span>
                <a href={`mailto:${contact.email}`} className="font-semibold text-slate-800 hover:underline truncate block">
                  {contact.email || 'None'}
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 text-xs bg-rose-50/80 border border-rose-200/70 p-2.5 rounded-xl">
              <div className="truncate">
                <span className="text-rose-600 font-bold block text-[10px] uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                  Emergency Contact ({primaryEmerg.relationship})
                </span>
                <span className="font-bold text-slate-900 truncate block">
                  {primaryEmerg.name || 'Not provided'}
                </span>
              </div>
              {primaryEmerg.phone && (
                <a
                  href={`tel:${primaryEmerg.phone}`}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shrink-0 flex items-center gap-1 shadow-xs"
                >
                  <Phone className="w-3 h-3" />
                  Call
                </a>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Tabs Navigation (Hidden during print) */}
      <div className="flex border-b border-slate-200 gap-6 no-print overflow-x-auto text-sm font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Personal & Identity</span>
        </button>

        <button
          onClick={() => setActiveTab('medical')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'medical'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Medical Profile & Vitals</span>
          {medical.allergies.length > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded-full text-xs">
              {medical.allergies.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'reports'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Medical Tests & Reports</span>
          {medicalReports.length > 0 && (
            <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
              {medicalReports.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('insurance')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'insurance'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Health Insurance</span>
        </button>

        <button
          onClick={() => setActiveTab('family')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'family'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Family & Emergency Contacts</span>
        </button>
      </div>

      {/* Tab 1: Personal & Identity Overview */}
      {(activeTab === 'overview' || typeof window !== 'undefined') && (
        <div className={`space-y-6 ${activeTab !== 'overview' ? 'hidden print:block' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Identity Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <span>Personal Particulars</span>
              </h2>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-slate-400">Full Legal Name</dt>
                  <dd className="font-semibold text-slate-800">{personal.fullName}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Preferred Name / Alias</dt>
                  <dd className="font-medium text-slate-700">{personal.preferredName || '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Date of Birth</dt>
                  <dd className="font-medium text-slate-700">{personal.dob || '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Age & Gender</dt>
                  <dd className="font-medium text-slate-700">{personal.age} yrs • {personal.gender}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Marital Status</dt>
                  <dd className="font-medium text-slate-700">{personal.maritalStatus}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Nationality</dt>
                  <dd className="font-medium text-slate-700">{personal.nationality || '—'}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-slate-400">Occupation / Profession</dt>
                  <dd className="font-medium text-slate-700">{personal.occupation || '—'}</dd>
                </div>
              </dl>

              {/* Gov ID */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">{personal.govId.idType} Number</span>
                  <span className="font-mono font-bold text-slate-800">
                    {showGovId || !personal.govId.idNumber 
                      ? (personal.govId.idNumber || 'Not recorded') 
                      : personal.govId.idNumber.replace(/.(?=.{4})/g, '•')}
                  </span>
                </div>
                {personal.govId.idNumber && (
                  <button
                    onClick={() => setShowGovId(!showGovId)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 rounded-lg no-print cursor-pointer"
                    title={showGovId ? 'Hide ID number' : 'Reveal ID number'}
                  >
                    {showGovId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

            {/* Address & Contact Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>Addresses & Communications</span>
              </h2>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Residential Address
                  </span>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium text-slate-800">
                    <p>{contact.residentialAddress.street || 'No street provided'}</p>
                    <p className="text-slate-600 text-xs mt-0.5">
                      {contact.residentialAddress.city}, {contact.residentialAddress.state} - {contact.residentialAddress.postalCode}
                    </p>
                    <p className="text-slate-500 text-xs">{contact.residentialAddress.country}</p>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Permanent Address
                  </span>
                  {contact.permanentAddress.sameAsResidential ? (
                    <div className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      Same as residential address
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium text-slate-800">
                      <p>{contact.permanentAddress.street || 'No street provided'}</p>
                      <p className="text-slate-600 text-xs mt-0.5">
                        {contact.permanentAddress.city}, {contact.permanentAddress.state} - {contact.permanentAddress.postalCode}
                      </p>
                      <p className="text-slate-500 text-xs">{contact.permanentAddress.country}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-xs text-slate-400">Alternate Phone</span>
                    <p className="font-mono text-xs font-medium text-slate-700">{contact.secondaryPhone || 'None'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Dietary Preference</span>
                    <p className="text-xs font-medium text-slate-700">{medical.dietaryPreference || 'Standard'}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Medical Profile & Health */}
      {(activeTab === 'medical' || typeof window !== 'undefined') && (
        <div className={`space-y-6 ${activeTab !== 'medical' ? 'hidden print:block' : ''}`}>
          
          {/* Blood group banner & Clinical Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="bg-gradient-to-br from-rose-50 to-red-50 p-5 rounded-2xl border border-rose-200">
              <div className="flex items-center gap-2 text-rose-800 font-bold mb-2">
                <Droplets className="w-5 h-5 fill-rose-600 text-rose-600" />
                <span>Blood Type</span>
              </div>
              <div className="text-3xl font-black text-rose-700 mb-1">{medical.bloodGroup}</div>
              <p className="text-xs text-rose-900/80">
                {medical.bloodGroup.includes('-') 
                  ? 'Rh Negative blood. Emergency donor registry alert.'
                  : 'Rh Positive blood profile.'}
              </p>
            </div>

            {/* Height, Weight & BMI Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
                <Scale className="w-5 h-5 text-indigo-600" />
                <span>Height & Weight</span>
              </div>
              <div className="text-xl font-bold text-slate-900 mb-1">
                {medical.heightCm ? `${medical.heightCm} cm` : '—'} / {medical.weightKg ? `${medical.weightKg} kg` : '—'}
              </div>
              {bmiInfo ? (
                <div className="mt-1">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${bmiInfo.badgeClass}`}>
                    BMI {bmiInfo.bmi} • {bmiInfo.category}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Measurements not logged</p>
              )}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
                <Heart className="w-5 h-5 text-rose-500" />
                <span>Organ Donation</span>
              </div>
              <div className="text-xl font-bold text-slate-900 mb-1">
                {medical.organDonor ? 'Pledged Life Donor' : 'Not Pledged'}
              </div>
              <p className="text-xs text-slate-500">
                {medical.organDonor 
                  ? 'Consent registered for life-saving organ transplants.' 
                  : 'No donor registration on file.'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>Immunization</span>
              </div>
              <div className="text-xl font-bold text-slate-900 mb-1">
                {medical.covidVaccinated ? 'COVID-19 Vaccinated' : 'Unvaccinated'}
              </div>
              <p className="text-xs text-slate-500">Vaccine protocols recorded</p>
            </div>

          </div>

          {/* Allergies & Chronic Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Known Allergies */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Known Allergies & Adverse Reactions</span>
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {medical.allergies.length} recorded
                </span>
              </div>

              {medical.allergies.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-3">No known drug, food, or contact allergies recorded.</p>
              ) : (
                <div className="space-y-2.5">
                  {medical.allergies.map(a => (
                    <div 
                      key={a.id} 
                      className={`p-3 rounded-xl border text-xs ${
                        a.severity.includes('Severe')
                          ? 'bg-rose-50 border-rose-200 text-rose-950'
                          : a.severity === 'Moderate'
                          ? 'bg-amber-50 border-amber-200 text-amber-950'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-sm">
                        <span>{a.allergen}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          a.severity.includes('Severe')
                            ? 'bg-rose-600 text-white'
                            : a.severity === 'Moderate'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-300 text-slate-800'
                        }`}>
                          {a.severity}
                        </span>
                      </div>
                      {a.reactionNotes && (
                        <p className="mt-1 text-slate-700">{a.reactionNotes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chronic Conditions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span>Chronic Health Conditions</span>
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {medical.chronicConditions.length} listed
                </span>
              </div>

              {medical.chronicConditions.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-3">No chronic conditions or illnesses reported.</p>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {medical.chronicConditions.map((cond, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-medium text-xs flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      {cond}
                    </span>
                  ))}
                </div>
              )}

              {/* Special clinical notes */}
              {medical.specialMedicalNotes && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 block mb-1">Special Medical Instructions:</span>
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950">
                    {medical.specialMedicalNotes}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Active Medications Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Pill className="w-4 h-4 text-indigo-500" />
              <span>Current Daily Medications</span>
            </h3>

            {medical.currentMedications.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No regular active medications logged.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">Medication Name</th>
                      <th className="px-3 py-2">Dosage</th>
                      <th className="px-3 py-2">Frequency / Timing</th>
                      <th className="px-3 py-2">Clinical Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {medical.currentMedications.map(m => (
                      <tr key={m.id}>
                        <td className="px-3 py-2.5 font-bold text-slate-800">{m.name}</td>
                        <td className="px-3 py-2.5 font-mono text-slate-600">{m.dosage}</td>
                        <td className="px-3 py-2.5 text-slate-700">{m.frequency}</td>
                        <td className="px-3 py-2.5 text-slate-500">{m.purpose || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 3: Medical Tests & Diagnostic Reports */}
      {(activeTab === 'reports' || typeof window !== 'undefined') && (
        <div className={`space-y-6 ${activeTab !== 'reports' ? 'hidden print:block' : ''}`}>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <MedicalReportsSection
              reports={medicalReports}
              onAddReport={handleAddReport}
              onDeleteReport={handleDeleteReport}
            />
          </div>
        </div>
      )}

      {/* Tab 4: Health Insurance Details */}
      {(activeTab === 'insurance' || typeof window !== 'undefined') && (
        <div className={`space-y-6 ${activeTab !== 'insurance' ? 'hidden print:block' : ''}`}>
          
          {insurance.hasInsurance ? (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              
              {/* Header banner */}
              <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 block mb-1">
                    Primary Health Insurance Provider
                  </span>
                  <h2 className="text-2xl font-black">{insurance.providerName}</h2>
                  <p className="text-xs text-emerald-100 mt-1">
                    Policy Type: {insurance.policyType} • Sum Insured: {insurance.sumInsured || 'Not specified'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-emerald-200 block">Validity Expiration</span>
                  <span className="text-lg font-mono font-bold bg-white/20 px-3 py-1 rounded-lg">
                    {insurance.validTill || 'Permanent'}
                  </span>
                </div>
              </div>

              {/* Policy Metrics */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-slate-400 block">Policy / Member ID</span>
                    <span className="font-mono text-base font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-md inline-block">
                      {insurance.policyNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block">Group / Corporate Number</span>
                    <span className="font-mono text-sm font-semibold text-slate-700">
                      {insurance.groupNumber || 'Individual Policy'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block">Primary Insured Person</span>
                    <span className="text-sm font-medium text-slate-800">
                      {insurance.primaryInsuredName || personal.fullName} ({insurance.relationshipWithPrimary || 'Self'})
                    </span>
                  </div>
                </div>

                {/* 24x7 Cashless Helpdesk Box */}
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-rose-600" />
                    <span>24x7 Emergency Cashless & TPA Helpline</span>
                  </div>
                  <p className="text-xs text-rose-900">
                    Call during hospital admission for pre-authorization and cashless claims:
                  </p>
                  <div className="pt-1 flex items-center gap-3">
                    <span className="font-mono font-black text-rose-700 text-lg">
                      {insurance.tpaHelpline || '1800 Helpline Not Set'}
                    </span>
                    {insurance.tpaHelpline && (
                      <a
                        href={`tel:${insurance.tpaHelpline.replace(/[^0-9]/g, '')}`}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call TPA
                      </a>
                    )}
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-lg">No Health Insurance Logged</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No active medical insurance policy has been linked to this profile. You can edit this record to add coverage details and cashless claim helpdesk contacts.
              </p>
              <button
                onClick={() => onEdit(profile)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Add Insurance Details
              </button>
            </div>
          )}

        </div>
      )}

      {/* Tab 5: Family & Emergency Network */}
      {(activeTab === 'family' || typeof window !== 'undefined') && (
        <div className={`space-y-6 ${activeTab !== 'family' ? 'hidden print:block' : ''}`}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Primary Emergency Contact */}
            <div className="bg-rose-50/70 border-2 border-rose-300 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-rose-200">
                <span className="text-xs font-black uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                  Primary Emergency Contact
                </span>
                {primaryEmerg.isAuthorizedMedicalDecisionMaker && (
                  <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">
                    Medical Decision Maker
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">{primaryEmerg.name || 'Not provided'}</h3>
                <p className="text-xs text-rose-800 font-semibold">{primaryEmerg.relationship}</p>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-rose-200">
                  <span className="text-slate-500">Phone:</span>
                  <a href={`tel:${primaryEmerg.phone}`} className="font-mono font-bold text-rose-700 text-sm hover:underline">
                    {primaryEmerg.phone || '—'}
                  </a>
                </div>

                {primaryEmerg.altPhone && (
                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-rose-200 text-slate-700">
                    <span className="text-slate-500">Alt Phone:</span>
                    <span className="font-mono">{primaryEmerg.altPhone}</span>
                  </div>
                )}

                {primaryEmerg.email && (
                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-rose-200 text-slate-700">
                    <span className="text-slate-500">Email:</span>
                    <a href={`mailto:${primaryEmerg.email}`} className="hover:underline">{primaryEmerg.email}</a>
                  </div>
                )}

                {primaryEmerg.address && (
                  <div className="bg-white p-2 rounded-xl border border-rose-200 text-slate-700">
                    <span className="text-slate-400 block text-[10px]">Address:</span>
                    <span>{primaryEmerg.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Secondary Emergency Contact & Doctor */}
            <div className="space-y-4">
              
              {/* Secondary Emergency */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Secondary Emergency Responder
                </span>
                <div className="font-bold text-slate-800 text-base">
                  {familyAndEmergency.secondaryEmergencyContact?.name || 'None listed'}
                </div>
                {familyAndEmergency.secondaryEmergencyContact?.name && (
                  <div className="text-xs text-slate-600 space-y-1">
                    <p>Relationship: <span className="font-medium">{familyAndEmergency.secondaryEmergencyContact.relationship}</span></p>
                    <p>Phone: <a href={`tel:${familyAndEmergency.secondaryEmergencyContact.phone}`} className="font-mono font-bold text-slate-900 hover:underline">{familyAndEmergency.secondaryEmergencyContact.phone}</a></p>
                  </div>
                )}
              </div>

              {/* Family Doctor */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-emerald-600" /> Primary Care Physician
                </span>
                <div className="font-bold text-slate-800 text-base">
                  {familyAndEmergency.primaryPhysician?.name || 'Not assigned'}
                </div>
                {familyAndEmergency.primaryPhysician?.name && (
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{familyAndEmergency.primaryPhysician.clinicHospital || 'Clinic'}</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`tel:${familyAndEmergency.primaryPhysician.phone}`} className="font-mono font-semibold text-slate-900 hover:underline">
                        {familyAndEmergency.primaryPhysician.phone}
                      </a>
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Family Dependents & Next of Kin List */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <UserCheck className="w-4 h-4 text-slate-600" />
              <span>Family Members & Dependents</span>
            </h3>

            {familyAndEmergency.familyMembers.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No additional family members or dependents listed.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {familyAndEmergency.familyMembers.map(f => (
                  <div key={f.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{f.name}</span>
                      {f.isDependent && (
                        <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-semibold text-[10px]">
                          Dependent
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 font-medium">{f.relationship} {f.age ? `(${f.age} yrs)` : ''}</div>
                    {f.phone && (
                      <div className="font-mono text-slate-700">
                        <a href={`tel:${f.phone}`} className="hover:underline">{f.phone}</a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
