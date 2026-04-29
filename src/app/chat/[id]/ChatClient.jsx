"use client";

import { useState } from "react";

export default function ChatClient({ conversation, messages, sessionId }) {
  const [text, setText] = useState("");
  const [chat, setChat] = useState(messages);

  const otherUser = conversation.participants.find(
    (p) => p._id !== sessionId
  );

  async function sendMessage() {
    if (!text) return;

    const res = await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: sessionId,
        receiver: otherUser._id,
        text,
      }),
    });

    const data = await res.json();

    setChat([...chat, data.message]);
    setText("");
  }

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Chat with {otherUser.username}</h2>

      {/* MESSAGE LIST */}
      <div
        style={{
          border: "1px solid #00364D",
          padding: "10px",
          height: "400px",
          overflowY: "auto",
          background: "#D4F1F6",
        }}
      >
        {chat.map((msg) => (
          <div
            key={msg._id}
            style={{
              textAlign: msg.sender === sessionId ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "10px",
                background:
                  msg.sender === sessionId ? "#00364D" : "#4EA8C2",
                color: "white",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1, padding: "10px" }}
          placeholder="Type a message..."
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}