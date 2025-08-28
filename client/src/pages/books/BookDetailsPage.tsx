import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { BookDto } from "../../models/books/BookDto";
import { booksApi } from "../../api_services/bookApi/BooksApiService";
import type { CommentDto } from "../../models/comments/CommentDto";
import { commentsApi } from "../../api_services/commentApi/CommentsApiService";
import AuthContext from "../../contexts/auth_context/AuthContext";
import "./BookDetailsPage.css";

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
      alert("You need to be logged in/signed in to leave a comment!");
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
      alert("You need to be logged in/signed in as the Editor to delete a book!");
      return;
    }
    const confirmed = confirm(`Are you sure you want to delete "${book.title}"?`);
    if (!confirmed) return;
    const success = await booksApi.deleteBook(token, book.id);
    if (success) navigate("/books");
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!token || !user) return;
    const confirmed = confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;
    const success = await commentsApi.deleteComment(token, commentId);
    if (success) setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  if (!book) return <p className="loading-text">Loading...</p>;

  return (
    <main className="book-details">
      <section className="product">
        <div className="product__photo">
          <div className="photo-container">
            <div className="photo-main">
              <img src={book.cover_image_url} alt={book.title} />
            </div>
          </div>
        </div>

        <div className="product__info">
          <div className="title">
            <h1>{book.title}</h1>
            <span>ISBN: {book.isbn}</span>
          </div>

          <div className="views">
            <span>Views: {book.views}</span>
          </div>

          <div className="details">
            <h3>Book Details</h3>
            <ul>
              <li><b>Author:</b> {book.author}</li>
              <li><b>Genres:</b> {book.genres.map(g => g.name).join(", ") || "No Genres"}</li>
              <li><b>Format:</b> {book.format}</li>
              <li><b>Page Number:</b> {book.pages}</li>
              <li><b>Script:</b> {book.script}</li>
              <li><b>Binding:</b> {book.binding}</li>
              <li><b>Publish Date:</b> {book.publish_date}</li>
            </ul>
          </div>

          {user?.role === "editor" && (
            <div className="editor-buttons">
              <button className="btn-delete" onClick={handleDeleteBook}>Delete book</button>
              <button className="btn-edit" onClick={() => navigate(`/books/${book.id}/edit`)}>Edit book</button>
            </div>
          )}

          <div className="comments">
            <h3>Comments</h3>
            <div className="new-comment">
              <input
                type="text"
                placeholder="Leave a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
              <button className="btn-add-comment" onClick={handleAddComment}>Add comment</button>
            </div>

            <ul className="comments-list">
              {comments.map(c => (
                <li className="comment-card" key={c.id}>
                  <div className="comment-heading">
                    <div className="avatar-placeholder"></div>
                    <div className="comment-meta">
                      <div className="comment-title">
                        <b>{c.username || `User #${c.user_id}`}</b>
                      </div>
                    </div>
                  </div>
                  <div className="comment-body">
                    <p>{c.content}</p>
                    {user?.role === "editor" && (
                      <button className="btn-comment-delete" onClick={() => handleDeleteComment(c.id)}>Delete comment</button>
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
