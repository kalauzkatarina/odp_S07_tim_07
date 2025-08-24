import type { FC } from "react";

export const HomePage: FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dobrodošli u digitalni katalog knjiga</h1>

            <section>
                <h2 className="text-xl font-semibold mb-4">📚 Bestselleri</h2>
                {/* Komponenta za prikaz 3 najposećenije knjige */}
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">🆕 Novi naslovi</h2>
                {/* Komponenta za prikaz 5 najnovijih knjiga */}
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">✨ Ne sudi knjigu po koricama</h2>
                {/* Komponenta za prikaz do 5 preporučenih knjiga */}
            </section>
        </div>
    );
}