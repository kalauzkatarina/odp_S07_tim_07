import { useState } from "react";
import type { BookDto } from "../../models/books/BookDto";
import { BookEditForm } from "../editBookForm/EditBookForm";
import type { CommentDto } from "../../models/comments/CommentDto";

interface BookDetailsFormProps {
  book: BookDto;
  editable?: boolean;
  comments?: CommentDto[];
  user?: { id: number; username: string; role: string } | null;
  newComment?: string;
  onNewCommentChange?: (value: string) => void;
  onAddComment?: () => void;
  onDeleteComment?: (commentId: number) => void;
  onDeleteBook?: () => void;
  onEditBook: (updatedBook: BookDto) => void;
}

export function BookDetailsForm({
  book,
  comments = [],
  user,
  newComment = "",
  onNewCommentChange,
  onAddComment,
  onDeleteComment,
  onDeleteBook,
  onEditBook
}: BookDetailsFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentBook, setCurrentBook] = useState(book);

  const handleSave = (updatedBook: BookDto) => {
    setCurrentBook(updatedBook);
    setIsEditing(false);
    onEditBook(updatedBook);
  };

  if (isEditing) {
    return (
      <BookEditForm
        bookId={currentBook.id}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <main className="book-details">
      <section className="product">
        <div className="product__photo">
          <div className="photo-container">
            <div className="photo-main">
              <img
                src={currentBook.cover_image_url || "https://via.placeholder.com/400x600?text=Korice"}
                alt={currentBook.title}
              />
            </div>
          </div>
        </div>

        <div className="product__info">
          <div className="title">
            <h1>{currentBook.title}</h1>
            <span>ISBN: {currentBook.isbn}</span>
          </div>

          <div className="views">
            <span>Views: {currentBook.views}</span>
          </div>

          <div className="details">
            <h3>Book Details</h3>
            <ul>
              <li><b>Author:</b> {currentBook.author}</li>
              <li><b>Genres:</b> {currentBook.genres.map(g => g.name).join(", ") || "No Genres"}</li>
              <li><b>Format:</b> {currentBook.format}</li>
              <li><b>Page Number:</b> {currentBook.pages}</li>
              <li><b>Script:</b> {currentBook.script}</li>
              <li><b>Binding:</b> {currentBook.binding}</li>
              <li><b>Publish Date:</b> {currentBook.publish_date}</li>
            </ul>
          </div>

          {user?.role === "editor" && (
            <div className="editor-buttons">
              <button className="btn-delete" onClick={onDeleteBook}>Delete book</button>
              <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit book</button>
            </div>
          )}

          <div className="comments">
            <h3>Comments</h3>
            <div className="new-comment">
              <input
                type="text"
                placeholder="Leave a comment..."
                value={newComment}
                onChange={e => onNewCommentChange?.(e.target.value)}
              />
              <button className="btn-add-comment" onClick={onAddComment}>Add comment</button>
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
                      <button
                        className="btn-comment-delete"
                        onClick={() => onDeleteComment?.(c.id)}
                      >
                        Delete comment
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