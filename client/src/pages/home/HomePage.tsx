import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { booksApi } from "../../api_services/bookApi/BooksApiService";
import { featuredBooksApi } from "../../api_services/featuredBooksApi/FeaturedBooksApiService";
import AuthContext from "../../contexts/auth_context/AuthContext";
import type { BookDto } from "../../models/books/BookDto";
import TabsBar from "../tabsbar/TabsBar";
import type { GenreDto } from "../../models/genres/GenreDto";
import { genresApi } from "../../api_services/genreApi/GenresApiService";
import "./HomePage.css";
import BooksList from "../../components/homePage/BooksList";
import SearchAndFilter from "../../components/homePage/SearchAndFilter";
import RecommendedSection from "../../components/homePage/RecommendedSection";
import AddBookForm from "../../components/addBook/AddBookForm";

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
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const top = await booksApi.getTopViewed(3);
        setTopViewed(Array.isArray(top) ? top : []);

        const all = await booksApi.getAllBooks();
        setAllBooks(all);
        setNewBooks(all.slice(-5).reverse());

        const allGenres = await genresApi.getAllGenres();
        setGenres(allGenres);

        const featured = await featuredBooksApi.getAllFeaturedBooks();
        setRecommended(featured.slice(0, 5));
      } catch (error) {
        console.error("Error while fetching the books:", error);
      }
    };
    fetchData();
  }, []);

  const handleClickBook = (bookId: number) => {
    navigate(`/books/${bookId}`);
  };

  const handleRemoveFeatured = async (bookId: number) => {
    if (!auth?.token) return;
    try {
      await featuredBooksApi.removeFeaturedBook(auth.token, bookId);
      setRecommended((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err) {
      console.error("Greška pri uklanjanju featured knjige:", err);
    }
  };

  const handleAddFeatured = async (bookId: number) => {
    if (!auth?.token || !auth.user) return;

    if (recommended.some((b) => b.id === bookId)) {
      alert("This book is already in the recommended section!");
      return;
    }

    if (recommended.length >= 5) {
      alert(`Max number of recommended books is ${5}. Remove one of the books first.`);
      return;
    }

    try {
      const newFeatured = await featuredBooksApi.addFeaturedBook(
        auth.token,
        bookId,
        auth.user.id
      );

      if (newFeatured.book) {
        setRecommended((prev) => [...prev, newFeatured.book].slice(0, 5));
      } else {
        const book = allBooks.find((b) => b.id === bookId);
        if (book) setRecommended((prev) => [...prev, book]);
      }

      setSelectedBookId("");
    } catch (err) {
      console.error("Error while adding featured books:", err);
    }
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

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Bookvarium</h1>
      </header>

      <div className="tabs-sticky">
        <TabsBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <main className="app-main">
        {activeTab === "bestsellers" && (
          <BooksList books={topViewed} onClick={handleClickBook} />
        )}
        {activeTab === "new" && (
          <BooksList books={newBooks} onClick={handleClickBook} />
        )}
        {activeTab === "recommended" && (
          <RecommendedSection
            books={recommended}
            allBooks={allBooks}
            isEditing={isEditing}
            onToggleEdit={() => setIsEditing((prev) => !prev)}
            onRemove={handleRemoveFeatured}
            onAdd={handleAddFeatured}
            selectedBookId={selectedBookId}
            setSelectedBookId={setSelectedBookId}
            isEditor={auth?.user?.role === "editor"}
            onClickBook={handleClickBook}
          />
        )}
        {activeTab === "login" && (
          <div className="spacing-mt text-muted text-center">
            {auth?.user
              ? `Welcome, ${auth.user.username}!`
              : "Click Login to access the user page."}
          </div>
        )}
        {activeTab === "allBooks" && (
          <div>
            <SearchAndFilter
              search={search}
              onSearchChange={setSearch}
              genres={genres}
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
            />
            <BooksList books={genreFilteredBooks} onClick={handleClickBook} />
            {auth?.user?.role === "editor" && (
              <button onClick={() => setShowForm(true)} className="btnAdd">
                Add new book
              </button>

            )}
            {showForm && <AddBookForm onClose={() => setShowForm(false)} />}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
