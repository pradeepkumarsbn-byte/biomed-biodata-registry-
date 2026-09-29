import React, { useState } from 'react';
import { 
  Droplets, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Activity, 
  Pill, 
  Heart, 
  ShieldCheck, 
  Info,
  Scale
} from 'lucide-react';
import { 
  BLOOD_GROUPS, 
  COMMON_ALLERGIES, 
  COMMON_CONDITIONS, 
  calculateBmi,
  type BiodataProfile, 
  type BloodGroup, 
  type AllergySeverity,
  type AllergyItem,
  type MedicationItem,
  type MedicalTestReport
} from '../../types/biodata';
import { MedicalReportsSection } from '../MedicalReportsSection';

interface StepMedicalProps {
  data: BiodataProfile;
  onChange: (updated: BiodataProfile) => void;
  errors: Record<string, string>;
}

export const StepMedical: React.FC<StepMedicalProps> = ({ data, onChange }) => {
  const { medical, medicalReports } = data;
  
  // Local scratch for adding an allergy
  const [newAllergen, setNewAllergen] = useState('');
  const [newSeverity, setNewSeverity] = useState<AllergySeverity>('Moderate');
  const [newReaction, setNewReaction] = useState('');

  // Local scratch for adding a medication
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFrequency, setMedFrequency] = useState('');
  const [medPurpose, setMedPurpose] = useState('');

  // Custom condition input
  const [customCond, setCustomCond] = useState('');

  const updateMedical = <K extends keyof typeof medical>(key: K, value: (typeof medical)[K]) => {
    onChange({
      ...data,
      medical: {
        ...medical,
        [key]: value,
      }
    });
  };

  const bmiInfo = calculateBmi(medical.heightCm, medical.weightKg);

  // Add Allergy
  const handleAddAllergy = () => {
    if (!newAllergen.trim()) return;
    const item: AllergyItem = {
      id: `alg-${Date.now()}`,
      allergen: newAllergen.trim(),
      severity: newSeverity,
      reactionNotes: newReaction.trim() || undefined,
    };
    updateMedical('allergies', [...medical.allergies, item]);
    setNewAllergen('');
    setNewReaction('');
  };

  const handleRemoveAllergy = (id: string) => {
    updateMedical('allergies', medical.allergies.filter(a => a.id !== id));
  };

  // Add Medication
  const handleAddMedication = () => {
    if (!medName.trim()) return;
    const item: MedicationItem = {
      id: `med-${Date.now()}`,
      name: medName.trim(),
      dosage: medDosage.trim() || 'Standard',
      frequency: medFrequency.trim() || 'Daily',
      purpose: medPurpose.trim() || undefined,
    };
    updateMedical('currentMedications', [...medical.currentMedications, item]);
    setMedName('');
    setMedDosage('');
    setMedFrequency('');
    setMedPurpose('');
  };

  const handleRemoveMedication = (id: string) => {
    updateMedical('currentMedications', medical.currentMedications.filter(m => m.id !== id));
  };

  // Toggle Chronic Condition
  const toggleCondition = (cond: string) => {
    const exists = medical.chronicConditions.includes(cond);
    if (exists) {
      updateMedical('chronicConditions', medical.chronicConditions.filter(c => c !== cond));
    } else {
      updateMedical('chronicConditions', [...medical.chronicConditions, cond]);
    }
  };

  const handleAddCustomCondition = () => {
    if (!customCond.trim()) return;
    if (!medical.chronicConditions.includes(customCond.trim())) {
      updateMedical('chronicConditions', [...medical.chronicConditions, customCond.trim()]);
    }
    setCustomCond('');
  };

  // Reports
  const handleAddReport = (report: MedicalTestReport) => {
    onChange({
      ...data,
      medicalReports: [report, ...(data.medicalReports || [])]
    });
  };

  const handleDeleteReport = (id: string) => {
    onChange({
      ...data,
      medicalReports: (data.medicalReports || []).filter(r => r.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Droplets className="w-5 h-5 text-rose-600 fill-rose-600" />
          <span>Step 3: Medical Record, Height/Weight & Test Reports</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Vitals, blood group, height, weight with live BMI calculator, allergies, and diagnostic reports.
        </p>
      </div>

      {/* Height, Weight & Live BMI Section */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>Body Measurements & Vitals</span>
          </label>
          {bmiInfo && (
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-xs ${bmiInfo.badgeClass}`}>
              BMI: {bmiInfo.bmi} • {bmiInfo.category}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Height (in cm)
            </label>
            <div className="relative">
              <input
                type="number"
                min="30"
                max="260"
                step="0.5"
                placeholder="e.g. 175"
                value={medical.heightCm || ''}
                onChange={(e) => updateMedical('heightCm', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono bg-white focus:outline-hidden focus:border-indigo-500"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">cm</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Weight (in kg)
            </label>
            <div className="relative">
              <input
                type="number"
                min="2"
                max="350"
                step="0.5"
                placeholder="e.g. 72"
                value={medical.weightKg || ''}
                onChange={(e) => updateMedical('weightKg', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono bg-white focus:outline-hidden focus:border-indigo-500"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">kg</span>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Body Mass Index (BMI)</span>
            {bmiInfo ? (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-black text-slate-900">{bmiInfo.bmi}</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${bmiInfo.badgeClass}`}>
                  {bmiInfo.category}
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-400 mt-1 italic">Enter height & weight to calculate BMI</span>
            )}
          </div>
        </div>
      </div>

      {/* 1. Blood Group Selection */}
      <div className="p-5 bg-rose-50/50 rounded-2xl border-2 border-rose-200 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-rose-600 fill-rose-600" />
            <span>Blood Group (Primary Emergency Identifier)</span>
          </label>
          <span className="text-xs font-bold text-rose-700 bg-white px-2.5 py-0.5 rounded-full border border-rose-200 shadow-xs">
            Selected: {medical.bloodGroup}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {BLOOD_GROUPS.map((bg) => {
            const isSelected = medical.bloodGroup === bg;
            return (
              <button
                key={bg}
                type="button"
                onClick={() => updateMedical('bloodGroup', bg as BloodGroup)}
                className={`p-3 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white font-extrabold shadow-md scale-102 ring-2 ring-rose-600/40'
                    : 'bg-white hover:bg-rose-50 text-slate-700 border border-slate-200 font-bold'
                }`}
              >
                <span className="text-lg leading-none">{bg}</span>
                <span className={`text-[10px] mt-1 ${isSelected ? 'text-rose-100' : 'text-slate-400'}`}>
                  {bg.includes('-') ? 'Rh Negative' : bg === 'Bombay / Rare' ? 'Ultra Rare' : 'Rh Positive'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Known Allergies Builder */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Known Allergies & Adverse Drug Reactions</span>
          </label>
          <span className="text-xs text-slate-400">{medical.allergies.length} added</span>
        </div>

        {/* Quick Allergy Suggestion Chips */}
        <div>
          <span className="text-xs text-slate-500 block mb-1.5">Quick add common allergen:</span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_ALLERGIES.map((allergen) => (
              <button
                key={allergen}
                type="button"
                onClick={() => {
                  setNewAllergen(allergen);
                  setNewSeverity('Moderate');
                }}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 transition-colors"
              >
                + {allergen}
              </button>
            ))}
          </div>
        </div>

        {/* Add Allergy Input Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="sm:col-span-1">
            <input
              type="text"
              placeholder="Allergen name (e.g. Penicillin)"
              value={newAllergen}
              onChange={(e) => setNewAllergen(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-rose-500"
            />
          </div>

          <div>
            <select
              value={newSeverity}
              onChange={(e) => setNewSeverity(e.target.value as AllergySeverity)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-rose-500"
            >
              <option value="Mild">Mild (Rash, Itching)</option>
              <option value="Moderate">Moderate (Swelling, Hives)</option>
              <option value="Severe (Anaphylactic)">Severe (Anaphylactic Shock)</option>
            </select>
          </div>

          <div>
            <input
              type="text"
              placeholder="Reaction / treatment notes (optional)"
              value={newReaction}
              onChange={(e) => setNewReaction(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-rose-500"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={handleAddAllergy}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Allergy</span>
            </button>
          </div>
        </div>

        {/* Added Allergies List */}
        {medical.allergies.length > 0 && (
          <div className="space-y-2 pt-2">
            {medical.allergies.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                    a.severity.includes('Severe')
                      ? 'bg-rose-600 text-white'
                      : a.severity === 'Moderate'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-200 text-slate-800'
                  }`}>
                    {a.severity}
                  </span>
                  <span className="font-bold text-slate-800">{a.allergen}</span>
                  {a.reactionNotes && (
                    <span className="text-slate-500 italic">— {a.reactionNotes}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveAllergy(a.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Chronic Health Conditions */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-blue-500" />
          <span>Chronic Health Conditions & Pre-existing Illnesses</span>
        </label>

        <div className="flex flex-wrap gap-2">
          {COMMON_CONDITIONS.map((cond) => {
            const isChecked = medical.chronicConditions.includes(cond);
            return (
              <button
                key={cond}
                type="button"
                onClick={() => toggleCondition(cond)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isChecked ? '✓ ' : '+ '}
                {cond}
              </button>
            );
          })}
        </div>

        {/* Custom condition adder */}
        <div className="flex items-center gap-2 max-w-md pt-1">
          <input
            type="text"
            placeholder="Add other medical condition..."
            value={customCond}
            onChange={(e) => setCustomCond(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomCondition();
              }
            }}
            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:border-rose-500"
          />
          <button
            type="button"
            onClick={handleAddCustomCondition}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            Add
          </button>
        </div>
      </div>

      {/* 4. Active Daily Medications */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-indigo-500" />
            <span>Active Regular Medications</span>
          </label>
          <span className="text-xs text-slate-400">{medical.currentMedications.length} listed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div>
            <input
              type="text"
              placeholder="Drug name (e.g. Metformin)"
              value={medName}
              onChange={(e) => setMedName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-rose-500"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Dosage (e.g. 500 mg)"
              value={medDosage}
              onChange={(e) => setMedDosage(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-rose-500"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Frequency (e.g. 2x Daily after meal)"
              value={medFrequency}
              onChange={(e) => setMedFrequency(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-rose-500"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={handleAddMedication}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medication</span>
            </button>
          </div>
        </div>

        {medical.currentMedications.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {medical.currentMedications.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-800">{m.name}</span>
                  <span className="font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {m.dosage}
                  </span>
                  <span className="text-slate-500">{m.frequency}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMedication(m.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Additional Medical Preferences */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Organ Donor Toggle */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => updateMedical('organDonor', !medical.organDonor)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              medical.organDonor ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${medical.organDonor ? 'fill-current' : ''}`} />
          </button>
          <div>
            <span className="text-xs font-bold text-slate-800 block">Organ Donor Pledge</span>
            <span className="text-[11px] text-slate-500">
              {medical.organDonor ? 'Yes, consented donor' : 'Not pledged'}
            </span>
          </div>
        </div>

        {/* Covid Vaccinated Toggle */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => updateMedical('covidVaccinated', !medical.covidVaccinated)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              medical.covidVaccinated ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-bold text-slate-800 block">COVID-19 Vaccinated</span>
            <span className="text-[11px] text-slate-500">
              {medical.covidVaccinated ? 'Yes, vaccinated' : 'No / Unstated'}
            </span>
          </div>
        </div>

        {/* Dietary Preference */}
        <div className="bg-white p-3 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-800 block mb-1">Dietary Preference</span>
          <select
            value={medical.dietaryPreference || 'Vegetarian'}
            onChange={(e) => updateMedical('dietaryPreference', e.target.value as any)}
            className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:border-rose-500"
          >
            <option value="Vegetarian">Vegetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Eggetarian">Eggetarian</option>
            <option value="Halal">Halal</option>
            <option value="Kosher">Kosher</option>
            <option value="Other">Other</option>
          </select>
        </div>

      </div>

      {/* Special Medical Notes */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Special Medical Instructions / Emergency Notes</span>
        </label>
        <textarea
          rows={2}
          placeholder="e.g. Carry EpiPen at all times, has coronary stent (2021), wears pacemaker, etc."
          value={medical.specialMedicalNotes || ''}
          onChange={(e) => updateMedical('specialMedicalNotes', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-rose-500"
        />
      </div>

      {/* 6. Medical Test Reports in Wizard */}
      <div className="pt-2">
        <MedicalReportsSection
          reports={medicalReports || []}
          onAddReport={handleAddReport}
          onDeleteReport={handleDeleteReport}
        />
      </div>

    </div>
  );
};
