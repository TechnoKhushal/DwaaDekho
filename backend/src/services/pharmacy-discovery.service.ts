import { prisma } from '../config/database.js';
import { calculateDistanceKm, validateCoordinates, validateSearchRadius } from '../domain/geography.js';

export interface PharmacyLocation {
  id: string;
  pharmacyName: string;
  latitude: number;
  longitude: number;
  address: string;
  rating: number;
  isJanAushadhi: boolean;
  distanceKm?: number;
  isOpen: boolean;
}

export interface PharmacySearchOptions {
  minRating?: number;
  isJanAushadhi?: boolean;
  isOpen?: boolean;
}

export async function findNearbyPharmacies(
  latitude: number,
  longitude: number,
  radiusKm = 5,
  options: PharmacySearchOptions = {},
): Promise<PharmacyLocation[]> {
  const origin = { latitude, longitude };
  validateCoordinates(origin);
  validateSearchRadius(radiusKm);

  if (options.minRating !== undefined && (!Number.isFinite(options.minRating) || options.minRating < 0 || options.minRating > 5)) {
    throw new RangeError('Minimum rating must be a number from 0 to 5.');
  }

  const pharmacies = await prisma.pharmacyProfile.findMany({
    where: {
      verificationStatus: 'VERIFIED',
      isVerified: true,
      ...(options.isJanAushadhi === undefined ? {} : { isJanAushadhi: options.isJanAushadhi }),
      ...(options.isOpen === undefined ? {} : { isOpen: options.isOpen }),
      ...(options.minRating === undefined ? {} : { rating: { gte: options.minRating } }),
    },
    select: {
      id: true,
      pharmacyName: true,
      latitude: true,
      longitude: true,
      address: true,
      rating: true,
      isJanAushadhi: true,
      isOpen: true,
      serviceAreaKm: true,
    },
  });

  return pharmacies
    .map((pharmacy) => ({
      id: pharmacy.id,
      pharmacyName: pharmacy.pharmacyName,
      latitude: pharmacy.latitude,
      longitude: pharmacy.longitude,
      address: pharmacy.address,
      rating: pharmacy.rating,
      isJanAushadhi: pharmacy.isJanAushadhi,
      isOpen: pharmacy.isOpen,
      distanceKm: calculateDistanceKm(origin, pharmacy),
      serviceAreaKm: pharmacy.serviceAreaKm,
    }))
    .filter((pharmacy) => pharmacy.distanceKm <= Math.min(radiusKm, pharmacy.serviceAreaKm))
    .sort((left, right) => left.distanceKm - right.distanceKm)
    .map(({ serviceAreaKm: _serviceAreaKm, ...pharmacy }) => ({
      ...pharmacy,
      distanceKm: Math.round(pharmacy.distanceKm * 100) / 100,
    }));
}

export async function getPharmacyById(pharmacyId: string): Promise<PharmacyLocation | null> {
  if (!pharmacyId || pharmacyId.length > 100) return null;

  const pharmacy = await prisma.pharmacyProfile.findFirst({
    where: {
      id: pharmacyId,
      verificationStatus: 'VERIFIED',
      isVerified: true,
    },
    select: {
      id: true,
      pharmacyName: true,
      latitude: true,
      longitude: true,
      address: true,
      rating: true,
      isJanAushadhi: true,
      isOpen: true,
    },
  });

  return pharmacy ?? null;
}

export async function getPharmaciesByServiceArea(
  latitude: number,
  longitude: number,
  radiusKm: number,
): Promise<PharmacyLocation[]> {
  return findNearbyPharmacies(latitude, longitude, radiusKm);
}

export async function getVerifiedPharmacies(): Promise<PharmacyLocation[]> {
  return prisma.pharmacyProfile.findMany({
    where: { verificationStatus: 'VERIFIED', isVerified: true },
    select: {
      id: true,
      pharmacyName: true,
      latitude: true,
      longitude: true,
      address: true,
      rating: true,
      isJanAushadhi: true,
      isOpen: true,
    },
    orderBy: { pharmacyName: 'asc' },
  });
}
