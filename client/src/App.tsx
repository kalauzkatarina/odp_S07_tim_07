import { Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import { authApi } from "./api_services/authApi/AuthAPIService";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import BookDetailsPage from "./pages/books/BookDetailsPage";
import EditBookPage from "./pages/books/EditBookPage";
import UnauthorizedPage from "./pages/common/UnauthorizedPage";
import HomePage from "./pages/home/HomePage";

function App() {
  return (
     <Routes>
      <Route path="/login" element={<LoginPage authApi={authApi} />} />
     
      <Route path="/" element={<Navigate to="/home" replace />} />
      
      <Route path="/home" element={<HomePage />} />
      
      <Route path="/books/:id" element={<BookDetailsPage />} />

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
