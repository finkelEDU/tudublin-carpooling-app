import {connectDB} from "@/lib/db";
import Chat from "@/models/Chat";
import ChatForm from "../components/ChatForm";
import {cookies} from "next/headers";
import {verifyToken} from "@/lib/auth";

export default async function ChatPage(){
    const cookieStore = await cookies();
        const token = cookieStore.get("session")?.value;
    
        const session = token ? verifyToken(token) : null;
    
        if(!session){
            return(
                <div>
                    <h1>Not authenticated</h1>
                    <p>You must login to view this page.</p>
                </div>
            );
        }

    await connectDB();

    const chats = await Chat.find().populate("user", "username profilePic").sort({createdAt: -1}).lean();

    return(
        <div className="chat">
            <h1>Chat Box</h1>

            <ChatForm />

            <ul style={{marginTop: "2rem", textAlign: "left"}}>
                {chats.map((s) => (
                    <li key={s._id} style={{marginBottom: "1rem"}}>

                        <img
                            src={s.user.profilePic}
                            alt="avatar"
                        />

                        <strong>{s.user.username}: </strong>{s.message}
                        <small>{new Date(s.createdAt).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}