import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { booksApi } from "../../api_services/book_api/BooksApiService";
import { useNavigate } from "react-router-dom";
import type { GenreDto } from "../../models/genres/GenreDto";
import { genresApi } from "../../api_services/genre_api/GenresApiService";

import "./AddBookPage.css"; // koristimo isti CSS

export default function AddBookPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [format, setFormat] = useState("");
  const [pages, setPages] = useState(0);
  const [script, setScript] = useState("");
  const [binding, setBinding] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [isbn, setIsbn] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const data = await genresApi.getAllGenres();
      setGenres(data);
    };
    fetchGenres();
  }, []);

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenreIds((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleSubmit = async () => {
    if (!token) {
      alert("Morate biti ulogovani kao urednik da biste dodali knjigu!");
      return;
    }

    const created = await booksApi.createBook(
      token,
      title,
      author,
      summary,
      format,
      pages,
      script,
      binding,
      publishDate,
      isbn,
      coverImageUrl,
      selectedGenreIds
    );

    if (created.id !== 0) {
      alert("Knjiga uspješno dodana!");
      navigate(`/books/${created.id}`);
    } else {
      alert("Greška pri dodavanju knjige!");
    }
  };

  return (
    <main className="book-details">
      <section className="product product-add">
        {/* Slika na vrhu */}
        <div className="product__photo photo-top">
          <div className="photo-container">
            <div className="photo-main">
              <img
                src={coverImageUrl || "https://via.placeholder.com/400x600?text=Korice"}
                alt="Korice knjige"
              />
            </div>
          </div>
        </div>

        {/* Forma ispod slike */}
        <div className="product__info info-bottom">
          <div className="title">
            <h1>➕ Dodaj novu knjigu</h1>
          </div>

          <div className="form-grid">
            <div className="row two-columns">
              <input type="text" placeholder="Naslov" value={title} onChange={e => setTitle(e.target.value)} />
              <input type="text" placeholder="Autor" value={author} onChange={e => setAuthor(e.target.value)} />
            </div>

            <textarea placeholder="Sažetak" value={summary} onChange={e => setSummary(e.target.value)} />

            <input type="text" placeholder="Format" value={format} onChange={e => setFormat(e.target.value)} />
            <input type="text" placeholder="Povez" value={binding} onChange={e => setBinding(e.target.value)} />

            <input type="number" placeholder="Broj strana" value={pages} onChange={e => setPages(Number(e.target.value))} />
            <input type="text" placeholder="Pismo" value={script} onChange={e => setScript(e.target.value)} />

            <input type="text" placeholder="Datum izdanja" value={publishDate} onChange={e => setPublishDate(e.target.value)} />
            <input type="text" placeholder="ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} />

            <input type="text" placeholder="URL korica" value={coverImageUrl} onChange={e => setCoverImageUrl(e.target.value)} />

            <div className="genres">
              {genres.map(genre => (
                <label key={genre.id}>
                  <input
                    type="checkbox"
                    checked={selectedGenreIds.includes(genre.id)}
                    onChange={() => handleGenreToggle(genre.id)}
                  />
                  <span>{genre.name}</span>
                </label>
              ))}
            </div>
          </div>


          <button className="btn-edit" onClick={handleSubmit}>Dodaj knjigu</button>
        </div>
      </section>
    </main>



  );
}
