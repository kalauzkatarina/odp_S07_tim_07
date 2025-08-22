import { Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import LogInPage from "./pages/LogInPage";
import { authApi } from "./api_services/auth_api/AuthAPIService";

function App() {
  return(
    <Routes>
      <Route path="/login" element={<LogInPage authApi={authApi} />} />
       {/* Preusmerava na dashboard kao default rutu */}
        <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
