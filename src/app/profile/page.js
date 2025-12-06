"use client";

import { useState, useEffect } from "react";

export default function ProfilePage() {
    const user = {
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
            </section>

            {/* User Information Table */}
            <section style={{ marginBottom: "2rem"}}>
                <h2>User Information</h2>
                <table style={{ width: "100px", borderCollapse: "collapse"}}>
                    <tbody>
                        <tr>
                            <td style={{ border: "1px solid #ccc", padding: "8px"}}>Name</td>
                            <td style={{ border: "1px solid #ccc", padding: "8px"}}>{user.name}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid #ccc", padding: "8px"}}>E-Mail</td>
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
                    </tbody>
                </table>
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