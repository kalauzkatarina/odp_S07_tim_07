// BookDetailsForm.tsx
import { useState } from "react";
import type { BookDto } from "../../models/books/BookDto";
import { BookEditForm } from "../editBookForm/EditBookForm";
import type { CommentDto } from "../../models/comments/CommentDto";
import "./BookDetailsForm.css";

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
  const [isClosing, setIsClosing] = useState(false); 

  const handleSave = (updatedBook: BookDto) => {
    setCurrentBook(updatedBook);
    setIsEditing(false);
    onEditBook(updatedBook);
  };

  const handleCancel = () => {
    setIsClosing(true); 
    setTimeout(() => {
      setIsEditing(false); 
      setIsClosing(false);
    }, 300); 
  };

  if (isEditing) {
    return (
      <div className={`fade-wrapper ${isClosing ? "fade-out" : "fade-in"}`}>
      <BookEditForm
        bookId={currentBook.id}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      </div>
    );
  }

  return (
    <section className="book-details">
      <div className="product">
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
            <h2 className="title-details">{currentBook.title}</h2>
            <p><b>Author:</b> {currentBook.author}</p>
            <p className="isbn"><b>ISBN:</b> {currentBook.isbn}</p>
          </div>

          <div className="book-summary">
            <p><b>Summary:</b> {currentBook.summary}</p>
            <p><b>Format:</b> {currentBook.format}</p>
            <p><b>Binding:</b> {currentBook.binding}</p>
            <p><b>Pages:</b> {currentBook.pages}</p>
            <p><b>Script:</b> {currentBook.script}</p>
            <p><b>Publish Date:</b> {currentBook.publish_date}</p>
            <p><b>Genres:</b> {currentBook.genres?.map(g => g.name).join(", ")}</p>
            <p><b>Views:</b> {currentBook.views}</p>
          </div>

          {user?.role === "editor" && (
            <div className="editor-buttons">
              <button className="btn-delete" onClick={onDeleteBook}>Delete book</button>
              <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit book</button>
            </div>
          )}

          <div className="comments">
            <h3 className="comments-header">Comments</h3>
            <div className="new-comment">
              <input
                type="text"
                placeholder="Leave a comment..."
                value={newComment}
                onChange={(e) => onNewCommentChange?.(e.target.value)}
              />
              <button className="btn-add-comment"
                onClick={() => {
                  if (!user) {
                    alert("You must be logged in to leave a comment!");
                    return;
                  }
                  onAddComment?.();
                }}
              >Add comment</button>
            </div>

            <ul className="comments-list">
              {comments.map((c) => (
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
      </div>
    </section>
  );
}
