import { Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import UnauthorizedPage from "./pages/common/UnauthorizedPage";
import HomePage from "./pages/home/HomePage";
import { authApi } from "./api_services/authApi/AuthAPIService";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route path="/home" element={<HomePage authApi={authApi} />} />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
    </Routes>
  );
}

export default App;
