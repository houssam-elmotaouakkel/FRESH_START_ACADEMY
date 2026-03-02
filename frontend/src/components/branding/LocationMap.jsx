import { useEffect, useRef, useState } from 'react';
import { FiMapPin, FiNavigation } from 'react-icons/fi';

let googleMapsPromise;

const loadGoogleMaps = (apiKey) => {
  if (!apiKey) {
    return Promise.reject(new Error('Missing Google Maps API key'));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById('fsa-google-maps-js');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google.maps));
      existingScript.addEventListener('error', () => reject(new Error('Google Maps JS failed')));
      return;
    }

    const script = document.createElement('script');
    script.id = 'fsa-google-maps-js';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps JS missing maps object'));
      }
    };
    script.onerror = () => reject(new Error('Google Maps JS load error'));
    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

const centerLat = Number(import.meta.env.VITE_CENTER_LAT) || 34.020882;
const centerLng = Number(import.meta.env.VITE_CENTER_LNG) || -6.84165;
const centerLabel = import.meta.env.VITE_CENTER_LABEL || 'Fresh Start Academy';
const centerAddress =
  import.meta.env.VITE_CENTER_ADDRESS || 'Centre de langues, Rabat, Maroc';
const fallbackUrl =
  import.meta.env.VITE_CENTER_MAP_URL ||
  `https://www.google.com/maps/search/?api=1&query=${centerLat},${centerLng}`;

function LocationMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const hasApiKey = Boolean(apiKey);
  const mapRef = useRef(null);
  const [status, setStatus] = useState(() => (hasApiKey ? 'loading' : 'error'));

  useEffect(() => {
    let isMounted = true;

    if (!hasApiKey || !mapRef.current) {
      return undefined;
    }

    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (!isMounted || !mapRef.current) return;

        const center = { lat: centerLat, lng: centerLng };
        const map = new maps.Map(mapRef.current, {
          center,
          zoom: 15,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
        });

        new maps.Marker({
          map,
          position: center,
          title: centerLabel,
        });

        setStatus('ready');
      })
      .catch((error) => {
        console.warn('Location map fallback triggered:', error);
        if (isMounted) {
          setStatus('error');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [apiKey, hasApiKey]);

  if (status === 'error') {
    return (
      <div className="card p-6 h-[330px] flex flex-col justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-primary-700 mb-2">Localisation</p>
          <h3 className="text-2xl font-bold text-primary-900 mb-3">Fresh Start Academy - Rabat</h3>
          <p className="text-secondary-700 flex items-start gap-2">
            <FiMapPin className="mt-1" />
            <span>{centerAddress}</span>
          </p>
        </div>
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-primary w-fit"
        >
          Ouvrir dans Google Maps
          <FiNavigation />
        </a>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="p-5 border-b border-secondary-200/70 flex flex-wrap items-center justify-between gap-3 bg-secondary-50">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary-700">Localisation</p>
          <h3 className="text-xl font-bold text-primary-900">{centerLabel}</h3>
        </div>
        <a
          href={fallbackUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary text-sm"
        >
          Itineraire
          <FiNavigation />
        </a>
      </div>
      <div className="relative h-[330px]">
        {status !== 'ready' && (
          <div className="absolute inset-0 bg-secondary-100/70 flex items-center justify-center z-10">
            <div className="spinner" />
          </div>
        )}
        <div ref={mapRef} className="h-full w-full" />
      </div>
    </div>
  );
}

export default LocationMap;
