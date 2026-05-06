export const dynamic = "force-dynamic"

import { connectDB } from "@/lib/db"
import Chat from "@/models/Chat"
import ChatForm from "../components/ChatForm"
import { getMongoUser } from "@/lib/getMongoUser"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"

export default async function ChatPage() {
  const user = await getMongoUser()

  if (!user) {
    return (
      <div className="p-6 max-w-2xl mx-auto mt-10">
        <p className="text-muted-foreground">You must be logged in to view the chat.</p>
      </div>
    )
  }

  await connectDB()
  const chats = await Chat.find()
    .populate("user", "username profilePic")
    .sort({ createdAt: -1 })
    .lean()

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Chat box</h1>
        <p className="text-sm text-muted-foreground">Chat with other TU Dublin commuters</p>
      </div>

      <div className="border rounded-xl p-4">
        <ChatForm />
      </div>

      <ul className="flex flex-col gap-3">
        {chats.map((chat) => (
          <li key={chat._id.toString()} className="border rounded-xl px-4 py-3 flex items-start gap-3">
            <Avatar className="h-9 w-9 shrink-0 mt-0.5">
              <AvatarImage src={chat.user?.profilePic} alt={chat.user?.username} />
              <AvatarFallback>{chat.user?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="font-medium text-sm">{chat.user?.username}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(chat.createdAt), "d MMM 'at' p")}
                </span>
              </div>
              <p className="text-sm">{chat.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
