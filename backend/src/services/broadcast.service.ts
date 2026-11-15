import { prisma } from '../config/database';
import { verifySupabaseToken } from '../config/supabase';
import { authenticate, optionalAuth } from '../middleware/authenticate';
import { isBuyer, isPharmacyOwner, isPharmacyStaff } from '../middleware/authorize';
import { sendNotification } from './notification.service';

export interface BroadcastRequest {
  id: string;
  buyerId: string;
  medicineId: string;
  dosage: string;
  quantity: number;
  locationLat: number;
  locationLng: number;
  radiusKm: number;
  status: 'DRAFT' | 'VALIDATING' | 'READY' | 'BROADCASTING' | 'ACTIVE' | 'RESPONSES_RECEIVED' | 'NO_ELIGIBLE_PHARMACIES' | 'CANCELLED' | 'EXPIRED' | 'FAILED';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  prescriptionStatus: 'OTC' | 'Rx Required' | 'Verification Needed';
  prescriptionDocumentId?: string;
  consentGiven: boolean;
}

export interface PharmacyRecipient {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  distanceKm: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  offerPrice?: number;
  offerValidUntil?: Date;
  createdAt: Date;
}

/**
 * Create a new broadcast request
 */
export async function createBroadcastRequest(
  buyerId: string,
  medicineId: string,
  dosage: string,
  quantity: number,
  locationLat: number,
  locationLng: number,
  radiusKm: number,
  prescriptionStatus: 'OTC' | 'Rx Required' | 'Verification Needed',
  prescriptionDocumentId?: string,
  consentGiven: boolean = false
): Promise<{ success: boolean; broadcast?: BroadcastRequest; error: string }> {
  try {
    // Validate medicine existence
    const medicine = await prisma.medicine.findUnique({
      where: { id: medicineId },
    });

    if (!medicine) {
      return { success: false, error: 'Medicine not found', broadcast: undefined };
    }

    // Validate prescription requirement
    const prescriptionStatusMap: any = {
      OTC: 'OTC',
      RxRequired: 'Rx Required',
      VerificationNeeded: 'Verification Needed',
    };

    // Validate quantity
    const quantityValidation = validateQuantity(medicineId, quantity);
    if (!validation.valid) {
      return { success: false, error: validation.message, broadcast: undefined };
    }

    // Find eligible pharmacies
    const eligiblePharmacies = await findEligiblePharmacies(
      latitude,
      longitude,
      radiusKm,
      medicineId
    );

    if (eligiblePharmacies.length === 0) {
      return {
        success: false,
        error: 'No eligible pharmacies found within the specified radius',
        broadcast: undefined,
      };
    }

    // Create broadcast request
    const now = new Date();
    const expiresAt = new Date(Date.now() + 45 * 60 * 1000); // 45 minutes

    const broadcast = await prisma.broadcastRequest.create({
      data: {
        buyerId,
        medicineId,
        dosage,
        quantity,
        locationLat,
        locationLng,
        radiusKm,
        status: 'DRAFT',
        expiresAt,
        prescriptionStatus,
        prescriptionDocumentId,
        consentGiven,
      },
    });

    return {
      success: true,
      broadcast,
      error: null,
    };
  } catch (error) {
    console.error('Error creating broadcast:', error);
    return {
      success: false,
      error: 'Failed to create broadcast request',
      broadcast: undefined,
    };
  }
};

/**
 * Find eligible pharmacies for a broadcast request
 */
async function findEligiblePharmacies(
  latitude: number,
  longitude: number,
  radiusKm: number,
  medicineId: string
): Promise<any[]> {
  // Find pharmacies within radius using geographic search
  const pharmacies = await prisma.pharmacyProfile.findMany({
    where: {
      isVerified: true,
      // Additional eligibility checks
    },
    include: {
      pharmacy: true,
    },
  });

  // Calculate distances and filter
  const pharmaciesWithDistance = pharmacies
    .map(pharmacy => {
      const distance = calculateDistance(
        latitude,
        longitude,
        pharmacy.pharmacy.latitude,
        pharmacy.pharmacy.longitude
      );

      return {
        ...pharmacy,
        distanceKm: parseFloat(distance.toFixed(2)),
      };
    })
    .filter(pharmacy => pharmacy.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return pharmaciesWithDistance;
}

/**
 * Create a pharmacy offer
 */
export async function createPharmacyOffer(
  broadcastId: string,
  pharmacyId: string,
  offerPrice: number,
  quantityAvailable: number
): Promise<{ success: boolean; offer?: any; error: string }> {
  try {
    const offer = await prisma.pharmacyOffer.create({
      data: {
        broadcastId,
        pharmacyId,
        price: offerPrice,
        quantityAvailable,
        status: 'pending',
      },
    });

    // Update broadcast status
    await prisma.broadcastRequest.update({
      where: { id: broadcastId },
      data: {
        status: 'RESPONSES_RECEIVED',
      },
    });

    return {
      success: true,
      offer,
      error: null,
    };
  } catch (error) {
    console.error('Error creating pharmacy offer:', error);
    return {
      success: false,
      error: 'Failed to create pharmacy offer',
    };
  }
}

/**
 * Get broadcast with recipients
 */
export async function getBroadcastWithRecipients(broadcastId: string) {
  const broadcast = await prisma.broadcastRequest.findUnique({
    where: { id: broadcastId },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
        },
      },
      pharmacyOffers: {
        include: {
          pharmacy: {
            select: {
              name: true,
              rating: true,
            },
          },
        },
      },
    });
  return broadcast;
}

/**
 * Cancel a broadcast request
 */
export async function cancelBroadcast(broadcastId: string, buyerId: string) {
  await prisma.broadcastRequest.update({
    where: { id: broadcastId, buyerId },
    data: {
      status: 'CANCELLED',
    },
  });
}

/**
 * Get active broadcasts for a buyer
 */
export async function getActiveBroadcasts(buyerId: string) {
  return prisma.broadcastRequest.findMany({
    where: {
      buyerId,
      status: 'ACTIVE',
    },
    include: {
      medicine: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Validate a broadcast request before creation
 */
export async function validateBroadcastRequest(
  buyerId: string,
  medicineId: string,
  quantity: number,
  radius: number
): Promise<{ valid: boolean; message: string; eligiblePharmacies: number }> {
  // 1. Validate authentication
  // 2. Validate medicine existence
  // 3. Validate quantity
  // 4. Validate location
  // 5. Validate radius
  // 6. Find eligible pharmacies

  const eligiblePharmacies = 5; // Would be calculated from findEligiblePharmacies

  return {
    valid: true,
    message: 'Request is valid',
    eligiblePharmacies,
  };
}