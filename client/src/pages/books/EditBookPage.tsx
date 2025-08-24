import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { BookDto } from "../../models/books/BookDto";
import { booksApi } from "../../api_services/book_api/BooksApiService";

export default function EditBookPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [book, setBook] = useState<BookDto | null>(null);

  useEffect(() => {
    booksApi.getAllBooks().then((all) => {
      const found = all.find((b) => b.id === Number(id));
      if (found) setBook(found);
    });
  }, [id]);

  const handleSave = async () => {
    if (book && token) {
      await booksApi.updateBook(token, book.title, book);
      alert("Knjiga sačuvana!");
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
          className="border p-2 rounded"
        />
        <input
          type="text"
          value={book.author}
          onChange={(e) => setBook({ ...book, author: e.target.value })}
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