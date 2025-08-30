import { useEffect, useState, useContext } from "react";
import { booksApi } from "../../api_services/bookApi/BooksApiService";
import { featuredBooksApi } from "../../api_services/featuredBooksApi/FeaturedBooksApiService";
import AuthContext from "../../contexts/auth_context/AuthContext";
import type { BookDto } from "../../models/books/BookDto";
import TabsBar from "../../components/homePage/TabsBar";
import type { GenreDto } from "../../models/genres/GenreDto";
import { genresApi } from "../../api_services/genreApi/GenresApiService";
import "./HomePage.css";
import BooksList from "../../components/homePage/BooksList";
import SearchAndFilter from "../../components/homePage/SearchAndFilter";
import RecommendedSection from "../../components/homePage/RecommendedSection";
import AddBookForm from "../../components/addBook/AddBookForm";
import type { CommentDto } from "../../models/comments/CommentDto";
import { commentsApi } from "../../api_services/commentApi/CommentsApiService";
import { BookDetailsForm } from "../../components/bookDetailsForm/BookDetailsForm";
import { AuthForm } from "../../components/auth/AuthForm";
import type { IAuthAPIService } from "../../api_services/authApi/IAuthAPIService";
import { UserForm } from "../../components/userProfile/UserProfile";
import { usersApi } from "../../api_services/userApi/UsersAPIService";
import { favoriteBooksApi } from "../../api_services/favoriteBookApi/FavoriteBooksApiService";
import type { FavoriteBooksDto } from "../../models/favoriteBooks/FavoriteBooksDto";
import BookImageGrid from "../../components/homePage/BookImageGrid";

type TabType = "bestsellers" | "new" | "recommended" | "allBooks" | "login";

