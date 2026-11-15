import { prisma } from '../config/database';
import { verifySupabaseToken } from '../config/supabase';

// Prescription requirement enum
export enum PrescriptionRequirement {
  OTC = 'OTC',
  RxRequired = 'Rx Required',
  VerificationNeeded = 'Verification Needed',
}

// Prescription requirement rules based on regulatory schedule
interface PrescriptionRule {
  schedule: string;
  requiresPrescription: boolean;
  minAge?: number;
  notes?: string;
}

// Prescription classification result
export interface PrescriptionClassification {
  requirement: PrescriptionRequirement;
  schedule: string;
  reason: string;
  requiresUpload: boolean;
  expiryNote?: string;
}

// Get prescription requirement for a medicine
export async function getPrescriptionRequirement(
  medicineId: string,
  userRole: string
): Promise<PrescriptionClassification> {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    include: {
      regulatoryRules: true,
    },
  );

  if (!medicine) {
    return {
      requirement: PrescriptionRequirement.VerificationNeeded,
      schedule: 'Unknown',
      reason: 'Medicine not found in database',
      requiresUpload: true,
    };
  }

  // Find applicable regulatory rule
  const applicableRule = medicine.regulatoryRules.find(
    rule => !rule.prescriptionRequired || // Rule allows OTC
    true // All rules are considered for determination
  ) || medicine.regulatoryRules[0];

  const schedule = applicableRule.schedule || 'OTC';
  const requiresPrescription = applicableRule.prescriptionRequired;

  // Determine prescription requirement based on schedule and user role
  let requirement: PrescriptionRequirement;
  let reason: string;
  let requiresUpload = false;

  switch (schedule) {
    case 'SCHEDULE_H':
    case 'SCHEDULE_H1':
    case 'SCHEDULE_X':
      requirement = PrescriptionRequirement.RxRequired;
      reason = `This medicine is Schedule ${schedule} and requires a prescription.`;
      requiresUpload = true;
      break;

    case 'SCHEDULE_G':
      // Schedule G medicines may be OTC or Rx based on strength
      if (medicine.prescriptionReq === 'OVER_THE_COUNTER') {
        requirement = PrescriptionRequirement.OTC;
        reason = 'This medicine is classified as OTC per regulatory rules.';
        requiresUpload = false;
      } else {
        requirement = PrescriptionRequirement.RxRequired;
        reason = 'This medicine requires a prescription per regulatory rules.';
        requiresUpload = true;
      }
      break;

    case 'OVER_THE_COUNTER':
      requirement = PrescriptionRequirement.OTC;
      reason = 'This medicine is available over the counter.';
      requiresUpload = false;
      break;

    default:
      // Check prescription requirement from medicine data
      if (medicine.prescriptionReq === 'OVER_THE_COUNTER') {
        requirement = PrescriptionRequirement.OTC;
        reason = 'This medicine is classified as OTC.';
        requiresUpload = false;
      } else if (medicine.prescriptionReq === 'DOCTOR_CONSULTATION_REQUIRED') {
        requirement = PrescriptionRequirement.RxRequired;
        reason = 'This medicine requires doctor consultation.';
        requiresUpload = true;
      } else {
        // Default to verification needed for uncertain cases
        requirement = PrescriptionRequirement.VerificationNeeded;
        reason = 'Prescription requirement could not be determined. Verification needed.';
        requiresUpload = true;
      }
  }

  // Additional check for user role
  if (userRole === 'pharmacy') {
    // Pharmacies always need verification for dispensing
    requiresUpload = true;
    if (requirement === PrescriptionRequirement.OTC) {
      requirement = PrescriptionRequirement.VerificationNeeded;
    }
  }

  return {
    requirement,
    schedule,
    reason,
    requiresUpload,
  };
}

// Get all regulatory rules
export async function getRegulatoryRules() {
  const rules = await prisma.regulatoryRule.findMany({
    include: {
      medicine: {
        select: {
          name: true,
          genericName: true,
        },
      },
    },
    orderBy: { schedule: 'asc' },
  });

  return rules.map(rule => ({
    id: rule.id,
    medicineName: medicine.name,
    genericName: medicine.genericName,
    schedule: rule.schedule,
    maxQuantity: rule.maxQuantity,
    prescriptionRequired: rule.prescriptionRequired,
    createdAt: rule.createdAt,
    createdBy: rule.createdBy,
  });
}

// Validate prescription upload
export async function validatePrescriptionUpload(
  medicineId: string,
  prescriptionDocumentId: string
): Promise<{ valid: boolean; reason: string }> {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    include: {
      regulatoryRules: true,
    },
  });

  if (!medicine) {
    return { valid: false, reason: 'Medicine not found' };
  }

  // Check if prescription is required
  const hasPrescriptionRule = medicine.regulatoryRules.some(
    rule => rule.prescriptionRequired
  );

  if (!hasPrescriptionRule) {
    return { valid: true, reason: 'No prescription required for this medicine' };
  }

  // Check if prescription document exists and is verified
  const prescription = await prisma.prescription.findFirst({
    where: {
      medicineId,
      documentId: prescriptionDocumentId,
      status: 'verified',
    },
  });

  if (!prescription) {
    return { valid: false, reason: 'Prescription not verified or missing' };
  }

  return { valid: true, reason: 'Prescription verified successfully' };
}

// Check if user can access prescription for this medicine
export async function checkPrescriptionAccess(
  medicineId: string,
  userId: string
): Promise<{ canAccess: boolean; reason: string }> {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
  });

  if (!medicine) {
    return { canAccess: false, reason: 'Medicine not found' };
  }

  // Check prescription requirement
  const hasPrescriptionRule = medicine.regulatoryRules.some(
    rule => rule.prescriptionRequired
  );

  if (!hasPrescriptionRule) {
    return { canAccess: true, reason: 'No prescription required' };
  }

  // Check if user has a valid prescription
  const prescription = await prisma.prescription.findFirst({
    where: {
      medicineId,
      patientId: userId,
      status: 'verified',
    },
  });

  if (!prescription) {
    return { canAccess: false, reason: 'No valid prescription on file' };
  }

  return { canAccess: true, reason: 'Valid prescription verified' };
}