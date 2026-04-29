"use client";

import { useState } from "react";

export default function ReportForm({ reportedUserId }) {
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportedUser: reportedUserId,
        reason,
        comment,
      }),
    });

    alert("Report submitted");
    setReason("");
    setComment("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <select value={reason} onChange={(e) => setReason(e.target.value)}>
        <option value="">Select reason</option>
        <option value="Inappropriate behavior">Inappropriate behavior</option>
        <option value="Spam">Spam</option>
        <option value="Unsafe driving">Unsafe driving</option>
        <option value="Other">Other</option>
      </select>

      <textarea
        placeholder="Add comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ width: "100%", marginTop: "10px" }}
      />

      <button
        style={{
          backgroundColor: "red",
          color: "white",
          marginTop: "10px",
        }}
      >
        Report User
      </button>
    </form>
  );
}