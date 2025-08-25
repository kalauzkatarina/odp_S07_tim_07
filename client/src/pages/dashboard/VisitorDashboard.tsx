import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../contexts/auth_context/AuthContext";

export default function VisitorDashboard() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    if (!auth) return null;

    const handleLogout = () => {
        auth.logout();
        navigate("/login");
    };

    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-6">📖 Dobrodošli, posetioče!</h1>
            <p className="mb-4">Možete pregledati sve knjige u katalogu.</p>

            <div className="flex gap-4 mb-4">
                <Link
                    to="/books"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Pregledaj knjige
                </Link>
            </div>

            <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Logout
            </button>
        </main>
    );
}
