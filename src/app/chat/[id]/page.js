import { connectDB } from "@/lib/db";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { getSession } from "@/lib/session";
import ChatClient from "./ChatClient";

export default async function ChatPage({ params }) {
  await connectDB();

  const session = await getSession();

  const conversation = await Conversation.findById(params.id)
    .populate("participants", "username")
    .lean();

  if (!conversation) {
    return <p>Chat not found</p>;
  }

  const messages = await Message.find({
    $or: [
      { sender: session.id, receiver: conversation.participants[0]._id },
      { sender: conversation.participants[0]._id, receiver: session.id },
    ],
  })
    .sort({ createdAt: 1 })
    .lean();

  return (
    <ChatClient
      conversation={JSON.parse(JSON.stringify(conversation))}
      messages={JSON.parse(JSON.stringify(messages))}
      sessionId={session.id}
    />
  );
}