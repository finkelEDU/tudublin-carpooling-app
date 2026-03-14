"use client";

import React, { useState } from "react";

const initialUser = {
        avatarUrl: "/avatar-placeholder.png",
        name: "Clark Kent",
        email: "clark.kent@example.com",
        phone: "+1234567890",
        userType: "Driver",
        homeAddress: "123 Main St, Hometown",
        ratings: 4.5,
        popularRoutes: [
            { id: 1, route: "Daily Planet To City Museum"},
            { id: 2, route: "City Museum To Airport"},
        ],
        status: "Online",
        preferences: {
            preferredVehicle: "Car",
        },
    };

const popularRoutesMock = [
    { id: 1, origin: "Metropolis", destination: "Gotham", frequency: "Weekly"},
    { id: 2, origin: "Gotham", destination: "Metropolis", frequency: "Weekly"},
]

export default function ProfilePage() {
    const [user, setUser] = useState(initialUser);
    const [editMode, setEditMode] = useState(false);
    const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
    const [message, setMessage] = useState("");

    const toggleEdit = () => setEditMode(!editMode);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handlePreferenceChange = (e) => {
        setUser((prev) => ({ ...prev, preferredVehicle: e.target.value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPassword((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (password.new && password.new !== password.confirm) {
            setMessage("New password and confirmation do not match.");
            return;
        }
        setMessage("Profile updated successfully!");
        setEditMode(false);
        setPassword({ current: "", new: "", confirm: "" });
    };

    return (
        <main style={styles.page}>
            <h1 style={styles.title}>Profile</h1>
            <section style={styles.section}>
                <table style={styles.table}>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <td>
                                {editMode ? (
                                    <input
                                    type="text"
                                    name="name"
                                    value={user.name}
                                    onChange={handleChange}
                                    style={styles.input}
                                    />
                                ) : (
                                    user.name
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{user.email}</td>
                        </tr>
                        <tr>
                            <th>Telephone</th>
                            <td>
                                {editMode ? (
                                    <input
                                    type="tel"
                                    name="telephone"
                                    value={user.telephone}
                                    onChange={handleChange}
                                    style={styles.input}
                                    />
                                ) : (
                                    user.telephone
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>User Type</th>
                            <td>{user.userType}</td>
                        </tr>
                        <tr>
                            <th>Home Address</th>
                            <td>
                                {editMode ? (
                                    <input
                                    type="text"
                                    name="homeAddress"
                                    value={user.homeAddress}
                                    onChange={handleChange}
                                    style={styles.input}
                                    />
                                ) : (
                                    user.homeAddress
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>Preferred Vehicle</th>
                            <td>
                                {editMode ? (
                                    <select
                                    name="preferredVehicle"
                                    value={user.preferredVehicle}
                                    onChange={handlePreferenceChange}
                                    style={styles.select}
                                    >
                                        <option value="Car">Car</option>
                                        <option value="Bus">Bus</option>
                                        <option value="Bike">Bike</option>
                                    </select>
                                ) : (
                                    user.preferredVehicle
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {editMode && (
                    <section style={{ marginTop: 20 }}>
                        <h2 style={styles.subtitle}>Change Password</h2>
                        <input
                        type="password"
                        name="current"
                        placeholder="Current Password"
                        value={password.current}
                        onChange={handlePasswordChange}
                        style={styles.input}
                        />
                        <input
                        type="password"
                        name="new"
                        placeholder="New Password"
                        value={password.new}
                        onChange={handlePasswordChange}
                        style={styles.input}
                        />
                        <input
                        type="password"
                        name="confirm"
                        placeholder="Confirm New Password"
                        value={password.confirm}
                        onChange={handlePasswordChange}
                        style={styles.input}
                        />
                    </section>
                )}

                <div style={styles.buttons}>
                    <button onClick={toggleEdit} style={styles.button}>
                        {editMode ? "Cancel" : "Edit Profile"}
                    </button>
                    {editMode && (
                        <button onClick={handleSave} style={{ ...styles.button, ...styles.primaryButton }}>
                            Save Changes
                        </button>
                    )}
                </div>

                {message && <p style={styles.message}>{message}</p>}
            </section>

            <section style={styles.section}>
                <h2 style={styles.subtitle}>Popular Routes</h2>
                <ul>
                    {popularRoutesMock.map((route) => (
                        <li key={route.id}>
                            {route.origin} || {route.destination} ({route.frequency})
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}

const styles = {
    page: {
        maxWidth: 720,
        margin: "3rem auto",
        padding: "0 1.2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#0f172a",
    },
    title: {
        fontSize: "2.5rem",
        fontWeight: "700",
        marginBottom: "1rem",
        color: "#2563eb",
    },
    section: {
        marginBottom: "2rem",
    },
    subtitle: {
        fontSize: "1.5rem",
        fontWeight: "600",
        marginBottom: "1rem",
        color: "#2563eb",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    input: {
        width: "100%",
        padding: "8px 10px",
        fontSize: "1rem",
        borderRadius: 6,
        border: "1px solid #ccc",
    },
    select: {
        width: "100%",
        padding: "8px 10px",
        fontSize: "1rem",
        borderRadius: 6,
        border: "1px solid #ccc",
    },
    buttons: {
        marginTop: 20,
        display: "flex",
        gap: 12,
    },
    button: {
        padding: "10px 18px",
        fontWeight: "600",
        fontSize: "1rem",
        borderRadius: 8,
        border: "1px solid #2563eb",
        backgroundColor: "white",
        color: "#2563eb",
        cursor: "pointer",
    },
    primaryButton: {
        backgroundColor: "#2563eb",
        color: "white",
    },
    message: {
        marginTop: 12,
        fontWeight: "600",
        color: "#2563eb",
    },
};