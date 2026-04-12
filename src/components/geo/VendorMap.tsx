import React, { useEffect, useRef, useState } from 'react';
import api from '../../utils/axios';
import { Spinner } from 'flowbite-react';

/**
 * Componente de Mapa de Vendedores.
 * Utiliza Leaflet (inyectado vía CDN en index.html).
 */
const VendorMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Esperar a que Leaflet esté disponible en el objeto window
    const checkLeaflet = setInterval(() => {
      if ((window as any).L) {
        clearInterval(checkLeaflet);
        initMap();
      }
    }, 100);

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
      }
      clearInterval(checkLeaflet);
    };
  }, []);

  const initMap = async () => {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;

    // Inicializar mapa centrado en una ubicación por defecto o del usuario
    leafletMap.current = L.map(mapRef.current).setView([4.5709, -74.2973], 6); // Centro por defecto (ej. Colombia)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(leafletMap.current);

    try {
      const response = await api.get('/geo/vendors-locations/');
      const locations = response.data;

      if (Array.isArray(locations) && locations.length > 0) {
        const markers: any[] = [];
        
        locations.forEach((loc: any) => {
          if (loc.latitude && loc.longitude) {
            const marker = L.marker([loc.latitude, loc.longitude])
              .addTo(leafletMap.current)
              .bindPopup(`<b>${loc.description || 'Vendedor'}</b><br>Lat: ${loc.latitude}, Lon: ${loc.longitude}`);
            markers.push(marker);
          }
        });

        // Ajustar vista para ver todos los marcadores si hay alguno
        if (markers.length > 0) {
          const group = L.featureGroup(markers);
          leafletMap.current.fitBounds(group.getBounds().pad(0.1));
        }
      }
    } catch (error) {
      console.error("Error al cargar ubicaciones de vendedores:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/50 dark:bg-dark/50 backdrop-blur-sm">
          <Spinner size="lg" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '400px' }} />
    </div>
  );
};

export default VendorMap;
