import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { BookDto } from "../../models/books/BookDto";
import { booksApi } from "../../api_services/book_api/BooksApiService";
import type { CommentDto } from "../../models/comments/CommentDto";
import { commentsApi } from "../../api_services/comment_api/CommentsApiService";
import AuthContext from "../../contexts/auth_context/AuthContext";

export default function BookDetailsPage() {
  const { id } = useParams();
  const [book, setBook] = useState<BookDto | null>(null);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [newComment, setNewComment] = useState("");


  useEffect(() => {
    if (!id) return;

    booksApi.getBookById(Number(id)).then((found) => {
      if (found && found.id !== 0) {  // <-- dodaj found && 
        setBook(found);
        booksApi.incrementViews(found.id);
      }
    });
  }, [id]);

  // Učitavanje komentara kada knjiga bude učitana
  useEffect(() => {
    if (!book) return;

    commentsApi.getAllCommentsByBook(book.id).then((data) => {
      setComments(data);
    });
  }, [book]);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within AuthProvider");
  }

  const { user, token } = authContext;
  // Funkcija za dodavanje komentara

  const handleAddComment = async () => {
    if (!book || newComment.trim() === "") return;

    if (!token || !user) {
      alert("Morate biti ulogovani da biste dodali komentar");
      return;
    }

    const user_id = user.id; // uzimamo user_id iz konteksta
    const created = await commentsApi.createComment(newComment, book.id, user_id, token);

    if (created.id !== 0) {
      setComments((prev) => [...prev, created]);
      setNewComment(""); // očisti input
    }
  };

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

        {/* Forma za novi komentar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Napiši komentar..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border p-2 w-full rounded mb-2"
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Dodaj komentar
          </button>
        </div>

        {/* Lista komentara */}
        <ul>
          {comments.map((c) => (
            <li key={c.id} className="border-b py-2">
              {c.content} <span className="text-gray-500 text-sm">(User: {c.user_id})</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}