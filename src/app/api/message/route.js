import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectDB();

    const { sender, receiver, text } = await req.json();

    if (
      !mongoose.Types.ObjectId.isValid(sender) ||
      !mongoose.Types.ObjectId.isValid(receiver)
    ) {
      return Response.json(
        { error: "Invalid user IDs" },
        { status: 400 }
      );
    }

    if (!text || text.trim() === "") {
      return Response.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    // 1. Save message
    const message = await Message.create({
      sender,
      receiver,
      text: text.trim(),
    });

    // 2. Find or create conversation
    let convo = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    if (!convo) {
      convo = await Conversation.create({
        participants: [sender, receiver],
        lastMessage: text,
      });
    } else {
      convo.lastMessage = text;
      await convo.save();
    }

    return Response.json({
      success: true,
      message,
    });
  } catch (err) {
    console.error("MESSAGE API ERROR:", err);
    return Response.json(
      { error: "Message failed", details: err.message },
      { status: 500 }
    );
  }
}