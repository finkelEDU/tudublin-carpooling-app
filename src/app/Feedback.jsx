"use client";

export default function Feedback(){
    return(
        <div className="card2">
            <h1 className="header1">Feedback</h1>
            <form action="/submit" method="POST">
            <label htmlFor="driver-name" id="driver-name">Driver Name:</label>
            <input type="text" name="driver" id="driver"></input>

            <br /><br />

            <textarea
                id="message"
                name="message"
                rows="8"
                cols="40"
                placeholder="Enter feedback here..."
            ></textarea>

            <h4>Rating:</h4>
            <input type="radio" id="five" name="five" value="5" />
            <label htmlFor="five">5 Stars</label><br />

            <input type="radio" id="five" name="five" value="5" />
            <label htmlFor="five">4 Stars</label><br />

            <input type="radio" id="five" name="five" value="5" />
            <label htmlFor="five">3 Stars</label><br />

            <input type="radio" id="five" name="five" value="5" />
            <label htmlFor="five">2 Stars</label><br />

            <input type="radio" id="five" name="five" value="5" />
            <label htmlFor="five">1 Star</label><br />

            <br />

            <button type="submit">Send Feedback</button>
            </form>
        </div>
    );
}