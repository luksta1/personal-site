import currentlyData from '../../data/currently';
import styles from './about.module.css';

const ICONS = {
  listening: '♫',
  building: '⌘',
  restaurant: '◉',
  mountain: '▲',
  cocktail: '¶',
};

export default function Currently() {
  return (
    <div className={styles.currentlyWidget}>
      <h3 className={styles.currentlyTitle}>Currently</h3>
      <div className={styles.currentlyList}>
        {Object.entries(currentlyData).map(([key, value]) => (
          <div key={key} className={styles.currentlyItem}>
            <span className={styles.currentlyLabel}>
              {ICONS[key]} {key}
            </span>
            <span className={styles.currentlyValue}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
