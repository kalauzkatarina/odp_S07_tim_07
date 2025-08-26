import { useEffect, useState } from "react";
import type { BookDto } from "../../models/books/BookDto";
import { booksApi } from "../../api_services/book_api/BooksApiService";
import { Link, useNavigate } from "react-router-dom";
import TabsBar from "../tabsbar/TabsBar";

type TabType = "bestsellers" | "new" | "recommended" | "allBooks" | "login";

export default function BooksPage() {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<BookDto[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("allBooks");
  const navigate = useNavigate();

  useEffect(() => {
    booksApi.getAllBooks().then(setBooks);
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(books);
    } else {
      setFiltered(
        books.filter(
          (b) =>
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.author.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [books, search]);

  const handleTabChange = (tab: TabType) => {
    // Ignorišemo tabove koji nisu podržani na ovoj stranici
    if (tab !== "allBooks") {
      navigate("/");
      return;
    }
    setActiveTab(tab);
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">📚 Katalog knjiga</h1>

      <TabsBar activeTab={activeTab} onTabChange={handleTabChange} />

      <input
        type="text"
        placeholder="Pretraga po naslovu ili autoru"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full max-w-lg mb-4 mt-4"
      />

      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map((book) => (
          <div
            key={book.id}
            className="border rounded-xl shadow p-4 bg-white hover:shadow-lg transition"
          >
            <img
              src={book.cover_image_url}
              alt={book.title}
              className="w-full h-48 object-cover rounded mb-3"
            />
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p className="text-gray-600">{book.author}</p>
            <p className="text-sm mt-2">{book.summary.slice(0, 100)}...</p>
            <Link to={`/books/${book.id}`} className="text-blue-600 mt-2 inline-block">
              Detalji →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
