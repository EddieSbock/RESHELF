import "./PostCard.css";
import { Link } from "react-router-dom";

export function PostCard({ post }) {
    const dataFormattata = new Date(post.dataCreazione).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        <Link to={`/post/${post._id}`} className="post-card">
            <div className="post-card-cover">
                <img src={post.cover} alt={post.titolo} />
            </div>
            <div className="post-card-info">
                <span className="post-card-titolo">{post.titolo}</span>
                <p className="post-card-dati">
                    {post.autore?.nome || "Autore"} - {dataFormattata}
                </p>
                <p className="post-card-descrizione">
                    {post.riassunto || "Clicca per visualizzare i dettagli dell'articolo."}
                </p>
            </div>
        </Link>
    );
}