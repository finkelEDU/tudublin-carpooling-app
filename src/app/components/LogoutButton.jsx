"use client";

export default function LogoutButton(){
    const handleLogout = async () => {
        await fetch("/api/logout", {method: "POST"});
        window.location.href = "/login";
    };

    return(
        <button onClick={handleLogout} className="nav-link">
            Logout
        </button>
    );
}