import React from 'react';
import { Eye, Edit3, Trash2, CreditCard, Phone, Droplets, FileText, Scale } from 'lucide-react';
import { calculateBmi, type BiodataProfile } from '../types/biodata';

interface ProfileTableViewProps {
  profiles: BiodataProfile[];
  onView: (profile: BiodataProfile) => void;
  onEdit: (profile: BiodataProfile) => void;
  onDelete: (id: string, name: string) => void;
  onOpenCard: (profile: BiodataProfile) => void;
}

export const ProfileTableView: React.FC<ProfileTableViewProps> = ({
  profiles,
  onView,
  onEdit,
  onDelete,
  onOpenCard,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3.5">Person</th>
              <th className="px-4 py-3.5">Blood Type</th>
              <th className="px-4 py-3.5">Height & Weight</th>
              <th className="px-4 py-3.5">Medical Tests</th>
              <th className="px-4 py-3.5">Contact Phone</th>
              <th className="px-4 py-3.5">City & State</th>
              <th className="px-4 py-3.5">Emergency Contact</th>
              <th className="px-4 py-3.5">Health Insurance</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {profiles.map((p) => {
              const { personal, contact, medical, insurance, familyAndEmergency, medicalReports = [] } = p;
              const primaryEmerg = familyAndEmergency.primaryEmergencyContact;
              const bmiInfo = calculateBmi(medical.heightCm, medical.weightKg);

              return (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Person Details */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {personal.photoUrl ? (
                        <img
                          src={personal.photoUrl}
                          alt={personal.fullName}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                          {personal.fullName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div 
                          onClick={() => onView(p)}
                          className="font-semibold text-slate-900 hover:text-rose-600 cursor-pointer"
                        >
                          {personal.fullName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {personal.age} yrs • {personal.gender}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Blood Group */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-extrabold text-xs border border-rose-200">
                      <Droplets className="w-3 h-3 text-rose-600 fill-rose-600" />
                      {medical.bloodGroup}
                    </span>
                  </td>

                  {/* Height & Weight */}
                  <td className="px-4 py-3 text-xs">
                    {(medical.heightCm || medical.weightKg) ? (
                      <div>
                        <div className="font-semibold text-slate-800 flex items-center gap-1">
                          <Scale className="w-3 h-3 text-slate-400" />
                          <span>{medical.heightCm ? `${medical.heightCm}cm` : '—'} / {medical.weightKg ? `${medical.weightKg}kg` : '—'}</span>
                        </div>
                        {bmiInfo && (
                          <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded border mt-0.5 ${bmiInfo.badgeClass}`}>
                            BMI {bmiInfo.bmi} ({bmiInfo.category})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">—</span>
                    )}
                  </td>

                  {/* Medical Reports */}
                  <td className="px-4 py-3 text-xs">
                    {medicalReports.length > 0 ? (
                      <button
                        onClick={() => onView(p)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer"
                        title="Click to view and download reports"
                      >
                        <FileText className="w-3 h-3 text-indigo-600" />
                        <span>{medicalReports.length} {medicalReports.length === 1 ? 'Report' : 'Reports'}</span>
                      </button>
                    ) : (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </td>

                  {/* Contact Phone */}
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">
                    <a href={`tel:${contact.primaryPhone}`} className="hover:underline">
                      {contact.primaryPhone || '—'}
                    </a>
                  </td>

                  {/* City */}
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {contact.residentialAddress.city || '—'}, {contact.residentialAddress.state || ''}
                  </td>

                  {/* Emergency Contact */}
                  <td className="px-4 py-3">
                    <div className="text-xs">
                      <div className="font-medium text-slate-800 flex items-center gap-1.5">
                        <span>{primaryEmerg.name || 'Not listed'}</span>
                        <span className="text-[10px] text-slate-400">({primaryEmerg.relationship})</span>
                      </div>
                      {primaryEmerg.phone && (
                        <a 
                          href={`tel:${primaryEmerg.phone}`} 
                          className="text-rose-600 hover:underline flex items-center gap-1 font-mono text-[11px] mt-0.5"
                        >
                          <Phone className="w-3 h-3" />
                          {primaryEmerg.phone}
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Insurance */}
                  <td className="px-4 py-3 text-xs">
                    {insurance.hasInsurance ? (
                      <div>
                        <div className="font-medium text-slate-800 truncate max-w-[150px]">
                          {insurance.providerName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Till: {insurance.validTill || 'N/A'}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onOpenCard(p)}
                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Emergency Pocket Card"
                      >
                        <CreditCard className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onView(p)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(p)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit Record"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(p.id, personal.fullName)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
