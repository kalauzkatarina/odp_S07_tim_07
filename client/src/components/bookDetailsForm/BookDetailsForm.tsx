// BookDetailsForm.tsx
import { useState } from "react";
import type { BookDto } from "../../models/books/BookDto";
import { BookEditForm } from "../editBookForm/EditBookForm";

interface BookDetailsFormProps {
  book: BookDto;
}

export function BookDetailsForm({ book }: BookDetailsFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentBook, setCurrentBook] = useState(book);

  const handleSave = (updatedBook: BookDto) => {
    setCurrentBook(updatedBook);
    setIsEditing(false);
  };

  return (
    <main className="book-details">
      {isEditing ? (
        <BookEditForm
          bookId={currentBook.id}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <section className="product product-details">
          <div className="product__photo photo-top">
            <div className="photo-container">
              <div className="photo-main">
                <img
                  src={currentBook.cover_image_url || "https://via.placeholder.com/400x600?text=Korice"}
                  alt="Book Cover"
                />
              </div>
            </div>
          </div>

          <div className="product__info info-bottom">
            <div className="title">
              <h1>{currentBook.title}</h1>
              <p>by {currentBook.author}</p>
            </div>

            <div className="book-summary">
              <p>{currentBook.summary}</p>
              <p><strong>Format:</strong> {currentBook.format}</p>
              <p><strong>Binding:</strong> {currentBook.binding}</p>
              <p><strong>Pages:</strong> {currentBook.pages}</p>
              <p><strong>Script:</strong> {currentBook.script}</p>
              <p><strong>Publish Date:</strong> {currentBook.publish_date}</p>
              <p><strong>ISBN:</strong> {currentBook.isbn}</p>
              <p><strong>Genres:</strong> {currentBook.genres.map(g => g.name).join(", ")}</p>
            </div>

            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
