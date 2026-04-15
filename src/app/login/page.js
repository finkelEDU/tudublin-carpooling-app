"use client";

import {useState} from "react";

export default function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleLogin(e){
        e.preventDefault();
        setMessage("");

        try{
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password}),
            });

            const data = await res.json();

            if(res.ok){
                window.location.href = "/dashboard";
            }else{
                setMessage(data.error);
            }
        }catch(err){
            setMessage("Something went wrong");
        }
    }

    return(
        <div style={{maxWidth: 400, margin: "3rem auto", fontFamily: "sans-serif"}}>
            <h1>Login</h1>

            <form onSubmit={handleLogin} style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    style={{padding: "0.5rem"}}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{padding: "0.5rem"}}
                />

                <button
                    type="submit"
                    style={{
                        padding: "0.7rem",
                        background: "black",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}>
                Login
                </button>
            </form>

            {message && (
                <p style={{marginTop: "1rem", color: message.includes("success") ? "green" : "red" }}>
                    {message}
                </p>
            )}
        </div>
    );
}