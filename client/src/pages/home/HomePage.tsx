import { useEffect, useState, useContext, type FC } from "react";
import { Link } from "react-router-dom";
import { booksApi } from "../../api_services/book_api/BooksApiService";
import AuthContext from "../../contexts/auth_context/AuthContext";
import type { BookDto } from "../../models/books/BookDto";
import './HomePage.css';

const HomePage: FC = () => {
    const [topViewed, setTopViewed] = useState<BookDto[]>([]);
    const [newBooks, setNewBooks] = useState<BookDto[]>([]);
    const [recommended, setRecommended] = useState<BookDto[]>([]);
    const [activeTab, setActiveTab] = useState<"bestsellers" | "new" | "recommended" | "login">("bestsellers");
    const auth = useContext(AuthContext);

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

            {/* Tabs + Login/User */}
            <div className="container mx-auto mt-6 flex justify-center">
                <div className="tabs relative">

                    <input type="radio" id="radio-1" name="tabs" checked={activeTab === "bestsellers"} onChange={() => setActiveTab("bestsellers")} />
                    <label className="tab" htmlFor="radio-1">Bestselleri</label>

                    <input type="radio" id="radio-2" name="tabs" checked={activeTab === "new"} onChange={() => setActiveTab("new")} />
                    <label className="tab" htmlFor="radio-2">Novi naslovi</label>

                    <input type="radio" id="radio-3" name="tabs" checked={activeTab === "recommended"} onChange={() => setActiveTab("recommended")} />
                    <label className="tab" htmlFor="radio-3">Ne sudi knjigu po koricama</label>

                    <input type="radio" id="radio-4" name="tabs" checked={activeTab === "login"} onChange={() => setActiveTab("login")} />
                    <label className="tab" htmlFor="radio-4">
                        <Link to={auth?.user ? "/user" : "/login"} className="w-full h-full flex items-center justify-center">
                            {auth?.user ? auth.user.username : "Login"}
                        </Link>
                    </label>

                    <span className="glider" />
                </div>
            </div>

            {/* Content */}
            <main className="flex-1 px-6">
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
            </main>

            {/* Footer link */}
            <section className="mt-10 mb-6 text-center">
                <Link
                    to="/books"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    📖 Pogledaj sve knjige
                </Link>
            </section>
        </div>
    );
};

export default HomePage;
