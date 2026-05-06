"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function JoinPoolButton({ poolId }) {
  const [loading, setLoading] = useState(false);

  async function joinPool() {
    setLoading(true);
    const res = await fetch("/api/pool/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ poolId }),
    });
    setLoading(false);

    if (res.ok) {
      window.location.reload();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to join pool");
    }
  }

  return (
    <Button onClick={joinPool} disabled={loading}>
      {loading ? "Joining..." : "Join Pool"}
    </Button>
  );
}