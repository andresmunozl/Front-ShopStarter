// src/components/locations/LocationsMaps.tsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";

// Iconos
const locationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

export interface VendorLocation {
  id: string;
  latitude: number;
  longitude: number;
  description?: string;
}

// FlyToMarker
const FlyToMarker = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15, { duration: 1.5 });
  }, [position, map]);
  return null;
};

// AnimatedRoute
const AnimatedRoute = ({
  start,
  end,
  onEnd,
}: {
  start: [number, number];
  end: [number, number];
  onEnd: () => void;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      lineOptions: { styles: [{ color: "blue", opacity: 0.6, weight: 4 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
    }).addTo(map);

    let animatedMarker: L.Marker | null = null;

    routingControl.on("routesfound", (e: any) => {
      const route = e.routes[0];
      if (!route) return;

      const line = L.polyline(route.coordinates).addTo(map);
      const totalPoints = line.getLatLngs().length;
      let index = 0;

      animatedMarker = L.marker(start, {
        icon: L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      }).addTo(map);

      const interval = 5000 / totalPoints;

      const timer = setInterval(() => {
        if (!animatedMarker) return;
        if (index >= totalPoints) {
          clearInterval(timer);
          map.removeLayer(line);
          if (animatedMarker) map.removeLayer(animatedMarker);
          onEnd();
          return;
        }
        animatedMarker.setLatLng(line.getLatLngs()[index]);
        index++;
      }, interval);
    });

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, end, onEnd]);

  return null;
};

