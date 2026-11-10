import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchPostById, createPost, updatePost } from '../api/posts';
import { CATEGORIE_FILM } from '../utility/costanti';
import './ModificaPost.css';

export default function GestionePost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titolo: "",
    riassunto: "",
    corpo: "",
    cover: "",
    registi: "",
    cast: "",
    voto: 10,
    categorie: []
  });

  const [errore, setErrore] = useState(null);
  const [invioInCorso, setInvioInCorso] = useState(false);

  useEffect(() => {
    if (!id) return;

    let attivo = true;
    const recuperaPost = async () => {
      try {
        const p = await fetchPostById(id);
        if (attivo && p) {
          setForm({
            titolo: p.titolo || "",
            riassunto: p.riassunto || "",
            corpo: p.corpo || "",
            cover: p.cover || "",
            registi: p.registi || "",
            cast: p.cast || "",
            voto: p.voto ?? 10,
            categorie: p.categorie || []
          });
        }
      } catch (err) {
        console.error(err);
        if (attivo) {
          setErrore("Impossibile caricare i dati del post da modificare.");
        }
      }
    };
    recuperaPost();
    return () => {
      attivo = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "voto" ? Number(value) : value
    }));
  };

  const handleCheckbox = (scelta) => {
    setForm((prev) => {
      const esiste = prev.categorie.includes(scelta);
      return {
        ...prev,
        categorie: esiste
          ? prev.categorie.filter((c) => c !== scelta)
          : [...prev.categorie, scelta]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore(null);

    if (form.categorie.length === 0) {
      setErrore("Seleziona almeno una categoria.");
      return;
    }

    if (form.corpo.trim().length < 10) {
      setErrore("Il corpo della recensione deve contenere almeno 10 caratteri.");
      return;
    }

    setInvioInCorso(true);
    try {
      if (id) {
        await updatePost(id, form);
        navigate(`/post/${id}`);
      } else {
        const creato = await createPost(form);
        navigate(`/post/${creato._id}`);
      }
    } catch (err) {
      console.error(err);
      setErrore(err.response?.data?.message || "Errore durante il salvataggio.");
    } finally {
      setInvioInCorso(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-container">
        <div className="form-header">
          <h2 className="form-titolo">{id ? "modifica post" : "nuovo post"}</h2>
          <Link to={id ? `/post/${id}` : "/"} className="form-bottone">annulla</Link>
        </div>

        {errore && <div className="form-errore">{errore}</div>}

        <form onSubmit={handleSubmit} className="modifica-form">
          <div className="form-input">
            <label htmlFor="post-titolo">titolo del film</label>
            <input
              id="post-titolo"
              className="input-item"
              type="text"
              name="titolo"
              value={form.titolo}
              onChange={handleChange}
              required
              placeholder="es. Kill Bill volume 1"
            />
          </div>

          <div className="form-input">
            <label htmlFor="post-cover">URL Immagine di Copertina</label>
            <input
              id="post-cover"
              className="input-item"
              type="url"
              name="cover"
              value={form.cover}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-riga-doppia">
            <div className="form-input">
              <label htmlFor="post-registi">Regia</label>
              <input
                id="post-registi"
                type="text"
                className="input-item"
                name="registi"
                value={form.registi}
                onChange={handleChange}
                placeholder="es. Christopher Nolan, Quentin Tarantino"
              />
            </div>

            <div className="form-input">
              <label htmlFor="post-voto">Voto (1-10)</label>
              <input
                id="post-voto"
                type="number"
                className="input-item"
                name="voto"
                min="1"
                max="10"
                value={form.voto}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-input">
            <label htmlFor="post-cast">Cast Principale</label>
            <input
              id="post-cast"
              type="text"
              name="cast"
              value={form.cast}
              onChange={handleChange}
              className="input-item"
              placeholder="es. Ryan Gosling, The Rock, Ana de Armas"
            />
          </div>

          <div className="form-input">
            <label>Categorie</label>
            <div className="categorie-griglia">
              {CATEGORIE_FILM.map((categoria) => (
                <label key={categoria} className="categoria-checkbox">
                  <input
                    type="checkbox"
                    checked={form.categorie.includes(categoria)}
                    onChange={() => handleCheckbox(categoria)}
                  />
                  <span>{categoria}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-input">
            <label htmlFor="post-riassunto">Descrizione</label>
            <input
              id="post-riassunto"
              type="text"
              name="riassunto"
              value={form.riassunto}
              onChange={handleChange}
              className="input-item"
              placeholder="Una frase per la homepage..."
            />
          </div>

          <div className="form-input">
            <label htmlFor="post-corpo">Corpo del Post</label>
            <textarea
              id="post-corpo"
              name="corpo"
              rows="8"
              minLength={10}
              maxLength={5000}
              value={form.corpo}
              onChange={handleChange}
              required
              className="input-item input-textarea"
              placeholder="Scrivi qui la recensione completa..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={invioInCorso}
            className="form-bottone form-bottone-invio"
          >
            {id ? "aggiorna articolo" : "pubblica articolo"}
          </button>
        </form>
      </div>
    </div>
  );
}