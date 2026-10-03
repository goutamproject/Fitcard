"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet's default marker icons reference image paths that break under
// bundlers like webpack/Next.js — this fixes it.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface VenueMapProps {
  venue: {
    name: string;
    address: {
      lat: number;
      lng: number;
      fullAddress?: string;
      city?: string;
    } | null;
  };
  className?: string;
}

export function VenueMap({ venue, className }: VenueMapProps) {
  if (!venue.address) {
    return (
      <div
        className={`flex items-center justify-center bg-muted text-muted-foreground text-sm ${className ?? ""}`}
      >
        No location available
      </div>
    );
  }

  const { lat, lng, fullAddress, city } = venue.address;

  return (
    <div className={className}>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Free OSM tiles — attribution is required by their license */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>
            <strong>{venue.name}</strong>
            <br />
            {fullAddress ?? city}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}