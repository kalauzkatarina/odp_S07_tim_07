import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { booksApi } from "../../api_services/book_api/BooksApiService";
import AuthContext from "../../contexts/auth_context/AuthContext";
import type { BookDto } from "../../models/books/BookDto";

import TabsBar from "../tabsbar/TabsBar";
import "./Cards.css"

type TabType = "bestsellers" | "new" | "recommended" | "allBooks" | "login";

const HomePage = () => {
  const [topViewed, setTopViewed] = useState<BookDto[]>([]);
  const [newBooks, setNewBooks] = useState<BookDto[]>([]);
  const [recommended, setRecommended] = useState<BookDto[]>([]);
  const [allBooks, setAllBooks] = useState<BookDto[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("bestsellers");
  const navigate = useNavigate();

  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const top = await booksApi.getTopViewed(6);
        setTopViewed(Array.isArray(top) ? top : []);

        const all = await booksApi.getAllBooks();
        setAllBooks(all);
        setNewBooks(all.slice(-6).reverse());
        setRecommended(all.slice(0, 6));
      } catch (error) {
        console.error("Greška pri fetchovanju knjiga:", error);
      }
    };
    fetchData();
  }, []);

   const handleClick = (bookId: number) => {
    navigate(`/books/${bookId}`);
  };

  const filteredBooks =
    search.trim() === ""
      ? allBooks
      : allBooks.filter(
        (b) =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.author.toLowerCase().includes(search.toLowerCase())
      );

  const renderBooks = (books: BookDto[]) => (
    <ul className="cards">
      {books.map((book) => (
        <li key={book.id} className="cards__item">
          <div className="card">
            <div
              className="card__image"
              style={{ backgroundImage: `url(${book.cover_image_url})` }}
            ></div>
            <div className="card__content">
              <div className="card__title">{book.title}</div>
              <p className="card__text">{book.author}</p>
              <p className="card__text">
                {book.summary ? book.summary.slice(0, 100) + "..." : ""}
              </p>
              <button
                onClick={() => handleClick(book.id)}
                className="mt-4 px-4 py-2 border-2 border-[#704141] text-[#704141] font-semibold rounded hover:bg-[#704141] hover:text-white transition"
              >
                Detalji
              </button>

            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-gray-800">
          Bukvarijum
        </h1>
      </header>

      {/* TabsBar */}
      <div className="sticky top-0 bg-white z-10 shadow px-6 py-2">
        <TabsBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-4">
        {activeTab === "bestsellers" && renderBooks(topViewed)}
        {activeTab === "new" && renderBooks(newBooks)}
        {activeTab === "recommended" && renderBooks(recommended)}

        {activeTab === "login" && (
          <div className="mt-4 text-center text-gray-700">
            {auth?.user
              ? `Dobrodošao, ${auth.user.username}!`
              : "Kliknite Login za pristup korisničkoj stranici."}
          </div>
        )}

        {activeTab === "allBooks" && (
          <div>
            <input
              type="text"
              placeholder="Pretraga po naslovu ili autoru"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded w-full max-w-lg mb-4 p-2"
            />
            {renderBooks(filteredBooks)}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