const LocationsMaps = () => {
  const [locations, setLocations] = useState<VendorLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPos, setSelectedPos] = useState<[number, number] | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  const [routeStart, setRouteStart] = useState<[number, number] | null>(null);
  const [routeEnd, setRouteEnd] = useState<[number, number] | null>(null);
  const [showRoute, setShowRoute] = useState(false);

  const BASE_URL = "http://127.0.0.1:8000/api/geo/vendors-locations/";

  const fetchAll = async () => {
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      setLocations(data);
      if (data.length > 0)
        setSelectedPos([Number(data[0].latitude), Number(data[0].longitude)]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserPos([position.coords.latitude, position.coords.longitude]),
        (error) => console.error("Error al obtener ubicación:", error)
      );
    }
  }, []);

  const fetchById = async (id: string) => {
    if (!id) return;
    try {
      const res = await fetch(`${BASE_URL}${id}/`);
      if (!res.ok) return;
      const data = await res.json();
      setSelectedPos([Number(data.latitude), Number(data.longitude)]);
    } catch (error) {
      console.error(error);
    }
  };

  const updateSelectedLocation = (lat: number, lng: number) => {
    if (!selectedPos) return;
    setSelectedPos([lat, lng]);
    setLocations(
      locations.map((loc) =>
        loc.latitude === selectedPos[0] && loc.longitude === selectedPos[1]
          ? { ...loc, latitude: lat, longitude: lng }
          : loc
      )
    );
  };

  const addPoint = () => {
    const lat = selectedPos ? Number(selectedPos[0]) + Math.random() * 0.01 : 0;
    const lng = selectedPos ? Number(selectedPos[1]) + Math.random() * 0.01 : 0;

    const newPoint: VendorLocation = {
      id: `new-${Date.now()}`,
      latitude: lat,
      longitude: lng,
      description: "Punto agregado ✨",
    };
    setLocations([...locations, newPoint]);
    setSelectedPos([lat, lng]);
  };

  const removePoint = () => {
    if (locations.length === 0) return;
    const updated = [...locations];
    const removed = updated.pop();
    setLocations(updated);

    if (
      removed &&
      selectedPos &&
      Number(selectedPos[0]) === Number(removed.latitude) &&
      Number(selectedPos[1]) === Number(removed.longitude)
    ) {
      if (updated.length > 0) {
        const last = updated[updated.length - 1];
        setSelectedPos([Number(last.latitude), Number(last.longitude)]);
      } else {
        setSelectedPos(null);
      }
    }
  };

  const filtered = locations.filter(
    (loc) =>
      loc.id.toLowerCase().includes(search.toLowerCase()) ||
      (loc.description && loc.description.toLowerCase().includes(search.toLowerCase()))
  );

  const selectRoutePoint = (point: [number, number]) => {
    if (!routeStart) setRouteStart(point);
    else if (!routeEnd) {
      setRouteEnd(point);
      setShowRoute(true);
    } else {
      setRouteStart(point);
      setRouteEnd(null);
      setShowRoute(false);
    }
    setSelectedPos(point);
  };

  if (loading) return <p className="text-center mt-10">Cargando ubicaciones...</p>;

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Título exótico */}
      <h1 className="text-3xl font-extrabold text-purple-700 text-center mb-6 animate-pulse">
        🌴 LOCALIZADOR DE PUNTOS 🌍
      </h1>

      {/* Buscador y botones */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="Filtrar por ID o descripción"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() => fetchById(search)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Ir a ID
        </button>

        <button
          onClick={addPoint}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Agregar punto
        </button>

        <button
          onClick={removePoint}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Quitar punto
        </button>

        {selectedPos && routeStart && routeEnd && (
          <span className="text-purple-600 font-medium">Ruta animada en progreso...</span>
        )}

        {selectedPos && (
          <div className="ml-auto flex gap-2 items-center">
            <label className="text-gray-700 font-medium">
              Lat:
              <input
                type="number"
                step="0.000001"
                value={selectedPos[0]}
                onChange={(e) =>
                  updateSelectedLocation(parseFloat(e.target.value) || 0, selectedPos[1])
                }
                className="border border-gray-300 rounded px-2 py-1 w-24"
              />
            </label>
            <label className="text-gray-700 font-medium">
              Lng:
              <input
                type="number"
                step="0.000001"
                value={selectedPos[1]}
                onChange={(e) =>
                  updateSelectedLocation(selectedPos[0], parseFloat(e.target.value) || 0)
                }
                className="border border-gray-300 rounded px-2 py-1 w-24"
              />
            </label>
          </div>
        )}
      </div>

      {/* Lista y mapa */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Lista */}
        <div className="w-full md:w-1/3 bg-white p-4 rounded-2xl shadow-lg h-[500px] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4 text-blue-600">Ubicaciones</h3>
          {filtered.length === 0 && <p>No hay datos</p>}
          {filtered.map((loc) => (
            <div
              key={loc.id}
              className={`border-b py-2 cursor-pointer hover:bg-blue-50 rounded px-2 transition-colors ${
                selectedPos?.[0] === loc.latitude && selectedPos?.[1] === loc.longitude
                  ? "bg-blue-100"
                  : ""
              }`}
              onClick={() =>
                selectRoutePoint([Number(loc.latitude), Number(loc.longitude)])
              }
            >
              <strong>ID:</strong> {loc.id} <br />
              <strong>Lat:</strong> {loc.latitude} | <strong>Lng:</strong> {loc.longitude} <br />
              {loc.description && <span>{loc.description}</span>}
            </div>
          ))}
        </div>

        {/* Mapa */}
        <div className="w-full md:flex-1 rounded-2xl overflow-hidden shadow-lg h-[500px]">
          <MapContainer center={userPos || [0, 0]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {userPos && (
              <Marker position={userPos} icon={userIcon}>
                <Popup>Tu ubicación</Popup>
              </Marker>
            )}

            {locations.map((loc) => (
              <Marker
                key={loc.id}
                position={[Number(loc.latitude), Number(loc.longitude)]}
                icon={locationIcon}
              >
                <Popup>
                  <strong>ID:</strong> {loc.id} <br />
                  <strong>Lat:</strong> {loc.latitude} <br />
                  <strong>Lng:</strong> {loc.longitude} <br />
                  {loc.description || "Sin descripción"}
                </Popup>
              </Marker>
            ))}

            {selectedPos && <FlyToMarker position={selectedPos} />}

            {showRoute && routeStart && routeEnd && (
              <AnimatedRoute
                start={routeStart}
                end={routeEnd}
                onEnd={() => {
                  setShowRoute(false);
                  setRouteStart(null);
                  setRouteEnd(null);
                }}
              />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default LocationsMaps;