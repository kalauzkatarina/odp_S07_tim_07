import { useContext } from "react";
import { SignUpForm } from "./SignUpForm";
import { LoginForm } from "./LoginForm";
import AuthContext from "../../contexts/auth_context/AuthContext";
import type { IAuthAPIService } from "../../api_services/authApi/IAuthAPIService";
import styles from "../../pages/auth/LoginPage.module.css"; 
import { UserForm } from "../userProfile/UserProfile";

interface AuthFormProps {
  authApi: IAuthAPIService;
}

export const AuthForm = ({ authApi }: AuthFormProps) => {
  const auth = useContext(AuthContext);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        {auth?.user ? (
          <div className={styles.login}>
            <UserForm
              username={auth.user.username}
              onSave={(updatedUser) => {
                // možeš ovde dodati update user funkcionalnost ako bude potrebno
                console.log("Updated user data", updatedUser);
              }}
            />
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};
