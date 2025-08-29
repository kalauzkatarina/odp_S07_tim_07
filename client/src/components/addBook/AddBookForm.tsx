import { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { GenreDto } from "../../models/genres/GenreDto";
import { genresApi } from "../../api_services/genreApi/GenresApiService";
import { booksApi } from "../../api_services/bookApi/BooksApiService";
import "./AddBookForm.css";
import type { BookDto } from "../../models/books/BookDto";
import { validateBookData } from "../../api_services/validators/books/ValidateBookData";

interface AddBookFormProps {
  onClose: () => void;
  onBookAdded: (book: BookDto) => void;
}

export default function AddBookForm({ onClose, onBookAdded }: AddBookFormProps) {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [format, setFormat] = useState("");
  const [pages, setPages] = useState(0);
  const [script, setScript] = useState("");
  const [binding, setBinding] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [isbn, setIsbn] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);

  useState(() => {
    const fetchGenres = async () => {
      const data = await genresApi.getAllGenres();
      setGenres(data);
    };
    fetchGenres();
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverImageUrl(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenreIds((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleSubmit = async () => {
    if (!token) {
      alert("You have to be logged in as the Editor to add a new book!");
      return;
    }
    const validation = validateBookData({
      title,
      author,
      summary,
      format,
      pages,
      script,
      binding,
      publish_date: publishDate,
      isbn,
      cover_image_url: coverImageUrl
    });

    if (!validation.success) {
      alert(validation.message);
      return;
    }

    const created = await booksApi.createBook(
      token,
      title,
      author,
      summary,
      format,
      pages,
      script,
      binding,
      publishDate,
      isbn,
      coverImageUrl,
      selectedGenreIds
    );

    if (created.id !== 0) {
      alert("Book successfully added!");
      onBookAdded(created);
      onClose();
    } else {
      alert("Error while adding a new book!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✕</button>

        {coverImageUrl && (
          <div className="photo-preview">
            <img src={coverImageUrl} alt="Book Cover Preview" />
          </div>
        )}

        <h2 className="add-new-book">Add new Book</h2>

        <div className="row">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={e => setAuthor(e.target.value)}
          />
        </div>

        <textarea
          placeholder="Summary"
          value={summary}
          onChange={e => setSummary(e.target.value)}
        />

        <div className="row">
          <input
            type="text"
            placeholder="Format"
            value={format}
            onChange={e => setFormat(e.target.value)}
          />
          <input
            type="text"
            placeholder="Binding"
            value={binding}
            onChange={e => setBinding(e.target.value)}
          />
        </div>

        <div className="row">
          <input
            type="number"
            placeholder="Pages"
            value={pages}
            onChange={e => setPages(Number(e.target.value))}
          />
          <input
            type="text"
            placeholder="Script"
            value={script}
            onChange={e => setScript(e.target.value)}
          />
        </div>

        <div className="row">
          <input
            type="text"
            placeholder="Publish Date"
            value={publishDate}
            onChange={e => setPublishDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="ISBN"
            value={isbn}
            onChange={e => setIsbn(e.target.value)}
          />
        </div>

        <label className="file-input-label">
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>

        <div className="genres">
          {genres.map((genre) => (
            <label key={genre.id}>
              <input
                className="chbx"
                type="checkbox"
                checked={selectedGenreIds.includes(genre.id)}
                onChange={() => handleGenreToggle(genre.id)}
              />
              <span>{genre.name}</span>
            </label>
          ))}
        </div>

        <div className="row">
          <button className="btn-add-book" onClick={handleSubmit}>Add Book</button>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>


  );
}
