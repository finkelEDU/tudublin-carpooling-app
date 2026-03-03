"use client";

import {useState} from "react";

export default function Feedback(){
    const [user, setUser] = useState("");
    const [driverName, setDriverName] = useState("");
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const review = {user, driverName, rating, comment};

        try{
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(review),
            });

            if(!res.ok){
                throw new Error("Failed to submit review.");
            }

            alert("Review submitted!");
            
            setUser("");
            setDriverName("");
            setRating(0);
            setComment("");
        }catch(err){
            console.error(err);
            alert("Failed to submit.");
        }
    };

    return(
        <div className="card2">
            <h1 className="header1">Feedback</h1>

            <form onSubmit={handleSubmit}>
            <label htmlFor="user">Your Name: </label>

            <input
                type="text"
                name="user"
                id="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
            />

            <br /><br />

            <label htmlFor="driver-name">Driver Name: </label>
            <input
                type="text"
                name="driver"
                id="driver"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
            />

            <br /><br />

            <textarea
                id="message"
                name="message"
                rows="8"
                cols="40"
                placeholder="Enter feedback here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <h4>Rating:</h4>
            <input
                type="radio"
                id="five"
                name="rating"
                value="5"
                checked={rating == 5}
                onChange={() => setRating(5)}
            />
            <label htmlFor="five">5 Stars</label><br />

            <input
                type="radio"
                id="four"
                name="rating"
                value="4"
                checked={rating == 4}
                onChange={() => setRating(4)}
            />
            <label htmlFor="four">4 Stars</label><br />

            <input
                type="radio"
                id="three"
                name="rating"
                value="3"
                checked={rating == 3}
                onChange={() => setRating(3)}
            />
            <label htmlFor="three">3 Stars</label><br />

            <input
                type="radio"
                id="two"
                name="rating"
                value="2"
                checked={rating == 2}
                onChange={() => setRating(2)}
            />
            <label htmlFor="two">2 Stars</label><br />

            <input
                type="radio"
                id="one"
                name="rating"
                value="1"
                checked={rating == 1}
                onChange={() => setRating(1)}
            />
            <label htmlFor="one">1 Star</label>
            <br /><br />

            <button type="submit">Send Feedback</button>
            </form>
        </div>
    );
}