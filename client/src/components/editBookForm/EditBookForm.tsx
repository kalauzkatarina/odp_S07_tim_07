//import React from "react";
import type { BookDto } from "../../models/books/BookDto";
import type { GenreDto } from "../../models/genres/GenreDto";

import "./EditBookForm.css";

interface EditBookFormProps {
  book: BookDto;
  genres: GenreDto[];
  selectedGenreIds: number[];
  onChange: (field: keyof BookDto, value: any) => void;
  onToggleGenre: (genreId: number) => void;
  onSubmit: () => void;
}

export default function EditBookForm({
  book,
  genres,
  selectedGenreIds,
  onChange,
  onToggleGenre,
  onSubmit,
}: EditBookFormProps) {
  return (
    <section className="book-card">
      <h1>✏️ Edit the Book</h1>

      <div className="row">
        <div>
          <input
            type="text"
            placeholder="Title"
            value={book.title}
            onChange={(e) => onChange("title", e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Author"
            value={book.author}
            onChange={(e) => onChange("author", e.target.value)}
          />
        </div>
      </div>

      <textarea
        placeholder="Summary"
        value={book.summary}
        onChange={(e) => onChange("summary", e.target.value)}
      />

      <div className="row">
        <input
          type="text"
          placeholder="Format"
          value={book.format}
          onChange={(e) => onChange("format", e.target.value)}
        />
        <input
          type="text"
          placeholder="Binding"
          value={book.binding}
          onChange={(e) => onChange("binding", e.target.value)}
        />
      </div>

      <div className="row">
        <input
          type="number"
          placeholder="Page Number"
          value={book.pages}
          onChange={(e) => onChange("pages", Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="Script"
          value={book.script}
          onChange={(e) => onChange("script", e.target.value)}
        />
      </div>

      <div className="row">
        <input
          type="text"
          placeholder="Publish Date"
          value={book.publish_date}
          onChange={(e) => onChange("publish_date", e.target.value)}
        />
        <input
          type="text"
          placeholder="ISBN"
          value={book.isbn}
          onChange={(e) => onChange("isbn", e.target.value)}
        />
      </div>

      <input
        type="text"
        placeholder="Cover Image URL"
        value={book.cover_image_url}
        onChange={(e) => onChange("cover_image_url", e.target.value)}
      />

      <div className="photo-preview">
        <img
          src={
            book.cover_image_url ||
            "https://via.placeholder.com/400x600?text=Korice"
          }
          alt="Book Cover"
        />
      </div>

      <div className="genres">
        {genres.map((genre) => (
          <label key={genre.id}>
            <input
              type="checkbox"
              checked={selectedGenreIds.includes(genre.id)}
              onChange={() => onToggleGenre(genre.id)}
            />
            <span>{genre.name}</span>
          </label>
        ))}
      </div>

      <button onClick={onSubmit}>Save changes</button>
    </section>
  );
}
