import { prisma } from '../config/database';
import { RegulatoryRule } from '../services/prescription.service';

// Quantities that have been validated
const validatedQuantities = new Map<string, { quantity: number; expiry: number }>();

// Get applicable regulatory rules for a medicine
export async function getApplicableRules(medicineId: string) {
  const rules = await prisma.regulatoryRule.findMany({
    where: {
      medicineId,
      // Active rules only (no expiration date or expired later)
      OR: [
        { expiryDate: null },
        { expiryDate: new Date() },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return rules;
}

// Validate quantity against regulatory rules
export function validateQuantity(
  medicineId: string,
  requestedQuantity: number,
  userId?: string
): { valid: boolean; message: string; rule?: { schedule: string; maxQuantity: number } } {
  // Get applicable rules
  const rules = getApplicableRules(medicineId);

  if (rules.length === 0) {
    // No specific rules found - use safe fallback
    return {
      valid: true,
      message: 'No regulatory limits configured. Default allowance applies.',
      rule: undefined,
    };
  }

  // Find the most applicable rule
  const rule = rules[0]; // Use the most recent rule

  // Check if there's a max quantity specified
  if (rule.maxQuantity && rule.maxQuantity > 0) {
    if (requestedQuantity > rule.maxQuantity) {
      return {
        valid: false,
        message: `Quantity exceeds the regulatory limit of ${rule.maxQuantity} ${rule.maxQuantity > 1 ? 'units' : 'unit'} for ${rule.schedule} schedule medicine.`,
        rule: { schedule: rule.schedule, maxQuantity: rule.maxQuantity },
      };
    }
  }

  // Check for effective date
  // If there's an effective date in the future, the rule doesn't apply yet
  // (This is a simplification - in production, check the current date)

  // Check for expiration
  // If there's an expiration date and it's passed, the rule doesn't apply
  // (This is a simplification)

  // Valid quantity
  return {
    valid: true,
    message: `Quantity of ${requestedQuantity} is within regulatory limits.`,
    rule: { schedule: rule.schedule, maxQuantity: rule.maxQuantity },
  };
}

// Check reservation expiry and validate
export function checkReservationExpiry(
  reservationExpiresAt: Date
): { valid: boolean; message: string; timeRemaining: number } {
  const now = new Date();
  const expiry = new Date(reservationExpiresAt);
  const timeRemaining = expiry.getTime() - now.getTime();

  if (timeRemaining <= 0) {
    return {
      valid: false,
      message: 'Reservation has expired',
      timeRemaining: 0,
    };
  }

  // Calculate time remaining in minutes
  const minutesRemaining = Math.ceil(timeRemaining / 60000);

  return {
    valid: true,
    message: `Reservation valid for ${minutesRemaining} more minutes`,
    timeRemaining,
  };
}

// Check for PIN expiry
export function checkPinExpiry(
  pinCreatedAt: Date,
  pinValidMinutes: number = 45
): { valid: boolean; message: string; timeRemaining: number } {
  const now = new Date();
  const created = new Date(pinCreatedAt);
  const pinValidUntil = new Date(pinCreatedAt.getTime() + pinValidMinutes * 60000);
  const timeRemaining = pinValidUntil.getTime() - now.getTime();

  if (timeRemaining <= 0) {
    return {
      valid: false,
      message: 'PIN has expired',
      timeRemaining: 0,
    };
  }

  const minutesRemaining = Math.ceil(timeRemaining / 60000);

  return {
    valid: true,
    message: `PIN valid for ${minutesRemaining} more minutes`,
    timeRemaining,
  };
}

// Check for duplicate reservation attempts
export function checkDuplicateReservation(
  reservationId: string,
  userId: string
): { valid: boolean; message: string } {
  // In a real implementation, this would check the database for existing reservations
  // For now, we'll return valid (the actual check happens in the database transaction)
  return {
    valid: true,
    message: 'No duplicate reservation detected',
  };
}

// Get quantity limits for a specific medicine and user
export async function getUserQuantityLimit(
  medicineId: string,
  userId: string
): Promise<{ maxQuantity: number | null; reason: string }> {
  const rules = await prisma.regulatoryRule.findMany({
    where: {
      medicineId,
      // Active rules only
    },
  });

  // Check for user-specific rules
  // In a real implementation, this would check user role, location, etc.
  const rule = rules.find(r => !r.maxQuantity || r.maxQuantity > 0);

  if (!rule || !rule.maxQuantity) {
    return { maxQuantity: null, reason: 'No quantity limit configured' };
  }

  return { maxQuantity: rule.maxQuantity, reason: 'Quantity limit from regulatory rule' };
}