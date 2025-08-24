import { Link } from "react-router-dom";

export default function EditorDashboard() {
    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-6">✏️ Dobrodošli, uredniče!</h1>
            <p className="mb-4">Možete pregledati, dodavati i uređivati knjige.</p>

            <div className="flex gap-4">
                <Link
                    to="/books"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Pregledaj knjige
                </Link>

                <Link
                    to="/books/add"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Dodaj knjigu
                </Link>
            </div>
        </main>
    );
}