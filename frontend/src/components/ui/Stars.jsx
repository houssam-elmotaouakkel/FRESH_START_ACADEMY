import { FaStar } from 'react-icons/fa';

/**
 * Rangée d'étoiles pleines (icône SVG, pas d'emoji — rendu identique partout).
 */
function Stars({ count = 5, size = 16, color = '#f59e0b' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color, verticalAlign: 'middle' }} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <FaStar key={i} size={size} />
      ))}
    </span>
  );
}

export default Stars;
