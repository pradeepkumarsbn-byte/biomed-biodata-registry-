import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Printer, 
  Droplets, 
  AlertTriangle, 
  Phone, 
  Heart,
  QrCode,
  UserCheck
} from 'lucide-react';
import type { BiodataProfile } from '../types/biodata';

interface EmergencyPocketCardProps {
  profile: BiodataProfile;
  onClose: () => void;
}

export const EmergencyPocketCard: React.FC<EmergencyPocketCardProps> = ({
  profile,
  onClose,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const { personal, contact, medical, insurance, familyAndEmergency } = profile;

  useEffect(() => {
    // Generate compact emergency QR code string
    const emergencyPayload = [
      `🚨 EMERGENCY MEDICAL ID`,
      `Name: ${personal.fullName}`,
      `DOB: ${personal.dob} (Age ${personal.age})`,
      `Blood Group: ${medical.bloodGroup}`,
      (medical.heightCm || medical.weightKg) ? `Height/Weight: ${medical.heightCm ? medical.heightCm + 'cm' : '—'} / ${medical.weightKg ? medical.weightKg + 'kg' : '—'}` : '',
      `Critical Allergies: ${medical.allergies.map(a => a.allergen).join(', ') || 'None Known'}`,
      `Conditions: ${medical.chronicConditions.join(', ') || 'None'}`,
      `Emergency Contact 1: ${familyAndEmergency.primaryEmergencyContact.name} (${familyAndEmergency.primaryEmergencyContact.relationship}) - ${familyAndEmergency.primaryEmergencyContact.phone}`,
      familyAndEmergency.primaryEmergencyContact.altPhone ? `Alt Phone: ${familyAndEmergency.primaryEmergencyContact.altPhone}` : '',
      insurance.hasInsurance ? `Insurance: ${insurance.providerName} (Pol #${insurance.policyNumber}) | TPA: ${insurance.tpaHelpline}` : '',
      `Organ Donor: ${medical.organDonor ? 'YES' : 'NO'}`
    ].filter(Boolean).join('\n');

    QRCode.toDataURL(emergencyPayload, {
      width: 256,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    }).then(url => {
      setQrDataUrl(url);
    }).catch(err => {
      console.error('Failed to generate QR code', err);
    });
  }, [profile]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between no-print bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Droplets className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Printable Emergency Medical Wallet Card</h2>
              <p className="text-xs text-slate-500">Standard CR80 / Credit-Card format (Front & Back)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Card</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Cards Container */}
        <div className="p-6 overflow-y-auto space-y-6 bg-slate-100">
          
          <div className="text-xs text-slate-500 text-center no-print">
            💡 Print this card on paper or heavy cardstock to fold into your wallet or slip behind a phone case.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto print:grid-cols-2 print:gap-4 print:max-w-none">
            
            {/* FRONT CARD */}
            <div className="bg-white rounded-xl shadow-md border-2 border-slate-300 overflow-hidden flex flex-col justify-between aspect-[1.586/1] w-full p-4 relative select-none print:shadow-none print:border-black">
              {/* Card Header Strip */}
              <div className="flex items-center justify-between pb-2 border-b-2 border-rose-500 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-600 inline-block animate-pulse"></span>
                  <span className="font-black text-rose-600 text-xs tracking-wider uppercase">
                    Emergency Medical ID
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-rose-600 text-white px-2 py-0.5 rounded font-black text-xs">
                  <Droplets className="w-3 h-3 fill-white" />
                  <span>{medical.bloodGroup}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex items-start gap-3 flex-1">
                {/* Photo or Initials */}
                <div className="w-16 h-18 rounded-lg overflow-hidden border border-slate-300 bg-slate-100 shrink-0">
                  {personal.photoUrl ? (
                    <img 
                      src={personal.photoUrl} 
                      alt={personal.fullName}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-xs">
                      PHOTO
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1 text-xs">
                  <div className="font-extrabold text-slate-900 text-sm leading-tight truncate">
                    {personal.fullName}
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    DOB: {personal.dob || '—'} (Age: {personal.age})
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Gender: {personal.gender} • {personal.govId.idType}: {personal.govId.idNumber || '—'}
                  </div>
                  {(medical.heightCm || medical.weightKg) && (
                    <div className="text-[10px] text-slate-500 font-medium">
                      Height: {medical.heightCm ? `${medical.heightCm}cm` : '—'} • Weight: {medical.weightKg ? `${medical.weightKg}kg` : '—'}
                    </div>
                  )}

                  {/* Critical Allergies Box */}
                  <div className="mt-1 p-1.5 bg-rose-50 border border-rose-200 rounded text-[10px] text-rose-900">
                    <span className="font-bold flex items-center gap-1 text-rose-700">
                      <AlertTriangle className="w-3 h-3" /> ALLERGIES:
                    </span>
                    <span className="font-semibold">
                      {medical.allergies.length > 0 
                        ? medical.allergies.map(a => a.allergen).join(', ')
                        : 'No Known Drug/Food Allergies'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Quick phone */}
              <div className="pt-2 border-t border-slate-200 mt-2 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <div>Phone: <span className="font-mono text-slate-800">{contact.primaryPhone}</span></div>
                {medical.organDonor && (
                  <span className="flex items-center gap-1 font-bold text-rose-600">
                    <Heart className="w-3 h-3 fill-rose-600" /> ORGAN DONOR
                  </span>
                )}
                <span className="text-[9px] uppercase tracking-wider text-slate-400">FRONT</span>
              </div>
            </div>

            {/* BACK CARD */}
            <div className="bg-white rounded-xl shadow-md border-2 border-slate-300 overflow-hidden flex flex-col justify-between aspect-[1.586/1] w-full p-4 relative select-none print:shadow-none print:border-black">
              {/* Back Header */}
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 mb-2">
                <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
                  <Phone className="w-3 h-3 text-rose-600" /> EMERGENCY & INSURANCE
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">BACK</span>
              </div>

              {/* Emergency Contacts & Insurance */}
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-1 space-y-1.5 text-[11px]">
                  
                  {/* Primary Emergency Contact */}
                  <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate">
                        {familyAndEmergency.primaryEmergencyContact.name || 'Emergency Contact'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {familyAndEmergency.primaryEmergencyContact.relationship}
                      </span>
                    </div>
                    <div className="font-mono font-bold text-rose-700 text-xs">
                      {familyAndEmergency.primaryEmergencyContact.phone || 'No phone'}
                    </div>
                    {familyAndEmergency.primaryEmergencyContact.altPhone && (
                      <div className="text-[10px] text-slate-500 font-mono">
                        Alt: {familyAndEmergency.primaryEmergencyContact.altPhone}
                      </div>
                    )}
                  </div>

                  {/* Insurance Info */}
                  <div className="text-[10px] text-slate-600 leading-tight">
                    {insurance.hasInsurance ? (
                      <>
                        <div className="font-semibold text-slate-800 truncate">
                          🛡️ {insurance.providerName}
                        </div>
                        <div>Policy: <span className="font-mono">{insurance.policyNumber}</span></div>
                        <div className="text-emerald-700 font-bold">
                          TPA Help: {insurance.tpaHelpline || 'N/A'}
                        </div>
                      </>
                    ) : (
                      <div className="text-slate-400 italic">No health insurance recorded</div>
                    )}
                  </div>

                </div>

                {/* QR Code */}
                <div className="shrink-0 flex flex-col items-center">
                  {qrDataUrl ? (
                    <img 
                      src={qrDataUrl} 
                      alt="Emergency Medical QR" 
                      className="w-20 h-20 border border-slate-300 rounded p-0.5 bg-white shadow-xs" 
                    />
                  ) : (
                    <div className="w-20 h-20 bg-slate-100 flex items-center justify-center text-slate-400">
                      <QrCode className="w-6 h-6" />
                    </div>
                  )}
                  <span className="text-[9px] text-slate-500 mt-1 font-semibold">SCAN FOR INFO</span>
                </div>
              </div>

              {/* Bottom Doctor note */}
              <div className="pt-1.5 border-t border-slate-200 mt-1 flex items-center justify-between text-[10px] text-slate-500">
                <div className="truncate">
                  Doctor: {familyAndEmergency.primaryPhysician?.name ? `${familyAndEmergency.primaryPhysician.name} (${familyAndEmergency.primaryPhysician.phone})` : 'None specified'}
                </div>
                {familyAndEmergency.primaryEmergencyContact.isAuthorizedMedicalDecisionMaker && (
                  <span className="text-[9px] bg-blue-50 text-blue-700 font-medium px-1 rounded flex items-center gap-0.5">
                    <UserCheck className="w-2.5 h-2.5" /> Decision Maker
                  </span>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
