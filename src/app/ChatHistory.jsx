export default function ChatHistory(){
    return(
        <div className="card">
            <h1 className="header1">Chat History</h1>

            <p>A user's chat history can be accessed here. Below are a few samples until functionality is implemented.</p>
            
            <div className="scroll">
                <img src="avatar-placeholder.png" alt="profile-pic" className="profile-icon"/>
                <textarea className="chat-history" disabled defaultValue="Thanks for the lift, I made it to my exam just in time!" />
                <br></br>
                <img src="avatar-placeholder.png" alt="profile-pic" className="profile-icon"/>
                <textarea className="chat-history" disabled defaultValue="What time are you here at?" />
                <br></br>
                <img src="avatar-placeholder.png" alt="profile-pic" className="profile-icon"/>
                <textarea className="chat-history" disabled defaultValue="Hope you arrive here soon, it's raining." />
            </div>
            <p>If there is a chat you want to report, please use the button below:</p>
            <button>Report Abuse</button>
        </div>
    );
}