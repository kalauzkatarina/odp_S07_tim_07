import { Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import { authApi } from "./api_services/auth_api/AuthAPIService";
import LoginPage from "./pages/auth/LogInPage";
import SignUpPage from "./pages/auth/SignUpPage";

function App() {
  return(
    <Routes>
      <Route path="/login" element={<LoginPage authApi={authApi} />} />
       {/* Preusmerava na dashboard kao default rutu */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<SignUpPage authApi={authApi} />} />

    </Routes>
  );
}

export default App;
