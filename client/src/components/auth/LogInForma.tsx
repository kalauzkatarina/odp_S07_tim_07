import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { validationOfDatasAuth } from "../../api_services/validators/auth/AuthValidators";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";

export function PrijavaForma({ authApi }: AuthFormProps) {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  const { login } = useAuth();

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();

    const validacija = validationOfDatasAuth(korisnickoIme, lozinka);
    if (!validacija.success) {
      setGreska(validacija.message ?? "Неисправни подаци");
      return;
    }

    const odgovor = await authApi.logIn(korisnickoIme, lozinka);
    if (odgovor.success && odgovor.data) {
      login(odgovor.data);
    } else {
      setGreska(odgovor.message);
      setKorisnickoIme("");
      setLozinka("");
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-lg shadow-md rounded-2xl p-10 w-full max-w-md border border-blue-400">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Пријава</h1>
      <form onSubmit={podnesiFormu} className="space-y-4">
        <input
          type="text"
          placeholder="Корисничко име"
          value={korisnickoIme}
          onChange={(e) => setKorisnickoIme(e.target.value)}
          className="w-full bg-white/40 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Лозинка"
          value={lozinka}
          onChange={(e) => setLozinka(e.target.value)}
          className="w-full bg-white/40 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {greska && <p className="text-md text-center text-red-700/80 font-medium">{greska}</p>}
        <button
          type="submit"
          className="w-full bg-blue-700/70 hover:bg-blue-700/90 text-white py-2 rounded-xl transition"
        >
          Пријави се
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        Немате налог?{" "}
        <Link to="/register" className="text-blue-700 hover:underline">
          Региструјте се
        </Link>
      </p>
    </div>
  );
}
