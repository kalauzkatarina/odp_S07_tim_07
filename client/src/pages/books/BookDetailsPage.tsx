import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { BookDto } from "../../models/books/BookDto";
import { booksApi } from "../../api_services/book_api/BooksApiService";

export default function BookDetailsPage() {
  const { id } = useParams();
  const [book, setBook] = useState<BookDto | null>(null);

  useEffect(() => {
    if (id) {
      booksApi.getAllBooks().then((all) => {
        const found = all.find((b) => b.id === Number(id));
        if (found) {
          setBook(found);
          booksApi.incrementViews(found.title);
        }
      });
    }
  }, [id]);

  if (!book) return <p className="p-6">Učitavanje...</p>;

  return (
    <main className="p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <img
          src={book.cover_image_url}
          alt={book.title}
          className="w-full h-[400px] object-cover rounded shadow"
        />

        <div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-gray-700 mb-2">Autor: {book.author}</p>
          <p className="mb-4">{book.summary}</p>

          <ul className="text-sm text-gray-600">
            <li><b>Format:</b> {book.format}</li>
            <li><b>Broj strana:</b> {book.pages}</li>
            <li><b>Pismo:</b> {book.script}</li>
            <li><b>Povez:</b> {book.binding}</li>
            <li><b>Datum izdanja:</b> {book.publish_date}</li>
            <li><b>ISBN:</b> {book.isbn}</li>
            <li><b>Pregleda:</b> {book.views}</li>
          </ul>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">💬 Komentari</h2>
        {/* TODO: poveži commentsApi i napravi listu/formu za komentare */}
        <p>Ovde ide lista i forma za komentare.</p>
      </section>
    </main>
  );
}