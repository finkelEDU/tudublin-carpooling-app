"use client";

import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const seatOptions = Array.from({ length: 8 }, (_, i) => i + 1);

export default function CreateRide() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [seatsAvailable, setSeatsAvailable] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!origin.trim() || !destination.trim()) {
      setError("Origin and destinations are required.");
      return;
    }
    if (!date) {
      setError("Date is required.");
      return;
    }
    if (!time) {
      setError("Time is required");
      return;
    }

    const datetime = new Date(`${date}T${time}`);
    if (isNaN(datetime.getTime())) {
      setError("Invalid date or time.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/create-ride", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: origin.trim(),
          destination: destination.trim(),
          date: datetime.toISOString(),
          seatsAvailable,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create ride.");
      } else {
        setSuccess("Ride created successfully!");
        setOrigin("");
        setDestination("");
        setDate("");
        setTime("");
        setSeatsAvailable("");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Create a New Ride</h1>

      <form onSubmit={handleSubmit} style={styles.form} noValidate>
        <TextField
        label="Origin"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
        required
        fullWidth
        margin="normal"
        variant="outlined"
        inputProps={{ maxLength: 100 }}
        />

        <TextField
        label="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        required
        fullWidth
        margin="normal"
        variant="outlined"
        inputProps={{ maxLength: 100 }}
        />

        <div style={styles.row}>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
            style={{ flex: 1, marginRight: 12 }}
          />

          <TextField
            label="Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
            style={{ flex: 1 }}
          />
        </div>

      <TextField
        label="Seats Available"
        select
        value={seatsAvailable}
        onChange={(e) => setSeatsAvailable(Number(e.target.value))}
        required
        margin="normal"
        variant="outlined"
        fullWidth
      >
          {seatOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option} {option === 1 ? "seat" : "seats"}
            </MenuItem>
          ))}
      </TextField>

        {error && (
          <Alert severity="error" style={{ marginTop: 16 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" style={{ marginTop: 16 }}>
            {success}
          </Alert>
        )}

        <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        style={{ marginTop: 24 }}
        fullWidth
        size="large"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Create Ride"}
        </Button>
      </form>
    </main>
  );
}

const styles = {
  page: {
    maxWidth: 600,
    margin: "3rem auto",
    padding: "0 1.2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#0f172a",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "1.5rem",
    color: "#2563eb",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    gap: 12,
    marginTop: 12,
  },
};