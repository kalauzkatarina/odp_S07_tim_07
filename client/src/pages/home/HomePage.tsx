import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { booksApi } from "../../api_services/book_api/BooksApiService";
import { featuredBooksApi } from "../../api_services/featured_books/FeaturedBooksApiService";
import AuthContext from "../../contexts/auth_context/AuthContext";
import type { BookDto } from "../../models/books/BookDto";
import TabsBar from "../tabsbar/TabsBar";
import "./Cards.css";
import type { GenreDto } from "../../models/genres/GenreDto";
import { genresApi } from "../../api_services/genre_api/GenresApiService";

type TabType = "bestsellers" | "new" | "recommended" | "allBooks" | "login";

const HomePage = () => {
  const [topViewed, setTopViewed] = useState<BookDto[]>([]);
  const [newBooks, setNewBooks] = useState<BookDto[]>([]);
  const [recommended, setRecommended] = useState<BookDto[]>([]);
  const [allBooks, setAllBooks] = useState<BookDto[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("bestsellers");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | "">("");
  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | "">("");

  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const recommendedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const top = await booksApi.getTopViewed(6);
        setTopViewed(Array.isArray(top) ? top : []);

        const all = await booksApi.getAllBooks();
        setAllBooks(all);
        setNewBooks(all.slice(-6).reverse());

        const allGenres = await genresApi.getAllGenres();
        setGenres(allGenres);

        const featured = await featuredBooksApi.getAllFeaturedBooks();
        setRecommended(featured.slice(0, 5));
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

  const genreFilteredBooks =
    selectedGenre === ""
      ? filteredBooks
      : filteredBooks.filter((b) =>
        b.genres?.some((g) => g.id === selectedGenre)
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

  const handleRemoveFeatured = async (bookId: number) => {
    if (!auth?.token) return;
    try {
      await featuredBooksApi.removeFeaturedBook(auth.token, bookId);
      setRecommended((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err) {
      console.error("Greška pri uklanjanju featured knjige:", err);
    }
  };

  const handleAddFeatured = async () => {
    if (!auth?.token || !auth.user || !selectedBookId) return;

    // Provera da li je knjiga već u recommended
    if (recommended.some((b) => b.id === selectedBookId)) {
      alert("Ova knjiga je već u recommended sekciji!");
      return;
    }

    try {
      const newFeatured = await featuredBooksApi.addFeaturedBook(
        auth.token,
        selectedBookId,
        auth.user.id
      );

      if (newFeatured.book) {
        setRecommended((prev) => [...prev, newFeatured.book]);
        setSelectedBookId("");
      } else {
        console.warn("API nije vratio book objekat unutar FeaturedBookDto, dodajemo book iz allBooks");
        const book = allBooks.find((b) => b.id === selectedBookId);
        if (book) {
          setRecommended((prev) => [...prev, book]);
          setSelectedBookId("");
        }
      }

      setSelectedBookId("");
      recommendedRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Greška pri dodavanju featured knjige:", err);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-gray-800">Bukvarijum</h1>
      </header>

      <div className="sticky top-0 bg-white z-10 shadow px-6 py-2">
        <TabsBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <main className="flex-1 px-6 pt-4">
        {activeTab === "bestsellers" && renderBooks(topViewed)}
        {activeTab === "new" && renderBooks(newBooks)}

        {activeTab === "recommended" && (
          <section ref={recommendedRef} className="my-8 p-4 bg-white shadow rounded">
            <div className="flex justify-between items-center mb-4">
              {auth?.user?.role === "editor" && (
                <button
                  className="bg-blue-500 text-white rounded text-xs"
                  style={{ width: "150px", height: "42px" }}
                  onClick={() => {
                    if (isEditing) {
                      recommendedRef.current?.scrollIntoView({ behavior: "smooth" });
                    }
                    setIsEditing(!isEditing);
                  }}
                >
                  {isEditing ? "Završi" : "Uredi"}
                </button>
              )}
            </div>

            <ul className="cards">
              {recommended.map((book) => (
                <li key={book.id} className="cards__item relative">
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

                  {isEditing && (
                    <button
                      className="absolute top-1 right-1 w-5 h-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center"
                      style={{ width: "250px", height: "42px" }}
                      onClick={() => handleRemoveFeatured(book.id)}
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {isEditing && (
              <div className="mt-4 flex gap-2 items-center">
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(Number(e.target.value))}
                  className="border p-2 rounded"
                  style={{ width: "250px", height: "42px" }}
                >
                  <option value="">Izaberi knjigu</option>
                  {allBooks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title}
                    </option>
                  ))}
                </select>
                <button
                  className="inline-flex items-center justify-center px-2 py-1 text-xs bg-green-500 text-white rounded"
                  style={{ width: "250px", height: "42px" }}
                  onClick={handleAddFeatured}
                  disabled={!selectedBookId}
                >
                  Dodaj novu featured knjigu
                </button>
              </div>
            )}
          </section>
        )}

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

            <div className="mb-4 flex gap-4 items-center">

              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(Number(e.target.value) || "")}
                className="w-64 h-10 border rounded p-2"
                style={{ width: "250px", height: "42px" }}

              >
                <option value="">Svi žanrovi</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>

            </div>

            {renderBooks(genreFilteredBooks)}

            {auth?.user?.role === "editor" && (
              <button
                onClick={() => navigate("/books/add")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                style={{ width: "250px", height: "42px" }}
              >
                Dodaj novu knjigu
              </button>
            )}

          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
