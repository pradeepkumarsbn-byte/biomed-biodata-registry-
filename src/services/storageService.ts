import type { BiodataProfile } from '../types/biodata';
import { calculateBmi } from '../types/biodata';

const STORAGE_KEY = 'biodata_profiles_v1';

export const SAMPLE_PROFILES: BiodataProfile[] = [
  {
    id: 'bio-sample-1',
    personal: {
      fullName: 'Dr. Aarav Mehta',
      preferredName: 'Aarav',
      gender: 'Male',
      dob: '1989-04-15',
      age: 37,
      maritalStatus: 'Married',
      nationality: 'Indian',
      occupation: 'Consultant Orthopedic Surgeon',
      photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
      govId: {
        idType: 'Aadhaar',
        idNumber: '4839-2910-4821',
        isMasked: true,
      }
    },
    contact: {
      primaryPhone: '+91 98451 23456',
      secondaryPhone: '+91 80 2345 6789',
      email: 'aarav.mehta@healthplus.org',
      residentialAddress: {
        street: 'Flat 402, Oakwood Residences, 12th Main Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
      },
      permanentAddress: {
        sameAsResidential: true,
      }
    },
    medical: {
      bloodGroup: 'O+',
      heightCm: 178,
      weightKg: 74,
      allergies: [
        {
          id: 'alg-1',
          allergen: 'Penicillin',
          severity: 'Severe (Anaphylactic)',
          reactionNotes: 'Causes bronchospasm and severe urticaria. Use Erythromycin/Clindamycin.'
        },
        {
          id: 'alg-2',
          allergen: 'Sulfa Drugs',
          severity: 'Moderate',
          reactionNotes: 'Skin rash and facial swelling.'
        }
      ],
      chronicConditions: ['Mild Asthma', 'Allergic Rhinitis'],
      currentMedications: [
        {
          id: 'med-1',
          name: 'Budesonide Inhaler',
          dosage: '200 mcg',
          frequency: '1 puff as needed',
          purpose: 'Asthma maintenance'
        },
        {
          id: 'med-2',
          name: 'Montelukast',
          dosage: '10 mg',
          frequency: 'Once daily at bedtime',
          purpose: 'Rhinitis control'
        }
      ],
      organDonor: true,
      dietaryPreference: 'Vegetarian',
      specialMedicalNotes: 'Carry epinephrine auto-injector during outdoor travel. Wears corrective spectacles.',
      covidVaccinated: true,
    },
    medicalReports: [
      {
        id: 'rep-101',
        testName: 'Comprehensive Metabolic Panel & Lipid Profile',
        category: 'Blood Test',
        testDate: '2026-02-14',
        labOrHospital: 'Manipal Diagnostics Centre',
        doctorName: 'Dr. K. S. Raman',
        fileName: 'Lipid_Panel_AaravMehta_Feb2026.pdf',
        fileSize: '420 KB',
        fileType: 'application/pdf',
        fileData: 'data:text/plain;charset=utf-8,MANIPAL%20DIAGNOSTICS%20-%20LABORATORY%20REPORT%0APatient%3A%20Dr.%20Aarav%20Mehta%0ABlood%20Group%3A%20O%20Positive%0ACholesterol%3A%20182%20mg%2FdL%20(Normal)%0AHDL%3A%2054%20mg%2FdL%0ALDL%3A%20108%20mg%2FdL%0ATriglycerides%3A%20138%20mg%2FdL%0AFasting%20Blood%20Glucose%3A%2092%20mg%2FdL%0AResult%3A%20All%20parameters%20within%20optimal%20limits.',
        summaryResult: 'Total Cholesterol: 182 mg/dL, HDL: 54 mg/dL, LDL: 108 mg/dL, Fasting Sugar: 92 mg/dL (Normal)',
        notes: 'Annual routine health checkup. Good cardiovascular markers.',
        uploadedAt: '2026-02-15T09:30:00.000Z'
      },
      {
        id: 'rep-102',
        testName: 'Pulmonary Function Test (Spirometry)',
        category: 'Pathology',
        testDate: '2025-11-20',
        labOrHospital: 'Bangalore Lung & Allergy Clinic',
        doctorName: 'Dr. P. Deshmukh',
        fileName: 'Spirometry_Report_Nov2025.pdf',
        fileSize: '650 KB',
        fileType: 'application/pdf',
        fileData: 'data:text/plain;charset=utf-8,BANGALORE%20LUNG%20CLINIC%20-%20SPIROMETRY%20REPORT%0APatient%3A%20Dr.%20Aarav%20Mehta%0AFEV1%20%2F%20FVC%20Ratio%3A%2084%25%0AResult%3A%20Mild%20reversible%20airway%20obstruction%20responsive%20to%20bronchodilator.',
        summaryResult: 'FEV1/FVC 84% - Mild reversible airway obstruction',
        notes: 'Asthma symptoms well managed with low-dose inhaler.',
        uploadedAt: '2025-11-21T14:10:00.000Z'
      }
    ],
    insurance: {
      hasInsurance: true,
      providerName: 'Star Health & Allied Insurance',
      policyNumber: 'SH-FAM-2024-984210',
      groupNumber: 'GRP-IND-882',
      policyType: 'Family Floater',
      sumInsured: '₹25,00,000 (25 Lakhs)',
      validTill: '2027-03-31',
      tpaHelpline: '1800-425-2255 (24x7 Cashless Desk)',
      primaryInsuredName: 'Aarav Mehta',
      relationshipWithPrimary: 'Self',
    },
    familyAndEmergency: {
      primaryEmergencyContact: {
        name: 'Dr. Ananya Mehta',
        relationship: 'Spouse',
        phone: '+91 98452 98765',
        altPhone: '+91 80 2345 6780',
        email: 'ananya.mehta@citycare.org',
        address: 'Flat 402, Oakwood Residences, Indiranagar, Bengaluru',
        isAuthorizedMedicalDecisionMaker: true,
      },
      secondaryEmergencyContact: {
        name: 'Suresh Mehta',
        relationship: 'Father',
        phone: '+91 94480 11223',
        email: 'suresh.mehta@yahoo.com',
      },
      familyMembers: [
        {
          id: 'fam-1',
          name: 'Ananya Mehta',
          relationship: 'Spouse',
          age: 35,
          phone: '+91 98452 98765',
          isDependent: false,
        },
        {
          id: 'fam-2',
          name: 'Reyansh Mehta',
          relationship: 'Son',
          age: 6,
          isDependent: true,
        }
      ],
      primaryPhysician: {
        name: 'Dr. K. S. Raman',
        clinicHospital: 'Manipal Hospital, Old Airport Road',
        phone: '+91 80 2502 4444',
      }
    },
    metadata: {
      createdAt: '2026-01-10T10:30:00.000Z',
      updatedAt: '2026-03-15T14:20:00.000Z',
    }
  },
  {
    id: 'bio-sample-2',
    personal: {
      fullName: 'Priya Ramesh Sharma',
      preferredName: 'Priya',
      gender: 'Female',
      dob: '1996-08-22',
      age: 29,
      maritalStatus: 'Single',
      nationality: 'Indian',
      occupation: 'Principal Cloud Architect',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      govId: {
        idType: 'Passport',
        idNumber: 'Z5891240',
        isMasked: true,
      }
    },
    contact: {
      primaryPhone: '+91 97110 54321',
      secondaryPhone: '',
      email: 'priya.sharma@techcloud.io',
      residentialAddress: {
        street: 'Tower B - 1404, Cyber Heights, Sector 62',
        city: 'Noida',
        state: 'Uttar Pradesh',
        postalCode: '201309',
        country: 'India',
      },
      permanentAddress: {
        sameAsResidential: false,
        street: 'House 54, Shastri Nagar, Civil Lines',
        city: 'Jaipur',
        state: 'Rajasthan',
        postalCode: '302006',
        country: 'India',
      }
    },
    medical: {
      bloodGroup: 'B+',
      heightCm: 165,
      weightKg: 56,
      allergies: [
        {
          id: 'alg-3',
          allergen: 'Peanuts & Tree Nuts',
          severity: 'Severe (Anaphylactic)',
          reactionNotes: 'Immediate airway restriction. Strict nut-free protocol.'
        }
      ],
      chronicConditions: ['Migraine with Aura'],
      currentMedications: [
        {
          id: 'med-3',
          name: 'Sumatriptan',
          dosage: '50 mg',
          frequency: 'As needed at onset of migraine aura',
          purpose: 'Migraine acute relief'
        }
      ],
      organDonor: true,
      dietaryPreference: 'Vegetarian',
      specialMedicalNotes: 'Carry EpiPen in backpack at all times. Blood group B Rh-positive verified.',
      covidVaccinated: true,
    },
    medicalReports: [
      {
        id: 'rep-201',
        testName: 'Allergy Antibody Panel (IgE & Food Allergens)',
        category: 'Blood Test',
        testDate: '2026-01-10',
        labOrHospital: 'Dr. Lal PathLabs Noida',
        doctorName: 'Dr. Suniti Singhal',
        fileName: 'Allergy_Panel_PriyaSharma.pdf',
        fileSize: '310 KB',
        fileType: 'application/pdf',
        fileData: 'data:text/plain;charset=utf-8,DR.%20LAL%20PATHLABS%20-%20ALLERGY%20REPORT%0APatient%3A%20Priya%20Ramesh%20Sharma%0ATotal%20Serum%20IgE%3A%20420%20kU%2FL%20(Elevated)%0APeanut%20Specific%20IgE%3A%20Class%205%20(Very%20High%20%3E50%20kU%2FL)%0ATree%20Nuts%20IgE%3A%20Class%204%20(High)%0ADiagnosis%3A%20Severe%20anaphylactic%20peanut%20and%20nut%20hypersensitivity.',
        summaryResult: 'Severe Peanut IgE (Class 5 >50 kU/L) & Tree Nuts (Class 4 High)',
        notes: 'Strict allergen avoidance and carry auto-injector epinephrine.',
        uploadedAt: '2026-01-11T11:20:00.000Z'
      }
    ],
    insurance: {
      hasInsurance: true,
      providerName: 'HDFC ERGO Health Insurance',
      policyNumber: 'HE-CORP-99210-441',
      groupNumber: 'GRP-TCS-719',
      policyType: 'Corporate Group',
      sumInsured: '₹15,00,000 (15 Lakhs)',
      validTill: '2026-12-31',
      tpaHelpline: '1800-2666-400 (HDFC ERGO 24/7)',
      primaryInsuredName: 'Priya Sharma',
      relationshipWithPrimary: 'Self',
    },
    familyAndEmergency: {
      primaryEmergencyContact: {
        name: 'Ramesh Sharma',
        relationship: 'Father',
        phone: '+91 94140 88776',
        altPhone: '+91 141 262 3344',
        email: 'ramesh.sharma.jpr@gmail.com',
        address: 'House 54, Shastri Nagar, Jaipur, Rajasthan',
        isAuthorizedMedicalDecisionMaker: true,
      },
      secondaryEmergencyContact: {
        name: 'Neha Sharma',
        relationship: 'Sister',
        phone: '+91 98290 33221',
        email: 'neha.sharma@delhicorp.com',
      },
      familyMembers: [
        {
          id: 'fam-3',
          name: 'Ramesh Sharma',
          relationship: 'Father',
          age: 61,
          phone: '+91 94140 88776',
          isDependent: false,
        },
        {
          id: 'fam-4',
          name: 'Kavita Sharma',
          relationship: 'Mother',
          age: 57,
          isDependent: true,
        }
      ],
      primaryPhysician: {
        name: 'Dr. Suniti Singhal',
        clinicHospital: 'Fortis Hospital Noida, Sector 62',
        phone: '+91 120 430 0222',
      }
    },
    metadata: {
      createdAt: '2026-02-01T08:15:00.000Z',
      updatedAt: '2026-02-18T11:00:00.000Z',
    }
  },
  {
    id: 'bio-sample-3',
    personal: {
      fullName: 'Colonel Vikramaditya Singh',
      preferredName: 'Vikram',
      gender: 'Male',
      dob: '1961-11-04',
      age: 64,
      maritalStatus: 'Married',
      nationality: 'Indian',
      occupation: 'Veteran / Defense Strategy Consultant',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      govId: {
        idType: 'Aadhaar',
        idNumber: '7102-9931-1052',
        isMasked: true,
      }
    },
    contact: {
      primaryPhone: '+91 98100 77665',
      secondaryPhone: '+91 11 2614 8899',
      email: 'col.vikramaditya@veteransnet.org',
      residentialAddress: {
        street: 'Villa 18, Som Vihar, R.K. Puram Sector 10',
        city: 'New Delhi',
        state: 'Delhi',
        postalCode: '110022',
        country: 'India',
      },
      permanentAddress: {
        sameAsResidential: true,
      }
    },
    medical: {
      bloodGroup: 'AB-',
      heightCm: 182,
      weightKg: 85,
      allergies: [
        {
          id: 'alg-4',
          allergen: 'Aspirin / NSAIDs',
          severity: 'Moderate',
          reactionNotes: 'Gastric irritation and shortness of breath. Acetaminophen preferred.'
        }
      ],
      chronicConditions: ['Type 2 Diabetes (Well Controlled)', 'Hypertension', 'Cardiovascular Stent (2021)'],
      currentMedications: [
        {
          id: 'med-4',
          name: 'Metformin Hydrochloride',
          dosage: '500 mg',
          frequency: 'Twice daily after meals',
          purpose: 'Glycemic control'
        },
        {
          id: 'med-5',
          name: 'Telmisartan',
          dosage: '40 mg',
          frequency: 'Once daily morning',
          purpose: 'Blood pressure regulation'
        },
        {
          id: 'med-6',
          name: 'Clopidogrel',
          dosage: '75 mg',
          frequency: 'Once daily after dinner',
          purpose: 'Post-stent antiplatelet'
        }
      ],
      organDonor: true,
      dietaryPreference: 'Non-Vegetarian',
      specialMedicalNotes: 'Rare Blood Group AB Negative. Keep emergency donor contacts handy. Stent placed in LAD (2021).',
      covidVaccinated: true,
    },
    medicalReports: [
      {
        id: 'rep-301',
        testName: '2D Echocardiogram & Stent Patency Evaluation',
        category: 'Cardiology / ECG',
        testDate: '2026-01-25',
        labOrHospital: 'Army Hospital (R&R) New Delhi',
        doctorName: 'Brig. Dr. Rajesh Sen',
        fileName: 'Echo_Cardiology_Report_ColVikram.pdf',
        fileSize: '890 KB',
        fileType: 'application/pdf',
        fileData: 'data:text/plain;charset=utf-8,ARMY%20HOSPITAL%20R%26R%20-%20CARDIOLOGY%20REPORT%0APatient%3A%20Col.%20Vikramaditya%20Singh%0AEjection%20Fraction%20(LVEF)%3A%2058%25%20(Preserved)%0AStent%20Site%20(LAD)%3A%20Patent%2C%20good%20distal%20flow%2C%20no%20in-stent%20restenosis.%0AValves%3A%20Trace%20mitral%20regurgitation%20consistent%20with%20age.%0ARecommendation%3A%20Continue%20antiplatelet%20and%20statin%20regimen.',
        summaryResult: 'LVEF 58% (Normal systolic function), LAD Stent patent with healthy flow',
        notes: 'Annual cardiac follow-up. Blood pressure optimal on Telmisartan.',
        uploadedAt: '2026-01-26T15:45:00.000Z'
      },
      {
        id: 'rep-302',
        testName: 'Glycated Hemoglobin (HbA1c) & Renal Function',
        category: 'Blood Test',
        testDate: '2026-02-28',
        labOrHospital: 'Dr. Dangs Lab, Hauz Khas',
        doctorName: 'Brig. Dr. Rajesh Sen',
        fileName: 'HbA1c_Renal_ColVikram_Feb2026.pdf',
        fileSize: '380 KB',
        fileType: 'application/pdf',
        fileData: 'data:text/plain;charset=utf-8,DR.%20DANGS%20LAB%20-%20BIOCHEMISTRY%20REPORT%0APatient%3A%20Col.%20Vikramaditya%20Singh%0AHbA1c%3A%206.4%25%20(Well%20Controlled%20Diabetic)%0AEsc%20Avg%20Glucose%3A%20137%20mg%2FdL%0ASerum%20Creatinine%3A%201.0%20mg%2FdL%20(Normal)%0AeGFR%3A%2082%20mL%2Fmin.',
        summaryResult: 'HbA1c: 6.4% (Good control), Serum Creatinine: 1.0 mg/dL (Normal)',
        notes: 'Diabetes well managed on Metformin 500mg BD.',
        uploadedAt: '2026-03-01T10:00:00.000Z'
      }
    ],
    insurance: {
      hasInsurance: true,
      providerName: 'ECHS (Ex-Servicemen Contributory Health Scheme) + Niva Bupa Senior First',
      policyNumber: 'NB-SR-2023-77192',
      groupNumber: 'DEF-ECHS-11029',
      policyType: 'Senior Citizen',
      sumInsured: '₹50,00,000 (50 Lakhs) + Unlimited ECHS',
      validTill: '2028-10-31',
      tpaHelpline: '1800-309-3333 / ECHS 1800-114-115',
      primaryInsuredName: 'Vikramaditya Singh',
      relationshipWithPrimary: 'Self',
    },
    familyAndEmergency: {
      primaryEmergencyContact: {
        name: 'Sunita Singh',
        relationship: 'Spouse',
        phone: '+91 98101 22334',
        altPhone: '+91 11 2614 8899',
        email: 'sunita.singh@gmail.com',
        address: 'Villa 18, Som Vihar, R.K. Puram, New Delhi',
        isAuthorizedMedicalDecisionMaker: true,
      },
      secondaryEmergencyContact: {
        name: 'Major Zorawar Singh',
        relationship: 'Son',
        phone: '+91 99990 44556',
        email: 'zorawar.singh@army.gov.in',
      },
      familyMembers: [
        {
          id: 'fam-5',
          name: 'Sunita Singh',
          relationship: 'Spouse',
          age: 60,
          phone: '+91 98101 22334',
          isDependent: true,
        },
        {
          id: 'fam-6',
          name: 'Major Zorawar Singh',
          relationship: 'Son',
          age: 33,
          phone: '+91 99990 44556',
          isDependent: false,
        }
      ],
      primaryPhysician: {
        name: 'Brig. Dr. Rajesh Sen (Cardiologist)',
        clinicHospital: 'Army Hospital (Research & Referral), Dhaula Kuan',
        phone: '+91 11 2568 6000',
      }
    },
    metadata: {
      createdAt: '2025-11-20T09:00:00.000Z',
      updatedAt: '2026-03-01T16:45:00.000Z',
    }
  }
];

