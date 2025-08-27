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
                className="btn btn-outline btn-details"
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
        console.warn(
          "API nije vratio book objekat unutar FeaturedBookDto, dodajemo book iz allBooks"
        );
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
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Bukvarijum</h1>
      </header>

      <div className="tabs-sticky">
        <TabsBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <main className="app-main">
        {activeTab === "bestsellers" && renderBooks(topViewed)}
        {activeTab === "new" && renderBooks(newBooks)}

        {activeTab === "recommended" && (
          <section ref={recommendedRef} className="section">
            <div className="row between center mb-4">
              {auth?.user?.role === "editor" && (
                <button
                  className={`btn btn-primary btn-edit`}
                  onClick={() => {
                    if (isEditing) {
                      recommendedRef.current?.scrollIntoView({
                        behavior: "smooth",
                      });
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
                <li key={book.id} className="cards__item card-item-relative">
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
                        className="btn btn-outline btn-details"
                      >
                        Detalji
                      </button>
                    </div>
                  </div>

                  {isEditing && (
                    <button
                      className="btn btn-danger btn-remove-featured"
                      onClick={() => handleRemoveFeatured(book.id)}
                      aria-label="Ukloni iz featured"
                      title="Ukloni iz featured"
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {isEditing && (
              <div className="row gap-2 mt-4">
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(Number(e.target.value))}
                  className="select select-wide"
                >
                  <option value="">Izaberi knjigu</option>
                  {allBooks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-success btn-wide"
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
          <div className="mt-4 text-center text-muted">
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
              className="input input-full mb-4"
            />

            <div className="row gap-4 mb-4">
              <select
                value={selectedGenre}
                onChange={(e) =>
                  setSelectedGenre(Number(e.target.value) || "")
                }
                className="select select-wide"
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
                className="btn btn-blue btn-wide mt-4"
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
