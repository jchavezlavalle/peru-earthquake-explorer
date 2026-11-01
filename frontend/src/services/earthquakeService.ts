
import type { Earthquake } from '../types/earthquake';

const DATA_URL = '/data/earthquakes-peru.geojson';

export async function fetchEarthquakes(): Promise<Earthquake[]> {
  const response = await fetch(DATA_URL);

  if (!response.ok) {
    throw new Error('Failed to load earthquake data');
  }

  const geojson = await response.json();

  return geojson.features.map((feature: any): Earthquake => {
    const [longitude, latitude, depth] =
      feature.geometry.coordinates;

    return {
      id: feature.id,
      longitude,
      latitude,
      depth,
      magnitude: feature.properties.mag,
      place: feature.properties.place,
      time: feature.properties.time,
      tsunami: feature.properties.tsunami,
      url: feature.properties.url,
    };
  });
}
