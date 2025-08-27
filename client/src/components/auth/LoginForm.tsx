import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <form onSubmit={submitForm}>
      <label htmlFor="chk" aria-hidden="true">Login</label>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
