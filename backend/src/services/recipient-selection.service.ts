import { prisma } from '../config/database';
import { calculateDistance } from '../services/pharmacy-discovery.service';

// Types for recipient records
export interface RecipientRecord {
  id: string;
  broadcastId: string;
  pharmacyId: string;
  pharmacyName: string;
  distanceKm: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  responseTimestamp?: Date;
}

/**
 * Get eligible pharmacies for a broadcast request
 */
export async function getEligiblePharmacies(
  broadcastId: string
): Promise<RecipientRecord[]> {
  const broadcast = await prisma.broadcastRequest.findUnique({
    where: { id: broadcastId },
    include: {
      pharmacyOffers: true,
    },
  });

  if (!broadcast) return [];

  // Calculate distances (would need buyer's location)
  // For now, return placeholder records
  const recipients: RecipientRecord[] = [];

  // In production, this would calculate distances from the broadcast's location
  // and filter by pharmacy eligibility (KYC status, etc.)
  const pharmacies = await prisma.pharmacyProfile.findMany({
    where: {
      isVerified: true,
    },
    include: {
      pharmacy: true,
    },
  });

  pharmacies.forEach((pharmacy, index) => {
    recipients.push({
      id: v4(),
      broadcastId,
      pharmacyId: pharmacy.id,
      pharmacyName: pharmacy.pharmacy.name,
      distanceKm: Math.random() * 10, // Placeholder distance
      status: 'pending',
      createdAt: new Date(),
    });
  });

  return recipients;
}

/**
 * Get eligible pharmacies for a broadcast request
 */
export async function getEligiblePharmaciesForBroadcast(
  broadcastId: string
): Promise<{ pharmacies: any[]; eligibleCount: number }> {
  const broadcast = await prisma.broadcastRequest.findUnique({
    where: { id: broadcastId },
    include: {
      pharmacyOffers: true,
    },
  });

  if (!broadcast) return { pharmacies: [], eligibleCount: 0 };

  // Get pharmacies that can receive this broadcast
  const pharmacies = await prisma.pharmacyProfile.findMany({
    where: {
      isVerified: true,
      // Additional eligibility checks
    },
    include: {
      pharmacy: true,
    },
  });

  return {
    pharmacies,
    eligibleCount: pharmacies.length,
  };
}

/**
 * Record a pharmacy's response to a broadcast
 */
export async function recordPharmacyResponse(
  broadcastId: string,
  pharmacyId: string,
  status: 'accepted' | 'rejected'
): Promise<{ success: boolean; recipientRecord?: any; error: string }> {
  // Check if recipient record exists
  const existingRecord = await prisma.recipientRecord.findFirst({
    where: {
      broadcastId,
      pharmacyId,
    },
  });

  if (existingRecord) {
    // Update existing record
    const updatedRecord = await prisma.recipientRecord.update({
      where: { id: existingRecord.id },
      data: {
        status,
        responseTimestamp: new Date(),
      },
    });
    return { success: true, recipientRecord: updatedRecord, error: null };
  }

  // Create new recipient record
  const recipientRecord = await prisma.recipientRecord.create({
    data: {
      broadcastId,
      pharmacyId,
      status,
      createdAt: new Date(),
    },
  });

  return { success: true, recipientRecord, error: null };
}

/**
 * Get recipient records for a broadcast
 */
export async function getRecipientRecords(broadcastId: string) {
  return prisma.recipientRecord.findMany({
    where: { broadcastId },
    include: {
      pharmacy: true,
    },
  });
}

/**
 * Get broadcast status with recipient details
 */
export async function getBroadcastStatus(broadcastId: string) {
  const broadcast = await prisma.broadcastRequest.findUnique({
    where: { id: broadcastId },
    include: {
      recipientRecords: {
        include: {
          pharmacy: true,
        },
      },
    },
  });

  if (!broadcast) return null;

  return {
    id: broadcast.id,
    status: broadcast.status,
    createdAt: broadcast.createdAt,
    expiredAt: broadcast.expiresAt,
    recipientRecords: broadcast.recipientRecords.map(r => ({
      pharmacyName: r.pharmacy.name,
      status: r.status,
      createdAt: r.createdAt,
      responseTimestamp: r.responseTimestamp,
    })),
  };
}