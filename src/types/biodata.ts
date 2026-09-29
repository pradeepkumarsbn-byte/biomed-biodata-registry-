export type BloodGroup = 
  | 'A+' 
  | 'A-' 
  | 'B+' 
  | 'B-' 
  | 'AB+' 
  | 'AB-' 
  | 'O+' 
  | 'O-' 
  | 'Bombay / Rare' 
  | 'Unknown';

export type Gender = 'Male' | 'Female' | 'Non-Binary' | 'Other' | 'Prefer not to say';

export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated';

export type AllergySeverity = 'Mild' | 'Moderate' | 'Severe (Anaphylactic)';

export interface AllergyItem {
  id: string;
  allergen: string;
  severity: AllergySeverity;
  reactionNotes?: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  purpose?: string;
}

export interface FamilyMemberItem {
  id: string;
  name: string;
  relationship: string;
  age?: number;
  phone?: string;
  isDependent: boolean;
}

export type GovIdType = 
  | 'Aadhaar' 
  | 'Passport' 
  | 'SSN / National ID' 
  | 'Driver License' 
  | 'Voter ID' 
  | 'Health Insurance ID' 
  | 'Other';

export type TestReportCategory = 
  | 'Blood Test' 
  | 'Radiology / Scan' 
  | 'Pathology' 
  | 'Prescription' 
  | 'Cardiology / ECG' 
  | 'Discharge Summary' 
  | 'Vaccination' 
  | 'Other';

export interface MedicalTestReport {
  id: string;
  testName: string;
  category: TestReportCategory;
  testDate: string; // YYYY-MM-DD
  labOrHospital?: string;
  doctorName?: string;
  fileName: string;
  fileSize: string; // e.g. "1.2 MB"
  fileType: string; // MIME type or extension
  fileData?: string; // Base64 data URL
  summaryResult?: string;
  notes?: string;
  uploadedAt: string;
}

export interface BiodataProfile {
  id: string;
  
  // 1. Personal & Identification
  personal: {
    fullName: string;
    preferredName?: string;
    gender: Gender;
    dob: string; // YYYY-MM-DD
    age: number;
    maritalStatus: MaritalStatus;
    nationality: string;
    occupation: string;
    photoUrl?: string; // base64 data URL or preset avatar
    govId: {
      idType: GovIdType;
      idNumber: string;
      isMasked: boolean;
    };
  };

  // 2. Contact & Address Details
  contact: {
    primaryPhone: string;
    secondaryPhone?: string;
    email: string;
    residentialAddress: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    permanentAddress: {
      sameAsResidential: boolean;
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };

  // 3. Medical & Health Profile
  medical: {
    bloodGroup: BloodGroup;
    heightCm?: number; // Height in cm
    weightKg?: number; // Weight in kg
    allergies: AllergyItem[];
    chronicConditions: string[]; // e.g. ["Type 2 Diabetes", "Hypertension"]
    currentMedications: MedicationItem[];
    organDonor: boolean;
    dietaryPreference?: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Eggetarian' | 'Halal' | 'Kosher' | 'Other';
    specialMedicalNotes?: string;
    covidVaccinated?: boolean;
  };

  // 4. Medical Test Reports & Documents
  medicalReports: MedicalTestReport[];

  // 5. Insurance Details
  insurance: {
    hasInsurance: boolean;
    providerName: string;
    policyNumber: string;
    groupNumber?: string;
    policyType: 'Individual Health' | 'Family Floater' | 'Corporate Group' | 'Government Scheme' | 'Senior Citizen' | 'Other';
    sumInsured?: string;
    validTill: string; // YYYY-MM-DD
    tpaHelpline: string; // 24x7 Cashless Emergency Helpline
    primaryInsuredName?: string;
    relationshipWithPrimary?: string;
  };

  // 6. Family & Emergency Contacts
  familyAndEmergency: {
    primaryEmergencyContact: {
      name: string;
      relationship: string;
      phone: string;
      altPhone?: string;
      email?: string;
      address?: string;
      isAuthorizedMedicalDecisionMaker: boolean;
    };
    secondaryEmergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
      email?: string;
    };
    familyMembers: FamilyMemberItem[];
    primaryPhysician?: {
      name: string;
      clinicHospital: string;
      phone: string;
    };
  };

