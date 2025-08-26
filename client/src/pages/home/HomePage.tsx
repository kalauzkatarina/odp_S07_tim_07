import { useEffect, useState, useContext, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { booksApi } from "../../api_services/book_api/BooksApiService";
import AuthContext from "../../contexts/auth_context/AuthContext";
import type { BookDto } from "../../models/books/BookDto";
import styles from './HomePage.module.css';

type TabType = "bestsellers" | "new" | "recommended" | "allBooks" | "login";

const HomePage: FC = () => {
    const [topViewed, setTopViewed] = useState<BookDto[]>([]);
    const [newBooks, setNewBooks] = useState<BookDto[]>([]);
    const [recommended, setRecommended] = useState<BookDto[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>("bestsellers");
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const top = await booksApi.getTopViewed(6);
                setTopViewed(Array.isArray(top) ? top : []);
                const all = await booksApi.getAllBooks();
                setNewBooks(all.slice(-6).reverse());
                setRecommended(all.slice(0, 6));
            } catch (error) {
                console.error("Greška pri fetchovanju knjiga:", error);
            }
        };
        fetchData();
    }, []);

    const renderBooks = (books: BookDto[]) => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
            {books.map(book => (
                <div key={book.id} className="border rounded-lg shadow hover:shadow-lg transition p-3 bg-white">
                    <img
                        src={book.cover_image_url}
                        alt={book.title}
                        className="h-56 w-full object-cover mb-3 rounded"
                    />
                    <h3 className="font-bold text-sm">{book.title}</h3>
                    <p className="text-xs text-gray-600">{book.author}</p>
                    <Link
                        to={`/books/${book.id}`}
                        className="text-blue-600 hover:underline text-xs"
                    >
                        Detalji
                    </Link>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Header */}
            <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
                <h1 className="text-2xl font-bold text-gray-800">📚 Digitalni katalog</h1>
            </header>

            {/* Tabs */}
            <div className={styles.homeContainer}>
                <div className={styles.tabs}>

                    <label
                        className={styles.tab}
                        onClick={() => setActiveTab("bestsellers")}
                    >
                        Bestselleri
                    </label>

                    <label
                        className={styles.tab}
                        onClick={() => setActiveTab("new")}
                    >
                        Novi naslovi
                    </label>

                    <label
                        className={styles.tab}
                        onClick={() => setActiveTab("recommended")}
                    >
                        Ne sudi knjigu po koricama
                    </label>

                    <label
                        className={styles.tab}
                        onClick={() => {
                            setActiveTab("allBooks");
                            navigate("/books");
                        }}
                    >
                        Pregledaj sve knjige
                    </label>

                    <label className={styles.tab} onClick={() => setActiveTab("login")}>
                        <Link
                            to={auth?.user ? "/user" : "/login"}
                            className="w-full h-full flex items-center justify-center"
                        >
                            {auth?.user ? auth.user.username : "Login"}
                        </Link>
                    </label>

                    <span
                        className={styles.glider}
                        style={{
                            transform: `translateX(${activeTab === "bestsellers"
                                    ? 0
                                    : activeTab === "new"
                                        ? 100
                                        : activeTab === "recommended"
                                            ? 200
                                            : activeTab === "allBooks"
                                                ? 300
                                                : 400
                                }%)`,
                        }}
                    />
                </div>
            </div>

            {/* Content */}
            <main className="flex-1 px-6 mt-4">
                {activeTab === "bestsellers" && renderBooks(topViewed)}
                {activeTab === "new" && renderBooks(newBooks)}
                {activeTab === "recommended" && renderBooks(recommended)}
                {activeTab === "login" && (
                    <div className="mt-6 text-center text-gray-700">
                        {auth?.user
                            ? `Dobrodošao, ${auth.user.username}!`
                            : "Kliknite Login za pristup korisničkoj stranici."}
                    </div>
                )}
                {activeTab === "allBooks" && (
                    <div className="mt-6 text-center">
                        <Link
                            to="/books"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            📖 Pogledaj sve knjige
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;
