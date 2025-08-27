import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { validationOfDatasAuth } from "../../api_services/validators/auth/AuthValidators";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";

export function LoginForm({ authApi }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validationOfDatasAuth(username, password);
    if (!validation.success) {
      setError(validation.message ?? "Invalid login information");
      return;
    }
    const response = await authApi.logIn(username, password);
    if (response.success && response.data) {
      login(response.data);
      navigate("/home");
    } else {
      setError(response.message);
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Пријава</h1>
      <form onSubmit={submitForm} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="auth-button">
          Log in
        </button>
      </form>
      <p className="auth-footer">
        Don't have an account?{" "}
        <Link to="/register" className="auth-link">
          Sign up
        </Link>
      </p>
    </div>
  );
}
