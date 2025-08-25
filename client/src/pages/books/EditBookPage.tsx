import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { BookDto } from "../../models/books/BookDto";

import { booksApi } from "../../api_services/book_api/BooksApiService";

export default function EditBookPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [book, setBook] = useState<BookDto | null>(null);
  const [genreIds, setGenreIds] = useState<number[]>([]);

  // Učitavanje knjige
  useEffect(() => {
    if (!id) return;
    booksApi.getBookById(Number(id)).then((found) => {
      if (found && found.id !== 0) {
        setBook(found);
        setGenreIds(found.genres.map((g) => g.id)); // inicijalizacija prethodnih žanrova
      }
    });
  }, [id]);

  const handleSave = async () => {
    if (book && token) {
      // Kreiraj update objekt sa genres kao niz GenreDto
      const updates = {
        ...book,
        genres: genreIds.map((id) => ({ id, name: "" })), // backend gleda samo ID
      };

      await booksApi.updateBook(token, book.id, updates);
      alert("Knjiga sačuvana!");
      navigate(`/books/${book.id}`);
    }
  };

  if (!book) return <p className="p-6">Učitavanje...</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">✏️ Uredi knjigu</h1>

      <div className="flex flex-col gap-4 max-w-lg">
        <input
          type="text"
          value={book.title}
          onChange={(e) => setBook({ ...book, title: e.target.value })}
          placeholder="Naslov"
          className="border p-2 rounded"
        />

        <input
          type="text"
          value={book.author}
          onChange={(e) => setBook({ ...book, author: e.target.value })}
          placeholder="Autor"
          className="border p-2 rounded"
        />

        <textarea
          value={book.summary}
          onChange={(e) => setBook({ ...book, summary: e.target.value })}
          placeholder="Opis"
          className="border p-2 rounded"
        />

        <input
          type="text"
          value={book.format}
          onChange={(e) => setBook({ ...book, format: e.target.value })}
          placeholder="Format"
          className="border p-2 rounded"
        />

        <input
          type="number"
          value={book.pages}
          onChange={(e) => setBook({ ...book, pages: Number(e.target.value) })}
          placeholder="Broj strana"
          className="border p-2 rounded"
        />

        <input
          type="text"
          value={book.script}
          onChange={(e) => setBook({ ...book, script: e.target.value })}
          placeholder="Pismo"
          className="border p-2 rounded"
        />

        <input
          type="text"
          value={book.binding}
          onChange={(e) => setBook({ ...book, binding: e.target.value })}
          placeholder="Povez"
          className="border p-2 rounded"
        />

        <input
          type="text"
          value={book.publish_date}
          onChange={(e) => setBook({ ...book, publish_date: e.target.value })}
          placeholder="Datum izdanja"
          className="border p-2 rounded"
        />

        <input
          type="text"
          value={book.isbn}
          onChange={(e) => setBook({ ...book, isbn: e.target.value })}
          placeholder="ISBN"
          className="border p-2 rounded"
        />

        <input
          type="text"
          value={book.cover_image_url}
          onChange={(e) => setBook({ ...book, cover_image_url: e.target.value })}
          placeholder="URL korice"
          className="border p-2 rounded"
        />

        <input
          type="text"
          value={genreIds.join(",")}
          placeholder="Žanrovi (unesi ID-jeve odvojene zarezom)"
          onChange={(e) =>
            setGenreIds(
              e.target.value
                .split(",")
                .map((id) => parseInt(id.trim()))
                .filter((id) => !isNaN(id))
            )
          }
          className="border p-2 rounded"
        />

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sačuvaj izmene
        </button>
      </div>
    </main>
  );
}
