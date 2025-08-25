import { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { booksApi } from "../../api_services/book_api/BooksApiService";
import { useNavigate } from "react-router-dom";

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
  const [genreIds, setGenreIds] = useState<number[]>([]);

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
      genreIds
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

        <input
          type="text"
          placeholder="Žanrovi (unesi ID-jeve odvojene zarezom)"
          onChange={(e) =>
            setGenreIds(
              e.target.value
                .split(",")
                .map((id) => parseInt(id.trim()))
                .filter((id) => !isNaN(id))
            )
          }
          className="border p-2 rounded"
        />

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
