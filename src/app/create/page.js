import Link from "next/link";

export default function Create(){
    return(
        <main style={styles.page}>
            <h1 style={styles.title}>Create a Carpool</h1>
            <p style={styles.description}>
                Welcome! This is where you can begin to make a new carpool ride that will share your commute with others.
                Carpooling is a great way to reduce costs, emissions, and parking demand.
            </p>
            <nav style={styles.nav}>
                <Link href="/create-ride" style={styles.link}>
                Create a Ride &rarr;
                </Link>
                <Link href="/rides" style={styles.link}>
                View Existing Rides &rarr;
                </Link>
            </nav>
        </main>
    );
}

const styles = {
    page: {
        maxWidth: 720,
        margin: "3rem auto",
        padding: "0 1.2rem",
        fontFamily: "'Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        color: "#0f172a",
    },
    title: {
        fontSize: "2.5rem",
        fontWeight: "700",
        marginBottom: "1rem",
        color: "#2563eb",
    },
    description: {
        fontSize: "1.15rem",
        marginBottom: "2rem",
        lineHeight: 1.5,
        color: "#475569",
    },
    nav: {
        display: "flex",
        gap: "1.5rem",
    },
    link: {
        fontWeight: "600",
        fontSize: "1.1rem",
        color: "#2563eb",
        textDecoration: "underline",
        cursor: "pointer",
    },
};