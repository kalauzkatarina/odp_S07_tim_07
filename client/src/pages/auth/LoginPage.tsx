import type { IAuthAPIService } from "../../api_services/auth_api/IAuthAPIService";
import { LoginForm } from "../../components/auth/LoginForm";
interface LoginPageProps {
  authApi: IAuthAPIService;
}

export default function LoginPage({ authApi }: LoginPageProps) {

  return (
    <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-orange-800/70 flex items-center justify-center">
      <LoginForm authApi={authApi} />

    </main>
  );
}
