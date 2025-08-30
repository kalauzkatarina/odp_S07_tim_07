import { useState } from "react";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { validationOfDatasAuth } from "../../api_services/validators/auth/AuthValidators";
import { useAuth } from "../../hooks/auth/useAuthHook";

import styles from "./LoginPage.module.css"

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
    <form onSubmit={submitForm}>
      <label className="signup" htmlFor="chk">Sign up</label>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

       <div className={styles.roleSelection}>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="role"
            value="visitor"
            checked={role === "visitor"}
            onChange={(e) => setRole(e.target.value)}
          />
          Visitor
        </label>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name="role"
            value="editor"
            checked={role === "editor"}
            onChange={(e) => setRole(e.target.value)}
          />
          Editor
        </label>
      </div>

      {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
      <button className={styles.btnSignUp} type="submit">Sign up</button>
    </form>
  );
}
