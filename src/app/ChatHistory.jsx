export default function ChatHistory(){
    return(
        <div className="card">
            <h1 className="header1">Chat History</h1>

            <p>A user's chat history can be accessed here. Below is a sample until functionality is implemented.</p>
            
            <img src="avatar-placeholder.png" alt="profile-pic" className="profile-icon"/>
            <textarea className="chat-history" disabled>Thanks for the lift, I made it to my exam just in time!</textarea>
        </div>
    );
}