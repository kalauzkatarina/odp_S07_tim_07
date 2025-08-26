import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { booksApi } from "../../api_services/book_api/BooksApiService";
import { useNavigate } from "react-router-dom";
import type { GenreDto } from "../../models/genres/GenreDto";
import { genresApi } from "../../api_services/genre_api/GenresApiService";

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
      alert("Morate biti ulogovani kao urednik da biste dodali knjigu!");
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
      alert("✅ Knjiga uspješno dodana!");
      navigate(`/books/${created.id}`);
    } else {
      alert("❌ Greška pri dodavanju knjige!");
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">➕ Dodaj novu knjigu</h1>

      <div className="flex flex-col gap-4 max-w-lg">
        <input
          type="text"
          placeholder="Naslov"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Autor"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Opis / sažetak"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Format (npr. A5, PDF, eBook...)"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Broj strana"
          value={pages}
          onChange={(e) => setPages(Number(e.target.value))}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Pismo (latinica, ćirilica...)"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Povez (meki, tvrdi...)"
          value={binding}
          onChange={(e) => setBinding(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Datum izdanja"
          value={publishDate}
          onChange={(e) => setPublishDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="URL slike korica"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          className="border p-2 rounded"
        />

        <div className="p-4 border rounded-lg bg-gray-50">
          <h2 className="font-semibold mb-2">Žanrovi:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {genres.map((genre) => (
              <label
                key={genre.id}
                className="flex items-center gap-2 cursor-pointer w-full"
              >
                <input
                  type="checkbox"
                  checked={selectedGenreIds.includes(genre.id)}
                  onChange={() => handleGenreToggle(genre.id)}
                  className="w-5 h-5 accent-pink-600 align-middle"
                />
                <span>{genre.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Dodaj knjigu
        </button>
      </div>
    </main>
  );
}