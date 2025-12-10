"use client";

import { useState } from "react";

export default function ProfilePage() {
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

    const [user, setUser] = useState(initialUser);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(initialUser);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
        setFormData(user);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePreferenceChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            preferences: { ...prev.preferences, [name]: value },
        }));
    };

    const handleSave = () => {
        setUser(formData);
        setIsEditing(false);
    };

    return (
        <main style={{ padding: "1rem", maxWidth: "700px", margin: "auto" }}>
            {/* Profile Picture And Ratings */}
            <section style={{ marginBottom: "2rem", textAlign: "center "}}>
                <img
                src={user.avatarUrl}
                alt={'${user.name} avatar'}
                style={{ width: "120px", height: "120px", borderRadius: "50%" }}
                />
                <h1>{user.name}</h1>
                <p>Rating: {user.ratings} / 5 *****</p>
                <p>Status: <strong>{user.status}</strong></p>
            </section>

            {/* Edit Button */}
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <button onClick={toggleEdit}>
                    {isEditing ? "Cancel Edit" : "Edit Profile"}
                </button>
            </div>

            {/* User Information Section */}
            <section style={{ marginBottom: "2rem" }}>
                <h2>User Information</h2>
                {isEditing ? (
                    <form>
                        <label>
                            Name:
                            <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            />
                        </label>
                        <br />
                        <label>
                            Email:
                            <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            />
                        </label>
                        <br />
                        <label>
                            Phone:
                            <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            />
                        </label>
                        <br />
                        <label>
                            User Type:
                            <select
                            name="userType"
                            value={formData.userType}
                            onChange={handleChange}
                            >
                                <option value="Driver">Driver</option>
                                <option value="Passenger">Passenger</option>
                            </select>
                        </label>
                        <br />
                        <label>
                            Home Address:
                            <input
                            type="type"
                            name="homeAddress"
                            value={formData.homeAddress}
                            onChange={handleChange}
                            />
                        </label>
                        <br />

                        {/* User Preferences */}
                        <label>
                            Preferred Vehicle:
                            <select
                            name="preferredVehicle"
                            value={formData.preferences.preferredVehicle}
                            onChange={handlePreferenceChange}
                            >
                                <option value="Car">Car</option>
                                <option value="Bus">Bus</option>
                                <option value="Bike">Bike</option>
                            </select>
                        </label>
                        <br />

                        {/* Password Change */}
                        <label>
                            Change Password:
                            <input type="password" name="password" placeholder="New Password" />
                        </label>
                        <br />

                        <button type="button" onClick={handleSave}>
                            Save Changes
                        </button>
                    </form>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tbody>
                            <tr>
                                <td style={{ border: "1px solid #ccc", padding: "8px"}}>Name</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px"}}>{user.name}</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid #ccc", padding: "8px"}}>Email</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px"}}>{user.email}</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid #ccc", padding: "8px"}}>Phone</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px"}}>{user.phone}</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid #ccc", padding: "8px"}}>User Type</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px"}}>{user.userType}</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid #ccc", padding: "8px"}}>Home Address</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px"}}>{user.homeAddress}</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid #ccc", padding: "8px"}}>Preferred Vehicle</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px"}}>{user.preferences.preferredVehicle}</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </section>

            {/* Popular Routes */}
            <section>
                <h2>Popular Routes</h2>
                <ul>
                    {user.popularRoutes.map((route) => (
                        <li key={route.id}>{route.route}</li>
                    ))}
                </ul>
            </section>
        </main>
    );
}