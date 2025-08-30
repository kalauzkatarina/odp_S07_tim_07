import { useEffect, useRef, useState } from "react";
import { booksApi } from "../../api_services/bookApi/BooksApiService";
import { genresApi } from "../../api_services/genreApi/GenresApiService";
import type { BookDto } from "../../models/books/BookDto";
import type { GenreDto } from "../../models/genres/GenreDto";
import { useAuth } from "../../hooks/auth/useAuthHook";

import "./EditBookForm.css";
import { validateBookData } from "../../api_services/validators/books/ValidateBookData";

interface BookEditFormProps {
  bookId: number;
  onSave: (updatedBook: BookDto) => void;
  onCancel: () => void;
}

export function BookEditForm({ bookId, onSave, onCancel }: BookEditFormProps) {
  const { token } = useAuth();
  const [book, setBook] = useState<BookDto | null>(null);
  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [isClosing, setIsClosing] = useState(false);


  const fileInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const bookData = await booksApi.getBookById(bookId);
      setBook(bookData);
      setCoverPreview(bookData.cover_image_url || "");
      setSelectedGenreIds(bookData.genres.map((g) => g.id));
      const allGenres = await genresApi.getAllGenres();
      setGenres(allGenres);
    };
    fetchData();
  }, [bookId]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onCancel();
    }, 300); 
  };


  const handleGenreToggle = (genreId: number) => {
    setSelectedGenreIds((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const handleChange = (field: keyof BookDto, value: any) => {
    if (book) setBook({ ...book, [field]: value });
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
        setBook((prev) => prev && { ...prev, cover_image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!token || !book) {
      alert("You need to be logged in as the Editor!");
      return;
    }
    const validation = validateBookData({
      title: book.title,
      author: book.author,
      summary: book.summary,
      format: book.format,
      pages: book.pages,
      script: book.script,
      binding: book.binding,
      publish_date: book.publish_date,
      isbn: book.isbn,
      cover_image_url: book.cover_image_url
    });

    if (!validation.success) {
      alert(validation.message);
      return;
    }

    const updatedGenres = genres
      .filter((g) => selectedGenreIds.includes(g.id))
      .map((g) => ({ id: g.id, name: g.name }));

    const updated = await booksApi.updateBook(token, book.id, {
      title: book.title,
      author: book.author,
      summary: book.summary,
      format: book.format,
      pages: book.pages,
      script: book.script,
      binding: book.binding,
      publish_date: book.publish_date,
      isbn: book.isbn,
      cover_image_url: book.cover_image_url,
      genres: updatedGenres
    });

    if (updated.id !== 0) {
      alert("Book successfully edited!");
      onSave(updated);
    } else {
      alert("Error while editing the book!");
    }
  };


  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (!book) return <p className="loading-text">Reading the book...</p>;

  return (
    <section className={`book-card ${isClosing ? "fade-out" : ""}`}>
      {coverPreview && (
        <div className="photo-preview">
          <img src={coverPreview} alt="Book Cover Preview" />
        </div>
      )}

      <h2 className="edit-book-header">Edit the Book</h2>

      <div className="row">
        <input
          type="text"
          placeholder="Title"
          value={book.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          value={book.author}
          onChange={(e) => handleChange("author", e.target.value)}
        />
      </div>

      <textarea
        placeholder="Summary"
        value={book.summary}
        onChange={(e) => handleChange("summary", e.target.value)}
      />

      <div className="row">
        <input
          type="text"
          placeholder="Format"
          value={book.format}
          onChange={(e) => handleChange("format", e.target.value)}
        />
        <input
          type="text"
          placeholder="Binding"
          value={book.binding}
          onChange={(e) => handleChange("binding", e.target.value)}
        />
      </div>

      <div className="row">
        <input
          type="number"
          placeholder="Pages"
          value={book.pages}
          onChange={(e) => handleChange("pages", Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="Script"
          value={book.script}
          onChange={(e) => handleChange("script", e.target.value)}
        />
      </div>

      <div className="row">
        <input
          type="text"
          placeholder="Publish Date"
          value={book.publish_date}
          onChange={(e) => handleChange("publish_date", e.target.value)}
        />
        <input
          type="text"
          placeholder="ISBN"
          value={book.isbn}
          onChange={(e) => handleChange("isbn", e.target.value)}
        />
      </div>

      <div className="upload-cover-wrapper">
        <button type="button" className="upload-btn" onClick={handleUploadClick}>
          Upload Cover
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleCoverChange}
        />
      </div>


      <div className="genres-edit-book">
        {genres.map((genre) => (
          <label key={genre.id}>
            <input
              type="checkbox"
              checked={selectedGenreIds.includes(genre.id)}
              onChange={() => handleGenreToggle(genre.id)}
            />
            <span>{genre.name}</span>
          </label>
        ))}
      </div>

      <div className="row">
        <button className="save-btn" onClick={handleSubmit}>Save changes</button>
        <button className="cancel-btn" onClick={handleClose}>Cancel</button>
      </div>
    </section>
  );
}
