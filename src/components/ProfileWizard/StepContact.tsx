import React from 'react';
import { Phone, MapPin, Mail, CheckSquare, Square } from 'lucide-react';
import type { BiodataProfile } from '../../types/biodata';

interface StepContactProps {
  data: BiodataProfile;
  onChange: (updated: BiodataProfile) => void;
  errors: Record<string, string>;
}

export const StepContact: React.FC<StepContactProps> = ({ data, onChange, errors }) => {
  const { contact } = data;

  const updateContact = <K extends keyof typeof contact>(key: K, value: (typeof contact)[K]) => {
    onChange({
      ...data,
      contact: {
        ...contact,
        [key]: value,
      }
    });
  };

  const updateResidential = (field: string, value: string) => {
    onChange({
      ...data,
      contact: {
        ...contact,
        residentialAddress: {
          ...contact.residentialAddress,
          [field]: value,
        }
      }
    });
  };

  const updatePermanent = (field: string, value: string) => {
    onChange({
      ...data,
      contact: {
        ...contact,
        permanentAddress: {
          ...contact.permanentAddress,
          [field]: value,
        }
      }
    });
  };

  const toggleSameAsResidential = () => {
    const isSame = !contact.permanentAddress.sameAsResidential;
    onChange({
      ...data,
      contact: {
        ...contact,
        permanentAddress: {
          ...contact.permanentAddress,
          sameAsResidential: isSame,
          ...(isSame ? {
            street: contact.residentialAddress.street,
            city: contact.residentialAddress.city,
            state: contact.residentialAddress.state,
            postalCode: contact.residentialAddress.postalCode,
            country: contact.residentialAddress.country,
          } : {})
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Phone className="w-5 h-5 text-rose-600" />
          <span>Step 2: Contact Details & Addresses</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Enter primary telecommunications and full residential/permanent addresses.
        </p>
      </div>

      {/* Primary Communication Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Primary Phone */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Primary Phone Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="e.g. +91 98451 23456"
            value={contact.primaryPhone}
            onChange={(e) => updateContact('primaryPhone', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono focus:outline-hidden focus:ring-2 ${
              errors.primaryPhone 
                ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30' 
                : 'border-slate-200 focus:border-rose-500 focus:ring-rose-100'
            }`}
          />
          {errors.primaryPhone && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.primaryPhone}</p>}
        </div>

        {/* Secondary Phone */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Secondary / Landline Phone
          </label>
          <input
            type="tel"
            placeholder="e.g. +91 80 2345 6789"
            value={contact.secondaryPhone || ''}
            onChange={(e) => updateContact('secondaryPhone', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-rose-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="e.g. name@example.com"
              value={contact.email}
              onChange={(e) => updateContact('email', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-rose-500"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Residential Address */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
          <MapPin className="w-4 h-4 text-rose-600" />
          <span>Present / Residential Address</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Street / House / Apartment</label>
            <input
              type="text"
              placeholder="e.g. Flat 402, Oakwood Residences, 12th Main"
              value={contact.residentialAddress.street}
              onChange={(e) => updateResidential('street', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">City / Town</label>
            <input
              type="text"
              placeholder="e.g. Bengaluru"
              value={contact.residentialAddress.city}
              onChange={(e) => updateResidential('city', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">State / Province</label>
            <input
              type="text"
              placeholder="e.g. Karnataka"
              value={contact.residentialAddress.state}
              onChange={(e) => updateResidential('state', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Postal / ZIP Code</label>
            <input
              type="text"
              placeholder="e.g. 560038"
              value={contact.residentialAddress.postalCode}
              onChange={(e) => updateResidential('postalCode', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-mono focus:outline-hidden focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Country</label>
            <input
              type="text"
              placeholder="e.g. India"
              value={contact.residentialAddress.country}
              onChange={(e) => updateResidential('country', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Permanent Address */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-slate-600" />
            <span>Permanent Address</span>
          </div>

          <button
            type="button"
            onClick={toggleSameAsResidential}
            className="flex items-center gap-2 text-xs font-semibold text-rose-700 hover:text-rose-800 cursor-pointer"
          >
            {contact.permanentAddress.sameAsResidential ? (
              <CheckSquare className="w-4 h-4 text-rose-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>Same as Residential Address</span>
          </button>
        </div>

        {!contact.permanentAddress.sameAsResidential && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Street / House / Town</label>
              <input
                type="text"
                placeholder="Permanent Street / House address"
                value={contact.permanentAddress.street || ''}
                onChange={(e) => updatePermanent('street', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
              <input
                type="text"
                placeholder="City"
                value={contact.permanentAddress.city || ''}
                onChange={(e) => updatePermanent('city', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">State</label>
              <input
                type="text"
                placeholder="State"
                value={contact.permanentAddress.state || ''}
                onChange={(e) => updatePermanent('state', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Postal Code</label>
              <input
                type="text"
                placeholder="Postal Code"
                value={contact.permanentAddress.postalCode || ''}
                onChange={(e) => updatePermanent('postalCode', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-mono focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Country</label>
              <input
                type="text"
                placeholder="Country"
                value={contact.permanentAddress.country || ''}
                onChange={(e) => updatePermanent('country', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-rose-500"
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
