import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { booksApi } from "../../api_services/book_api/BooksApiService";
import { genresApi } from "../../api_services/genre_api/GenresApiService";
import type { BookDto } from "../../models/books/BookDto";
import type { GenreDto } from "../../models/genres/GenreDto";

import "./BookDetailsPage.css";

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
 <main className="p-6 flex justify-center">
  <div className="w-full max-w-3xl">
    <div className="bg-pink-200 rounded-xl shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">✏️ Izmeni knjigu</h1>

      <div className="flex flex-col gap-4">
        {/* Naslov */}
        <input
          type="text"
          placeholder="Naslov"
          value={book.title}
          onChange={(e) => setBook({ ...book, title: e.target.value })}
          className="border p-2 rounded focus:ring-2 focus:ring-pink-400"
        />

        {/* Autor */}
        <input
          type="text"
          placeholder="Autor"
          value={book.author}
          onChange={(e) => setBook({ ...book, author: e.target.value })}
          className="border p-2 rounded focus:ring-2 focus:ring-pink-400"
        />

        {/* Sažetak */}
        <textarea
          placeholder="Opis / sažetak"
          value={book.summary}
          onChange={(e) => setBook({ ...book, summary: e.target.value })}
          className="border p-2 rounded focus:ring-2 focus:ring-pink-400"
        />

        {/* Format i Povez */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Format"
            value={book.format}
            onChange={(e) => setBook({ ...book, format: e.target.value })}
            className="border p-2 rounded focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="text"
            placeholder="Povez"
            value={book.binding}
            onChange={(e) => setBook({ ...book, binding: e.target.value })}
            className="border p-2 rounded focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* Broj strana i datum izdanja */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Broj strana"
            value={book.pages}
            onChange={(e) => setBook({ ...book, pages: Number(e.target.value) })}
            className="border p-2 rounded focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="text"
            placeholder="Datum izdanja"
            value={book.publish_date}
            onChange={(e) => setBook({ ...book, publish_date: e.target.value })}
            className="border p-2 rounded focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* ISBN i URL korica */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="ISBN"
            value={book.isbn}
            onChange={(e) => setBook({ ...book, isbn: e.target.value })}
            className="border p-2 rounded focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="text"
            placeholder="URL korica"
            value={book.cover_image_url}
            onChange={(e) => setBook({ ...book, cover_image_url: e.target.value })}
            className="border p-2 rounded focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* Žanrovi */}
        <div className="p-4 border rounded-lg bg-pink-100">
          <h2 className="font-semibold mb-2">Žanrovi:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {genres.map((genre) => (
              <label key={genre.id} className="flex items-center gap-2 cursor-pointer w-full">
                <input
                  type="checkbox"
                  checked={selectedGenreIds.includes(genre.id)}
                  onChange={() => handleGenreToggle(genre.id)}
                  className="w-5 h-5 accent-pink-600"
                />
                <span>{genre.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Dugme */}
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Sačuvaj izmene
        </button>
      </div>
    </div>
  </div>
</main>


  );
}
