import { Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import { authApi } from "./api_services/auth_api/AuthAPIService";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ProtectedRoute from "./components/ProtectedRoute";
import BookDetailsPage from "./pages/books/BookDetailsPage";
import BooksPage from "./pages/books/BooksPage";
import EditBookPage from "./pages/books/EditBookPage";
import UnauthorizedPage from "./pages/common/UnauthorizedPage";
import AddBookPage from "./pages/books/AddBookPage";
import HomePage from "./pages/home/HomePage";

function App() {
  return (
     <Routes>
      {/* Auth */}
      <Route path="/login" element={<LoginPage authApi={authApi} />} />
      <Route path="/register" element={<SignUpPage authApi={authApi} />} />
     
      {/* Početna stranica */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      
      <Route path="/home" element={<HomePage />} />

      <Route path="/books" element={<BooksPage />} />
      
      <Route path="/books/:id" element={<BookDetailsPage />} />

      <Route path="/books/add" element={
        <ProtectedRoute roles={["editor"]}>
          <AddBookPage />
        </ProtectedRoute>
      } />

      <Route path="/books/:id/edit" element={
        <ProtectedRoute roles={["editor"]}>
          <EditBookPage />
        </ProtectedRoute>
      } />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
    </Routes>
  );
}

export default App;
