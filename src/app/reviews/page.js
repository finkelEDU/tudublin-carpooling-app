import React, { useState, useEffect } from "react";

async function getReviews(page = 1, limit = 10){
    const res = await fetch("http://localhost:3000/api/reviews", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch reviews");
    return res.json();
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function StarRating({ rating }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} style={{ color: i <= rating ? "#fbbf24" : "#ddd" }} aria-hidden="true">
                "⭐"
            </span>
        );
    }
    return <span aria-label={`${rating} out of 5 stars`}>{stars}</span>;
}


export default function Reviews(){
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalReviews, setTotalReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getReviews(page)
        .then((data) => {
            setReviews((prev) => [...prev, ...data.items]);
            setTotalReviews(data.total);
            setAverageRating(data.averageRating);
            setLoading(false);
        })
        .catch((err) => {
            setError(err.message);
            setLoading(false);
        });
    }, [page]);

    const loadMore = () => setPage((p) => p + 1);

    return (
        <main style={{ maxWidth: 720, margin: "3rem auto", padding: "0 1rem", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem", color: "#2563eb" }}>User Reviews</h1>

            <section aria-lavel="Summary of reviews" style={{ marginBottom: "2rem" }}>
                <p>
                    <strong>{totalReviews}</strong> review{totalReviews !== 1 ? "s" : ""} with an average rating of{" "}
                    <StarRating rating={Math.round(averageRating)} /> ({averageRating.toFixed(1)})
                </p>
            </section>

            {error && <p role="alert" style={{ color: "red"}}>Error: {error}</p>}

            <section aria-live="polite" aria-busy={loading}>
                {reviews.length === 0 && !loading && <p>No reviews yet.</p>}

                {reviews.map((review) => (
                    <article key={review._id} style={{ marginBottom: "1.5rem", borderBottom: "1px solid #ddd", paddingBottom: "1rem" }}>
                        <h3 style={{ margin: 0, fontWeight: "600" }}>{review.userName || "Anonymous"}</h3>
                        <StarRating rating={review.rating} />
                        <p style={{ marginTop: "0.5rem"}}>{review.comment}</p>
                        <time dateTime={review.createdAt} style={{ fontSize: "0.85rem", color: "#555" }}>
                            {formatDate(review.createdAt)}
                        </time>
                    </article>
                ))}

                {loading && <p>Loading...</p>}

                {!loading && reviews.length < totalReviews && (
                    <button onClick={loadMore} style={{ padding: "10px 20px", fontSize: "1rem", cursor: "pointer", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: 6 }}>
                        Load More
                    </button>
                )}
            </section>
        </main>
    );
}