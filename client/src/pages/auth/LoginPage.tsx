import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import type { IAuthAPIService } from "../../api_services/auth_api/IAuthAPIService";
import styles from './LoginPage.module.css'; // koristeći CSS module

interface LoginPageProps {
  authApi: IAuthAPIService;
}

const LoginPage: FC<LoginPageProps> = ({ authApi }) => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    username: "",
    password: "",
    email: "",
    role: "visitor",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.logIn(loginData.email, loginData.password);
      alert("Login successful");
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Login failed");
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
            <select
              value={signupData.role}
              onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
            >
              <option value="visitor">Visitor</option>
              <option value="editor">Editor</option>
            </select>
            <button type="submit">Sign up</button>
          </form>
        </div>

        {/* Login Form */}
        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <label htmlFor="chk" aria-hidden="true">Login</label>

            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
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
