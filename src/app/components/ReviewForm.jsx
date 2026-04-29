"use client";

export default function ReviewForm({driverId}){
    async function submitReview(e){
        e.preventDefault();

        const form = new FormData(e.target);

        const res = await fetch("/api/reviews/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                driverId,
                rating: form.get("rating"),
                comment: form.get("comment")
            })
        });

        if(res.ok){
            window.location.reload();
        }
    }

    return(
        <form onSubmit={submitReview}>
            <label>Rating</label>
            <select name="rating" required>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
            </select>

            <label>Comment</label>
            <textarea name="comment" placeholder="Write Review..." />

            <button type="submit">Submit Review</button>
        </form>
    );
}