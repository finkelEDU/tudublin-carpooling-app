import CarpoolChat from "../CarpoolChat.jsx";
import ChatHistory from "../ChatHistory.jsx";
import Feedback from "../Feedback.jsx";

export default function Chat(){
    return(
        <main>
            <div className="chat-divs">
                <ChatHistory />
                <CarpoolChat />
            </div>

            <Feedback />
        </main>
    );
}