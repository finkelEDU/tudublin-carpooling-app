"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function MapClient({ pools, requests, searchPin }) {
  return (
    <div style={{ height: "500px", width: "100%" }}>
      <Map pools={pools} requests={requests} searchPin={searchPin} />
    </div>
  );
}