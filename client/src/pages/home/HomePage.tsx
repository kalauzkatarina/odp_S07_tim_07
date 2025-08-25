import { useEffect, useState, useContext, type FC } from "react";
import { Link } from "react-router-dom";
import { booksApi } from "../../api_services/book_api/BooksApiService";
import AuthContext from "../../contexts/auth_context/AuthContext";
import type { BookDto } from "../../models/books/BookDto";

const HomePage: FC = () => {
    const [topViewed, setTopViewed] = useState<BookDto[]>([]);
    const [newBooks, setNewBooks] = useState<BookDto[]>([]);
    const [recommended, setRecommended] = useState<BookDto[]>([]);
    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const top = await booksApi.getTopViewed(3);
                console.log("Top viewed response:", top); // proveri ovde
                setTopViewed(Array.isArray(top) ? top : []);

                const all = await booksApi.getAllBooks();
                setNewBooks(all.slice(-5).reverse());
                setRecommended(all.slice(0, 5));
            } catch (error) {
                console.error("Greška pri fetchovanju knjiga:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dobrodošli u digitalni katalog knjiga</h1>

            {/* Opcija za urednike */}
            {auth?.user?.role === "editor" && (
                <div className="mb-6 flex gap-4">
                    <Link
                        to="/books/add"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Dodaj novu knjigu
                    </Link>
                </div>
            )}

            {/* Bestselleri */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">📚 Bestselleri</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.isArray(topViewed) && topViewed.map(book => (
                        <div key={book.id} className="border p-4 rounded shadow">
                            <img src={book.cover_image_url} alt={book.title} className="h-48 w-full object-cover mb-2" />
                            <h3 className="font-bold">{book.title}</h3>
                            <p className="text-sm text-gray-600">{book.author}</p>
                            <Link to={`/books/${book.id}`} className="text-blue-600 hover:underline text-sm">Detalji</Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Novi naslovi */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">🆕 Novi naslovi</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {newBooks.map(book => (
                        <div key={book.id} className="border p-4 rounded shadow">
                            <img src={book.cover_image_url} alt={book.title} className="h-48 w-full object-cover mb-2" />
                            <h3 className="font-bold">{book.title}</h3>
                            <Link to={`/books/${book.id}`} className="text-blue-600 hover:underline text-sm">Detalji</Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Preporuke */}
            <section>
                <h2 className="text-xl font-semibold mb-4">✨ Ne sudi knjigu po koricama</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {recommended.map(book => (
                        <div key={book.id} className="border p-4 rounded shadow">
                            <img src={book.cover_image_url} alt={book.title} className="h-48 w-full object-cover mb-2" />
                            <h3 className="font-bold">{book.title}</h3>
                            <Link to={`/books/${book.id}`} className="text-blue-600 hover:underline text-sm">Detalji</Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
