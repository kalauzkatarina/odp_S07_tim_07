import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { booksApi } from "../../api_services/bookApi/BooksApiService";
import { genresApi } from "../../api_services/genreApi/GenresApiService";
import type { BookDto } from "../../models/books/BookDto";
import type { GenreDto } from "../../models/genres/GenreDto";

interface BookEditFormProps {
  bookId: number;
  onSave: (book: BookDto) => void;
  onCancel: () => void;
}

export function BookEditForm({ bookId, onSave, onCancel }: BookEditFormProps) {
  const { token } = useAuth();
  const [book, setBook] = useState<BookDto | null>(null);
  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const bookData = await booksApi.getBookById(bookId);
      setBook(bookData);
      setSelectedGenreIds(bookData.genres.map(g => g.id));
      const allGenres = await genresApi.getAllGenres();
      setGenres(allGenres);
    };
    fetchData();
  }, [bookId]);

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenreIds(prev =>
      prev.includes(genreId) ? prev.filter(id => id !== genreId) : [...prev, genreId]
    );
  };

  const handleSubmit = async () => {
    if (!token || !book) return;

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
      genres: genres.filter(g => selectedGenreIds.includes(g.id)).map(g => ({ id: g.id, name: g.name })),
    });

    if (updated.id) {
      alert("✅ Book successfully edited!");
      onSave(updated); // VAŽNO: prosleđuje nove podatke BookDetailsForm-u
    } else {
      alert("❌ Error while editing the book!");
    }
  };

  if (!book) return <p className="loading-text">Reading the book...</p>;

  return (
    <div className="book-edit-form">
      <input
        type="text"
        value={book.title}
        onChange={e => setBook({ ...book, title: e.target.value })}
        placeholder="Title"
      />
      <input
        type="text"
        value={book.author}
        onChange={e => setBook({ ...book, author: e.target.value })}
        placeholder="Author"
      />
      <textarea
        value={book.summary}
        onChange={e => setBook({ ...book, summary: e.target.value })}
        placeholder="Summary"
      />
      {/* Dodaj ostala polja isto kao u originalnom EditBookPage */}
      <div className="genres">
        {genres.map(g => (
          <label key={g.id}>
            <input
              type="checkbox"
              checked={selectedGenreIds.includes(g.id)}
              onChange={() => handleGenreToggle(g.id)}
            />
            {g.name}
          </label>
        ))}
      </div>

      <button onClick={handleSubmit}>Save changes</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}
