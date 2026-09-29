import React from 'react';
import { ShieldCheck, Phone, CheckCircle2, XCircle } from 'lucide-react';
import type { BiodataProfile } from '../../types/biodata';

interface StepInsuranceProps {
  data: BiodataProfile;
  onChange: (updated: BiodataProfile) => void;
  errors: Record<string, string>;
}

const COMMON_PROVIDERS = [
  'Star Health & Allied Insurance',
  'HDFC ERGO Health Insurance',
  'Niva Bupa Health Insurance',
  'ICICI Lombard Health Care',
  'Care Health Insurance (Religare)',
  'Tata AIG Medicare',
  'Bajaj Allianz Health Guard',
  'National Insurance Co.',
  'ECHS / CGHS (Govt Scheme)',
  'UnitedHealthcare / Blue Cross'
];

export const StepInsurance: React.FC<StepInsuranceProps> = ({ data, onChange }) => {
  const { insurance, personal } = data;

  const updateInsurance = <K extends keyof typeof insurance>(key: K, value: (typeof insurance)[K]) => {
    onChange({
      ...data,
      insurance: {
        ...insurance,
        [key]: value,
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Step 4: Health Insurance & Cashless TPA Details</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Record policy number, coverage provider, cashless helpline, and renewal expiry.
        </p>
      </div>

      {/* Insurance Toggle */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
        <div>
          <span className="text-sm font-bold text-slate-900 block">Does this person have Health Insurance?</span>
          <span className="text-xs text-slate-500">Enable to record policy information and 24x7 hospital admission helpline</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateInsurance('hasInsurance', true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              insurance.hasInsurance 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Yes, Insured</span>
          </button>

          <button
            type="button"
            onClick={() => updateInsurance('hasInsurance', false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !insurance.hasInsurance 
                ? 'bg-slate-700 text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>No Insurance</span>
          </button>
        </div>
      </div>

      {insurance.hasInsurance && (
        <div className="space-y-4">
          
          {/* Quick Provider Suggestions */}
          <div>
            <span className="text-xs text-slate-500 block mb-1">Quick pick popular insurance provider:</span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PROVIDERS.map((provider) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => updateInsurance('providerName', provider)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 transition-colors"
                >
                  {provider.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Provider Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Insurance Provider / Company Name
              </label>
              <input
                type="text"
                placeholder="e.g. Star Health & Allied Insurance Co."
                value={insurance.providerName}
                onChange={(e) => updateInsurance('providerName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Policy Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Policy / Member ID Number
              </label>
              <input
                type="text"
                placeholder="e.g. SH-FAM-2024-984210"
                value={insurance.policyNumber}
                onChange={(e) => updateInsurance('policyNumber', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Group Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Group / Corporate Policy # (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. GRP-CORP-4482"
                value={insurance.groupNumber || ''}
                onChange={(e) => updateInsurance('groupNumber', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Policy Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Policy Type
              </label>
              <select
                value={insurance.policyType}
                onChange={(e) => updateInsurance('policyType', e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-emerald-500"
              >
                <option value="Individual Health">Individual Health Policy</option>
                <option value="Family Floater">Family Floater</option>
                <option value="Corporate Group">Corporate Group Policy</option>
                <option value="Government Scheme">Government Scheme (Ayushman / ECHS / CGHS)</option>
                <option value="Senior Citizen">Senior Citizen Health Insurance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Sum Insured */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Sum Insured / Coverage Amount
              </label>
              <input
                type="text"
                placeholder="e.g. ₹25,00,000 or $50,000"
                value={insurance.sumInsured || ''}
                onChange={(e) => updateInsurance('sumInsured', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Valid Till Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Policy Valid Till / Renewal Expiry
              </label>
              <input
                type="date"
                value={insurance.validTill}
                onChange={(e) => updateInsurance('validTill', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* 24x7 Cashless Emergency Helpline */}
            <div>
              <label className="block text-xs font-bold text-rose-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-rose-600" />
                <span>24x7 Cashless Helpline / TPA Phone</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 1800-425-2255 (TPA Desk)"
                value={insurance.tpaHelpline}
                onChange={(e) => updateInsurance('tpaHelpline', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-rose-500"
              />
            </div>

            {/* Primary Insured Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Primary Insured Holder Name
              </label>
              <input
                type="text"
                placeholder={`Defaults to ${personal.fullName || 'Self'}`}
                value={insurance.primaryInsuredName || ''}
                onChange={(e) => updateInsurance('primaryInsuredName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Relationship with Primary */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Relationship with Primary Policyholder
              </label>
              <input
                type="text"
                placeholder="e.g. Self, Spouse, Parent, Child"
                value={insurance.relationshipWithPrimary || 'Self'}
                onChange={(e) => updateInsurance('relationshipWithPrimary', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-emerald-500"
              />
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
