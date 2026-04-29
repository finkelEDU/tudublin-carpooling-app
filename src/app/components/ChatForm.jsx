"use client";

import {useState} from "react";

export default function ChatForm(){
    const [message, setMessage] = useState("");

    async function handleSubmit(e){
        e.preventDefault();

        const res = await fetch("/api/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({message})
        });

        if(res.ok){
            setMessage("");
            window.location.reload();
        }
    }

    return(
        <form onSubmit={handleSubmit} style={{marginTop: "1rem"}}>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Send a message..."
                style={{width: "80%", padding: "0.5rem"}}
            />

            <button type="submit" style={{marginLeft: "0.5rem"}}>
                Send Chat
            </button>

        </form>
    );
}