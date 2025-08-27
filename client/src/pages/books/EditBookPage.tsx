import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { booksApi } from "../../api_services/book_api/BooksApiService";
import { genresApi } from "../../api_services/genre_api/GenresApiService";
import type { BookDto } from "../../models/books/BookDto";
import type { GenreDto } from "../../models/genres/GenreDto";

import "./BookDetailsPage.css"; // isti css koristimo i za edit stranicu

export default function EditBookPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [book, setBook] = useState<BookDto | null>(null);
  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const bookData = await booksApi.getBookById(Number(id));
      setBook(bookData);
      setSelectedGenreIds(bookData.genres.map(g => g.id));

      const allGenres = await genresApi.getAllGenres();
      setGenres(allGenres);
    };
    fetchData();
  }, [id]);

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenreIds(prev =>
      prev.includes(genreId) ? prev.filter(id => id !== genreId) : [...prev, genreId]
    );
  };

  const handleSubmit = async () => {
    if (!token || !book) {
      alert("Morate biti ulogovani kao urednik!");
      return;
    }

    const updated = await booksApi.updateBook(token, book.id, {
      title: book.title,
      author: book.author,
      summary: book.summary,
      format: book.format,
      pages: book.pages,
      script: book.script,
      binding: book.binding,
      publish_date: book.publish_date,
      isbn: book.isbn,
      cover_image_url: book.cover_image_url,
      genres: genres
        .filter(g => selectedGenreIds.includes(g.id))
        .map(g => ({ id: g.id, name: g.name }))
    });

    if (updated.id !== 0) {
      alert("✅ Knjiga uspešno izmenjena!");
      navigate(`/books/${updated.id}`);
    } else {
      alert("❌ Greška pri izmeni knjige!");
    }
  };

  if (!book) return <p>Učitavanje knjige...</p>;

  return (
    <main className="edit-page">
      <div className="edit-container">
        <div className="edit-card">
          <h1 className="edit-title">✏️ Izmeni knjigu</h1>

          <div className="edit-form">
            {/* Naslov */}
            <input
              type="text"
              placeholder="Naslov"
              value={book.title}
              onChange={(e) => setBook({ ...book, title: e.target.value })}
              className="input"
            />

            {/* Autor */}
            <input
              type="text"
              placeholder="Autor"
              value={book.author}
              onChange={(e) => setBook({ ...book, author: e.target.value })}
              className="input"
            />

            {/* Sažetak */}
            <textarea
              placeholder="Opis / sažetak"
              value={book.summary}
              onChange={(e) => setBook({ ...book, summary: e.target.value })}
              className="input"
            />

            {/* Format i Povez */}
            <div className="form-grid">
              <input
                type="text"
                placeholder="Format"
                value={book.format}
                onChange={(e) => setBook({ ...book, format: e.target.value })}
                className="input"
              />
              <input
                type="text"
                placeholder="Povez"
                value={book.binding}
                onChange={(e) => setBook({ ...book, binding: e.target.value })}
                className="input"
              />
            </div>

            {/* Broj strana i datum izdanja */}
            <div className="form-grid">
              <input
                type="number"
                placeholder="Broj strana"
                value={book.pages}
                onChange={(e) => setBook({ ...book, pages: Number(e.target.value) })}
                className="input"
              />
              <input
                type="text"
                placeholder="Datum izdanja"
                value={book.publish_date}
                onChange={(e) => setBook({ ...book, publish_date: e.target.value })}
                className="input"
              />
            </div>

            {/* ISBN i URL korica */}
            <div className="form-grid">
              <input
                type="text"
                placeholder="ISBN"
                value={book.isbn}
                onChange={(e) => setBook({ ...book, isbn: e.target.value })}
                className="input"
              />
              <input
                type="text"
                placeholder="URL korica"
                value={book.cover_image_url}
                onChange={(e) => setBook({ ...book, cover_image_url: e.target.value })}
                className="input"
              />
            </div>

            {/* Žanrovi */}
            <div className="genres-box">
              <h2 className="genres-title">Žanrovi:</h2>
              <div className="genres-grid">
                {genres.map((genre) => (
                  <label key={genre.id} className="genre-label">
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

            {/* Dugme */}
            <button onClick={handleSubmit} className="btn-save">
              Sačuvaj izmene
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
