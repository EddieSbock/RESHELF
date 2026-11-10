import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contesto/AuthContext";
import { fetchPostById, deletePost } from "../api/posts";
import "./VisualizzaPost.css";
import { ChatCommenti } from "../componenti/ChatCommenti";

export default function VisualizzaPost() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isAdmin } = useAuth();

    const [post, setPost] = useState(null);
    const [errore, setErrore] = useState(null);

    useEffect(() => {
        let attivo = true;
        const handlePost = async () => {
            try {
                setErrore(null);
                const datiPost = await fetchPostById(id);
                if (attivo) {
                    setPost(datiPost);
                }
            } catch (err) {
                console.error(err);
                if (attivo) {
                    setErrore("Impossibile caricare il post richiesto.");
                }
            }
        };
        handlePost();
        return () => {
            attivo = false;
        };
    }, [id]);

    const handleDelete = async () => {
        try {
            await deletePost(id);
            navigate("/");
        } catch (err) {
            console.error(err);
            setErrore("Errore durante l'eliminazione del post.");
        }
    };

    return (
        <div className="visualizza-post">
            <div className="post-container">
                {errore && <p className="messaggio-errore">{errore}</p>}

                <div className="post-header">
                    {post && (
                        <div className="post-cover">
                            <img className="post-cover-img" src={post.cover} alt={post.titolo} />
                        </div>
                    )}
                    {post && (
                        <aside className="post-info">
                            <h1 className="post-titolo">{post.titolo}</h1>
                            <p className="post-registi">Registi: {post.registi}</p>
                            <p className="post-cast">Cast: {post.cast}</p>
                            <p className="post-categorie">
                                Categorie:
                                {post.categorie?.map((categoria) => (
                                    <span key={categoria} className="post-categorie-item">
                                        {categoria}
                                    </span>
                                ))}
                            </p>
                            <p className="post-voto">Voto: {post.voto}</p>
                        </aside>
                    )}
                </div>
                <div className="post-principale">
                    {post && (
                        <div>
                            <section className="post-dettagli">
                                <h2>Dettagli del post</h2>
                                <p className="post-autore">
                                    Scritto da: {post.autore?.nome || "Autore"}
                                </p>
                            </section>
                            <p className="post-corpo">{post.corpo}</p>
                        </div>
                    )}
                    <section className="post-modifica">
                        {isAdmin && (
                            <div>
                                <Link to={`/modifica-post/${id}`} className="modifica-link">
                                    Modifica Post
                                </Link>
                                <button type="button" className="elimina-link" onClick={handleDelete}>
                                    Elimina Post
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
            <aside className="chat-container">
                <ChatCommenti postId={id} />
            </aside>
        </div>
    );
}