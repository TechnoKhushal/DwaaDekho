export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function validateCoordinates({ latitude, longitude }: Coordinates): void {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new RangeError('Latitude must be a finite number from -90 to 90.');
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new RangeError('Longitude must be a finite number from -180 to 180.');
  }
}

export function validateSearchRadius(radiusKm: number): void {
  if (!Number.isInteger(radiusKm) || radiusKm < 1 || radiusKm > 10) {
    throw new RangeError('Search radius must be an integer from 1 to 10 km.');
  }
}

export function calculateDistanceKm(origin: Coordinates, destination: Coordinates): number {
  validateCoordinates(origin);
  validateCoordinates(destination);

  const earthRadiusKm = 6371.0088;
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);
  const originLatitude = toRadians(origin.latitude);
  const destinationLatitude = toRadians(destination.latitude);
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(originLatitude) * Math.cos(destinationLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(Math.min(1, haversine)));
}