const HomePage = ({ authApi }: { authApi: IAuthAPIService }) => {
  const [topViewed, setTopViewed] = useState<BookDto[]>([]);
  const [newBooks, setNewBooks] = useState<BookDto[]>([]);
  const [recommended, setRecommended] = useState<BookDto[]>([]);
  const [allBooks, setAllBooks] = useState<BookDto[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("bestsellers");
  const [isEditing, setIsEditing] = useState(false);
  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | "">("");
  const [showForm, setShowForm] = useState(false);
  const [selectedBookDetails, setSelectedBookDetails] = useState<BookDto | null>(null);
  const [bookDetailsComments, setBookDetailsComments] = useState<CommentDto[]>([]);
  const [newComment, setNewComment] = useState("");

  const [favoriteBooks, setFavoriteBooks] = useState<FavoriteBooksDto[]>(() => {
    const stored = localStorage.getItem("favoriteBooks");
    return stored ? JSON.parse(stored) : [];
  });
  const auth = useContext(AuthContext);
  const [localUser, setLocalUser] = useState(auth!.user);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!auth?.token || !auth.user) return;

      try {
        const favs = await favoriteBooksApi.getFavoriteBooksByUserId(auth.token, auth.user.id);

        setFavoriteBooks(favs);
        localStorage.setItem("favoriteBooks", JSON.stringify(favs));
      } catch (err) {
        console.error("Failed to fetch favorites", err);
      }
    };

    fetchFavorites();
  }, [auth?.token, auth?.user]);

  useEffect(() => {
    if (auth?.user) {
      setLocalUser(auth.user);
    }
  }, [auth?.user]);

  useEffect(() => {
    const fetchFullUser = async () => {
      if (auth?.user && auth?.token) {
        const fullUser = await usersApi.getUserById(auth.token, auth.user.id);
        setLocalUser(fullUser);
      }
    };
    fetchFullUser();
  }, [auth?.user, auth?.token]);

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

  const refreshFavorites = async () => {
    if (!auth?.token || !auth.user) return;
    try {
      const favs = await favoriteBooksApi.getFavoriteBooksByUserId(auth.token, auth.user.id);
      setFavoriteBooks(favs);
      localStorage.setItem("favoriteBooks", JSON.stringify(favs));
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
  };

  useEffect(() => {
    if (auth?.user) {
      setFavoriteBooks([]);
      refreshFavorites();
    } else {
      setFavoriteBooks([]);
      localStorage.removeItem("favoriteBooks");
    }
  }, [auth?.user, auth?.token]);

  const handleClickBook = async (bookId: number) => {
    try {
      const found = await booksApi.getBookById(bookId);
      if (found && found.id !== 0) {
        setSelectedBookDetails(found);
        await booksApi.incrementViews(found.id);
        const comments = await commentsApi.getAllCommentsByBook(found.id);
        setBookDetailsComments(comments);
      }
    } catch (error) {
      console.error("Failed to fetch book details:", error);
    }
  };

  const handleBookAdded = (newBook: BookDto) => {
    setAllBooks((prev) => [...prev, newBook]);
  };

  const handleBookUpdated = (updatedBook: BookDto) => {
    setAllBooks((prev) =>
      prev.map((b) => (b.id === updatedBook.id ? updatedBook : b))
    );

    setTopViewed((prev) =>
      prev.map((b) => (b.id === updatedBook.id ? updatedBook : b))
    );

    setNewBooks((prev) =>
      prev.map((b) => (b.id === updatedBook.id ? updatedBook : b))
    );

    setRecommended((prev) =>
      prev.map((b) => (b.id === updatedBook.id ? updatedBook : b))
    );

    setSelectedBookDetails(updatedBook);
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

  const handleToggleFavorite = async (book: BookDto) => {
    if (!auth?.token || !auth.user) {
      alert("You have to be logged in to bookmark a book!");
      return;
    }

    try {
      const existingFav = favoriteBooks.find(f => f.book.id === book.id);

      let updatedFavorites: FavoriteBooksDto[];

      if (existingFav) {
        await favoriteBooksApi.removeFavoriteBook(auth.token, book.id, auth.user.id);
        updatedFavorites = favoriteBooks.filter(f => f.book.id !== book.id);
      } else {
        const added = await favoriteBooksApi.addFavoriteBook(auth.token, book.id, auth.user.id);
        updatedFavorites = added ? [...favoriteBooks, added] : favoriteBooks;
      }

      setFavoriteBooks(updatedFavorites);
      localStorage.setItem("favoriteBooks", JSON.stringify(updatedFavorites));
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };


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
          <BooksList
            books={topViewed}
            onClick={handleClickBook}
            onToggleFavorite={handleToggleFavorite}
            favoriteBooks={favoriteBooks.map(f => f.book)}
          />
        )}
        {activeTab === "new" && (
          <BooksList
            books={newBooks}
            onClick={handleClickBook}
            onToggleFavorite={handleToggleFavorite}
            favoriteBooks={favoriteBooks.map(f => f.book)}
          />
        )}
        {activeTab === "recommended" && (
          <RecommendedSection
            books={recommended}
            isEditing={isEditing}
            onToggleEdit={() => setIsEditing((prev) => !prev)}
            onRemove={async (bookId) => {
              if (!auth?.token) return;
              try {
                await featuredBooksApi.removeFeaturedBook(auth.token, bookId);
                setRecommended((prev) => prev.filter((b) => b.id !== bookId));
              } catch (err) {
                console.error(err);
              }
            }}
            isEditor={auth?.user?.role === "editor"}
            onClickBook={handleClickBook}
          />
        )}

        {isEditing && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="select-for-featured" >Select Books for Featured</h2>
              <BookImageGrid
                books={allBooks}
                featuredBooks={recommended}
                onToggleFeatured={async (book) => {
                  if (!auth?.token || !auth.user) return;

                  const isAlreadyFeatured = recommended.some((b) => b.id === book.id);

                  try {
                    if (isAlreadyFeatured) {
                      await featuredBooksApi.removeFeaturedBook(auth.token, book.id);
                      setRecommended((prev) => prev.filter((b) => b.id !== book.id));
                    } else {
                      if (recommended.length >= 5) {
                        alert("You have to delete a book before you add a new book.");
                        return;
                      }

                      const added = await featuredBooksApi.addFeaturedBook(auth.token, book.id, auth.user.id);
                      if (added) {
                        setRecommended((prev) => [...prev, book]);
                      }
                    }
                  } catch (err) {
                    console.error("Failed to toggle featured book:", err);
                  }
                }}
              />
              <button className="btnCloseRecommended" onClick={() => setIsEditing(false)}>Close</button>
            </div>
          </div>
        )}

        {activeTab === "login" && (
          <>
            {!auth?.user ? (
              <AuthForm authApi={authApi} />
            ) : (
              <div className="user-profile">
                {activeTab === "login" && auth?.user && (
                  <UserForm
                    username={localUser?.username ?? ""}
                    email={localUser?.email ?? ""}
                    onSave={async (updatedUser) => {
                      if (!auth.token || !auth.user) return;
                      const newUser = await usersApi.updateUser(auth.token, auth.user.id, updatedUser);
                      if (newUser) setLocalUser(newUser);
                    }}
                    favoriteBooks={favoriteBooks.map(f => f.book)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                )}
              </div>
            )}
          </>
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
            <BooksList
              books={genreFilteredBooks}
              onClick={handleClickBook}
              onToggleFavorite={handleToggleFavorite}
              favoriteBooks={favoriteBooks.map(f => f.book)}
            />
            {auth?.user?.role === "editor" && (
              <button onClick={() => setShowForm(true)} className="btnAdd">
                Add new book
              </button>
            )}
            {showForm && (
              <AddBookForm
                onClose={() => setShowForm(false)}
                onBookAdded={handleBookAdded}
              />
            )}
          </div>
        )}

        {selectedBookDetails && (
          <div className="modal-overlay">
            <div className="modal-content">
              <BookDetailsForm
                book={selectedBookDetails}
                editable={auth?.user?.role === "editor"}
                comments={bookDetailsComments}
                user={auth?.user}
                newComment={newComment}
                onNewCommentChange={setNewComment}
                onAddComment={async () => {
                  if (!auth?.user || !auth.token || !newComment.trim()) return;
                  const created = await commentsApi.createComment(
                    newComment,
                    selectedBookDetails.id,
                    auth.user.id,
                    auth.token
                  );
                  if (created.id !== 0) {
                    const refreshed = await commentsApi.getAllCommentsByBook(
                      selectedBookDetails.id
                    );
                    setBookDetailsComments(refreshed);
                    setNewComment("");
                  }
                }}
                onDeleteComment={async (commentId) => {
                  if (!auth?.user || !auth.token) return;
                  const confirmed = confirm(
                    "Are you sure you want to delete this comment?"
                  );
                  if (!confirmed) return;
                  const success = await commentsApi.deleteComment(
                    auth.token,
                    commentId
                  );
                  if (success) {
                    setBookDetailsComments((prev) =>
                      prev.filter((c) => c.id !== commentId)
                    );
                  }
                }}
                onDeleteBook={async () => {
                  if (!auth?.user || !auth.token) return;
                  const confirmed = confirm(
                    `Are you sure you want to delete "${selectedBookDetails.title}"?`
                  );
                  if (!confirmed) return;
                  const success = await booksApi.deleteBook(
                    auth.token,
                    selectedBookDetails.id
                  );
                  if (success) {
                    setAllBooks((prev) =>
                      prev.filter((b) => b.id !== selectedBookDetails.id)
                    );
                    setSelectedBookDetails(null);
                  }
                }}
                onEditBook={handleBookUpdated}
              />
              <button
                className="btn-close"
                onClick={() => setSelectedBookDetails(null)}
              >
                × Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
