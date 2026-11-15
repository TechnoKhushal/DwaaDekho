import { prisma } from '../config/database';
import { supabase, supabaseAdmin } from '../config/supabase';
import { verifySupabaseToken } from '../config/supabase';
import { IdempotencyRecord } from '../prisma/schema';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface PharmacyOfferSubmission {
  broadcastId: string;
  pharmacyId: string;
  medicineId: string;
  quantity: number;
  price: number;
  availability: 'FULL_STOCK' | 'PARTIAL_STOCK' | 'OUT_OF_STOCK';
  unitPrice?: number;
  deliveryCharges?: number;
}

export interface PharmacyOffer {
  id: string;
  broadcastId: string;
  pharmacyId: string;
  medicineId: string;
  quantity: number;
  price: number;
  availability: 'FULL_STOCK' | 'PARTIAL_STOCK' | 'OUT_OF_STOCK';
  unitPrice?: number;
  deliveryCharges?: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'RESERVED';
  responseDeadline: Date;
  createdAt: Date;
}

export interface RecipientRecord {
  id: string;
  broadcastId: string;
  pharmacyId: string;
  distanceKm: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  createdAt: Date;
  responseTimestamp?: Date;
}

/**
 * Submit a pharmacy offer for a broadcast request
 */
export async function submitPharmacyOffer(
  buyerId: string,
  pharmacyId: string,
  broadcastId: string,
  submission: PharmacyOfferSubmission
): Promise<{ success: boolean; offer?: any; error: string }> {
  try {
    // Verify authentication
    const { data: tokenData, error: tokenError } = await verifySupabaseToken(
      (await import('../config/supabase')).default.auth.getSession()
    ).session?.access_token || '';

    if (tokenError || !tokenData) {
      return { success: false, error: 'Authentication required', offer: undefined };
    }

    // Verify the broadcast exists and is in a valid state
    const broadcast = await prisma.broadcastRequest.findUnique({
      where: { id: broadcastId },
      include: {
        buyer: true,
        medicine: true,
      },
    });

    if (!broadcast) {
      return { success: false, error: 'Broadcast request not found', offer: undefined };
    }

    if (broadcast.status !== 'VALIDATING' && broadcast.status !== 'READY') {
      return { success: false, error: 'Broadcast request is not accepting offers', offer: undefined };
    }

    // Verify pharmacy eligibility
    const pharmacyProfile = await prisma.pharmacyProfile.findUnique({
      where: { id: pharmacyId },
      include: {
        user: true,
      },
    });

    if (!pharmacyProfile || !pharmacyProfile.isVerified) {
      return { success: false, error: 'Pharmacy not verified', offer: undefined };
    }

    // Check if pharmacy already has an offer for this broadcast
    const existingOffer = await prisma.pharmacyOffer.findFirst({
      where: {
        broadcastId,
        pharmacyId,
      },
    });

    if (existingOffer) {
      return { success: false, error: 'Pharmacy already submitted an offer for this broadcast', offer: undefined };
    }

    // Create the offer
    const now = new Date();
    const responseDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours response window

    const offer = await prisma.pharmacyOffer.create({
      data: {
        broadcastId,
        pharmacyId,
        medicineId: broadcast.medicineId,
        quantity: submission.quantity,
        price: submission.price,
        availability: submission.availability,
        unitPrice: submission.unitPrice,
        deliveryCharges: submission.deliveryCharges,
        status: 'PENDING',
        responseDeadline,
        createdAt: now,
      },
    });

    // Update recipient record
    await prisma.recipientRecord.update({
      where: {
        broadcastId_pharmacyId: {
          broadcastId,
          pharmacyId,
        },
      },
      data: {
        status: 'ACCEPTED',
        responseTimestamp: now,
        offerId: offer.id,
      },
    });

    // Notify buyer via Supabase Realtime
    await notifyBuyerOfNewOffer(broadcastId, offer);

    return {
      success: true,
      offer: {
        id: offer.id,
        broadcastId: offer.broadcastId,
        pharmacyId: offer.pharmacyId,
        medicineId: offer.medicineId,
        quantity: offer.quantity,
        price: offer.price,
        availability: offer.availability,
        unitPrice: offer.unitPrice,
        deliveryCharges: offer.deliveryCharges,
        status: offer.status,
        responseDeadline: offer.responseDeadline,
        createdAt: offer.createdAt,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error submitting pharmacy offer:', error);
    return { success: false, error: 'Failed to submit offer', offer: undefined };
  }
}

/**
 * Notify buyer via Supabase Realtime about new offer
 */
async function notifyBuyerOfNewOffer(broadcastId: string, offer: any) {
  try {
    // Subscribe to the broadcast channel and trigger an event
    // This will be received by buyer's Supabase Realtime subscription
    const channel = supabase.channel('broadcasts:' + broadcastId);

    // Post a message to the channel
    await supabaseAdmin.postgres
      .from('notifications')
      .insert({
        recipientId: '', // Will be set by trigger
        recipientType: 'buyer',
        type: 'OFFER_RECEIVED',
        title: 'New pharmacy offer received',
        message: `Pharmacy has submitted an offer for your medicine request`,
        relatedEntityId: broadcastId,
        relatedEntityType: 'broadcast',
      });
  } catch (error) {
    console.error('Error notifying buyer of new offer:', error);
  }
}

/**
 * Get eligible pharmacies for a broadcast request
 */
export async function getEligiblePharmacies(broadcastId: string): Promise<{ pharmacies: any[]; eligibleCount: number }> {
  const broadcast = await prisma.broadcastRequest.findUnique({
    where: { id: broadcastId },
    include: {
      pharmacyOffers: {
        include: {
          pharmacy: true,
        },
      },
      recipientRecords: true,
    });

    if (!broadcast) return { pharmacies: [], eligibleCount: 0 };

    // Filter pharmacies that have submitted valid offers
    const eligiblePharmacies = broadcast.pharmacyOffers
      .filter((offer: any) => offer.status === 'PENDING' || offer.status === 'ACCEPTED')
      .map((offer: any) => ({
        ...offer.pharmacy,
        offerId: offer.id,
        offerPrice: offer.price,
        availability: offer.availability,
        confirmedQuantity: offer.quantity,
        deliveryCharges: offer.deliveryCharges || 0,
      }));

    return {
      pharmacies: eligiblePharmacies,
      eligibleCount: eligiblePharmacies.length,
    };
  }
}

/**
 * Get broadcast status with offer details
 */
export async function getBroadcastStatusWithOffers(broadcastId: string) {
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
              id: true,
              pharmacyName: true,
              latitude: true,
              longitude: true,
              address: true,
              phone: true,
              isJanAushadhi: true,
              rating: true,
            },
          },
        },
      },
      recipientRecords: {
        include: {
          pharmacy: {
            select: {
              id: true,
              pharmacyName: true,
              isVerified: true,
            },
          },
        },
      },
    });

    if (!broadcast) return null;

    return {
      id: broadcast.id,
      status: broadcast.status,
      medicineName: broadcast.medicine?.name,
      dosage: broadcast.dosage,
      quantity: broadcast.quantity,
      createdAt: broadcast.createdAt,
      expiresAt: broadcast.expiresAt,
      prescriptionStatus: broadcast.prescriptionStatus,
      consentGiven: broadcast.consentGiven,
      pharmacyOffers: broadcast.pharmacyOffers.map((offer: any) => ({
        id: offer.id,
        pharmacyName: offer.pharmacy.pharmacyName,
        distanceKm: offer.pharmacy.distanceKm || 0,
        availability: offer.availability,
        confirmedQuantity: offer.confirmedQuantity,
        price: offer.price,
        unitPrice: offer.unitPrice,
        deliveryCharges: offer.deliveryCharges,
        status: offer.status,
      })),
      recipientRecords: broadcast.recipientRecords.map((rec: any) => ({
        pharmacyName: rec.pharmacy.pharmacyName,
        status: rec.status,
        distanceKm: rec.distanceKm,
        responseTimestamp: rec.responseTimestamp,
      })),
    };
}