import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import terminator from "../assets/terminator.png";
import { PostCard } from "../componenti/PostCard";
import { fetchPosts, fetchTopPosts } from "../api/posts";
import { CATEGORIE_FILM } from "../utility/costanti";

export default function Home() {
    const [post, setPost] = useState([]);
    const [errore, setErrore] = useState(null);
    const [ricerca, setRicerca] = useState("");
    const [categoria, setCategoria] = useState("");
    const [topPost, setTopPost] = useState([]);

    useEffect(() => {
        let attivo = true;
        const handlePost = async () => {
            try {
                setErrore(null);
                const postati = await fetchPosts({ categoria, ricerca });
                if (attivo) {
                    setPost(postati);
                }
            } catch (err) {
                console.error(err);
                if (attivo) {
                    setErrore("Problema nel recuperare i post");
                }
            }
        };
        handlePost();
        return () => {
            attivo = false;
        };
    }, [ricerca, categoria]);

    useEffect(() => {
        let attivo = true;
        const handleTopPost = async () => {
            try {
                const migliori = await fetchTopPosts();
                if (attivo) {
                    setTopPost(migliori);
                }
            } catch (err) {
                console.error(err);
            }
        };
        handleTopPost();
        return () => {
            attivo = false;
        };
    }, []);

    return (
        <div className="home">
            <header className="barra-home">
                <div className="barra-ricerca">
                    <input
                        className="ricerca-input"
                        type="text"
                        placeholder="Cerca..."
                        value={ricerca}
                        onChange={(e) => setRicerca(e.target.value)}
                    />
                </div>
                <div className="barra-utility">
                    <span className="utility-numPost">{post.length} Post</span>
                </div>
            </header>

            {errore && <p className="messaggio-errore">{errore}</p>}

            <div className="corpo-home">
                <div className="corpo-post">
                    {post.map((item) => (
                        <PostCard key={item._id} post={item} />
                    ))}
                </div>
                <aside className="corpo-sidebar">
                    <div className="sidebar-sezione">
                        <h3>Categorie</h3>
                        <section className="sezione-categorie">
                            {CATEGORIE_FILM.map((scelta) => (
                                <button
                                    type="button"
                                    key={scelta}
                                    className={categoria === scelta ? "categoria selezionata" : "categoria"}
                                    onClick={() => setCategoria(scelta === categoria ? "" : scelta)}
                                >
                                    {scelta}
                                </button>
                            ))}
                        </section>
                    </div>

                    <div className="sidebar-sezione">
                        <h3>Top Recensioni</h3>
                        <section className="sezione-topPost">
                            {topPost.map((item) => (
                                <Link to={`/post/${item._id}`} key={item._id} className="topPost-link">
                                    <div className="topPost-card">
                                        <h4 className="topPost-titolo">{item.titolo}</h4>
                                        <span className="topPost-voto">Voto: {item.voto}</span>
                                    </div>
                                </Link>
                            ))}
                        </section>
                    </div>
                    <div className="sidebar-sezione-img">
                        <img className="sidebar-img" src={terminator} alt="Terminator" />
                    </div>
                </aside>
            </div>
        </div>
    );
}