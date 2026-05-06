"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function DriverRequestCard({ request }) {
  async function handleAccept() {
    try {
      const res = await fetch("/api/poolRequest/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: request._id }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  }

  return (
    <Card>
      <CardContent className="space-y-1 text-sm pt-6">
        <p><span className="font-medium">Student:</span> {request.student.username}</p>
        <p><span className="font-medium">From:</span> {request.location}</p>
        <p><span className="font-medium">To:</span> {request.destination}</p>
        <p><span className="font-medium">Time:</span> {request.time}</p>
      </CardContent>
      <CardFooter>
        {request.status === "accepted" ? (
          <Badge variant="secondary">Accepted</Badge>
        ) : (
          <Button onClick={handleAccept}>Accept Request</Button>
        )}
      </CardFooter>
    </Card>
  );
}