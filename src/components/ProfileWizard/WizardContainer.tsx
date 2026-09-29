import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  ArrowRight, 
  X, 
  User, 
  Phone, 
  Droplets, 
  ShieldCheck, 
  Users, 
  CheckCircle2 
} from 'lucide-react';
import type { BiodataProfile } from '../../types/biodata';
import { StepPersonal } from './StepPersonal';
import { StepContact } from './StepContact';
import { StepMedical } from './StepMedical';
import { StepInsurance } from './StepInsurance';
import { StepFamily } from './StepFamily';
import { StepReview } from './StepReview';

interface WizardContainerProps {
  initialData: BiodataProfile;
  isEditing: boolean;
  onSave: (profile: BiodataProfile) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 'personal', title: 'Personal', icon: User },
  { id: 'contact', title: 'Contact', icon: Phone },
  { id: 'medical', title: 'Medical & Blood', icon: Droplets },
  { id: 'insurance', title: 'Insurance', icon: ShieldCheck },
  { id: 'family', title: 'Family & Emergency', icon: Users },
  { id: 'review', title: 'Review & Save', icon: CheckCircle2 },
];

export const WizardContainer: React.FC<WizardContainerProps> = ({
  initialData,
  isEditing,
  onSave,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<BiodataProfile>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validateStep = (stepIdx: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepIdx === 0) {
      if (!formData.personal.fullName.trim()) {
        newErrors.fullName = 'Full legal name is required';
      }
      if (!formData.personal.dob) {
        newErrors.dob = 'Date of birth is required';
      }
    }

    if (stepIdx === 1) {
      if (!formData.contact.primaryPhone.trim()) {
        newErrors.primaryPhone = 'Primary phone number is required';
      }
    }

    if (stepIdx === 4) {
      if (!formData.familyAndEmergency.primaryEmergencyContact.name.trim()) {
        newErrors.emergName = 'Primary emergency contact name is required';
      }
      if (!formData.familyAndEmergency.primaryEmergencyContact.phone.trim()) {
        newErrors.emergPhone = 'Emergency contact phone number is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(STEPS.length - 1, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpToStep = (index: number) => {
    // Only allow jumping backwards or if current step is valid
    if (index < currentStep || validateStep(currentStep)) {
      setCurrentStep(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    // Validate all critical steps
    if (!validateStep(0) || !validateStep(1) || !validateStep(4)) {
      alert('Please fill in required fields: Full Name, Date of Birth, Primary Phone, and Primary Emergency Contact.');
      return;
    }

    setIsSaving(true);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignored if canvas unsupported
    }

    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
    }, 400);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden max-w-5xl mx-auto">
      
      {/* Wizard Header Bar */}
      <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {isEditing ? 'Edit Biodata Profile' : 'Record New Biodata & Medical Profile'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep].title}
          </p>
        </div>

        <button
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
          title="Cancel and close wizard"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Step Progress Bar & Tab Navigation */}
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px] gap-2">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleJumpToStep(idx)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-rose-600 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  isCurrent ? 'bg-white/20 text-white' : isCompleted ? 'bg-rose-200 text-rose-800' : 'bg-slate-200 text-slate-500'
                }`}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <Icon className="w-3.5 h-3.5" />
                <span>{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Step Body */}
      <div className="p-6 sm:p-8">
        {currentStep === 0 && (
          <StepPersonal data={formData} onChange={setFormData} errors={errors} />
        )}
        {currentStep === 1 && (
          <StepContact data={formData} onChange={setFormData} errors={errors} />
        )}
        {currentStep === 2 && (
          <StepMedical data={formData} onChange={setFormData} errors={errors} />
        )}
        {currentStep === 3 && (
          <StepInsurance data={formData} onChange={setFormData} errors={errors} />
        )}
        {currentStep === 4 && (
          <StepFamily data={formData} onChange={setFormData} errors={errors} />
        )}
        {currentStep === 5 && (
          <StepReview data={formData} onSubmit={handleSubmit} isSaving={isSaving} />
        )}
      </div>

      {/* Wizard Footer Controls */}
      <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <div>
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Cancel
            </button>
          )}
        </div>

        <div>
          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
