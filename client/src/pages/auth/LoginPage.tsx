import { type FC } from "react";
import type { IAuthAPIService } from "../../api_services/auth_api/IAuthAPIService";
import styles from "./LoginPage.module.css";
import { SignUpForm } from "../../components/auth/SignUpForm";
import { LoginForm } from "../../components/auth/LoginForm";


interface LoginPageProps {
  authApi: IAuthAPIService;
}

const LoginPage: FC<LoginPageProps> = ({ authApi }) => {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <input
          type="checkbox"
          id="chk"
          aria-hidden="true"
          className={styles.chk}
        />

        <div className={styles.signup}>
          <SignUpForm authApi={authApi} />
        </div>

        <div className={styles.login}>
          <LoginForm authApi={authApi} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
