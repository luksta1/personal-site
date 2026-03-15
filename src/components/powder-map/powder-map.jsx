import { useState, useCallback } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import resorts from '../../data/resorts';
import styles from './powder-map.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

const MAP_STYLE = 'mapbox://styles/mapbox/dark-v11';
const INITIAL_VIEW = {
  longitude: -40,
  latitude: 45,
  zoom: 2.2,
  pitch: 0,
  bearing: 0,
};

export default function PowderMap() {
  const [selectedResort, setSelectedResort] = useState(null);

  const handleMarkerClick = useCallback((resort) => {
    setSelectedResort(resort);
  }, []);

  if (!MAPBOX_TOKEN) {
    return (
      <section className={styles.section} id="powder-map" aria-label="Powder Map">
        <div className={styles.header}>
          <h2 className={styles.heading}>Powder Map</h2>
          <p className={styles.subtitle}>Resorts ridden — {resorts.length} and counting</p>
        </div>
        <div className={styles.fallback}>
          <span>Set VITE_MAPBOX_TOKEN to enable the map</span>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} id="powder-map" aria-label="Powder Map">
      <div className={styles.header}>
        <h2 className={styles.heading}>Powder Map</h2>
        <p className={styles.subtitle}>Resorts ridden — {resorts.length} and counting</p>
      </div>

      <div className={styles.mapContainer}>
        <Map
          initialViewState={INITIAL_VIEW}
          style={{ width: '100%', height: '100%' }}
          mapStyle={MAP_STYLE}
          mapboxAccessToken={MAPBOX_TOKEN}
          attributionControl={false}
          interactive
        >
          {resorts.map((resort) => (
            <Marker
              key={resort.id}
              longitude={resort.coordinates[0]}
              latitude={resort.coordinates[1]}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(resort);
              }}
            >
              <div
                className={styles.marker}
                role="button"
                tabIndex={0}
                aria-label={`${resort.name}, ${resort.location}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleMarkerClick(resort);
                  }
                }}
              />
            </Marker>
          ))}

          {selectedResort && (
            <Popup
              longitude={selectedResort.coordinates[0]}
              latitude={selectedResort.coordinates[1]}
              anchor="bottom"
              onClose={() => setSelectedResort(null)}
              closeOnClick={false}
              offset={12}
              className={styles.popupWrapper}
            >
              <div className={styles.popup}>
                <h3 className={styles.popupName}>{selectedResort.name}</h3>
                <div className={styles.popupMeta}>
                  <span className={styles.popupYear}>{selectedResort.year}</span>
                  <span className={styles.popupTag}>{selectedResort.tag}</span>
                </div>
                <p className={styles.popupMemory}>{selectedResort.memory}</p>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </section>
  );
}
