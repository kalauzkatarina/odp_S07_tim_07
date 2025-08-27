import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { booksApi } from "../../api_services/book_api/BooksApiService";
import { genresApi } from "../../api_services/genre_api/GenresApiService";
import type { BookDto } from "../../models/books/BookDto";
import type { GenreDto } from "../../models/genres/GenreDto";

import "./EditBookPage.css"; 

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
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleSubmit = async () => {
    if (!token || !book) {
      alert("You need to be logged in as the Editor!");
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
        .map(g => ({ id: g.id, name: g.name })),
    });

    if (updated.id !== 0) {
      alert("✅ Book succesfully edited!");
      navigate(`/books/${updated.id}`);
    } else {
      alert("❌ Error while editing the book!");
    }
  };

  if (!book) return <p className="loading-text">Reading the book...</p>;

  return (
    <main className="book-details">
      <section className="product product-add">
        <div className="product__photo photo-top">
          <div className="photo-container">
            <div className="photo-main">
              <img
                src={book.cover_image_url || "https://via.placeholder.com/400x600?text=Korice"}
                alt="Book Cover"
              />
            </div>
          </div>
        </div>

        <div className="product__info info-bottom">
          <div className="title">
            <h1>✏️ Edit the Book</h1>
          </div>

          <div className="form-grid">
            <input
              type="text"
              placeholder="Title"
              value={book.title}
              onChange={e => setBook({ ...book, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Author"
              value={book.author}
              onChange={e => setBook({ ...book, author: e.target.value })}
            />
            <textarea
              placeholder="Summary"
              value={book.summary}
              onChange={e => setBook({ ...book, summary: e.target.value })}
            />
            <input
              type="text"
              placeholder="Format"
              value={book.format}
              onChange={e => setBook({ ...book, format: e.target.value })}
            />
            <input
              type="text"
              placeholder="Binding"
              value={book.binding}
              onChange={e => setBook({ ...book, binding: e.target.value })}
            />
            <input
              type="number"
              placeholder="Page Number"
              value={book.pages}
              onChange={e => setBook({ ...book, pages: Number(e.target.value) })}
            />
            <input
              type="text"
              placeholder="Script"
              value={book.script}
              onChange={e => setBook({ ...book, script: e.target.value })}
            />
            <input
              type="text"
              placeholder="Publish Date"
              value={book.publish_date}
              onChange={e => setBook({ ...book, publish_date: e.target.value })}
            />
            <input
              type="text"
              placeholder="ISBN"
              value={book.isbn}
              onChange={e => setBook({ ...book, isbn: e.target.value })}
            />
            <input
              type="text"
              placeholder="Cover Image URL"
              value={book.cover_image_url}
              onChange={e => setBook({ ...book, cover_image_url: e.target.value })}
            />

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

          <button className="btn-edit" onClick={handleSubmit}>
            Save changes
          </button>
        </div>
      </section>
    </main>
  );
}
