import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { booksApi } from "../../api_services/bookApi/BooksApiService";
import { useNavigate } from "react-router-dom";
import type { GenreDto } from "../../models/genres/GenreDto";
import { genresApi } from "../../api_services/genreApi/GenresApiService";

import "./AddBookPage.css"; 

export default function AddBookPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchGenres = async () => {
      const data = await genresApi.getAllGenres();
      setGenres(data);
    };
    fetchGenres();
  }, []);

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenreIds((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleSubmit = async () => {
    if (!token) {
      alert("You have to be logged in/signed in as the Editor to add a new book!");
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
      alert("Book succesfully added!");
      navigate(`/books/${created.id}`);
    } else {
      alert("Error while adding a new book!");
    }
  };

  return (
    <main className="book-details">
      <section className="product product-add">
        <div className="product__photo photo-top">
          <div className="photo-container">
            <div className="photo-main">
              <img
                src={coverImageUrl || "https://via.placeholder.com/400x600?text=Korice"}
                alt="Book Cover"
              />
            </div>
          </div>
        </div>

        <div className="product__info info-bottom">
          <div className="title">
            <h1>Add new book</h1>
          </div>

          <div className="form-grid">
            <div className="row two-columns">
              <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
              <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
            </div>

            <textarea placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} />

            <input type="text" placeholder="Format" value={format} onChange={e => setFormat(e.target.value)} />
            <input type="text" placeholder="Binding" value={binding} onChange={e => setBinding(e.target.value)} />

            <input type="number" placeholder="Number of Pages" value={pages} onChange={e => setPages(Number(e.target.value))} />
            <input type="text" placeholder="Script" value={script} onChange={e => setScript(e.target.value)} />

            <input type="text" placeholder="Publish Date" value={publishDate} onChange={e => setPublishDate(e.target.value)} />
            <input type="text" placeholder="ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} />

            <input type="text" placeholder="Cover Image URL" value={coverImageUrl} onChange={e => setCoverImageUrl(e.target.value)} />

            <div className="genres">
              {genres.map(genre => (
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
          </div>


          <button className="btn-edit" onClick={handleSubmit}>Add Book</button>
        </div>
      </section>
    </main>



  );
}
