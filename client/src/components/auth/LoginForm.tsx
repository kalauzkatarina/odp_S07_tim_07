import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { validationOfDatasAuth } from "../../api_services/validators/auth/AuthValidators";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";

export function LoginForm({ authApi }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

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
    } else {
      setError(response.message);
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-lg shadow-md rounded-2xl p-10 w-full max-w-md border border-blue-400">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Пријава</h1>
      <form onSubmit={submitForm} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-white/40 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/40 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {error && <p className="text-md text-center text-red-700/80 font-medium">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-700/70 hover:bg-blue-700/90 text-white py-2 rounded-xl transition"
        >
          Log in
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-700 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
