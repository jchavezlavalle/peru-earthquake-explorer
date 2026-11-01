
import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import { Marker, Popup } from 'maplibre-gl';
import type { Earthquake } from '../types/earthquake';

interface EarthquakeMapProps {
  earthquakes: Earthquake[];
}

function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 6) return '#ef4444';
  if (magnitude >= 5) return '#f97316';
  if (magnitude >= 4) return '#eab308';
  return '#22c55e';
}

function getMarkerSize(magnitude: number): number {
  return Math.max(8, Math.min(28, magnitude * 4));
}

export default function EarthquakeMap({
  earthquakes,
}: EarthquakeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Marker[]>([]);

  // Initialize the map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: import.meta.env.VITE_MAP_STYLE_URL,
      center: [-75.5, -9.2],
      zoom: 4.2,
      minZoom: 3,
      maxZoom: 12,
    });

    map.addControl(
      new maplibregl.NavigationControl(),
      'top-right'
    );

    map.addControl(
      new maplibregl.ScaleControl({
        unit: 'metric',
      }),
      'bottom-left'
    );

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Add earthquake markers whenever the data changes
  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Create new markers
    earthquakes.forEach((earthquake) => {
      if (
        !Number.isFinite(earthquake.longitude) ||
        !Number.isFinite(earthquake.latitude)
      ) {
        return;
      }

      const color = getMagnitudeColor(earthquake.magnitude);
      const size = getMarkerSize(earthquake.magnitude);

      const element = document.createElement('div');

      element.className = 'earthquake-marker';
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.backgroundColor = color;

      element.setAttribute(
        'aria-label',
        `Earthquake magnitude ${earthquake.magnitude}`
      );

      const popupContent = document.createElement('div');
      popupContent.className = 'earthquake-popup';

      const heading = document.createElement('strong');
      heading.textContent = `Magnitude ${earthquake.magnitude.toFixed(1)}`;

      const location = document.createElement('p');
      location.textContent = earthquake.place || 'Unknown location';

      const depth = document.createElement('p');
      depth.textContent = `Depth: ${earthquake.depth} km`;

      const date = document.createElement('p');
      date.textContent = new Date(earthquake.time).toLocaleString();

      popupContent.append(heading, location, depth, date);

      const popup = new Popup({
        offset: 12,
        closeButton: true,
        maxWidth: '280px',
      }).setDOMContent(popupContent);

      const marker = new Marker({
        element,
        anchor: 'center',
      })
        .setLngLat([
          earthquake.longitude,
          earthquake.latitude,
        ])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [earthquakes]);

  return (
    <div className="earthquake-map-wrapper">
      <div className="map-header">
        <div>
          <h2>Earthquake Activity Map</h2>
          <p>Peru and surrounding seismic zone</p>
        </div>

        <div className="map-count">
          {earthquakes.length.toLocaleString()} events
        </div>
      </div>

      <div
        ref={mapContainer}
        className="earthquake-map"
      />

      <div className="map-legend">
        <span><i className="legend-dot low" /> M 2.5–3.9</span>
        <span><i className="legend-dot moderate" /> M 4.0–4.9</span>
        <span><i className="legend-dot high" /> M 5.0–5.9</span>
        <span><i className="legend-dot severe" /> M 6.0+</span>
      </div>
    </div>
  );
}
