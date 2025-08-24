import { Link } from "react-router-dom";

export default function VisitorDashboard() {
    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-6">📖 Dobrodošli, posetioče!</h1>
            <p className="mb-4">Možete pregledati sve knjige u katalogu.</p>

            <Link
                to="/books"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Pregledaj knjige
            </Link>
        </main>
    );
}