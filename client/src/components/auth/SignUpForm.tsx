import { useState } from "react";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { validationOfDatasAuth } from "../../api_services/validators/auth/AuthValidators";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { Link } from "react-router-dom";

export function SignUpForm({ authApi }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("visitor");
  const { login } = useAuth();
  const [error, setError] = useState("");

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validationOfDatasAuth(username, password);

    if (!validation.success) {
      setError(validation.message ?? "Invalid information");
      return;
    }

    const response = await authApi.signUp(username, password, email, role);
    if (response.success && response.data) {
      login(response.data);
    } else {
      setError(response.message);
      setUsername("");
      setPassword("");
      setEmail("");
    }
  };
  return (
    <div className="auth-container">
      <h1 className="auth-title">Registration</h1>
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
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="auth-input"
        >
          <option value="visitor">Visitor</option>
          <option value="editor">Editor</option>
        </select>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="auth-button">
          Sign up
        </button>
      </form>
      <p className="auth-footer">
        Already have an account?{" "}
        <Link to="/login" className="auth-link">
          Log in
        </Link>
      </p>
    </div>
  );
}
