import { useNavigate } from "react-router-dom";
import type { IAuthAPIService } from "../../api_services/auth_api/IAuthAPIService";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { useEffect } from "react";
import { LoginForm } from "../../components/auth/LoginForm";
interface LoginPageProps {
  authApi: IAuthAPIService;
}

export default function LoginPage({ authApi }: LoginPageProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user)
      navigate(`/${user.role}-dashboard`);
  }, [isAuthenticated, navigate, user]);

  return (
    <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-orange-800/70 flex items-center justify-center">
      <LoginForm authApi={authApi} />

    </main>
  );
}
