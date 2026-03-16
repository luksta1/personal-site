import { useState, useCallback, useRef, memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from 'react-simple-maps';
import { AnimatePresence, motion } from 'framer-motion';
import resorts from '../../data/resorts';
import styles from './powder-map.module.css';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const MapGeographies = memo(function MapGeographies() {
  return (
    <Geographies geography={GEO_URL}>
      {({ geographies }) =>
        geographies.map((geo) => (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            className={styles.geography}
            tabIndex={-1}
          />
        ))
      }
    </Geographies>
  );
});

export default function PowderMap() {
  const [selected, setSelected] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const sectionRef = useRef(null);

  const handleClick = useCallback((resort, e) => {
    e.stopPropagation();
    const nativeEvent = e?.nativeEvent || e;
    if (nativeEvent && sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      setPopupPos({
        x: (nativeEvent.clientX || 0) - rect.left,
        y: (nativeEvent.clientY || 0) - rect.top,
      });
    }
    setSelected((prev) => (prev?.id === resort.id ? null : resort));
  }, []);

  const handleMapClick = useCallback((e) => {
    if (e.target.closest(`.${styles.beacon}`)) return;
    setSelected(null);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="powder-map"
      aria-label="Powder Map"
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>Powder Map</h2>
        <p className={styles.subtitle}>
          Resorts ridden — {resorts.length} and counting
        </p>
      </div>

      <div className={styles.mapContainer} onClick={handleMapClick}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 140, center: [0, 35] }}
          className={styles.svg}
        >
          <ZoomableGroup
            minZoom={1}
            maxZoom={8}
            translateExtent={[[-200, -200], [1000, 600]]}
            onMove={({ zoom: z }) => setZoom(z)}
          >
            <MapGeographies />

            {resorts.map((resort) => (
              <Marker
                key={resort.id}
                coordinates={resort.coordinates}
              >
                <g className={styles.beacon}>
                  <circle
                    r={12 / zoom}
                    className={styles.beaconPulse}
                    style={{ animationDelay: `${resort.id * 0.4}s` }}
                  />
                  <circle
                    r={16 / zoom}
                    className={styles.beaconHitArea}
                    role="button"
                    tabIndex={0}
                    aria-label={`${resort.name}, ${resort.location}`}
                    onClick={(e) => handleClick(resort, e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleClick(resort, e);
                    }}
                  />
                  <circle
                    r={4 / zoom}
                    className={styles.beaconDot}
                    pointerEvents="none"
                  />
                </g>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <div className={styles.zoomHint} aria-hidden="true">
        Scroll to zoom · Drag to pan
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            className={styles.popup}
            style={popupPos.x ? {
              left: popupPos.x,
              top: popupPos.y,
            } : undefined}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className={styles.popupClose}
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className={styles.popupName}>{selected.name}</h3>
            <div className={styles.popupMeta}>
              {selected.year && (
                <span className={styles.popupYear}>{selected.year}</span>
              )}
              {selected.tag && (
                <span className={styles.popupTag}>{selected.tag}</span>
              )}
            </div>
            <p className={styles.popupLocation}>{selected.location}</p>
            {selected.memory && (
              <p className={styles.popupMemory}>{selected.memory}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
