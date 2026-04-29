"use client"

import {useState} from "react";

export default function Signup(){
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("Student");
    const [message, setMessage] = useState("");

    async function handleSubmit(e){
        e.preventDefault();
        setMessage("");

        const res = await fetch("/api/signup", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, email, password, userType}),
        });

        const data = await res.json();

        if(res.ok){
            setMessage("User created. You can log in now.");
            setUsername("");
            setEmail("");
            setPassword("");
            setUserType("");

            window.location.href = "/login";
        }else{
            setMessage(data.error || "Something went wrong");
        }
    }

    return(
        <div style={{maxWidth: 400, margin: "2rem auto"}}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                </div>

                <div>
                    <label>Email</label>
                    <input 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </div>

                <div>
                    <label>User Type</label>
                    <select value={userType} onChange={e => setUserType(e.target.value)}>
                        <option value="Student">Student</option>
                        <option value="Driver">Driver</option>
                    </select>
                </div>

                <button type="submit">Create Account</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}