"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const poolIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});

const requestIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
});

const collegeIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

/* -----------------------------
   FIX LEAFLET DEFAULT ICONS
------------------------------ */
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LOCATION_COORDS = {
  Blanchardstown: [53.404, -6.38],
  Finglas: [53.389, -6.296],
  Swords: [53.4597, -6.2181],
  "Dublin City Centre": [53.3498, -6.2603],

  Clonee: [53.418, -6.449],
  Dunboyne: [53.419, -6.473],
  Summerhill: [53.511, -6.687],
  Dunshaughlin: [53.512, -6.537],

  Trim: [53.555, -6.791],
  Navan: [53.652, -6.681],
  Kells: [53.725, -6.879],

  Drogheda: [53.718, -6.347],
  Dundalk: [54.005, -6.404],

  Cavan: [53.99, -7.36],
  Wicklow: [52.98, -6.04],

  Cork: [51.898, -8.475],
  Kildare: [53.156, -6.911],

  Monaghan: [54.25, -6.967],
  Westmeath: [53.534, -7.337],
  Offaly: [53.273, -7.492],
};

export default function Map({ pools = [], requests = [] }) {
  const [map, setMap] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { MapContainer, TileLayer, Marker, Popup } =
        await import("react-leaflet");

      if (!mounted) return;

      setMap({ MapContainer, TileLayer, Marker, Popup });
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  if (!map) return <p>Loading map...</p>;

  const { MapContainer, TileLayer, Marker, Popup } = map;

  return (
    <MapContainer
      center={[53.404, -6.38]}
      zoom={8}
      style={{ height: "500px", width: "100%" }}
    >
      {/* BASE MAP */}
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🏫 COLLEGE */}
      <Marker position={[53.404, -6.38]}>
        <Popup>
          <b>College</b>
          <br />
          TU Dublin Blanchardstown
        </Popup>
      </Marker>

      {/* 🚗 POOL GROUPS */}
      {pools.map((pool) => {
        const coords = LOCATION_COORDS[pool.location?.trim()];
        if (!coords) return null;

        return (
          <Marker key={pool._id} position={coords}>
            <Popup>
              <b>Pool Group</b>
              <br />
              <b>{pool.groupName}</b>
              <br />
              {pool.location} → {pool.destination}
              <br />
              <br />
              <span style={{ fontSize: "12px" }}>
                Driver: {pool.driver?.username || "Unknown"}
              </span>
            </Popup>
          </Marker>
        );
      })}

      {requests.map((req) => {
        const coords = LOCATION_COORDS[req.location?.trim()];
        if (!coords) return null;

        return (
          <Marker
            key={req._id}
            position={coords}
            icon={requestIcon}
          >
            <Popup>
              <b>Student Request</b>
              <br />
              {req.student?.username}
              <br />
              {req.location} → {req.destination}
              <br />
              {req.time}
              <br />
              <br />
              <span
                style={{
                  color: req.status === "accepted" ? "green" : "orange",
                  fontWeight: "bold",
                }}
              >
                Status: {req.status}
              </span>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}