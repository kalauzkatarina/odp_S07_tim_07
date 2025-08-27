import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { BookDto } from "../../models/books/BookDto";
import { booksApi } from "../../api_services/book_api/BooksApiService";
import type { CommentDto } from "../../models/comments/CommentDto";
import { commentsApi } from "../../api_services/comment_api/CommentsApiService";
import AuthContext from "../../contexts/auth_context/AuthContext";
import "./BookDetailsPage.css"; // CSS za komentare i stranicu

export default function BookDetailsPage() {
  const { id } = useParams();
  const [book, setBook] = useState<BookDto | null>(null);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error("AuthContext must be used within AuthProvider");
  const { user, token } = authContext;

  useEffect(() => {
    if (!id) return;
    booksApi.getBookById(Number(id)).then((found) => {
      if (found && found.id !== 0) {
        setBook(found);
        booksApi.incrementViews(found.id);
      }
    });
  }, [id]);

  useEffect(() => {
    if (!book) return;
    commentsApi.getAllCommentsByBook(book.id).then((data) => setComments(data));
  }, [book]);

  const handleAddComment = async () => {
    if (!book || newComment.trim() === "") return;
    if (!token || !user) {
      alert("Morate biti ulogovani da biste dodali komentar.");
      return;
    }
    const created = await commentsApi.createComment(newComment, book.id, user.id, token);
    if (created.id !== 0) {
      const refreshed = await commentsApi.getAllCommentsByBook(book.id);
      setComments(refreshed);
      setNewComment("");
    }
  };

  const handleDeleteBook = async () => {
    if (!book) return;
    if (!token || !user) {
      alert("Morate biti ulogovani kao editor da biste obrisali knjigu.");
      return;
    }
    const confirmed = confirm(`Da li ste sigurni da želite obrisati "${book.title}"?`);
    if (!confirmed) return;
    const success = await booksApi.deleteBook(token, book.id);
    if (success) navigate("/books");
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!token || !user) return;
    const confirmed = confirm("Da li ste sigurni da želite obrisati ovaj komentar?");
    if (!confirmed) return;
    const success = await commentsApi.deleteComment(token, commentId);
    if (success) setComments((prev) => prev.filter((c) => c.id !== commentId));
  };


  if (!book) return <p className="p-6">Učitavanje...</p>;

  return (
    <main className="book-details container mt-4">
      <section className="product row">
        <div className="col-md-5 product__photo">
          <div className="photo-container">
            <div className="photo-main">
              <img src={book.cover_image_url} alt={book.title} className="img-fluid" />
            </div>
          </div>
        </div>

        <div className="col-md-7 product__info">
          <div className="title mb-2">
            <h1>{book.title}</h1>
            <span>ISBN: {book.isbn}</span>
          </div>

          <div className="price mb-3">
            <span>Pregleda: {book.views}</span>
          </div>

          <div className="variant mb-3">
            <h3>Detalji knjige</h3>
            <ul>
              <li><b>Autor:</b> {book.author}</li>
              <li><b>Žanrovi:</b> {book.genres.map(g => g.name).join(", ") || "Nema žanrova"}</li>
              <li><b>Format:</b> {book.format}</li>
              <li><b>Broj strana:</b> {book.pages}</li>
              <li><b>Pismo:</b> {book.script}</li>
              <li><b>Povez:</b> {book.binding}</li>
              <li><b>Datum izdanja:</b> {book.publish_date}</li>
            </ul>
          </div>

          {user?.role === "editor" && (
            <div className="editor-buttons mb-3">
              <button className="btn btn-danger mr-2" onClick={handleDeleteBook}>Obriši knjigu</button>
              <button className="btn btn-secondary" onClick={() => navigate(`/books/${book.id}/edit`)}>Uredi knjigu</button>
            </div>
          )}

          <div className="description">
            <h3>Komentari</h3>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Napiši komentar..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
              <button
                className="btn btn-primary mt-2"
                onClick={handleAddComment}
              >
                Dodaj komentar
              </button>
            </div>

            <ul className="comments-list">
              {comments.map(c => (
                <li className="card card-white post mb-3" key={c.id}>
                  <div className="post-heading d-flex align-items-center">
                    <div className="avatar-placeholder"></div>
                    <div className="float-left meta ml-3">
                      <div className="title h5">
                        <b>{c.username || `User #${c.user_id}`}</b> 
                      </div>
                    </div>
                  </div>
                  <div className="post-description mt-2">
                    <p>{c.content}</p>
                    {user?.role === "editor" && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteComment(c.id)}
                      >
                        Obriši
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>

          </div>
        </div>
      </section>
    </main>
  );
}
