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
import EditorDashboard from "./pages/dashboard/EditorDashboard";
import VisitorDashboard from "./pages/dashboard/VisitorDashboard";

function App() {
  return (
     <Routes>
      {/* Auth */}
      <Route path="/login" element={<LoginPage authApi={authApi} />} />
      <Route path="/register" element={<SignUpPage authApi={authApi} />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/visitor-dashboard" element={
        <ProtectedRoute roles={["visitor"]}>
          <VisitorDashboard />
        </ProtectedRoute>
      } />

      <Route path="/editor-dashboard" element={
        <ProtectedRoute roles={["editor"]}>
          <EditorDashboard />
        </ProtectedRoute>
      } />

      <Route path="/books" element={
        <ProtectedRoute>
          <BooksPage />
        </ProtectedRoute>
      } />
      <Route path="/books/:id" element={
        <ProtectedRoute>
          <BookDetailsPage />
          </ProtectedRoute>
      } />

      {/* Samo editor 
      <Route path="/books/add" element={
        <ProtectedRoute roles={["editor"]}><AddBookPage /></ProtectedRoute>
      } />*/}
      <Route path="/books/:id/edit" element={
        <ProtectedRoute roles={["editor"]}><EditBookPage /></ProtectedRoute>
      } />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
    </Routes>
  );
}

export default App;
