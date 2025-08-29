import type { BookDto } from "../../models/books/BookDto";

type Props = {
  books: BookDto[]; // svi prikazani bookovi
  favoriteBooks?: BookDto[]; // koji su označeni kao omiljeni
  onToggleFavorite: (book: BookDto) => void; // handler za dodavanje/uklanjanje iz omiljenih
};

const FavoriteBookImageGrid = ({ books, favoriteBooks, onToggleFavorite }: Props) => {
  return (
    <div className="book-image-grid">
      {books.map((book) => {
        const isFavorite = favoriteBooks?.some((b) => b.id === book.id);
        return (
          <div key={book.id} className="book-image-item">
            <img
              src={book.cover_image_url}
              alt={book.title}
              className="book-image"
            />
            <button
              className={`btnFavorite ${isFavorite ? "remove" : "add"}`}
              onClick={() => onToggleFavorite(book)}
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default FavoriteBookImageGrid;
