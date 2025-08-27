import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import type { IAuthAPIService } from "../../api_services/auth_api/IAuthAPIService";
import styles from './LoginPage.module.css';
import { useAuth } from "../../hooks/auth/useAuthHook";

interface LoginPageProps {
  authApi: IAuthAPIService;
}

const LoginPage: FC<LoginPageProps> = ({ authApi }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({
    username: "",
    password: "",
    email: "",
    role: "visitor",
  });
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await authApi.logIn(loginData.username, loginData.password);

      if (response.success && response.data) {
        login(response.data); // ažurira globalni auth state
        navigate("/home"); // ide na home page
      } else {
        setError(response.message || "Login failed"); // prikazuje poruku greške
      }
    } catch (err) {
      console.error(err);
      setError("Login failed due to server error" + error); // fallback greška
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.signUp(
        signupData.username,
        signupData.password,
        signupData.email,
        signupData.role
      );
      alert("Signup successful");
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <input type="checkbox" id="chk" aria-hidden="true" className={styles.chk} />

        {/* Signup Form */}
        <div className={styles.signup}>
          <form onSubmit={handleSignup}>
            <label htmlFor="chk">Sign up</label>

            <input
              type="text"
              placeholder="Username"
              value={signupData.username}
              onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              required
            />
            <div className={styles.roleSelection}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="role"
                  value="visitor"
                  checked={signupData.role === "visitor"}
                  onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                />
                Visitor
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="role"
                  value="editor"
                  checked={signupData.role === "editor"}
                  onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                />
                Editor
              </label>
            </div>
            <button type="submit">Sign up</button>
          </form>
        </div>

        {/* Login Form */}
        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <label htmlFor="chk" aria-hidden="true">Login</label>

            <input
              type="text"
              placeholder="Username"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
