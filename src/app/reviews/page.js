async function getReviews(){
    const res = await fetch("http://localhost:3000/api/reviews", {
        cache: "no-store"
    });

    if(!res.ok){
        throw new Error("Failed to load.");
    }

    return res.json();
}

export default async function Reviews(){
    const reviews = await getReviews();

    return (
    <div>
        <h1>List of Reviews</h1>

        {reviews.map((review) => (
            <div key={review.id}>
                <h3>{review.driverName}</h3>
                <p>Customer: {review.user}</p>
                <span>
                    {"⭐".repeat(review.rating)}
                </span>
                <p>{review.comment}</p>
                <hr />
            </div>
        ))}
    </div>
    );
}