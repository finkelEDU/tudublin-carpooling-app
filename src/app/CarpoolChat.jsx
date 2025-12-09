"use client";

import { useState } from "react";

export default function CarpoolChat(){
    const [message, setMessage] = useState("");

    const handleSend = async () => {
        await fetch("http://localhosy:3000/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            nody: JSON.stringify({text: message}),
        });

        setMessage("");
    }





    return(
        <div className="card">
            <h1 className="header1">Current Carpool Chat</h1>
            
            <img src="avatar-placeholder.png" alt="profile-pic" class="profile-icon"/>
            <textarea placeholder="Send a message..." value={message} onChange={(e) => setMessage(e.target.value)} />

            <br></br>
            <button onClick={handleSend}>Send to Driver</button>
        </div>
    );
}