  // System Metadata
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
}

export const BLOOD_GROUPS: BloodGroup[] = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Bombay / Rare', 'Unknown'
];

export const COMMON_ALLERGIES = [
  'Penicillin', 'Peanuts', 'Tree Nuts', 'Shellfish', 'Dairy / Lactose', 
  'Sulfa Drugs', 'Aspirin / NSAIDs', 'Latex', 'Bee/Wasp Stings', 'Dust / Pollen', 'Eggs'
];

export const COMMON_CONDITIONS = [
  'Type 2 Diabetes', 'Type 1 Diabetes', 'Hypertension (High BP)', 'Asthma', 
  'Thyroid Disorder', 'Heart Condition / Arrhythmia', 'Epilepsy / Seizures', 
  'Kidney Disease', 'Arthritis', 'Migraine'
];

export const TEST_REPORT_CATEGORIES: TestReportCategory[] = [
  'Blood Test', 
  'Radiology / Scan', 
  'Pathology', 
  'Prescription', 
  'Cardiology / ECG', 
  'Discharge Summary', 
  'Vaccination', 
  'Other'
];

export const GENDERS: Gender[] = ['Male', 'Female', 'Non-Binary', 'Other', 'Prefer not to say'];
export const MARITAL_STATUSES: MaritalStatus[] = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];
export const GOV_ID_TYPES: GovIdType[] = ['Aadhaar', 'Passport', 'SSN / National ID', 'Driver License', 'Voter ID', 'Health Insurance ID', 'Other'];

export interface BmiInfo {
  bmi: number;
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obese';
  badgeClass: string;
}

export const calculateBmi = (heightCm?: number, weightKg?: number): BmiInfo | null => {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return null;
  const heightM = heightCm / 100;
  const bmiVal = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
  if (bmiVal < 18.5) {
    return { bmi: bmiVal, category: 'Underweight', badgeClass: 'text-amber-700 bg-amber-50 border-amber-200' };
  } else if (bmiVal < 25) {
    return { bmi: bmiVal, category: 'Normal weight', badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  } else if (bmiVal < 30) {
    return { bmi: bmiVal, category: 'Overweight', badgeClass: 'text-amber-700 bg-amber-50 border-amber-200' };
  } else {
    return { bmi: bmiVal, category: 'Obese', badgeClass: 'text-rose-700 bg-rose-50 border-rose-200' };
  }
};

export const createEmptyProfile = (): BiodataProfile => ({
  id: '',
  personal: {
    fullName: '',
    preferredName: '',
    gender: 'Male',
    dob: '',
    age: 0,
    maritalStatus: 'Single',
    nationality: 'Indian',
    occupation: '',
    photoUrl: '',
    govId: {
      idType: 'Aadhaar',
      idNumber: '',
      isMasked: true,
    }
  },
  contact: {
    primaryPhone: '',
    secondaryPhone: '',
    email: '',
    residentialAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    },
    permanentAddress: {
      sameAsResidential: true,
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    }
  },
  medical: {
    bloodGroup: 'O+',
    heightCm: undefined,
    weightKg: undefined,
    allergies: [],
    chronicConditions: [],
    currentMedications: [],
    organDonor: false,
    dietaryPreference: 'Vegetarian',
    specialMedicalNotes: '',
    covidVaccinated: true,
  },
  medicalReports: [],
  insurance: {
    hasInsurance: true,
    providerName: '',
    policyNumber: '',
    groupNumber: '',
    policyType: 'Individual Health',
    sumInsured: '',
    validTill: '',
    tpaHelpline: '',
    primaryInsuredName: '',
    relationshipWithPrimary: 'Self',
  },
  familyAndEmergency: {
    primaryEmergencyContact: {
      name: '',
      relationship: 'Spouse',
      phone: '',
      altPhone: '',
      email: '',
      address: '',
      isAuthorizedMedicalDecisionMaker: true,
    },
    secondaryEmergencyContact: {
      name: '',
      relationship: 'Parent',
      phone: '',
      email: '',
    },
    familyMembers: [],
    primaryPhysician: {
      name: '',
      clinicHospital: '',
      phone: '',
    }
  },
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
});
