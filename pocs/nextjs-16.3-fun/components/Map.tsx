'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type Restaurant = {
  id: string;
  name: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
};

export default function Map({ restaurants }: { restaurants: Restaurant[] }) {
  const center: [number, number] = restaurants.length > 0 
    ? [restaurants[0].lat, restaurants[0].lng] 
    : [51.505, -0.09];

  return (
    <div style={{ height: '600px', width: '100%', borderRadius: '16px', overflow: 'hidden' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {restaurants.map((r) => (
          <Marker key={r.id} position={[r.lat, r.lng]} icon={customIcon}>
            <Popup>
              <strong>{r.name}</strong><br/>
              {r.type}<br/>
              {r.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