export const storageService = {
  getProfiles(): BiodataProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveAllProfiles(SAMPLE_PROFILES);
        return SAMPLE_PROFILES;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.saveAllProfiles(SAMPLE_PROFILES);
        return SAMPLE_PROFILES;
      }
      // Ensure backwards-compatible shape
      return parsed.map((p: any) => ({
        ...p,
        medicalReports: p.medicalReports || [],
        medical: {
          ...p.medical,
          heightCm: p.medical?.heightCm,
          weightKg: p.medical?.weightKg,
        }
      }));
    } catch (err) {
      console.error('Failed to load profiles from localStorage:', err);
      return SAMPLE_PROFILES;
    }
  },

  getProfileById(id: string): BiodataProfile | undefined {
    const list = this.getProfiles();
    return list.find(p => p.id === id);
  },

  saveAllProfiles(profiles: BiodataProfile[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    } catch (err) {
      console.error('Failed to save profiles to localStorage:', err);
    }
  },

  saveProfile(profile: BiodataProfile): BiodataProfile {
    const list = this.getProfiles();
    const existingIndex = list.findIndex(p => p.id === profile.id);
    const updatedProfile: BiodataProfile = {
      ...profile,
      medicalReports: profile.medicalReports || [],
      metadata: {
        ...profile.metadata,
        updatedAt: new Date().toISOString(),
      }
    };

    if (existingIndex >= 0) {
      list[existingIndex] = updatedProfile;
    } else {
      updatedProfile.id = profile.id || `bio-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      updatedProfile.metadata.createdAt = new Date().toISOString();
      list.unshift(updatedProfile);
    }

    this.saveAllProfiles(list);
    return updatedProfile;
  },

  deleteProfile(id: string): boolean {
    const list = this.getProfiles();
    const filtered = list.filter(p => p.id !== id);
    if (filtered.length !== list.length) {
      this.saveAllProfiles(filtered);
      return true;
    }
    return false;
  },

  resetToSampleData(): BiodataProfile[] {
    this.saveAllProfiles(SAMPLE_PROFILES);
    return SAMPLE_PROFILES;
  },

  exportProfilesAsJSON(): string {
    const list = this.getProfiles();
    return JSON.stringify(list, null, 2);
  },

  importProfilesFromJSON(jsonString: string): { success: boolean; count?: number; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return { success: false, error: 'Uploaded JSON must be an array of biodata profiles.' };
      }
      const isValid = parsed.every(item => item && item.personal && item.personal.fullName && item.medical && item.medical.bloodGroup);
      if (!isValid) {
        return { success: false, error: 'JSON format mismatch: Missing essential biodata or medical properties.' };
      }
      const normalized = parsed.map((p: any) => ({
        ...p,
        medicalReports: p.medicalReports || [],
        medical: {
          ...p.medical,
          heightCm: p.medical?.heightCm,
          weightKg: p.medical?.weightKg,
        }
      }));
      this.saveAllProfiles(normalized);
      return { success: true, count: normalized.length };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Invalid JSON file content.' };
    }
  },

  exportProfilesAsCSV(): string {
    const list = this.getProfiles();
    const headers = [
      'ID', 'Full Name', 'Gender', 'DOB', 'Age', 'Height (cm)', 'Weight (kg)', 'BMI',
      'Blood Group', 'Primary Phone', 'Email', 'City', 'State', 'Gov ID Type', 'Gov ID Number',
      'Allergies', 'Chronic Conditions', 'Medical Reports Count',
      'Insurance Provider', 'Policy Number', 'Valid Till',
      'Emergency Contact Name', 'Emergency Contact Relation', 'Emergency Phone', 'Emergency Alt Phone',
      'Family Doctor Name', 'Doctor Phone'
    ];

    const escapeCSV = (val: unknown) => {
      const str = String(val ?? '').replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = list.map(p => {
      const bmiInfo = calculateBmi(p.medical.heightCm, p.medical.weightKg);
      const bmiStr = bmiInfo ? `${bmiInfo.bmi} (${bmiInfo.category})` : 'N/A';

      return [
        p.id,
        p.personal.fullName,
        p.personal.gender,
        p.personal.dob,
        p.personal.age,
        p.medical.heightCm || 'N/A',
        p.medical.weightKg || 'N/A',
        bmiStr,
        p.medical.bloodGroup,
        p.contact.primaryPhone,
        p.contact.email,
        p.contact.residentialAddress.city,
        p.contact.residentialAddress.state,
        p.personal.govId.idType,
        p.personal.govId.idNumber,
        p.medical.allergies.map(a => `${a.allergen} (${a.severity})`).join('; '),
        p.medical.chronicConditions.join('; '),
        p.medicalReports?.length || 0,
        p.insurance.hasInsurance ? p.insurance.providerName : 'None',
        p.insurance.hasInsurance ? p.insurance.policyNumber : 'N/A',
        p.insurance.hasInsurance ? p.insurance.validTill : 'N/A',
        p.familyAndEmergency.primaryEmergencyContact.name,
        p.familyAndEmergency.primaryEmergencyContact.relationship,
        p.familyAndEmergency.primaryEmergencyContact.phone,
        p.familyAndEmergency.primaryEmergencyContact.altPhone || '',
        p.familyAndEmergency.primaryPhysician?.name || '',
        p.familyAndEmergency.primaryPhysician?.phone || ''
      ].map(escapeCSV).join(',');
    });

    return [headers.join(','), ...rows].join('\r\n');
  }
};
