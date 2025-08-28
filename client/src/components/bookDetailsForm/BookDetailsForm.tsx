import type { BookDto } from "../../models/books/BookDto";
import type { CommentDto } from "../../models/comments/CommentDto";
import "./BookDetailsForm.css";

interface BookDetailsCardProps {
  book: BookDto;
  comments: CommentDto[];
  user: any;
  newComment: string;
  onNewCommentChange: (value: string) => void;
  onAddComment: () => void;
  onDeleteBook?: () => void;
  onDeleteComment: (commentId: number) => void;
  onEditBook?: () => void;
}

export default function BookDetailsCard({
  book,
  comments,
  user,
  newComment,
  onNewCommentChange,
  onAddComment,
  onDeleteBook,
  onDeleteComment,
  onEditBook,
}: BookDetailsCardProps) {
  return (
    <section className="book-details">
      <div className="product">
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
              <button className="btn-delete" onClick={onDeleteBook}>Delete book</button>
              <button className="btn-edit" onClick={onEditBook}>Edit book</button>
            </div>
          )}

          <div className="comments">
            <h3>Comments</h3>
            <div className="new-comment">
              <input
                type="text"
                placeholder="Leave a comment..."
                value={newComment}
                onChange={e => onNewCommentChange(e.target.value)}
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
                        onClick={() => onDeleteComment(c.id)}
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
