"use client";

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
    <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
      <p><b>Student:</b> {request.student.username}</p>
      <p><b>From:</b> {request.location}</p>
      <p><b>To:</b> {request.destination}</p>
      <p><b>Time:</b> {request.time}</p>

      {request.status === "accepted" ? (
        <p style={{ color: "green", fontWeight: "bold" }}>Accepted by driver</p>
      ) : (
        <button onClick={handleAccept}>Accept Request</button>
      )}
    </div>
  );
}