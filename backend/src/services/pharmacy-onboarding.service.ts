import { prisma } from '../config/database';
import { supabase, supabaseAdmin } from '../config/supabase';
import { verifySupabaseToken } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime';
import fs from 'fs';
import path from 'path';

// Types
export interface PharmacyRegistrationData {
  pharmacyName: string;
  displayName: string;
  address: string;
  state: string;
  district: string;
  pinCode: string;
  contactPhone: string;
  businessEmail?: string;
  licenceType: string;
  licenceNumber: string;
  ownerName: string;
  ownerEmail: string;
  pharmacistName: string;
  pharmacistRegistrationNumber: string;
  statePharmacyCouncil: string;
  operatingHours: string;
  serviceAreaKm: number;
  latitude: number;
  longitude: number;
}

export interface PharmacyOnboardingStep {
  step: 1 | 2 | 3 | 4 | 4.5 | 5 | 6;
  title: string;
  description: string;
  completed: boolean;
  valid: boolean;
}

export interface PharmacyVerification {
  id: string;
  pharmacyId: string;
  status: 'DRAFT' | 'PENDING_VERIFICATION' | 'UNDER_REVIEW' | 'ACTIVE' | 'CORRECTION_REQUIRED' | 'REJECTED' | 'SUSPENDED' | 'DEACTIVATED';
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  correctionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Submit pharmacy onboarding application
 */
export async function submitOnboardingApplication(
  buyerId: string,
  registrationData: PharmacyRegistrationData
): Promise<{ success: boolean; verification?: any; error: string }> {
  try {
    // Verify authentication
    const payload = await verifySupabaseToken(
      (await import('../config/supabase')).default.auth.getSession()
    ).session?.access_token;

    if (!payload) {
      return { success: false, error: 'Authentication required', verification: undefined };
    }

    // Check if user is already a pharmacy
    const existingPharmacy = await prisma.pharmacyProfile.findFirst({
      where: { userId: buyerId },
    });

    if (existingPharmacy) {
      return { success: false, error: 'Pharmacy profile already exists', verification: undefined };
    }

    // Create pharmacy profile
    const pharmacyProfile = await prisma.pharmacyProfile.create({
      data: {
        userId: buyerId,
        pharmacyName: registrationData.pharmacyName,
        displayName: registrationData.displayName,
        address: registrationData.address,
        state: registrationData.state,
        district: registrationData.district,
        pinCode: registrationData.pinCode,
        phone: registrationData.contactPhone,
        email: registrationData.businessEmail,
        licenseType: registrationData.licenceType,
        licenseNumber: registrationData.licenceNumber,
        verificationStatus: 'PENDING',
        isVerified: false,
        isOpen: true,
        serviceAreaKm: registrationData.serviceAreaKm || 5,
        latitude: registrationData.latitude,
        longitude: registrationData.longitude,
      },
    });

    // Create drug licence document
    const licenceDocument = await createLicenceDocument(
      pharmacyProfile.id,
      registrationData.licenceType,
      registrationData.licenceNumber
    );

    // Create pharmacist registration
    const pharmacistRegistration = await prisma.pharmacistRegistration.create({
      data: {
        pharmacyId: pharmacyProfile.id,
        fullName: registrationData.pharmacistName,
        statePharmacyCouncil: registrationData.statePharmacyCouncil,
        registrationNumber: registrationData.pharmacistRegistrationNumber,
        verificationStatus: 'REGISTRATION_SUBMITTED',
      },
    });

    // Create pharmacy verification record
    const verificationRecord = await prisma.pharmacyVerification.create({
      data: {
        pharmacyId: pharmacyProfile.id,
        status: 'PENDING_VERIFICATION',
      },
    });

    // Create notification preferences
    await prisma.pharmacyNotificationPreference.create({
      data: {
        pharmacyId: pharmacyProfile.id,
      },
    });

    return {
      success: true,
      verification: {
        id: verificationRecord.id,
        pharmacyId: pharmacyProfile.id,
        status: verificationRecord.status,
        submittedAt: verificationRecord.createdAt,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error submitting onboarding application:', error);
    return { success: false, error: 'Failed to submit onboarding application', verification: undefined };
  }
}

/**
 * Create drug licence document
 */
async function createLicenceDocument(
  pharmacyId: string,
  licenceType: string,
  licenceNumber: string
): Promise<any> {
  // Generate document ID
  const documentId = uuidv4();
  const filePath = `drug-licences/${pharmacyId}/${documentId}`;

  // Determine file type based on licence type
  const fileType = licenceType.includes('FORM_20') ? 'pdf' : 'pdf';

  // Create signed URL for private storage
  const { data, error } = await supabaseAdmin.storage
    .from('patient-documents')
    .createSignedUrl(filePath, 86400); // 24 hours

  if (error) {
    throw new Error(`Failed to create document: ${error.message}`);
  }

  // Record the document in database
  const dbRecord = await prisma.pharmacyDocument.create({
    data: {
      pharmacyId,
      documentType: 'DRUG_LICENCE',
      licenceType: licenceType as any,
      fileName: `${licenceNumber}.pdf`,
      fileType,
      fileSize: 0, // Will be updated on actual upload
      storagePath: filePath,
      documentId,
      status: 'SUBMITTED',
      uploadedBy: '', // Will be set when user uploads
    },
  });

  return dbRecord;
}

/**
 * Get onboarding steps progress
 */
export function getOnboardingSteps(pharmacyId: string): PharmacyOnboardingStep[] {
  return [
    {
      step: 1,
      title: 'Business Information',
      description: 'Pharmacy details and contact information',
      completed: true,
      valid: true,
    },
    {
      step: 2,
      title: 'Drug Licences',
      description: 'Submit drug licence documents',
      completed: false,
      valid: false,
    },
    {
      step: 3,
      title: 'Pharmacist Information',
      description: 'Pharmacist registration details',
      completed: false,
      valid: false,
    },
    {
      step: 4,
      title: 'Location',
      description: 'Map pin and service area',
      completed: false,
      valid: false,
    },
    {
      step: 4.5,
      title: 'Declaration',
      description: 'Accuracy declaration and consent',
      completed: false,
      valid: false,
    },
    {
      step: 5,
      title: 'Final Review',
      description: 'Review information and submit application',
      completed: false,
      valid: false,
    },
    {
      step: 6,
      title: 'KYC Approval',
      description: 'Administrative review and activation',
      completed: false,
      valid: false,
    },
  ];
}

/**
 * Update onboarding step completion
 */
export async function updateOnboardingStep(
  pharmacyId: string,
  step: number,
  completed: boolean,
  valid: boolean
): Promise<any> {
  // This would update a step tracking system
  // For now, return the steps
  return getOnboardingSteps(pharmacyId);
}

/**
 * Submit pharmacy application for KYC review
 */
export async function submitForKycReview(
  pharmacyId: string,
  submittedBy: string
): Promise<{ success: boolean; error: string }> {
  try {
    // Update pharmacy verification status
    await prisma.pharmacyVerification.update({
      where: { pharmacyId },
      data: {
        status: 'UNDER_REVIEW',
        submittedAt: new Date(),
      },
    });

    // Update pharmacy verification status
    await prisma.pharmacyProfile.update({
      where: { id: pharmacyId },
      data: {
        verificationStatus: 'UNDER_REVIEW',
      },
    });

    return { success: true, error: null };
  } catch (error) {
    console.error('Error submitting for KYC review:', error);
    return { success: false, error: 'Failed to submit for KYC review' };
  }
}

/**
 * Approve pharmacy application (admin only)
 */
export async function approvePharmacy(
  pharmacyId: string,
  approvedBy: string
): Promise<{ success: boolean; error: string }> {
  try {
    // Update pharmacy verification status to ACTIVE
    await prisma.pharmacyVerification.update({
      where: { pharmacyId },
      data: {
        status: 'ACTIVE',
        reviewedAt: new Date(),
        reviewedBy: approvedBy,
      },
    });

    // Update pharmacy profile
    await prisma.pharmacyProfile.update({
      where: { id: pharmacyId },
      data: {
        verificationStatus: 'VERIFIED',
        isVerified: true,
      },
    });

    // Update verification records
    await prisma.pharmacistRegistration.updateMany({
      where: { pharmacyId },
      data: {
        verificationStatus: 'VERIFICATION_SUCCESSFUL',
      },
    });

    return { success: true, error: null };
  } catch (error) {
    console.error('Error approving pharmacy:', error);
    return { success: false, error: 'Failed to approve pharmacy' };
  }
}

/**
 * Reject pharmacy application (admin only)
 */
export async function rejectPharmacy(
  pharmacyId: string,
  rejectedBy: string,
  reason: string
): Promise<{ success: boolean; error: string }> {
  try {
    // Update pharmacy verification status
    await prisma.pharmacyVerification.update({
      where: { pharmacyId },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        reviewedBy: rejectedBy,
        rejectionReason: reason,
      },
    });

    // Update pharmacy profile
    await prisma.pharmacyProfile.update({
      where: { id: pharmacyId },
      data: {
        verificationStatus: 'REJECTED',
      },
    });

    return { success: true, error: null };
  } catch (error) {
    console.error('Error rejecting pharmacy:', error);
    return { success: false, error: 'Failed to reject pharmacy' };
  }
}

/**
 * Get pharmacy onboarding status
 */
export async function getPharmacyOnboardingStatus(
  pharmacyId: string
): Promise<{
  pharmacy: any;
  verification: any;
  steps: PharmacyOnboardingStep[];
  documents: any[];
  licences: any[];
  pharmacists: any[];
}> {
  const [pharmacy, verification, documents, licences, pharmacists] = await Promise.all([
    prisma.pharmacyProfile.findUnique({
      where: { id: pharmacyId },
      include: {
        verification: true,
        documents: true,
        licences: true,
        pharmacists: true,
      },
    }),
    prisma.pharmacyVerification.findUnique({
      where: { pharmacyId },
    }),
    prisma.pharmacyDocument.findMany({
      where: { pharmacyId },
    }),
    prisma.pharmacyLicense.findMany({
      where: { pharmacyId },
    }),
    prisma.pharmacistRegistration.findMany({
      where: { pharmacyId },
    }),
  ]);

  return {
    pharmacy,
    verification,
    steps: getOnboardingSteps(pharmacyId),
    documents,
    licences,
    pharmacists,
  };
}

export default {
  submitOnboardingApplication,
  getOnboardingSteps,
  updateOnboardingStep,
  submitForKycReview,
  approvePharmacy,
  rejectPharmacy,
  getPharmacyOnboardingStatus,
};